import { GalleryVerticalEnd, LogOutIcon } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white shadow sticky top-0 z-10">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-lg font-bold flex-row">
          <div className="flex justify-center gap-2 md:justify-start">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Notes.
          </div>
        </Link>

        <div className="space-x-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={logout}
                className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md p-2"
              >
                <LogOutIcon />
              </button>
            </>
          ) : (
            <>
              <Navigate to="/login" />
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
