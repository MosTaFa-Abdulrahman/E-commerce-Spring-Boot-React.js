import "./adminProducts.scss";
import { useState } from "react";
import {
  Plus,
  Pen,
  Trash2,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import Spinner from "../../../components/global/spinner/Spinner";
import Modal from "../../../components/global/modal/Modal";
import { useNavigate } from "react-router-dom";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import upload from "../../../upload";

// RTKQ
import { useGetCategoriesQuery } from "../../../store/categories/categoriesSlice";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../../store/products/productsSlice";
import toast from "react-hot-toast";

function AdminProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
    imageUrl: "",
    imageFile: null,
  });

  // Pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // RTKQ
  const {
    data: productsResponse,
    isLoading,
    error,
    refetch,
  } = useGetProductsQuery({
    page: paginationModel.page + 1,
    size: paginationModel.pageSize,
  });

  const { data: categories = [] } = useGetCategoriesQuery();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // RTKQ Transformation
  const products = productsResponse?.data?.content || [];
  const totalItems = productsResponse?.data?.totalItems || 0;

  // Handle opening modal for creating new product
  const handleCreateProduct = () => {
    setModalMode("create");
    setFormData({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      categoryId: "",
      imageUrl: "",
      imageFile: null,
    });
    setImagePreview(null);
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  // Handle opening modal for editing product
  const handleEditProduct = (product) => {
    setModalMode("edit");
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      categoryId: product.category.id,
      imageUrl: product.imageUrl,
      imageFile: null,
    });
    setImagePreview(product.imageUrl);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handle opening delete confirmation modal
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        imageFile: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //  ************************************** ((Actions-Buttons)) *********************************** //
  // Handle Create && Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Product description is required");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }
    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
      toast.error("Valid stock quantity is required");
      return;
    }
    if (!formData.categoryId) {
      toast.error("Please select a category");
      return;
    }

    try {
      let imageUrl = formData.imageUrl;

      // Upload new image if selected
      if (formData.imageFile) {
        setImageUploading(true);
        imageUrl = await upload(formData.imageFile);
        setImageUploading(false);
      }

      if (!imageUrl && modalMode === "create") {
        toast.error("Product image is required");
        return;
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        categoryId: formData.categoryId,
        imageUrl: imageUrl || "",
      };

      if (modalMode === "create") {
        await createProduct(productData).unwrap();
        toast.success("Product created successfully");
      } else {
        await updateProduct({
          productId: selectedProduct.id,
          ...productData,
        }).unwrap();
        toast.success("Product updated successfully");
      }

      handleCloseModal();
      refetch();
    } catch (error) {
      setImageUploading(false);
      toast.error(error?.data?.message || "An error occurred");
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id).unwrap();
      toast.success("Product deleted successfully");
      handleCloseDeleteModal();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete product");
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      categoryId: "",
      imageUrl: "",
      imageFile: null,
    });
    setImagePreview(null);
    setSelectedProduct(null);
    setImageUploading(false);
  };

  // Handle delete modal close
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  // Handle pagination change
  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
  };

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Handler function for product name click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Columns
  const columns = [
    {
      field: "imageUrl",
      headerName: "Image",
      width: 80,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="product-image-cell">
          <img
            src={params.value}
            alt={params.row.name}
            className="product-image"
            onError={(e) => {
              e.target.src = "";
            }}
          />
        </div>
      ),
    },

    {
      field: "name",
      headerName: "Product Name",
      flex: 1,
      minWidth: 200,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
      renderCell: (params) => (
        <div
          onClick={() => handleProductClick(params.row.id)}
          className="product-name-link"
          title={`View ${params.value}`}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
      renderCell: (params) => params?.row?.category?.name || "N/A",
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
      renderCell: (params) => (
        <span className="price-cell">{formatPrice(params.value)}</span>
      ),
    },
    {
      field: "stockQuantity",
      headerName: "Stock",
      width: 100,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
      renderCell: (params) => (
        <span className={`stock-cell ${params.value < 10 ? "low-stock" : ""}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
      renderCell: (params) => (
        <div className="actions-cell">
          <button
            onClick={() => handleEditProduct(params.row)}
            className="action-button edit-button"
            disabled={isUpdating || isDeleting}
            title="Edit Product"
          >
            <Pen size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(params.row)}
            className="action-button delete-button"
            disabled={isUpdating || isDeleting}
            title="Delete Product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Loading && Error
  if (isLoading && paginationModel.page === 0) {
    return <Spinner />;
  }
  if (error) {
    return (
      <div className="error-container">
        <h3 className="error-title">
          Error loading products: {error?.data?.message || "Unknown error"}
        </h3>
        <button onClick={refetch} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="admin-products__header">
        <div className="header-content">
          <h1 className="admin-products__title">Products Management</h1>
          <p className="admin-products__subtitle">
            Manage your product inventory and information
          </p>
        </div>
        <button
          onClick={handleCreateProduct}
          className="admin-products__add-button"
          disabled={isCreating}
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <Paper className="admin-products__paper" elevation={0}>
        <DataGrid
          rows={products}
          columns={columns}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[5, 10, 25, 50]}
          rowCount={totalItems}
          loading={isLoading}
          checkboxSelection={false}
          disableRowSelectionOnClick
          className="admin-products__data-grid"
          autoHeight
          getRowHeight={() => 80}
        />
      </Paper>

      {/* Modal ((Create + Update)) */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="product-modal">
          <div className="modal-header">
            <div className="modal-header-content">
              <h2 className="modal-title">
                {modalMode === "create" ? "Create New Product" : "Edit Product"}
              </h2>
              <p className="modal-subtitle">
                {modalMode === "create"
                  ? "Add a new product to your inventory"
                  : "Update the product information"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            {/* Image Upload Section */}
            <div className="form-group image-upload-group">
              <label className="form-label">
                Product Image <span className="required">*</span>
              </label>
              <div className="image-upload-container">
                <div className="image-preview-wrapper">
                  {imagePreview ? (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                      <div className="image-overlay">
                        <label
                          htmlFor="image-input"
                          className="change-image-btn"
                        >
                          <Upload size={16} />
                          Change
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="image-input"
                      className="image-upload-placeholder"
                    >
                      <ImageIcon size={32} />
                      <span>Click to upload image</span>
                      <small>PNG, JPG up to 5MB</small>
                    </label>
                  )}
                </div>
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-input"
                  disabled={isCreating || isUpdating || imageUploading}
                />
              </div>
              {imageUploading && (
                <div className="upload-progress">
                  <div className="upload-spinner"></div>
                  <span>Uploading image...</span>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="productName" className="form-label">
                  Product Name <span className="required">*</span>
                </label>
                <input
                  id="productName"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter product name"
                  required
                  disabled={isCreating || isUpdating || imageUploading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="categoryId" className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="form-input form-select"
                  required
                  disabled={isCreating || isUpdating || imageUploading}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-input form-textarea"
                placeholder="Enter product description"
                rows="4"
                required
                disabled={isCreating || isUpdating || imageUploading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  Price ($) <span className="required">*</span>
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="0.00"
                  required
                  disabled={isCreating || isUpdating || imageUploading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="stockQuantity" className="form-label">
                  Stock Quantity <span className="required">*</span>
                </label>
                <input
                  id="stockQuantity"
                  name="stockQuantity"
                  type="number"
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="0"
                  required
                  disabled={isCreating || isUpdating || imageUploading}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={handleCloseModal}
                className="secondary-button"
                disabled={isCreating || isUpdating || imageUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={
                  isCreating ||
                  isUpdating ||
                  imageUploading ||
                  !formData.name.trim() ||
                  !formData.description.trim() ||
                  !formData.price ||
                  !formData.stockQuantity ||
                  !formData.categoryId ||
                  (modalMode === "create" && !imagePreview)
                }
              >
                {(isCreating || isUpdating || imageUploading) && (
                  <div className="button-spinner"></div>
                )}
                {modalMode === "create" ? "Create Product" : "Update Product"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal ((Delete)) */}
      <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
        <div className="delete-modal">
          <div className="delete-modal-header">
            <div className="warning-icon">
              <AlertTriangle size={24} />
            </div>
          </div>

          <div className="delete-modal-content">
            <h2 className="delete-modal-title">Delete Product</h2>
            <p className="delete-modal-message">
              Are you sure you want to delete the product{" "}
              <strong>"{productToDelete?.name}"</strong>?
            </p>
            <p className="delete-modal-warning">
              This action cannot be undone and will permanently remove the
              product from your inventory.
            </p>
          </div>

          <div className="delete-modal-actions">
            <button
              onClick={handleCloseDeleteModal}
              className="secondary-button"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="danger-button"
              disabled={isDeleting}
            >
              {isDeleting && <div className="button-spinner"></div>}
              Delete Product
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AdminProducts;
