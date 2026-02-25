import { NavLink, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const navClassName = ({ isActive }) =>
  isActive ? "sidebar-link sidebar-link-active" : "sidebar-link";

const Layout = () => {
  const { admin, logout } = useAuth();
  const name = admin?.name || admin?.email || "Admin";
  const firstName = name.split(" ")[0];

  return (
    <div className="admin-dashboard-bg">
      <div className="admin-dashboard-shell">
        <aside className="dashboard-sidebar animate-slide-down">
          <div className="sidebar-header">
            <img
              className="sidebar-logo"
              src="/ramadreams-logo.png"
              alt="Ramadreams Group logo"
            />
            <div>
              <p className="topbar-kicker">Ramadreams Group</p>
              <h1>Admin Suite</h1>
            </div>
          </div>

          <div className="sidebar-intro">
            <p>Live Workspace</p>
            <h2>{firstName}</h2>
            <span>{admin?.email}</span>
          </div>

          <nav className="sidebar-nav">
            <NavLink to="/" end className={navClassName}>
              Dashboard
            </NavLink>
            <NavLink to="/properties/new" className={navClassName}>
              New Listing
            </NavLink>
          </nav>

          <div className="sidebar-footer">
            <button type="button" className="button button-ghost" onClick={logout}>
              Logout
            </button>
          </div>
        </aside>

        <section className="dashboard-workspace animate-rise">
          <header className="admin-dashboard-header animate-fade-in">
            <div>
              <p className="hero-kicker">Property Control</p>
              <h2>Welcome back, {firstName}</h2>
            </div>
          </header>

          <main className="admin-main">
            <Outlet />
          </main>
        </section>
      </div>
    </div>
  );
};

export default Layout;
