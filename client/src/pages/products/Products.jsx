import "./products.scss";
import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ShoppingCart,
  Plus,
  Minus,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";

// RTKQ
import { useGetProductsQuery } from "../../store/products/productsSlice";
import { useGetCategoriesQuery } from "../../store/categories/categoriesSlice";
import toast from "react-hot-toast";

// Cart Context
import { useCart } from "../../context/useCart";

function Products() {
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    search: "",
  });

  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);

  // Cart Context - using the proper context methods
  const { cart, addToCart, changeQuantity, removeFromCart } = useCart();

  // Pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // RTKQ
  const {
    data: productsResponse,
    isLoading: productsLoading,
    error: productsError,
    refetch,
  } = useGetProductsQuery({
    page: paginationModel.page + 1,
    size: paginationModel.pageSize,
  });
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  // Get all products from API response
  const allProducts = productsResponse?.data?.content || [];
  const totalItems = productsResponse?.data?.totalItems || 0;
  const totalPages = productsResponse?.data?.totalPages || 0;
  const currentPage = productsResponse?.data?.currentPage || 1;

  // Get unique categories from products
  const availableCategories = useMemo(() => {
    if (categories.length > 0) return categories;

    const uniqueCategories = [];
    const seen = new Set();

    allProducts.forEach((product) => {
      if (product.category && !seen.has(product.category.id)) {
        seen.add(product.category.id);
        uniqueCategories.push(product.category);
      }
    });

    return uniqueCategories;
  }, [categories, allProducts]);

  // Client-side filtering
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category?.name.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category?.name === filters.category
      );
    }

    // Price range filter
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      filtered = filtered.filter((product) => product.price >= minPrice);
    }

    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      filtered = filtered.filter((product) => product.price <= maxPrice);
    }

    return filtered;
  }, [allProducts, filters]);

  // Use filtered products for display
  const products = filteredProducts;

  // Handle filter changes (no pagination reset needed for client-side filtering)
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      search: "",
    });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper function to get cart item quantity for a specific product
  const getCartItemQuantity = (productId) => {
    const cartItem = cart.items.find((item) => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Helper function to get cart item for a specific product
  const getCartItem = (productId) => {
    return cart.items.find((item) => item.product.id === productId);
  };

  // Cart functionality using CartContext
  const handleAddToCart = (product) => {
    if (product.stockQuantity === 0) {
      toast.error("Product is out of stock");
      return;
    }

    const currentQuantity = getCartItemQuantity(product.id);
    if (currentQuantity >= product.stockQuantity) {
      toast.error("Cannot add more items than available in stock");
      return;
    }

    addToCart(product);
    toast.success(`Added to cart! Quantity: ${currentQuantity + 1}`);
  };

  const updateCartQuantity = (product, newQuantity) => {
    const cartItem = getCartItem(product.id);

    if (!cartItem) return;

    if (newQuantity < 1) {
      removeFromCart(product.id);
      toast.success("Item removed from cart");
      return;
    }

    if (newQuantity > product.stockQuantity) {
      toast.error("Cannot add more items than available in stock");
      return;
    }

    changeQuantity(cartItem, newQuantity);
  };

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      0,
      currentPage - 1 - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 2)}
          disabled={currentPage <= 1}
          className="pagination-btn"
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`pagination-btn ${
              currentPage === page + 1 ? "active" : ""
            }`}
          >
            {page + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage)}
          disabled={currentPage >= totalPages}
          className="pagination-btn"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    );
  };

  // Render product card
  const renderProductCard = (product) => {
    const cartQuantity = getCartItemQuantity(product.id);

    return (
      <div key={product.id} className={`product-card ${viewMode}`}>
        <div className="product-image">
          <NavLink to={`/product/${product.id}`}>
            <img
              src={product.imageUrl}
              alt={product.name}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x200?text=No+Image";
              }}
            />
          </NavLink>
          {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
            <span className="low-stock-badge">
              Only {product.stockQuantity} left!
            </span>
          )}
          {product.stockQuantity === 0 && (
            <span className="out-of-stock-badge">Out of Stock</span>
          )}
        </div>

        <div className="product-info">
          <div className="product-category">{product.category?.name}</div>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-price">${product.price.toFixed(2)}</div>
          <div className="product-stock">Stock: {product.stockQuantity}</div>

          <div className="product-actions">
            {cartQuantity > 0 ? (
              <div className="quantity-controls">
                <button
                  onClick={() => updateCartQuantity(product, cartQuantity - 1)}
                  className="quantity-btn"
                >
                  <Minus size={16} />
                </button>
                <span className="quantity">{cartQuantity}</span>
                <button
                  onClick={() => updateCartQuantity(product, cartQuantity + 1)}
                  className="quantity-btn"
                  disabled={cartQuantity >= product.stockQuantity}
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stockQuantity === 0}
                className="add-to-cart-btn"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (productsError) {
    return (
      <div className="products-container">
        <div className="error-state">
          <AlertCircle size={48} />
          <h2>Error Loading Products</h2>
          <p>Something went wrong while fetching products.</p>
          <button onClick={refetch} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      {/* Header */}
      <div className="products-header">
        <div className="header-content">
          <h1>Products</h1>
          <p>Discover amazing products from our collection</p>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-toggle ${showFilters ? "active" : ""}`}
          >
            <Filter size={20} />
            Filters
          </button>

          <div className="view-toggle">
            <button
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "active" : ""}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "active" : ""}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-content">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                disabled={categoriesLoading}
              >
                <option value="">All Categories</option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                  min="0"
                  step="0.01"
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <button onClick={clearFilters} className="clear-filters-btn">
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Products Grid/List */}
      <div className="products-content">
        <div className="products-info">
          <span className="results-count">
            {productsLoading ? "Loading..." : `${totalItems} products found`}
          </span>
        </div>

        {productsLoading ? (
          <div className="loading-state">
            <Loader2 className="spinner" size={48} />
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`products-grid ${viewMode}`}>
            {products.map(renderProductCard)}
          </div>
        )}

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
}

export default Products;
