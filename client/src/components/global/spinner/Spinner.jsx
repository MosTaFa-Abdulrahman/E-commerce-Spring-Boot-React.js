import "./spinner.css";
import { Loader2 } from "lucide-react";

export default function Spinner({
  size = "medium",
  color = "primary",
  className = "",
  text = "",
}) {
  const sizeClasses = {
    small: "spinner-small",
    medium: "spinner-medium",
    large: "spinner-large",
  };

  const colorClasses = {
    primary: "spinner-primary",
    secondary: "spinner-secondary",
    white: "spinner-white",
    dark: "spinner-dark",
  };

  return (
    <div className={`spinner-container ${className}`}>
      <Loader2
        className={`spinner ${sizeClasses[size]} ${colorClasses[color]}`}
      />
      {text && <span className="spinner-text">{text}</span>}
    </div>
  );
}
