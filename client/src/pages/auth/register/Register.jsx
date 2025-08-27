import "./register.scss";
import { useState } from "react";
import { User, Mail, Lock, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// RTKQ
import { useRegisterUserMutation } from "../../../store/auth/authSlice";
import toast from "react-hot-toast";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // RTKQ
  const [registerUser, { isLoading, isError, error }] =
    useRegisterUserMutation();

  // Validate Password
  const isPasswordValid = () => {
    return (
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isPasswordValid()) {
      toast.error(
        "Please complete the password requirements before signing up."
      );
      return;
    }

    try {
      await registerUser({ username, email, password }).unwrap();
      navigate("/login");
      toast.success("Registered successfully!");
    } catch (error) {
      console.error(error?.data?.message);
      toast.error(error?.data?.message || "Error Register 🙄");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <User className="icon" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="input-group">
            <Mail className="icon" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
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
              {error?.data?.message || "An error occurred during registration."}
            </p>
          )}
          <button
            className="register-button"
            type="submit"
            disabled={!isPasswordValid() || isLoading}
          >
            {isLoading ? <Loader className="spinner" /> : "Sign Up"}
          </button>
        </form>

        <p className="register-footer">
          Already have an account?
          <Link to="/login" className="login-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
