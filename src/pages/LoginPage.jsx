import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const { isAuthenticated, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";
  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!loading && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-shell">
      <section className="login-visual">
        <div className="login-orbit login-orbit-one"></div>
        <div className="login-orbit login-orbit-two"></div>
        <div className="login-orbit login-orbit-three"></div>

        <div className="login-copy">
          <span className="login-mark">*</span>
          <p className="login-brand">Ramadreams Group</p>
          <h1>Hello Admin!</h1>
          <p>
            Publish properties, manage media, and keep listings updated in one
            secure workspace.
          </p>
        </div>

        <p className="login-credit">
          &copy; {currentYear} Ramadreams Group. All rights reserved.
        </p>
      </section>

      <section className="login-pane">
        <form className="login-card animate-scale-in" onSubmit={handleSubmit}>
          <div className="login-card-head">
            <img
              className="login-card-logo"
              src="/ramadreams-logo.png"
              alt="Ramadreams Group logo"
            />
            <div>
              <p className="topbar-kicker">Admin Portal</p>
              <h2>Welcome Back!</h2>
              <p>Sign in to continue managing the property catalog.</p>
            </div>
          </div>

          {error ? <p className="form-error">{error}</p> : null}

          <label className="form-field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@ramadreamsgroup.com"
              required
            />
          </label>

          <label className="form-field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </label>

          <div className="login-meta-row">
            <span>Secure internal access</span>
            <span>v1.0</span>
          </div>

          <button type="submit" className="button button-dark" disabled={submitting}>
            {submitting ? "Signing in..." : "Login Now"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;
