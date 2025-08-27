import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCheckAuthQuery } from "./store/auth/authSlice";
import { setUserInfo, logout } from "./store/auth/authStateSlice";

const AuthChecker = ({ children }) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.authState);
  const [shouldCheckAuth, setShouldCheckAuth] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      if (token && !user) {
        setShouldCheckAuth(true);
      } else {
        setIsInitialized(true);
      }
    }
  }, [token, user, isInitialized]);

  // Only run the query when we need to check auth
  const { data, isSuccess, isError, isLoading, error } = useCheckAuthQuery(
    undefined,
    {
      skip: !shouldCheckAuth,
    }
  );

  useEffect(() => {
    if (shouldCheckAuth) {
      if (isSuccess && data) {
        dispatch(setUserInfo(data.user));
        setShouldCheckAuth(false);
        setIsInitialized(true);
      } else if (isError) {
        dispatch(logout());
        setShouldCheckAuth(false);
        setIsInitialized(true);
      }
    }
  }, [isSuccess, isError, data, dispatch, shouldCheckAuth]);

  // Show loading only when we're actively checking authentication
  if (shouldCheckAuth && isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div
          style={{
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                border: "2px solid #f3f3f3",
                borderTop: "2px solid #3498db",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <span>Verifying authentication...</span>
          </div>
        </div>
      </div>
    );
  }

  // If we're not initialized yet and have no token, initialize immediately
  if (!isInitialized && !token) {
    setIsInitialized(true);
  }

  return isInitialized ? children : null;
};

export default AuthChecker;
