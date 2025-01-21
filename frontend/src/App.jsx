import { useEffect } from "react";
import { useDispatch } from "react-redux"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { getUser } from "./store/slice/authSlice"
import ProtectedRoute from "./components/common/ProtectedRoute";
import ChatPage from "./pages/ChatPage";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<ChatPage />} />
        </Route>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage/>} />
      </Routes>
      <Toaster/>
    </BrowserRouter>
  )
}

export default App
