import "./profile.scss";
import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Package,
  Calendar,
  DollarSign,
  Trash2,
  Eye,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";

// RTKQ
import { useSelector } from "react-redux";
import {
  useGetOrdersByUserQuery,
  useDeleteOrderMutation,
} from "../../store/orders/ordersSlice";
import toast from "react-hot-toast";

function Profile() {
  // Expand
  const [expandedOrder, setExpandedOrder] = useState(null);

  // RTKQ
  const { user: currentUser } = useSelector((state) => state.authState);
  const {
    data: orders = [],
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useGetOrdersByUserQuery(currentUser.userId);
  const [deleteOrder, { isLoading: deletingOrder }] = useDeleteOrderMutation();

  // ************************** ((Handlers)) ***************************** //
  // Handle Delete Order
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(orderId).unwrap();
        toast.success("Order deleted successfully!");
        refetchOrders();
      } catch (error) {
        toast.error("Failed to delete order");
        console.error("Delete order error:", error);
      }
    }
  };

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case "SHIPPED":
        return { icon: <Truck className="status-icon" />, color: "shipped" };
      case "DELIVERED":
        return {
          icon: <CheckCircle className="status-icon" />,
          color: "delivered",
        };
      case "CANCELED":
        return { icon: <XCircle className="status-icon" />, color: "canceled" };
      case "PENDING":
        return {
          icon: <AlertCircle className="status-icon" />,
          color: "pending",
        };
      default:
        return { icon: <Package className="status-icon" />, color: "default" };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="profile-container">
      {/* User Information Section */}
      <div className="profile-header">
        <div className="user-info-card">
          <div className="user-avatar">
            <User className="avatar-icon" />
          </div>
          <div className="user-details">
            <h1 className="user-name">{currentUser.username}</h1>
            <div className="user-meta">
              <div className="meta-item">
                <Mail className="meta-icon" />
                <span>{currentUser.email}</span>
              </div>
              <div className="meta-item">
                <Shield className="meta-icon" />
                <span
                  className={`role-badge ${currentUser.role.toLowerCase()}`}
                >
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="orders-section">
        <div className="section-header">
          <h2 className="section-title">
            <ShoppingBag className="section-icon" />
            My Orders
          </h2>
          <div className="orders-count">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </div>
        </div>

        {ordersLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <Package className="empty-icon" />
            <h3>No Orders Yet</h3>
            <p>
              You haven't placed any orders yet. Start shopping to see your
              orders here!
            </p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const isExpanded = expandedOrder === order.id;

              return (
                <div key={order.id} className="order-card">
                  <div
                    className="order-header"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <div className="order-info">
                      <div className="order-id">
                        <Package className="order-icon" />
                        <span>Order #{order.id.slice(-8)}</span>
                      </div>
                      <div className="order-meta">
                        <div className="meta-item">
                          <Calendar className="meta-icon" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="meta-item">
                          <DollarSign className="meta-icon" />
                          <span className="price">
                            ${order.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="order-actions">
                      <div className={`status-badge ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span>{order.status}</span>
                      </div>
                      <button
                        className="expand-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOrderDetails(order.id);
                        }}
                      >
                        <Eye
                          className={`expand-icon ${
                            isExpanded ? "expanded" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="order-details">
                      <div className="items-header">
                        <h4>Order Items ({order.orderItems.length})</h4>
                      </div>

                      <div className="order-items">
                        {order.orderItems.map((item) => (
                          <div key={item.id} className="order-item">
                            <div className="item-image">
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/80x80?text=No+Image";
                                }}
                              />
                            </div>
                            <div className="item-details">
                              <h5 className="item-name">{item.product.name}</h5>
                              <p className="item-description">
                                {item.product.description}
                              </p>
                              <div className="item-meta">
                                <span className="quantity">
                                  Qty: {item.quantity}
                                </span>
                                <span className="unit-price">
                                  ${item.price.toFixed(2)} each
                                </span>
                                <span className="total-price">
                                  Total: $
                                  {(item.quantity * item.price).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="order-footer">
                        <div className="total-summary">
                          <strong>
                            Order Total: ${order.totalPrice.toFixed(2)}
                          </strong>
                        </div>

                        {order.status === "PENDING" && (
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={deletingOrder}
                          >
                            <Trash2 className="btn-icon" />
                            {deletingOrder ? "Deleting..." : "Delete Order"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
