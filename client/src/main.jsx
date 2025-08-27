import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { CartProvider } from "./context/useCart.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <CartProvider>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
        }}
      />
    </CartProvider>
  </Provider>
);
