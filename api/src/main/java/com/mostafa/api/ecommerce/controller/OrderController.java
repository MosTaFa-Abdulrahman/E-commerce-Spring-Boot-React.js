package com.mostafa.api.ecommerce.controller;


import com.mostafa.api.ecommerce.dto.PaginatedResponse;
import com.mostafa.api.ecommerce.dto.order.CreateOrderDTO;
import com.mostafa.api.ecommerce.dto.order.OrderResponseDTO;
import com.mostafa.api.ecommerce.dto.order.PaymentDTO;
import com.mostafa.api.ecommerce.dto.order.UpdateOrderStatusDTO;
import com.mostafa.api.ecommerce.exception.GlobalResponse;
import com.mostafa.api.ecommerce.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;


    //    Create
    @PostMapping
    public ResponseEntity<GlobalResponse<OrderResponseDTO>> createOrder(
            @RequestBody @Valid CreateOrderDTO dto) {
        OrderResponseDTO createdOrder = orderService.createOrder(dto);
        GlobalResponse<OrderResponseDTO> res = new GlobalResponse<>(createdOrder);

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    //    Update
    @PutMapping("/{orderId}")
    public ResponseEntity<GlobalResponse<OrderResponseDTO>> updateOrder(
            @PathVariable UUID orderId,
            @RequestBody @Valid UpdateOrderStatusDTO dto) {
        OrderResponseDTO updatedOrder = orderService.updateOrderStatus(orderId, dto);
        GlobalResponse<OrderResponseDTO> res = new GlobalResponse<>(updatedOrder);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Process PAYMENT
    @PutMapping("/payment")
    public ResponseEntity<GlobalResponse<OrderResponseDTO>> processPayment(
            @RequestBody PaymentDTO dto) {
        UUID orderId = dto.orderId();
        OrderResponseDTO processedOrder = orderService.processPayment(orderId);
        GlobalResponse<OrderResponseDTO> res = new GlobalResponse<>(processedOrder);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


    //    Delete
    @DeleteMapping("/{orderId}")
    public ResponseEntity<GlobalResponse<String>> deleteOrder(
            @PathVariable UUID orderId) {
        String deletedOrder = orderService.deleteOrder(orderId);
        GlobalResponse<String> res = new GlobalResponse<>(deletedOrder);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    //    Get All
    @GetMapping
    public ResponseEntity<GlobalResponse<PaginatedResponse<OrderResponseDTO>>> getAllOrders(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "3") int size,
            HttpServletRequest req
    ) {
        Page<OrderResponseDTO> orders = orderService.getAllOrders(page - 1, size);

        String baseUrl = req.getRequestURL().toString();
        String nextUrl = orders.hasNext() ? String.format("%s?page=%d&size=%d", baseUrl, page + 1, size) : null;
        String prevUrl = orders.hasPrevious() ? String.format("%s?page=%d&size=%d", baseUrl, page - 1, size) : null;

        var paginatedResponse = new PaginatedResponse<OrderResponseDTO>(
                orders.getContent(),
                orders.getNumber() + 1,
                orders.getTotalPages(),
                orders.getTotalElements(),
                orders.hasNext(),
                orders.hasPrevious(),
                nextUrl,
                prevUrl
        );

        return new ResponseEntity<>(new GlobalResponse<>(paginatedResponse), HttpStatus.OK);
    }

    //    Get By ((orderId))
    @GetMapping("/{orderId}")
    public ResponseEntity<GlobalResponse<OrderResponseDTO>> getSingleOrder(
            @PathVariable UUID orderId) {
        OrderResponseDTO findSingleOrder = orderService.getOrderById(orderId);
        GlobalResponse<OrderResponseDTO> res = new GlobalResponse<>(findSingleOrder);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


    // *********************************** ((Specifications)) ******************************** //
    //    Get All Orders for Specific-User BY ((userId))
    @GetMapping("/{userId}/user")
    public ResponseEntity<GlobalResponse<List<OrderResponseDTO>>> getAllUserOrders(
            @PathVariable UUID userId) {
        List<OrderResponseDTO> orders = orderService.getOrdersByUserId(userId);
        GlobalResponse<List<OrderResponseDTO>> res = new GlobalResponse<>(orders);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }


}
