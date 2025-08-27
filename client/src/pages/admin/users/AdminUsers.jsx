import "./adminUsers.scss";
import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Modal from "../../../components/global/modal/Modal";
import Spinner from "../../../components/global/spinner/Spinner";

// RTKQ
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../../store/users/usersSlice";
import toast from "react-hot-toast";

function AdminUsers() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [UserToDelete, setUserToDelete] = useState(null);

  // Pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // RTKQ
  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useGetUsersQuery({
    page: paginationModel.page + 1,
    size: paginationModel.pageSize,
  });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // RTKQ Transformation
  const users = usersResponse?.data?.content || [];
  const totalItems = usersResponse?.data?.totalItems || 0;

  // Handle opening delete confirmation modal
  const handleDeleteClick = (User) => {
    setUserToDelete(User);
    setIsDeleteModalOpen(true);
  };

  // *********************************** ((Handlers)) ***************************************** //
  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!UserToDelete) return;

    try {
      await deleteUser(UserToDelete.id).unwrap();
      toast.success("User deleted successfully");
      handleCloseDeleteModal();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete User");
    }
  };

  // Handle delete modal close
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // Handle pagination change
  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
  };

  // Columns
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 310,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
    },
    {
      field: "username",
      headerName: "Username",
      width: 200,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
    },
    {
      field: "email",
      headerName: "Email",
      width: 320,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
    },
    {
      field: "role",
      headerName: "Role",
      width: 180,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      filterable: false,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
      renderCell: (params) => (
        <div className="actions-cell">
          <button
            onClick={() => handleDeleteClick(params.row)}
            className="action-button delete-button"
            disabled={isDeleting}
            title="Delete User"
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
          Error loading users: {error?.data?.message || "Unknown error"}
        </h3>
        <button onClick={refetch} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="admin-users__header">
        <div className="header-content">
          <h1 className="admin-users__title">Users Management</h1>
        </div>
      </div>

      {/* Table */}
      <Paper className="admin-users__paper" elevation={0}>
        <DataGrid
          rows={users}
          columns={columns}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[5, 10, 25, 50]}
          rowCount={totalItems}
          loading={isLoading}
          checkboxSelection={false}
          disableRowSelectionOnClick
          className="admin-users__data-grid"
          autoHeight
          getRowHeight={() => 80}
        />
      </Paper>

      {/* Modal ((Delete)) */}
      <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
        <div className="delete-modal">
          <div className="delete-modal-header">
            <div className="warning-icon">
              <AlertTriangle size={24} />
            </div>
          </div>

          <div className="delete-modal-content">
            <h2 className="delete-modal-title">Delete User</h2>
            <p className="delete-modal-message">
              Are you sure you want to delete the User{" "}
              <strong>"{UserToDelete?.username}"</strong>?
            </p>
            <p className="delete-modal-warning">
              This action cannot be undone and may affect products associated
              with this User.
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
              Delete User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AdminUsers;
