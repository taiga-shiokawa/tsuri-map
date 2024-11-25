import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Layout, RequireAuth } from "./components/layout/Layout"
import HomePage from "./pages/HomePage"
import SignInPage from "./pages/auth/SignInPage"
import LoginPage from "./pages/auth/LoginPage"
import PostDetails from "./pages/PostDetails"
import ProfilePage from "./pages/ProfilePage"
import ProfileEditPage from "./pages/ProfileEditPage"

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
