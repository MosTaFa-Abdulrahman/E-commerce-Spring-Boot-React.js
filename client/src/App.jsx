import "./App.scss";
import { useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";

// RTKQ
import { useSelector } from "react-redux";
import AuthChecker from "./AuthChecker";

// Main Components
import Header from "./components/global/header/Header";
import Footer from "./components/global/footer/Footer";

// Auth
import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import NotFound from "./pages/notFound/NotFound";

// Pages ((User))
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Favourites from "./pages/favourites/Favourites";
import Products from "./pages/products/Products";
import SingleProduct from "./pages/singleProduct/SingleProduct";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import Payment from "./pages/payment/Payment";

// Pages ((Admin))
import AdminCategories from "./pages/admin/categories/AdminCategories";
import AdminOrders from "./pages/admin/orders/AdminOrders";
import AdminProducts from "./pages/admin/products/AdminProducts";
import AdminUsers from "./pages/admin/users/AdminUsers";

// Dashboard layout with sidebar
const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      <div
        className={`main-content ${isSidebarOpen ? "expanded" : "collapsed"}`}
      >
        <Header isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="dashboard-content">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

// Simple layout for auth pages
const SimpleLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

// Protected ((ADMIN))
const AdminRoute = ({ element }) => {
  const { user, isAuthenticated } = useSelector((state) => state.authState);

  if (!isAuthenticated || !user || user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return element;
};

// Protected ((USER))
const AuthenticatedRoute = ({ element }) => {
  const { isAuthenticated } = useSelector((state) => state.authState);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return element;
};

function App() {
  const { isAuthenticated } = useSelector((state) => state.authState);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        // Authenticated ((USER))
        {
          path: "/",
          element: <AuthenticatedRoute element={<Home />} />,
        },
        {
          path: "/favourites",
          element: <AuthenticatedRoute element={<Favourites />} />,
        },
        {
          path: "/products",
          element: <AuthenticatedRoute element={<Products />} />,
        },
        {
          path: "/product/:id",
          element: <AuthenticatedRoute element={<SingleProduct />} />,
        },
        {
          path: "/profile",
          element: isAuthenticated ? <Profile /> : <Navigate to="/" />,
        },
        {
          path: "/cart",
          element: <AuthenticatedRoute element={<Cart />} />,
        },
        {
          path: "/checkout",
          element: <AuthenticatedRoute element={<Checkout />} />,
        },
        {
          path: "/:orderId/pay",
          element: <AuthenticatedRoute element={<Payment />} />,
        },

        // Authenticated ((ADMIN))
        {
          path: "/admin/categories",
          element: <AdminRoute element={<AdminCategories />} />,
        },
        {
          path: "/admin/orders",
          element: <AdminRoute element={<AdminOrders />} />,
        },
        {
          path: "/admin/products",
          element: <AdminRoute element={<AdminProducts />} />,
        },
        {
          path: "/admin/users",
          element: <AdminRoute element={<AdminUsers />} />,
        },
      ],
    },

    {
      path: "/",
      element: <SimpleLayout />,
      children: [
        {
          path: "/register",
          element: !isAuthenticated ? <Register /> : <Navigate to="/" />,
        },
        {
          path: "/login",
          element: !isAuthenticated ? <Login /> : <Navigate to="/" />,
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return (
    <AuthChecker>
      <RouterProvider router={router} />
    </AuthChecker>
  );
}

export default App;
