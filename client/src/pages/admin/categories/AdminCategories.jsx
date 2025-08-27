import "./adminCategories.scss";
import { useState } from "react";
import { Plus, Pen, Trash2, X, AlertTriangle } from "lucide-react";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Modal from "../../../components/global/modal/Modal";
import Spinner from "../../../components/global/spinner/Spinner";

// RTKQ
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../../store/categories/categoriesSlice";
import toast from "react-hot-toast";

function AdminCategories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  // RTKQ
  const {
    data: categories = [],
    isLoading,
    error,
    refetch,
  } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  // Handle opening modal for creating new category
  const handleCreateCategory = () => {
    setModalMode("create");
    setCategoryName("");
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  // Handle opening modal for editing category
  const handleEditCategory = (category) => {
    setModalMode("edit");
    setCategoryName(category.name);
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // Handle opening delete confirmation modal
  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  // *********************************** ((Handlers)) ***************************************** //
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      if (modalMode === "create") {
        await createCategory({ name: categoryName.trim() }).unwrap();
        toast.success("Category created successfully");
      } else {
        await updateCategory({
          categoryId: selectedCategory.id,
          name: categoryName.trim(),
        }).unwrap();
        toast.success("Category updated successfully");
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error?.data?.message || "An error occurred");
    }
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id).unwrap();
      toast.success("Category deleted successfully");
      handleCloseDeleteModal();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete category");
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCategoryName("");
    setSelectedCategory(null);
  };

  // Handle delete modal close
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  // Columns
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 350,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
    },
    {
      field: "name",
      headerName: "Category Name",
      width: 850,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
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
            onClick={() => handleEditCategory(params.row)}
            className="action-button edit-button"
            disabled={isUpdating || isDeleting}
            title="Edit Category"
          >
            <Pen size={16} />
          </button>
          <button
            onClick={() => handleDeleteClick(params.row)}
            className="action-button delete-button"
            disabled={isUpdating || isDeleting}
            title="Delete Category"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Loading && Error
  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return (
      <div className="error-container">
        <h3 className="error-title">
          Error loading categories: {error?.data?.message || "Unknown error"}
        </h3>
        <button onClick={refetch} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-categories">
      <div className="admin-categories__header">
        <div className="header-content">
          <h1 className="admin-categories__title">Categories Management</h1>
          <p className="admin-categories__subtitle">
            Manage your product categories
          </p>
        </div>
        <button
          onClick={handleCreateCategory}
          className="admin-categories__add-button"
          disabled={isCreating}
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <Paper className="admin-categories__paper" elevation={0}>
        <DataGrid
          rows={categories}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          className="admin-categories__data-grid"
          autoHeight
          getRowHeight={() => 60}
        />
      </Paper>

      {/* Modal ((Create + Update)) */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="category-modal">
          <div className="modal-header">
            <div className="modal-header-content">
              <h2 className="modal-title">
                {modalMode === "create"
                  ? "Create New Category"
                  : "Edit Category"}
              </h2>
              <p className="modal-subtitle">
                {modalMode === "create"
                  ? "Add a new category to organize your products"
                  : "Update the category information"}
              </p>
            </div>
            <button
              onClick={handleCloseModal}
              className="modal-close-button"
              disabled={isCreating || isUpdating}
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label htmlFor="categoryName" className="form-label">
                Category Name <span className="required">*</span>
              </label>
              <input
                id="categoryName"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="form-input"
                placeholder="Enter category name"
                required
                disabled={isCreating || isUpdating}
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={handleCloseModal}
                className="secondary-button"
                disabled={isCreating || isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={isCreating || isUpdating || !categoryName.trim()}
              >
                {(isCreating || isUpdating) && (
                  <div className="button-spinner"></div>
                )}
                {modalMode === "create" ? "Create Category" : "Update Category"}
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
            <h2 className="delete-modal-title">Delete Category</h2>
            <p className="delete-modal-message">
              Are you sure you want to delete the category{" "}
              <strong>"{categoryToDelete?.name}"</strong>?
            </p>
            <p className="delete-modal-warning">
              This action cannot be undone and may affect products associated
              with this category.
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
              Delete Category
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AdminCategories;
