import { Link, NavLink } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { isAuthenticated, user, cartCount, isCartLoading, logout } = useAppContext();

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand">
          Velora
        </Link>

        <nav className="navbar__links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `navbar__link${isActive ? " navbar__link--active" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `navbar__link${isActive ? " navbar__link--active" : ""}`
            }
          >
            Cart{" "}
            <span className="navbar__badge">
              {isCartLoading ? "..." : cartCount}
            </span>
          </NavLink>
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `navbar__link${isActive ? " navbar__link--active" : ""}`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>

        <div className="navbar__actions">
          {isAuthenticated ? (
            <button className="btn btn--ghost btn--sm" onClick={logout}>
              Log out
            </button>
          ) : (
            <Link className="btn btn--primary btn--sm" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
