import "./login.scss";
import { useState } from "react";
import { User, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// RTKQ
import { useLoginUserMutation } from "../../../store/auth/authSlice";
import { setCredentials } from "../../../store/auth/authStateSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // RTKQ
  const [loginUser, { isLoading, isError, error }] = useLoginUserMutation();
  const dispatch = useDispatch();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const result = await loginUser({ username, password }).unwrap();

      // Store credentials in Redux state
      dispatch(
        setCredentials({
          user: result.user,
          token: result.token,
        })
      );

      navigate("/");
      toast.success("LoggedIn Success 😎!");
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || "Error Logged");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back </h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <User className="icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="input-group">
            <Lock className="icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isError && (
            <p className="error-message">
              {error?.data?.message || "An error occurred during login."}
            </p>
          )}
          <button className="login-button" type="submit" disabled={isLoading}>
            {isLoading ? <Loader className="spinner" /> : "Login"}
          </button>
        </form>

        <p className="login-footer">
          You don't have an account?
          <Link to="/register" className="login-link">
            register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
