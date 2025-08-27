import "./header.scss";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Home,
  ShieldCheck,
  Menu,
  ShoppingCart,
  Heart,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Spinner from "../spinner/Spinner";

// RTKQ
import { useLogoutMutation } from "../../../store/auth/authSlice";
import { logout as logoutAction } from "../../../store/auth/authStateSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useGetFavouritesByUserQuery } from "../../../store/favourites/favouritesSlice";
import toast from "react-hot-toast";

// Cart Context
import { useCart } from "../../../context/useCart";

export default function Header() {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const menuRef = useRef();
  const mobileMenuRef = useRef();
  const navigate = useNavigate();

  // RTKQ
  const { user: currentUser } = useSelector((state) => state.authState);
  const {
    data: favourites = [],
    isLoading: favouritesLoading,
    refetch: refetchFavourites,
  } = useGetFavouritesByUserQuery(currentUser?.userId || null);
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();

  // Cart
  const { cart } = useCart();

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Base menu items that are always shown
  const baseMenuItems = [
    {
      icon: <Home />,
      label: "Home",
      path: "/",
    },
    {
      icon: <ShoppingCart />,
      label: "Products",
      path: "/products",
    },

    // {
    //   icon: <Users />,
    //   label: "Users",
    //   submenu: [
    //     {
    //       label: "Products",
    //       path: "/products",
    //       onClick: (e) => {
    //         if (!currentUser) {
    //           e.preventDefault();
    //           navigate("/login");
    //         }
    //       },
    //     },
    //     {
    //       label: "Cart",
    //       path: "/cart",
    //       onClick: (e) => {
    //         if (!currentUser) {
    //           e.preventDefault();
    //           navigate("/login");
    //         }
    //       },
    //     },
    //   ],
    // },
  ];

  // Admin menu
  const adminMenuItem = {
    icon: <ShieldCheck />,
    label: "Admin",
    submenu: [
      { label: "All Orders", path: "/admin/orders" },
      { label: "All Products", path: "/admin/products" },
      { label: "All Users", path: "/admin/users" },
      { label: "All Categories", path: "/admin/categories" },
    ],
  };

  let menuItems = [...baseMenuItems];

  if (currentUser && currentUser.role === "ADMIN") {
    menuItems.push(adminMenuItem);
  }

  const toggleUserMenu = () => setUserMenuOpen(!isUserMenuOpen);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
    setActiveSubmenu(null);
  };
  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  // ********************************* ((Handlers)) *************************************** //
  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      dispatch(logoutAction());
      navigate("/login");
      toast.success("Logged out successfully");
    }
  };

  return (
    <header className="header">
      {/* Logo Section */}
      <div className="logo-section">
        <NavLink to="/" className="logo-link">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiUJQ99MK3-qTVTOJ35SxmyfL7lHqKNURk5g&s"
            alt="Logo"
            className="logo-img"
          />
          <span className="logo-text">Spring-Ecommerce</span>
        </NavLink>
      </div>

      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        {menuItems.map((item, index) => (
          <div key={index} className="nav-item-wrapper">
            <NavLink
              to={item.path || "#"}
              className={({ isActive }) =>
                `nav-item ${item.submenu ? "has-submenu" : ""} ${
                  isActive && !item.submenu ? "active" : ""
                }`
              }
              onClick={(e) => {
                item.onClick && item.onClick(e);
                if (item.submenu) {
                  e.preventDefault();
                  toggleSubmenu(index);
                }
              }}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.submenu && (
                <ChevronDown
                  className={`submenu-arrow ${
                    activeSubmenu === index ? "rotated" : ""
                  }`}
                />
              )}
            </NavLink>

            {item.submenu && (
              <div
                className={`submenu ${activeSubmenu === index ? "active" : ""}`}
              >
                {item.submenu.map((subitem, subindex) => (
                  <NavLink
                    key={subindex}
                    to={subitem.path}
                    className={({ isActive }) =>
                      `submenu-item ${isActive ? "active" : ""}`
                    }
                    onClick={(e) => {
                      subitem.onClick && subitem.onClick(e);
                      setActiveSubmenu(null);
                    }}
                  >
                    {subitem.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Right Section */}
      <div className="right-section">
        <NavLink to={"/cart"} className="icon-button notification-btn">
          <ShoppingCart />
          {/* <span className="notification-badge">{cart?.totalCount || 0}</span> */}
          <span className="notification-badge">{cart?.items?.length || 0}</span>
        </NavLink>
        <NavLink to={"/favourites"} className="icon-button notification-btn">
          <Heart />
          <span className="notification-badge">
            {favouritesLoading ? <Spinner /> : favourites?.length}
          </span>
        </NavLink>

        {/* User Menu */}
        <div className="user-menu" ref={menuRef}>
          <button className="user-button" onClick={toggleUserMenu}>
            <span className="username">
              {currentUser?.username || "Username"}
            </span>
            <ChevronDown
              className={`dropdown-arrow ${isUserMenuOpen ? "rotated" : ""}`}
            />
          </button>

          {isUserMenuOpen && (
            <div className="user-menu-dropdown">
              {currentUser ? (
                <>
                  <NavLink to={`/profile`} className="menu-item profile-link">
                    <img
                      src="https://img.freepik.com/premium-vector/3d-vector-icon-simple-blue-user-profile-icon-with-white-features_6011-1575.jpg"
                      alt="Profile"
                      className="menu-avatar"
                    />
                    <div className="user-info">
                      <span className="user-name">{currentUser.username}</span>
                      <span className="user-role">{currentUser.role}</span>
                    </div>
                  </NavLink>
                  <hr className="menu-divider" />
                  <div
                    className="menu-item logout-item"
                    onClick={() => {
                      handleLogout();
                      setUserMenuOpen(false);
                    }}
                  >
                    Logout
                  </div>
                </>
              ) : (
                <NavLink to="/login" className="menu-item login-item">
                  Login
                </NavLink>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu" ref={mobileMenuRef}>
            <div className="mobile-menu-header">
              <div className="mobile-logo">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiUJQ99MK3-qTVTOJ35SxmyfL7lHqKNURk5g&s"
                  alt="Logo"
                />
                <span>Spring-Ecommerce</span>
              </div>
              <button className="close-btn" onClick={toggleMobileMenu}>
                <X />
              </button>
            </div>

            <nav className="mobile-nav">
              {menuItems.map((item, index) => (
                <div key={index} className="mobile-nav-item-wrapper">
                  <NavLink
                    to={item.path || "#"}
                    className={({ isActive }) =>
                      `mobile-nav-item ${item.submenu ? "has-submenu" : ""} ${
                        isActive && !item.submenu ? "active" : ""
                      }`
                    }
                    onClick={(e) => {
                      item.onClick && item.onClick(e);
                      if (item.submenu) {
                        e.preventDefault();
                        toggleSubmenu(index);
                      } else {
                        setMobileMenuOpen(false);
                      }
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.submenu && (
                      <ChevronDown
                        className={`submenu-arrow ${
                          activeSubmenu === index ? "rotated" : ""
                        }`}
                      />
                    )}
                  </NavLink>

                  {item.submenu && activeSubmenu === index && (
                    <div className="mobile-submenu">
                      {item.submenu.map((subitem, subindex) => (
                        <NavLink
                          key={subindex}
                          to={subitem.path}
                          className={({ isActive }) =>
                            `mobile-submenu-item ${isActive ? "active" : ""}`
                          }
                          onClick={(e) => {
                            subitem.onClick && subitem.onClick(e);
                            setMobileMenuOpen(false);
                            setActiveSubmenu(null);
                          }}
                        >
                          {subitem.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile User Section */}
            <div className="mobile-user-section">
              {currentUser ? (
                <>
                  <NavLink to={`/profile`} className="mobile-profile-link">
                    <img
                      src="https://img.freepik.com/premium-vector/3d-vector-icon-simple-blue-user-profile-icon-with-white-features_6011-1575.jpg"
                      alt="Profile"
                      className="mobile-avatar"
                    />
                    <div className="mobile-user-info">
                      <span className="mobile-user-name">
                        {currentUser.username}
                      </span>
                      <span className="mobile-user-role">
                        {currentUser.role}
                      </span>
                    </div>
                  </NavLink>
                  <button
                    className="mobile-logout-btn"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" className="mobile-login-btn">
                  Login
                </NavLink>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
