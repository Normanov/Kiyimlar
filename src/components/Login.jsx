import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(username.trim(), password);
      toast.success(`Welcome back, ${user.username}`);
      const dest = user.role === "admin" ? "/admin" : (location.state?.from?.pathname || "/");
      navigate(dest, { replace: true });
    } catch (err) {
      const detail = err?.response?.status === 401
        ? "Incorrect username or password."
        : "Unable to sign in. Please check the server and try again.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  const fill = (u, p) => { setUsername(u); setPassword(p); };

  return (
    <div className="auth">
      <aside className="auth-aside">
        <div className="auth-aside-art" />
        <div className="auth-aside-inner">
          <span className="eyebrow">MONO Essentials</span>
          <h2>Dressing well is a quiet kind of confidence.</h2>
          <p>
            Sign in to explore a curated wardrobe of considered, timeless pieces —
            crafted from natural materials and built to last.
          </p>
          <div className="auth-quote">“Style is knowing who you are.”</div>
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <h1>Welcome back</h1>
          <p className="sub">Sign in to continue to your wardrobe.</p>

          {location.state?.signupSuccess && (
            <div className="form-note">Account created. Please sign in.</div>
          )}
          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="lg-user">Username</label>
              <input
                id="lg-user" className="input" type="text" autoComplete="username"
                placeholder="Enter your username" value={username}
                onChange={(e) => setUsername(e.target.value)} required
              />
            </div>
            <div className="field">
              <label htmlFor="lg-pass">Password</label>
              <div className="input-wrap">
                <input
                  id="lg-pass" className="input" type={showPw ? "text" : "password"}
                  autoComplete="current-password" placeholder="Enter your password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                />
                <button type="button" className="toggle-eye" onClick={() => setShowPw((s) => !s)}>
                  {showPw ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>
            <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : "Sign in"}
            </button>
          </form>

          <div className="demo-creds">
            <b>Demo accounts</b> — tap to fill:<br />
            <a onClick={() => fill("user", "user12345")} style={{ cursor: "pointer" }}>
              Customer: <code>user / user12345</code>
            </a><br />
            <a onClick={() => fill("admin", "admin12345")} style={{ cursor: "pointer" }}>
              Admin: <code>admin / admin12345</code>
            </a>
          </div>

          <p className="auth-alt">
            New to MONO? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
