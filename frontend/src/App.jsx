import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Layout, RequireAuth } from "./components/layout/Layout"
import HomePage from "./pages/HomePage"
import SignInPage from "./pages/auth/SignInPage"
import LoginPage from "./pages/auth/LoginPage"
import PostDetails from "./pages/PostDetails"
import ProfilePage from "./pages/ProfilePage"
import ProfileEditPage from "./pages/ProfileEditPage"
import NotFoundPage from "./pages/NotFoundPage"
import ForgetPassword from "./pages/ForgetPassword"
import SetNewPasswordPage from "./pages/SetNewPasswordPage"
import EmailSentConfirmation from "./components/info/EmailSentConfirmation"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,

      children: [
        {
          path: "/",
          element: <HomePage />
        },
        {
          path: "/signin",
          element: <SignInPage />
        },
        {
          path: "/login",
          element: <LoginPage />
        },
        {
          path: "/posts/:id",
          element: <PostDetails />
        },
        {
          path: "/forgot-password",
          element: <ForgetPassword />
        },
        {
          path: "/password-reset/:token",
          element: <SetNewPasswordPage />
        },
        {
          path: "/email-sent-confirmation",
          element: <EmailSentConfirmation />
        },
        {
          path: "/*",
          element: <NotFoundPage />
        }
      ]
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />
        },
        {
          path: "/profile/edit",
          element: <ProfileEditPage />
        }
      ]
    }
  ]
  )
  return (
    <RouterProvider router={router} />
  )
}

export default App
