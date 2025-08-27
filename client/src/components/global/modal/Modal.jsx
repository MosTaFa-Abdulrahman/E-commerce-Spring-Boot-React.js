import "./modal.css";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`modal-overlay ${isOpen ? "open" : ""}`}
      onClick={handleOverlayClick}
    >
      <div className="modal-container">
        <button
          className="modal-close-button"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} color="red" />
        </button>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
