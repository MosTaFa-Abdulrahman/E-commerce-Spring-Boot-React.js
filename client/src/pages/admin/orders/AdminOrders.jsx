import "./adminOrders.scss";
import { useState } from "react";
import { Check, Truck, Package, RotateCcw, Clock, X } from "lucide-react";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Modal from "../../../components/global/modal/Modal";

// RTKQ
import {
  useGetOrdersQuery,
  useUpdateOrderMutation,
} from "../../../store/orders/ordersSlice";
import toast from "react-hot-toast";
import Spinner from "../../../components/global/spinner/Spinner";

function AdminOrders() {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // RTKQ
  const {
    data: ordersResponse,
    isLoading,
    error,
    refetch,
  } = useGetOrdersQuery({
    page: paginationModel.page + 1,
    size: paginationModel.pageSize,
  });
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const orders = ordersResponse?.data?.content || [];
  const totalItems = ordersResponse?.data?.totalItems || 0;

  const statusOptions = [
    { value: "PENDING", label: "Pending", icon: Clock, color: "#f59e0b" },
    { value: "CONFIRMED", label: "Confirmed", icon: Check, color: "#10b981" },
    { value: "SHIPPED", label: "Shipped", icon: Truck, color: "#3b82f6" },
    { value: "DELIVERED", label: "Delivered", icon: Package, color: "#059669" },
    { value: "RETURNED", label: "Returned", icon: RotateCcw, color: "#8b5cf6" },
    { value: "CANCELED", label: "Canceled", icon: X, color: "#ef4444" },
  ];

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedOrder) return;

    try {
      await updateOrder({
        orderId: selectedOrder.id,
        status: newStatus,
      }).unwrap();

      toast.success("Order status updated successfully");
      setIsStatusModalOpen(false);
      setSelectedOrder(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update order status");
    }
  };

  const handleCloseModal = () => {
    setIsStatusModalOpen(false);
    setSelectedOrder(null);
  };

  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getStatusInfo = (status) => {
    const statusInfo = statusOptions.find((option) => option.value === status);
    return statusInfo || { value: status, label: status, color: "#6b7280" };
  };

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      width: 300,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
    },
    {
      field: "totalPrice",
      headerName: "Total Price",
      width: 170,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
      renderCell: (params) => (
        <span className="price-cell">{formatPrice(params.value)}</span>
      ),
    },
    {
      field: "user",
      headerName: "Customer",
      width: 250,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
      renderCell: (params) => (
        <div className="customer-cell">
          <div className="customer-info">
            <span className="customer-name">
              {params?.row?.user?.username || "N/A"}
            </span>
          </div>
        </div>
      ),
    },
    {
      field: "createdAt",
      headerName: "Order Date",
      width: 140,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
      renderCell: (params) => {
        const date = new Date(params.value);
        return <span className="date-cell">{date.toLocaleDateString()}</span>;
      },
    },
    {
      field: "status",
      headerName: "Order Status",
      width: 150,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
      renderCell: (params) => {
        const statusInfo = getStatusInfo(params.value);
        const IconComponent = statusInfo.icon;

        return (
          <div className="status-cell">
            <span
              className="status-badge"
              style={{
                backgroundColor: `${statusInfo.color}15`,
                color: statusInfo.color,
                border: `1px solid ${statusInfo.color}30`,
              }}
            >
              {IconComponent && <IconComponent size={14} />}
              {statusInfo.label}
            </span>
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      headerClassName: "data-grid-header",
      cellClassName: "data-grid-cell",
      renderCell: (params) => {
        const order = params.row;
        const showUpdateButton =
          order.status !== "DELIVERED" && order.status !== "CANCELED";

        return (
          <div className="actions-cell">
            {showUpdateButton && (
              <button
                onClick={() => handleUpdateStatus(order)}
                className="update-button"
                disabled={isUpdating}
              >
                <Check size={14} />
                Update Status
              </button>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading && paginationModel.page === 0) {
    return <Spinner />;
  }
  if (error) {
    return (
      <div className="error-container">
        <h3 className="error-title">
          Error loading orders: {error?.data?.message || "Unknown error"}
        </h3>
        <button onClick={refetch} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders__header">
        <div className="header-content">
          <h1 className="admin-orders__title">Orders Management</h1>
          <p className="admin-orders__subtitle">
            Manage and track customer orders and their status
          </p>
        </div>
      </div>

      {/* Table */}
      <Paper className="admin-orders__paper" elevation={0}>
        <DataGrid
          rows={orders}
          columns={columns}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[5, 10, 25, 50]}
          rowCount={totalItems}
          loading={isLoading}
          checkboxSelection={false}
          disableRowSelectionOnClick
          className="admin-orders__data-grid"
          autoHeight
          getRowHeight={() => 80}
        />
      </Paper>

      {/* Modal */}
      <Modal isOpen={isStatusModalOpen} onClose={handleCloseModal}>
        <div className="status-modal">
          <div className="modal-header">
            <div className="modal-header-content">
              <h2 className="modal-title">Update Order Status</h2>
              <p className="modal-subtitle">
                Select a new status for order #{selectedOrder?.id}
              </p>
            </div>
          </div>

          <div className="modal-content">
            <div className="current-status">
              <span className="current-status-label">Current Status:</span>
              {selectedOrder && (
                <div className="current-status-badge">
                  {(() => {
                    const statusInfo = getStatusInfo(selectedOrder.status);
                    const IconComponent = statusInfo.icon;
                    return (
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: `${statusInfo.color}15`,
                          color: statusInfo.color,
                          border: `1px solid ${statusInfo.color}30`,
                        }}
                      >
                        {IconComponent && <IconComponent size={16} />}
                        {statusInfo.label}
                      </span>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="status-options">
              <span className="status-options-label">Select New Status:</span>
              <div className="status-grid">
                {statusOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isCurrentStatus =
                    selectedOrder?.status === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => handleStatusUpdate(option.value)}
                      className={`status-option ${
                        isCurrentStatus ? "current" : ""
                      }`}
                      disabled={isUpdating || isCurrentStatus}
                      style={{
                        borderColor: option.color,
                        color: option.color,
                      }}
                    >
                      <IconComponent size={18} />
                      <span>{option.label}</span>
                      {isCurrentStatus && (
                        <span className="current-indicator">Current</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={handleCloseModal}
              className="secondary-button"
              disabled={isUpdating}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AdminOrders;
