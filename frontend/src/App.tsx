import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <ToastContainer position="bottom-right" />
    </AuthProvider>
  );
}

export default App;
