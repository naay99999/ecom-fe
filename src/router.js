import { createBrowserRouter } from "react-router";

// layouts
import RootLayout from "./layouts/RootLayout";
import CheckoutLayout from "./layouts/CheckoutLayout";
import AccountLayout from "./layouts/AccountLayout";

// pages — existing
import HomePage from "./pages/HomePage";
import ProductsListPage from "./pages/ProductsListPage";
import ProductsDetailPage from "./pages/ProductsDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

// pages — auth
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// pages — orders
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrdersListPage from "./pages/OrdersListPage";
import OrderDetailPage from "./pages/OrderDetailPage";

// pages — account
import AccountPage from "./pages/AccountPage";
import ProfilePage from "./pages/ProfilePage";
import AddressesPage from "./pages/AddressesPage";

// pages — discovery
import SearchResultsPage from "./pages/SearchResultsPage";
import CategoryPage from "./pages/CategoryPage";

// pages — static
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    ErrorBoundary: NotFoundPage,
    children: [
      { index: true, Component: HomePage },

      // Products
      { path: "products", Component: ProductsListPage },
      { path: "products/:productId", Component: ProductsDetailPage },

      // Cart & Checkout
      { path: "cart", Component: CartPage },
      {
        path: "checkout",
        Component: CheckoutLayout,
        children: [
          { index: true, Component: CheckoutPage },
          { path: "success", Component: OrderConfirmationPage },
        ],
      },

      // Auth
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "forgot-password", Component: ForgotPasswordPage },

      // Account
      {
        path: "account",
        Component: AccountLayout,
        children: [
          { index: true, Component: AccountPage },
          { path: "profile", Component: ProfilePage },
          { path: "addresses", Component: AddressesPage },
          { path: "orders", Component: OrdersListPage },
          { path: "orders/:orderId", Component: OrderDetailPage },
        ],
      },

      // Discovery
      { path: "search", Component: SearchResultsPage },
      { path: "categories/:slug", Component: CategoryPage },

      // Static
      { path: "about", Component: AboutPage },
      { path: "contact", Component: ContactPage },

      // 404
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
