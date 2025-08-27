import "./notFound.scss";
import { NavLink } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <NavLink to={"/"} className="home-link">
        Go Back Home
      </NavLink>
    </div>
  );
}
