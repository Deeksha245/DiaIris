
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <Link to={user ? "/dashboard" : "/"} className="navbar-logo">
          <span className="logo-mark">D</span>
          <span>DiaIris</span>
        </Link>

        {/* Navigation */}
        <div className="navbar-links">

          {user && (
            <>
              <Link
                to="/dashboard"
                className={isActive("/dashboard") ? "active" : ""}
              >
                Dashboard
              </Link>

              <Link
                to="/detection"
                className={isActive("/detection") ? "active" : ""}
              >
                Detection
              </Link>

              <Link
                to="/history"
                className={isActive("/history") ? "active" : ""}
              >
                History
              </Link>

              <Link
                to="/appointments"
                className={isActive("/appointments") ? "active" : ""}
              >
                Appointments
              </Link>

              <Link
                to="/medications"
                className={isActive("/medications") ? "active" : ""}
              >
                Medications
              </Link>

              <Link
                to="/about"
                className={isActive("/about") ? "active" : ""}
              >
                About
              </Link>

              {user.role === "admin" && (
                <Link
                  to="/doctor"
                  className={isActive("/doctor") ? "active" : ""}
                >
                  Admin
                </Link>
              )}
            </>
          )}

          {!user && (
            <Link
              to="/about"
              className={isActive("/about") ? "active" : ""}
            >
              About
            </Link>
          )}

        </div>

        {/* Right side */}
        <div className="navbar-right">

          {user ? (
            <>
              <Link
                to="/profile"
                className="navbar-user"
              >
                <span className="user-avatar">
                  {user.name?.charAt(0).toUpperCase()}
                </span>

                <span className="navbar-username">
                  {user.name}
                </span>
              </Link>

              <button
                className="navbar-logout"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="navbar-login-link"
              >
                Log In
              </Link>

              <Link
                to="/signup"
                className="navbar-signup-btn"
              >
                Sign Up
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;

