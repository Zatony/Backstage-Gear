import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root";
import Home from "./page_home/Home";
import About from "./page_about/about";
import Rules from "./page_rules/rules";
import Products from "./page_products/Products";
import List from "./page_list/List";
import MyAds from "./page_myAds/MyAds";
import Profile from "./page_profile/Profile";
import NewAd from "./page_newAd/NewAd";
import ViewAd from "./page_ViewAd/viewAd";
import EditAd from "./page_EditAd/editAd";
import Message from "./page_message/Message";
import { tokenLoader, checkAuthLoader, checkEditAdAccess, checkAdminAccess } from "./util/auth";
import { action as logoutAction } from "./util/logout";
import ReportedAds from "./page_reportedAds/ReportedAds";

export default function Routing() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <div className="fallbackText">Hiba történt az oldal betöltésekor.</div>,
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
          path: "/product",
          element: <ViewAd />,
        },
        {
          path: "/edit_ad",
          element: <EditAd />,
          loader: checkEditAdAccess,
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
          path: "/new_ad",
          element: <NewAd />,
          loader: checkAuthLoader,
        },
        {
          path: "/my_profile",
          element: <Profile />,
          loader: checkAuthLoader,
        },
        {
          path: "/message",
          element: <Message />, 
          loader: checkAuthLoader,
        },
        {
          path: "/reported_ads",
          element: <ReportedAds />,
          loader: checkAdminAccess,
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
