import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserApi from "../api/UserApi.jsx";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (username.trim().length < 3) return "Username must be at least 3 characters.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Passwords don’t match.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }
    setError("");
    setLoading(true);
    try {
      await UserApi.signup(username.trim(), password);
      navigate("/login", { state: { signupSuccess: true } });
    } catch (err) {
      const detail = err?.response?.status === 409
        ? "That username is already taken. Try another."
        : err?.response?.data?.detail || "Sign up failed. Please try again.";
      setError(typeof detail === "string" ? detail : "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <aside className="auth-aside">
        <div className="auth-aside-art" />
        <div className="auth-aside-inner">
          <span className="eyebrow">Join MONO</span>
          <h2>A wardrobe worth keeping starts here.</h2>
          <p>
            Create your account to save favourites, build a considered closet, and
            be first to discover new arrivals each season.
          </p>
          <div className="auth-quote">“Buy less, choose well, make it last.”</div>
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <h1>Create account</h1>
          <p className="sub">Join the house in less than a minute.</p>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="su-user">Username</label>
              <input
                id="su-user" className="input" type="text" autoComplete="username"
                placeholder="Choose a username" value={username}
                onChange={(e) => setUsername(e.target.value)} required
              />
            </div>
            <div className="field">
              <label htmlFor="su-pass">Password</label>
              <div className="input-wrap">
                <input
                  id="su-pass" className="input" type={showPw ? "text" : "password"}
                  autoComplete="new-password" placeholder="At least 6 characters"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                />
                <button type="button" className="toggle-eye" onClick={() => setShowPw((s) => !s)}>
                  {showPw ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>
            <div className="field">
              <label htmlFor="su-conf">Confirm password</label>
              <input
                id="su-conf" className="input" type={showPw ? "text" : "password"}
                autoComplete="new-password" placeholder="Re-enter your password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} required
              />
            </div>
            <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : "Create account"}
            </button>
          </form>

          <p className="auth-alt">
            Already a member? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Signup;
