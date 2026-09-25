import { useState } from "react";
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function AuthForm({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${API_URL}/api/auth/google/start`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        mode === "login"
          ? { email: email.trim().toLowerCase(), password }
          : { name: name.trim(), email: email.trim().toLowerCase(), password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      onAuth({
        token: data.token,
        user: data.user,
      });
    } catch (submitError) {
      setError(
        submitError instanceof TypeError
          ? "Unable to connect to the server. Start the backend and try again."
          : submitError.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-accent" aria-hidden="true" />
      <section className="auth-intro">
        <div className="brand-mark" aria-hidden="true">✓</div>
        <p className="auth-kicker">A calmer way to plan</p>
        <h1>Make space for the things that matter.</h1>
        <p className="auth-intro-copy">
          Keep your next steps close, clear, and easy to finish.
        </p>
        <div className="intro-note">
          <span className="intro-note-dot" aria-hidden="true" />
          <span>Small lists. Real progress.</span>
        </div>
      </section>

      <section className="auth-card">
        <div className="auth-header">
          <p className="form-eyebrow">{mode === "login" ? "Welcome back" : "Get started"}</p>
          <h2>{mode === "login" ? "Sign in to your account" : "Create your account"}</h2>
          <p>{mode === "login" ? "Pick up right where you left off." : "Your organized day starts here."}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </label>
          )}

          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
              required
            />
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="auth-divider"><span>OR CONTINUE WITH</span></div>

        <button className="google-button" type="button" onClick={handleGoogleSignIn}>
          <span className="google-g">G</span>
          Continue with Google
        </button>

        <p className="auth-switch">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button type="button" onClick={switchMode}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </section>
    </main>
  );
}

export default AuthForm;
