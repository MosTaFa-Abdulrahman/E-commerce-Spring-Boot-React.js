import "./favourites.scss";
import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { NavLink } from "react-router-dom";

// RTKQ
import { useSelector } from "react-redux";
import {
  useDeleteFavouriteMutation,
  useGetFavouritesByUserQuery,
} from "../../store/favourites/favouritesSlice";
import toast from "react-hot-toast";

function Favourites() {
  // RTKQ
  const { user: currentUser } = useSelector((state) => state.authState);
  const {
    data: favourites = [],
    isLoading: favouritesLoading,
    refetch: refetchFavourites,
  } = useGetFavouritesByUserQuery(currentUser.userId);
  const [deleteFavourite, { isLoading: deletingFavourite }] =
    useDeleteFavouriteMutation();

  const [deletingItems, setDeletingItems] = useState([]);

  //  ************************** ((Actions-Buttons)) ********************************** //
  // Handle Delete
  const handleDeleteFavourite = async (favouriteId, productName) => {
    try {
      setDeletingItems((prev) => [...prev, favouriteId]);
      await deleteFavourite(favouriteId).unwrap();
      toast.success(`${productName} removed from favourites`);
      refetchFavourites();
    } catch (error) {
      toast.error("Failed to remove from favourites");
      console.error("Delete favourite error:", error);
    } finally {
      setDeletingItems((prev) => prev.filter((id) => id !== favouriteId));
    }
  };

  // Loading  && Not Found
  if (favouritesLoading) {
    return (
      <div className="favourites">
        <div className="favourites__container">
          <div className="favourites__header">
            <Heart className="favourites__header-icon" />
            <h1 className="favourites__title">My Favourites</h1>
          </div>
          <div className="favourites__loading">
            <Loader2 className="favourites__loading-spinner" />
            <p>Loading your favourites...</p>
          </div>
        </div>
      </div>
    );
  }
  if (!favourites.length) {
    return (
      <div className="favourites">
        <div className="favourites__container">
          <div className="favourites__header">
            <Heart className="favourites__header-icon" />
            <h1 className="favourites__title">My Favourites</h1>
          </div>
          <div className="favourites__empty">
            <Heart className="favourites__empty-icon" />
            <h2 className="favourites__empty-title">No favourites yet</h2>
            <p className="favourites__empty-description">
              Start exploring and add products to your favourites to see them
              here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="favourites">
      <div className="favourites__container">
        <div className="favourites__header">
          <Heart className="favourites__header-icon" />
          <h1 className="favourites__title">My Favourites</h1>
          <span className="favourites__count">{favourites.length} items</span>
        </div>

        <div className="favourites__grid">
          {favourites?.map((favourite) => (
            <div key={favourite.id} className="favourites__card">
              <div className="favourites__card-image-container">
                <NavLink to={`/product/${favourite.productId}`}>
                  <img
                    src={favourite.productImageUrl}
                    alt={favourite.productName}
                    className="favourites__card-image"
                    loading="lazy"
                  />
                </NavLink>
                <button
                  className={`favourites__card-remove ${
                    deletingItems.includes(favourite.id)
                      ? "favourites__card-remove--loading"
                      : ""
                  }`}
                  onClick={() =>
                    handleDeleteFavourite(favourite.id, favourite.productName)
                  }
                  disabled={deletingItems.includes(favourite.id)}
                  title="Remove from favourites"
                >
                  {deletingItems.includes(favourite.id) ? (
                    <Loader2 className="favourites__card-remove-icon favourites__card-remove-icon--loading" />
                  ) : (
                    <Heart className="favourites__card-remove-icon" />
                  )}
                </button>
              </div>

              <div className="favourites__card-content">
                <h3 className="favourites__card-title">
                  {favourite.productName}
                </h3>

                <div className="favourites__card-user">
                  <span className="favourites__card-user-label">Lover:</span>
                  <span className="favourites__card-user-name">
                    {favourite.userName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Favourites;
