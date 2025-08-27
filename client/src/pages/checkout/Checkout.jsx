import "./checkout.scss";
import { useState, useCallback, useRef } from "react";
import {
  ShoppingCart,
  MapPin,
  Package,
  Loader2,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Map from "../../components/Map";
import { MapContainer, TileLayer, Circle } from "react-leaflet";

// Cart Context
import { useCart } from "../../context/useCart";
// RTKQ
import { useSelector } from "react-redux";
import { useCreateOrderMutation } from "../../store/orders/ordersSlice";
import toast from "react-hot-toast";

function Checkout() {
  // Cart Context
  const { cart, clearCart } = useCart();

  // RTKQ
  const { user: currentUser } = useSelector((state) => state.authState);
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

  // Form states
  const [position, setPosition] = useState([29.0661, 31.0994]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [addressName, setAddressName] = useState("");
  const [errors, setErrors] = useState({});
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapKey, setMapKey] = useState(0); // Force map re-render
  const mapRef = useRef(null);
  const navigate = useNavigate();

  // Get current location function
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newPosition = [latitude, longitude];

        setSelectedPosition(newPosition);
        setPosition(newPosition);
        setMapKey((prev) => prev + 1); // Force map update

        // Get address for current location
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          if (data.display_name) {
            setAddressName(data.display_name);
          }
          toast.success("📍 Current location detected and marked on map!");
        } catch (error) {
          console.error("Error getting address:", error);
          toast.error("Could not get address for current location");
        }

        setIsGettingLocation(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Could not get your current location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        toast.error(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!addressName.trim()) newErrors.addressName = "Address is required";
    if (!selectedPosition) newErrors.location = "Please select location on map";
    if (cart.items.length === 0) newErrors.items = "Cart is empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Create Order
  const handleCreateOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const orderData = {
        totalPrice: cart.totalPrice,
        userId: currentUser?.userId,
        orderAddress: {
          addressName: addressName,
          addressLatLng: {
            lat: selectedPosition[0].toString(),
            lng: selectedPosition[1].toString(),
          },
        },
        orderItems: cart.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      const res = await createOrder(orderData).unwrap();
      const orderId = res?.id || res?.orderId || res?._id;

      toast.success("Order Created Success 😍!");
      clearCart();
      navigate(`/${orderId}/pay`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(error?.data?.message || "Failed to create order");
    }
  };

  const handleAddressChange = useCallback(
    (value) => {
      setAddressName(value);
      if (errors.addressName) {
        setErrors((prev) => ({ ...prev, addressName: "" }));
      }
    },
    [errors.addressName]
  );

  return (
    <div className="checkout">
      <div className="checkout__container">
        <div className="checkout__header">
          <ShoppingCart className="checkout__header-icon" />
          <h1 className="checkout__title">Checkout</h1>
        </div>

        <form onSubmit={handleCreateOrder} className="checkout__form">
          <div className="checkout__content">
            {/* Left Side - Order Items */}
            <div className="checkout__left">
              <div className="checkout__section">
                <div className="checkout__section-header">
                  <Package className="checkout__section-icon" />
                  <h2 className="checkout__section-title">Order Summary</h2>
                </div>

                <div className="checkout__order-summary">
                  {cart.items.length === 0 ? (
                    <p className="checkout__empty-cart">Your cart is empty</p>
                  ) : (
                    <>
                      <div className="checkout__order-items">
                        {cart.items.map((item, index) => (
                          <div
                            key={`${item.product.id}-${index}`}
                            className="checkout__order-item"
                          >
                            <div className="checkout__item-image">
                              <img
                                src={
                                  item.product.image ||
                                  item.product.imageUrl ||
                                  "/placeholder-image.jpg"
                                }
                                alt={item.product.name}
                                className="checkout__product-image"
                              />
                            </div>
                            <div className="checkout__item-info">
                              <h4 className="checkout__item-name">
                                {item.product.name}
                              </h4>
                              <p className="checkout__item-description">
                                {item.product.description}
                              </p>
                              <p className="checkout__item-details">
                                Quantity: {item.quantity} × $
                                {item.product.price}
                              </p>
                            </div>
                            <span className="checkout__item-total">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="checkout__order-total">
                        <div className="checkout__total-row">
                          <span>Total Items:</span>
                          <span>{cart.totalCount}</span>
                        </div>
                        <div className="checkout__total-row checkout__total-row--final">
                          <span>Total Price:</span>
                          <span>${cart.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </>
                  )}
                  {errors.items && (
                    <span className="checkout__error">{errors.items}</span>
                  )}
                </div>
              </div>

              {/* Address Input Section */}
              <div className="checkout__section">
                <div className="checkout__section-header">
                  <MapPin className="checkout__section-icon" />
                  <h2 className="checkout__section-title">Delivery Address</h2>
                </div>

                <div className="checkout__form-group">
                  <label className="checkout__label">
                    Address Details{" "}
                    <span className="checkout__required">*</span>
                  </label>
                  <input
                    type="text"
                    className={`checkout__input ${
                      errors.addressName ? "checkout__input--error" : ""
                    }`}
                    value={addressName}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    placeholder="Building number, street, area details..."
                  />
                  {errors.addressName && (
                    <span className="checkout__error">
                      {errors.addressName}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="checkout__location-btn"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <>
                      <Loader2 className="checkout__location-icon checkout__location-icon--loading" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <Navigation className="checkout__location-icon" />
                      Get Current Location
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Side - Map */}
            <div className="checkout__right">
              <div className="checkout__section">
                <div className="checkout__section-header">
                  <MapPin className="checkout__section-icon" />
                  <h2 className="checkout__section-title">Select Location</h2>
                </div>

                <div className="checkout__map-container">
                  <label className="checkout__label">
                    Click on the map to select your delivery location{" "}
                    <span className="checkout__required">*</span>
                  </label>
                  {selectedPosition && (
                    <div className="checkout__selected-location">
                      <div className="checkout__location-info">
                        <MapPin className="checkout__location-info-icon" />
                        <div>
                          <strong>Selected Location:</strong>
                          <br />
                          <span className="checkout__coordinates">
                            📍 {selectedPosition[0].toFixed(6)},{" "}
                            {selectedPosition[1].toFixed(6)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="checkout__map-wrapper">
                    <MapContainer
                      key={mapKey}
                      center={position}
                      zoom={selectedPosition ? 16 : 13}
                      style={{ height: "400px", width: "100%" }}
                      className="checkout__map"
                      ref={mapRef}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Map
                        position={selectedPosition}
                        setPosition={setSelectedPosition}
                        setAddress={setAddressName}
                        mapRef={mapRef}
                      />
                      {selectedPosition && (
                        <Circle
                          center={selectedPosition}
                          radius={100}
                          pathOptions={{
                            color: "#3b82f6",
                            fillColor: "#3b82f6",
                            fillOpacity: 0.1,
                            weight: 2,
                            dashArray: "5, 5",
                          }}
                        />
                      )}
                    </MapContainer>
                  </div>
                  {errors.location && (
                    <span className="checkout__error">{errors.location}</span>
                  )}
                  <p className="checkout__map-hint">
                    🖱️ Click anywhere on the map to pin your exact delivery
                    location
                    {selectedPosition && (
                      <span className="checkout__location-selected">
                        ✅ Location selected!
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="checkout__actions">
            <button
              type="submit"
              className="checkout__submit"
              disabled={isCreating || cart.items.length === 0}
            >
              {isCreating ? (
                <>
                  <Loader2 className="checkout__submit-icon checkout__submit-icon--loading" />
                  Creating Order...
                </>
              ) : (
                <>
                  <ShoppingCart className="checkout__submit-icon" />
                  Place Order & Pay (${cart.totalPrice.toFixed(2)})
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
