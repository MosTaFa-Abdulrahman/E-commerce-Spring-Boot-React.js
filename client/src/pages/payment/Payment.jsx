import "./payment.scss";
import {
  CreditCard,
  MapPin,
  Package,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

import Map from "../../components/Map";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
});

// RTKQ
import {
  useGetOrderByIdQuery,
  useOrderPaymentMutation,
} from "../../store/orders/ordersSlice";
import toast from "react-hot-toast";

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // RTKQ
  const {
    data: order,
    isLoading: isLoadingOrder,
    error: orderError,
  } = useGetOrderByIdQuery(orderId, {
    skip: !orderId,
    refetchOnMountOrArgChange: true,
  });
  const [payOrder, { isLoading, isSuccess, error }] = useOrderPaymentMutation();

  //  ***************************** ((Actions- Buttons)) ************************************* //
  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      await payOrder({ orderId: order.id }).unwrap();
      toast.success("Order Paid Successfully 🥰");
      setTimeout(() => {
        navigate("/profile");
      }, 4000);
    } catch (err) {
      const message =
        err?.data?.message ||
        err?.error ||
        "Something went wrong while processing payment.";
      toast.error(message);
    }
  };

  //  ***************************** ((Format (Currency+ Date))) ************************************* //
  // Format currency
  const formatCurrency = (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) {
      return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
  };

  // Format date with error handling
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  // Get status display with enhanced states
  const getStatusDisplay = (status) => {
    switch (status) {
      case "PENDING":
        return {
          color: "warning",
          icon: <Clock className="payment__status-icon" />,
          text: "Pending Payment",
        };
      case "PAID":
        return {
          color: "success",
          icon: <CheckCircle className="payment__status-icon" />,
          text: "Paid",
        };
      case "CANCELLED":
        return {
          color: "error",
          icon: <XCircle className="payment__status-icon" />,
          text: "Cancelled",
        };
      case "PROCESSING":
        return {
          color: "info",
          icon: <Loader2 className="payment__status-icon spinning" />,
          text: "Processing",
        };
      case "FAILED":
        return {
          color: "error",
          icon: <XCircle className="payment__status-icon" />,
          text: "Failed",
        };
      default:
        return {
          color: "default",
          icon: <Clock className="payment__status-icon" />,
          text: status || "Unknown",
        };
    }
  };

  // Loading && Error
  if (isLoadingOrder) {
    return (
      <div className="payment">
        <div className="payment__container">
          <div className="payment__loading">
            <Loader2 className="payment__loading-icon spinning" />
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }
  if (!order) {
    return (
      <div className="payment">
        <div className="payment__container">
          <div className="payment__error">
            <XCircle className="payment__error-icon" />
            <h2>Order Not Found</h2>
            <p>
              {orderError?.data?.message ||
                orderError?.message ||
                "The order you're looking for doesn't exist or has been removed."}
            </p>
            <div className="payment__error-actions">
              <button
                className="payment__back-btn"
                onClick={() => navigate("/products")}
              >
                <ArrowLeft className="payment__back-icon" />
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(order.status);
  const orderPosition = [
    parseFloat(order.orderAddress.addressLatLng?.lat || 0),
    parseFloat(order.orderAddress.addressLatLng?.lng || 0),
  ];

  // Check if coordinates are valid
  const hasValidCoordinates =
    orderPosition[0] !== 0 &&
    orderPosition[1] !== 0 &&
    !isNaN(orderPosition[0]) &&
    !isNaN(orderPosition[1]);

  return (
    <div className="payment">
      <div className="payment__container">
        {/* Header */}
        <div className="payment__header">
          <button className="payment__back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft className="payment__back-icon" />
            Back
          </button>
          <div className="payment__header-content">
            <CreditCard className="payment__header-icon" />
            <div>
              <h1 className="payment__title">Payment</h1>
              <p className="payment__subtitle">Order ID: {order.id}</p>
            </div>
          </div>
          <div
            className={`payment__status payment__status--${statusDisplay.color}`}
          >
            {statusDisplay.icon}
            <span>{statusDisplay.text}</span>
          </div>
        </div>

        <div className="payment__content">
          {/* Left Side - Order Details */}
          <div className="payment__left">
            {/* Order Summary */}
            <div className="payment__section">
              <div className="payment__section-header">
                <Package className="payment__section-icon" />
                <h2 className="payment__section-title">Order Summary</h2>
              </div>

              <div className="payment__order-items">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="payment__order-item">
                    <div className="payment__item-image">
                      <img
                        src={item.product?.imageUrl || "/placeholder-image.jpg"}
                        alt={item.product?.name || "Product"}
                        className="payment__product-image"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>
                    <div className="payment__item-info">
                      <h4 className="payment__item-name">
                        {item.product?.name || "Unknown Product"}
                      </h4>
                      <p className="payment__item-description">
                        {item.product?.description ||
                          "No description available"}
                      </p>
                      <p className="payment__item-details">
                        Quantity: {item.quantity} ×{" "}
                        {formatCurrency(item.product?.price)}
                      </p>
                    </div>
                    <span className="payment__item-total">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="payment__order-total">
                <div className="payment__total-row">
                  <span>Total Items:</span>
                  <span>{order.orderItems.length}</span>
                </div>
                <div className="payment__total-row payment__total-row--final">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(order.totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="payment__section">
              <div className="payment__section-header">
                <User className="payment__section-icon" />
                <h2 className="payment__section-title">Customer Information</h2>
              </div>

              <div className="payment__customer-info">
                <div className="payment__info-item">
                  <span className="payment__info-label">Name:</span>
                  <span className="payment__info-value">
                    {order.user?.username || "N/A"}
                  </span>
                </div>
                <div className="payment__info-item">
                  <span className="payment__info-label">Email:</span>
                  <span className="payment__info-value">
                    {order.user?.email || "N/A"}
                  </span>
                </div>
                <div className="payment__info-item">
                  <span className="payment__info-label">Order Date:</span>
                  <span className="payment__info-value">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="payment__section">
              <div className="payment__section-header">
                <MapPin className="payment__section-icon" />
                <h2 className="payment__section-title">Delivery Address</h2>
              </div>

              <div className="payment__address-info">
                <p className="payment__address-text">
                  {order.orderAddress?.addressName || "Address not provided"}
                </p>
                {hasValidCoordinates && (
                  <div className="payment__coordinates">
                    <span>
                      📍 {orderPosition[0].toFixed(6)},{" "}
                      {orderPosition[1].toFixed(6)}
                    </span>
                  </div>
                )}
              </div>

              {/* Map */}
              {hasValidCoordinates ? (
                <div className="payment__map-container">
                  <MapContainer
                    center={orderPosition}
                    zoom={16}
                    style={{ height: "300px", width: "100%" }}
                    className="payment__map"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Map
                      position={orderPosition}
                      setPosition={() => {}} // Read-only
                      setAddress={() => {}} // Read-only
                      mapRef={null}
                    />
                  </MapContainer>
                </div>
              ) : (
                <div className="payment__map-placeholder">
                  <MapPin className="payment__map-placeholder-icon" />
                  <p>Map coordinates not available</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Payment */}
          <div className="payment__right">
            <div className="payment__section">
              <div className="payment__section-header">
                <DollarSign className="payment__section-icon" />
                <h2 className="payment__section-title">Payment</h2>
              </div>

              {/* PENDING ORDER */}
              {order.status === "PENDING" && (
                <div className="payment__stripe-container">
                  <div className="payment__payment-summary">
                    <div className="payment__payment-row">
                      <span>Order Total:</span>
                      <span className="payment__payment-amount">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "12px",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                      maxWidth: "400px",
                    }}
                  >
                    <button
                      onClick={handlePayment}
                      disabled={isLoading}
                      style={{
                        backgroundColor: isLoading ? "#ccc" : "#4caf50",
                        color: "#fff",
                        border: "none",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "8px",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        cursor: isLoading ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        transition:
                          "background-color 0.3s ease, transform 0.2s ease",
                        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
                        width: "100%",
                        maxWidth: "240px",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <Loader2
                            className="spinning"
                            style={{
                              width: "20px",
                              height: "20px",
                              animation: "spin 1s linear infinite",
                            }}
                          />
                          Processing...
                        </>
                      ) : (
                        "Pay"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* PAID ORDER*/}
              {order.status === "PAID" && (
                <div className="payment__success">
                  <CheckCircle className="payment__success-icon" />
                  <h3>Payment Completed!</h3>
                  <p>Your order has been paid successfully.</p>

                  <div className="payment__success-details">
                    <p>Amount Paid: {formatCurrency(order.totalPrice)}</p>
                    <p>Order Status: {order.status}</p>
                  </div>
                  <button
                    className="payment__continue-btn"
                    onClick={() => navigate("/profile")}
                  >
                    View Orders
                  </button>
                </div>
              )}

              {/* Security notice */}
              {order.status === "PENDING" && (
                <div
                  style={{
                    backgroundColor: "#e6f4ea",
                    color: "#256029",
                    border: "1px solid #b5e0c3",
                    padding: "1rem 1.5rem",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    marginTop: "1.5rem",
                    animation: "fadeIn 0.5s ease-in-out",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    🔒 Your payment information is secure and encrypted.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
