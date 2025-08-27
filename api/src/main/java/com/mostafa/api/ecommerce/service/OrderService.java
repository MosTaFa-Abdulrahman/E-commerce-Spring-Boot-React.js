package com.mostafa.api.ecommerce.service;

import com.mostafa.api.ecommerce.dto.order.CreateOrderDTO;
import com.mostafa.api.ecommerce.dto.order.OrderResponseDTO;
import com.mostafa.api.ecommerce.dto.order.UpdateOrderStatusDTO;
import com.mostafa.api.ecommerce.dto.orderItem.CreateOrderItemDTO;
import com.mostafa.api.ecommerce.enums.OrderStatus;
import com.mostafa.api.ecommerce.exception.CustomResponseException;
import com.mostafa.api.ecommerce.mapper.EntityDtoMapper;
import com.mostafa.api.ecommerce.model.Order;
import com.mostafa.api.ecommerce.model.OrderItem;
import com.mostafa.api.ecommerce.model.Product;
import com.mostafa.api.ecommerce.model.User;
import com.mostafa.api.ecommerce.repository.OrderRepo;
import com.mostafa.api.ecommerce.repository.ProductRepo;
import com.mostafa.api.ecommerce.repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepo orderRepository;
    private final UserRepo userRepository;
    private final ProductRepo productRepository;
    private final EntityDtoMapper mapper;


    //    Create
    @Transactional
    public OrderResponseDTO createOrder(CreateOrderDTO createOrderDTO) {
        // 1- Check User Found
        User user = userRepository.findById(createOrderDTO.userId())
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "User not found with id: " + createOrderDTO.userId())
                );

        // 2. Create order entity
        Order order = mapper.toOrderEntity(createOrderDTO);
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        // Set order address from DTO
        order.setOrderAddress(createOrderDTO.orderAddress());

        // 3. Process order items
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal calculatedTotal = BigDecimal.ZERO;

        for (CreateOrderItemDTO itemDTO : createOrderDTO.orderItems()) {
            // Find product
            Product product = productRepository.findById(itemDTO.productId())
                    .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                            "Product not found with id: " + itemDTO.productId())
                    );

            // Check stock availability
            if (product.getStockQuantity() < itemDTO.quantity()) {
                throw new CustomResponseException("Insufficient stock for product: " + product.getName() +
                        ". Available: " + product.getStockQuantity() + ", Requested: " + itemDTO.quantity(), 400);
            }

            // Create order item
            OrderItem orderItem = mapper.toOrderItemEntity(itemDTO);
            orderItem.setProduct(product);
            orderItem.setOrder(order);
            orderItem.setPrice(product.getPrice());

            // Update stock
            product.setStockQuantity(product.getStockQuantity() - itemDTO.quantity());
            productRepository.save(product);

            // Calculate total
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemDTO.quantity()));
            calculatedTotal = calculatedTotal.add(itemTotal);

            orderItems.add(orderItem);
        }

        // 4. Set calculated total or use provided total
        order.setTotalPrice(createOrderDTO.totalPrice() != null ? createOrderDTO.totalPrice() : calculatedTotal);
        order.setOrderItems(orderItems);

        // 5. Save order
        Order savedOrder = orderRepository.save(order);

        // 6. Return response DTO
        return mapper.toOrderResponseDTO(savedOrder);
    }

    //    Update ((Order Status))
    @Transactional
    public OrderResponseDTO updateOrderStatus(
            UUID orderId,
            UpdateOrderStatusDTO updateOrderStatusDTO) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "Order not found with id: " + orderId)
                );

        // Validate status transition (optional business logic)
        validateStatusTransition(order.getStatus(), updateOrderStatusDTO.status());

        order.setStatus(updateOrderStatusDTO.status());

        // If order is cancelled, restore stock
        if (updateOrderStatusDTO.status() == OrderStatus.CANCELED) {
            restoreStock(order);
        }

        Order updatedOrder = orderRepository.save(order);

        return mapper.toOrderResponseDTO(updatedOrder);
    }


    //    Process Payment
    @Transactional
    public OrderResponseDTO processPayment(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomResponseException(
                        "Order not found with id: " + orderId, 404));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new CustomResponseException(
                    "Order must be in PENDING status to process payment. Current status: " + order.getStatus(),
                    400);
        }

        order.setPaymentId("sss-oo-nn");
        order.setStatus(OrderStatus.PAID);

        Order updatedOrder = orderRepository.save(order);


        return mapper.toOrderResponseDTO(updatedOrder);

    }

    //    Get By ((orderId))
    @Transactional
    public OrderResponseDTO getOrderById(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "Order not found with id: " + orderId)
                );

        return mapper.toOrderResponseDTO(order);
    }

    //    Get All
    @Transactional
    public Page<OrderResponseDTO> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> ordersPage = orderRepository.findAll(pageable);

        // Convert Page<Order> to Page<OrderResponseDTO>
        return ordersPage.map(mapper::toOrderResponseDTO);
    }

    //    Delete
    @Transactional
    public String deleteOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "Order not found with id: " + orderId)
                );

        // Restore stock before deletion
        restoreStock(order);

        orderRepository.delete(order);

        return "Order Deleted Success 🥰";
    }


    // ******************************* ((Specifications)) ************************ //
    //    Get All Orders for user ((userId))
    @Transactional
    public List<OrderResponseDTO> getOrdersByUserId(UUID userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> CustomResponseException.ResourceNotFound(
                        "User not found with id: " + userId)
                );

        List<Order> orders = orderRepository.findByUserIdOrderByCreatedDateDesc(userId);

        return orders.stream()
                .map(mapper::toOrderResponseDTO)
                .toList();
    }


    //   ******************************** ((Helpers)) ****************************** //
    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        // Business logic for valid status transitions
        if (currentStatus == OrderStatus.DELIVERED && newStatus != OrderStatus.DELIVERED) {
            throw new CustomResponseException("Cannot change status of delivered order", 400);
        }

        if (currentStatus == OrderStatus.CANCELED && newStatus != OrderStatus.CANCELED) {
            throw new CustomResponseException("Cannot change status of cancelled order", 400);
        }
    }

    private void restoreStock(Order order) {
        order.getOrderItems().forEach(item -> {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());

            productRepository.save(product);
        });
    }


}