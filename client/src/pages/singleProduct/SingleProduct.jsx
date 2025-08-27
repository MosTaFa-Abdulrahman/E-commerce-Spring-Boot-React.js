import "./singleProduct.scss";
import { useState, useMemo } from "react";
import {
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Trash2,
  User,
  Calendar,
  Package,
  Heart,
  Share2,
  Shield,
  Loader2,
} from "lucide-react";
import { useParams } from "react-router-dom";

// RTKQ
import { useSelector } from "react-redux";
import { useGetProductByIdQuery } from "../../store/products/productsSlice";
import {
  useGetReviewsByProductQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} from "../../store/reviews/reviewsSlice";
import {
  useCreateFavouriteMutation,
  useDeleteFavouriteMutation,
  useGetFavouritesByUserQuery,
} from "../../store/favourites/favouritesSlice";
import toast from "react-hot-toast";

// Cart Context
import { useCart } from "../../context/useCart";

function SingleProduct() {
  const { id: productId } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 2,
    description: "",
  });

  // Cart Context
  const { addToCart } = useCart();

  // RTKQ
  const { user: currentUser } = useSelector((state) => state.authState);
  const {
    data: product,
    isLoading: productLoading,
    error: productError,
  } = useGetProductByIdQuery(productId);

  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useGetReviewsByProductQuery(productId);

  const {
    data: userFavourites = [],
    isLoading: favouritesLoading,
    refetch: refetchFavourites,
  } = useGetFavouritesByUserQuery(currentUser?.userId, {
    skip: !currentUser?.userId,
  });

  const [createReview, { isLoading: creatingReview }] =
    useCreateReviewMutation();
  const [deleteReview, { isLoading: deletingReview }] =
    useDeleteReviewMutation();

  const [createFavourite, { isLoading: creatingFavourite }] =
    useCreateFavouriteMutation();
  const [deleteFavourite, { isLoading: deletingFavourite }] =
    useDeleteFavouriteMutation();

  // Check if current user has already reviewed this product
  const userHasReviewed = reviews.some(
    (review) => review.userId === currentUser?.userId
  );

  // Check if product is in user's favourites and get the favourite object
  const currentFavourite = useMemo(() => {
    if (!userFavourites.length || !product) return null;
    return userFavourites.find(
      (favourite) => favourite.productId === product.id
    );
  }, [userFavourites, product]);

  const isInFavourites = !!currentFavourite;
  const isFavouriteLoading = creatingFavourite || deletingFavourite;

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  // Handle quantity changes
  const handleQuantityChange = (action) => {
    if (action === "increase" && quantity < product?.stockQuantity) {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  //  ************************************** ((Actions-Buttons)) *********************************** //
  // Handle Add to CART
  const handleAddToCart = () => {
    if (!product) return;

    // Add items to cart based on selected quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    toast.success(`Added ${quantity} ${product.name}(s) to cart!`, {
      duration: 3000,
      position: "top-right",
    });

    // Reset quantity to 1 after adding to cart
    setQuantity(1);
  };

  // Handle Favourite Toggle
  const handleFavouriteToggle = async () => {
    if (!product || !currentUser) {
      toast.error("Please log in to add favourites");
      return;
    }

    try {
      if (isInFavourites && currentFavourite) {
        // Remove from favourites
        await deleteFavourite(currentFavourite.id).unwrap();
        toast.success("Removed from favourites", {
          icon: "💔",
          duration: 2000,
        });
      } else {
        // Add to favourites
        const favouriteData = {
          productId: product.id,
          userId: currentUser.userId,
        };

        await createFavourite(favouriteData).unwrap();
        toast.success("Added to favourites", {
          icon: "❤️",
          duration: 2000,
        });
      }

      // Refetch favourites to update the UI
      refetchFavourites();
    } catch (error) {
      console.error("Favourite toggle error:", error);
      toast.error(
        isInFavourites
          ? "Failed to remove from favourites"
          : "Failed to add to favourites"
      );
    }
  };

  // Handle Share
  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: product.name,
      text: `Check out this amazing product: ${product.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Product link copied to clipboard!");
      }
    } catch (error) {
      // If clipboard API fails, show the link
      toast.success("Product link: " + window.location.href);
    }
  };

  // Handle Add Review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewData.description.trim()) {
      toast.error("Please write a review description");
      return;
    }

    try {
      await createReview({
        productId,
        rating: reviewData.rating,
        description: reviewData.description,
        userId: currentUser.userId,
      }).unwrap();

      toast.success("Review submitted successfully!");
      setReviewData({ rating: 5, description: "" });
      setShowReviewForm(false);
      refetchReviews();
    } catch (error) {
      toast.error("Failed to submit review");
      console.error("Review submission error:", error);
    }
  };

  // Handle Delete Review
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId).unwrap();
        toast.success("Review deleted successfully!");
        refetchReviews();
      } catch (error) {
        toast.error("Failed to delete review");
        console.error("Review deletion error:", error);
      }
    }
  };

  //  ************************************** ((Renders)) *********************************** //

  // Render star rating
  const renderStars = (rating, interactive = false, size = "medium") => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`star star--${size} ${
          index < rating ? "star--filled" : "star--empty"
        } ${interactive ? "star--interactive" : ""}`}
        onClick={
          interactive
            ? () => setReviewData((prev) => ({ ...prev, rating: index + 1 }))
            : undefined
        }
        fill={index < rating ? "currentColor" : "none"}
      />
    ));
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading && Error
  if (productLoading) {
    return (
      <div className="single-product">
        <div className="single-product__loading">
          <div className="spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="single-product">
        <div className="single-product__error">
          <h2>Product Not Found</h2>
          <p>
            The product you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="single-product">
      <div className="single-product__container">
        {/* Product Section */}
        <div className="single-product__main">
          {/* Image Section */}
          <div className="single-product__image-section">
            <div className="single-product__image-container">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="single-product__image"
              />
              <div className="single-product__image-actions">
                <button
                  className={`single-product__action-btn single-product__action-btn--heart ${
                    isInFavourites ? "single-product__action-btn--active" : ""
                  }`}
                  onClick={handleFavouriteToggle}
                  disabled={isFavouriteLoading || favouritesLoading}
                  title={
                    isInFavourites
                      ? "Remove from favourites"
                      : "Add to favourites"
                  }
                >
                  {isFavouriteLoading ? (
                    <Loader2 className="single-product__action-spinner" />
                  ) : (
                    <Heart
                      className={
                        isInFavourites ? "single-product__heart--filled" : ""
                      }
                    />
                  )}
                </button>
                <button
                  className="single-product__action-btn single-product__action-btn--share"
                  onClick={handleShare}
                  title="Share product"
                >
                  <Share2 />
                </button>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="single-product__info-section">
            <div className="single-product__header">
              <div className="single-product__category">
                {product.category.name}
              </div>
              <h1 className="single-product__title">{product.name}</h1>

              {/* Rating Overview */}
              <div className="single-product__rating-overview">
                <div className="single-product__stars">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="single-product__rating-text">
                  {averageRating} ({reviews.length} review
                  {reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            </div>

            <div className="single-product__description">
              <p>{product.description}</p>
            </div>

            <div className="single-product__details">
              <div className="single-product__price">
                <span className="single-product__price-currency">$</span>
                <span className="single-product__price-amount">
                  {product.price}
                </span>
              </div>

              <div className="single-product__stock">
                <Package className="single-product__stock-icon" />
                <span className="single-product__stock-text">
                  {product.stockQuantity > 0
                    ? `${product.stockQuantity} items in stock`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            {product.stockQuantity > 0 && (
              <div className="single-product__purchase-section">
                <div className="single-product__quantity">
                  <label className="single-product__quantity-label">
                    Quantity:
                  </label>
                  <div className="single-product__quantity-controls">
                    <button
                      className="single-product__quantity-btn single-product__quantity-btn--decrease"
                      onClick={() => handleQuantityChange("decrease")}
                      disabled={quantity <= 1}
                    >
                      <Minus />
                    </button>
                    <span className="single-product__quantity-display">
                      {quantity}
                    </span>
                    <button
                      className="single-product__quantity-btn single-product__quantity-btn--increase"
                      onClick={() => handleQuantityChange("increase")}
                      disabled={quantity >= product.stockQuantity}
                    >
                      <Plus />
                    </button>
                  </div>
                </div>

                <button
                  className="single-product__add-to-cart"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="single-product__trust-badges">
              <div className="single-product__trust-badge">
                <Shield />
                <span>Secure Payment</span>
              </div>
              <div className="single-product__trust-badge">
                <Package />
                <span>Fast Shipping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="single-product__reviews-section">
          <div className="single-product__reviews-header">
            <h2>Customer Reviews</h2>
            {!userHasReviewed && currentUser && (
              <button
                className="single-product__write-review-btn"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                Write a Review
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && !userHasReviewed && currentUser && (
            <div className="single-product__review-form">
              <form onSubmit={handleSubmitReview}>
                <div className="single-product__form-group">
                  <label>Your Rating:</label>
                  <div className="single-product__rating-input">
                    {renderStars(reviewData.rating, true, "large")}
                  </div>
                </div>

                <div className="single-product__form-group">
                  <label htmlFor="review-description">Your Review:</label>
                  <textarea
                    id="review-description"
                    value={reviewData.description}
                    onChange={(e) =>
                      setReviewData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Share your experience with this product..."
                    rows="4"
                    required
                  />
                </div>

                <div className="single-product__form-actions">
                  <button
                    type="button"
                    className="single-product__btn single-product__btn--secondary"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="single-product__btn single-product__btn--primary"
                    disabled={creatingReview}
                  >
                    {creatingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Login prompt for reviews */}
          {!currentUser && (
            <div className="single-product__login-prompt">
              <p>Please log in to write a review or add to favourites.</p>
            </div>
          )}

          {/* Reviews List */}
          <div className="single-product__reviews-list">
            {reviewsLoading ? (
              <div className="single-product__reviews-loading">
                <div className="spinner"></div>
                <p>Loading reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="single-product__review">
                  <div className="single-product__review-header">
                    <div className="single-product__review-user">
                      <div className="single-product__review-avatar">
                        <User />
                      </div>
                      <div className="single-product__review-user-info">
                        <h4>{review.userName}</h4>
                        <div className="single-product__review-meta">
                          <div className="single-product__review-rating">
                            {renderStars(review.rating, false, "small")}
                          </div>
                          <div className="single-product__review-date">
                            <Calendar />
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {review.userId === currentUser?.userId && (
                      <button
                        className="single-product__delete-review"
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={deletingReview}
                        title="Delete review"
                      >
                        <Trash2 />
                      </button>
                    )}
                  </div>

                  <div className="single-product__review-content">
                    <p>{review.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="single-product__no-reviews">
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
