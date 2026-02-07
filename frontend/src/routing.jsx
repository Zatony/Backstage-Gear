import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root";
import Home from "./page_home/Home";
import About from "./page_about/About";
import Rules from "./page_rules/Rules";
import Products from "./page_products/Products";
import List from "./page_list/List";
import MyAds from "./page_myAds/MyAds";
import Profile from "./page_profile/Profile";
import { tokenLoader, checkAuthLoader } from "./util/auth";
import { action as logoutAction } from "./util/logout";

export default function Routing() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <div>Hiba történt az oldal betöltésekor.</div>,
      id: "root",
      loader: tokenLoader,
      children: [
        { index: true, element: <Home /> },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/rules",
          element: <Rules />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/cart",
          element: <List />,
          loader: checkAuthLoader,
        },
        {
          path: "/my_ads",
          element: <MyAds />,
          loader: checkAuthLoader,
        },
        {
          path: "/my_profile",
          element: <Profile />,
          loader: checkAuthLoader,
        },
        {
          path: "/logout",
          action: logoutAction,
        }
      ],
    },
  ]);

  return (
    <RouterProvider router={router} fallbackElement={<div>Betöltés...</div>} />
  );
}
