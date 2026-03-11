import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { useAppContext } from "../context/AppContext";

const LoginPage = () => {
  const { login, isAuthenticated } = useAppContext();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      if (mode === "login") {
        await login({
          email: formData.email.trim(),
          password: formData.password,
        });
        setMessage("Welcome back!");
      } else {
        await registerUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });
        setMode("login");
        setMessage("Account created. Please log in.");
      }
    } catch (err) {
      setMessage(
        err?.response?.data?.message || "Unable to process your request.",
      );
    } finally {
      setStatus("idle");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="container">
      <div className="login-panel">
        <div className="login-panel__toggle">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        <h2>{mode === "login" ? "Welcome back" : "Create an account"}</h2>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              Name
              <input
                name="name"
                value={formData.name}
                autoComplete="name"
                onChange={handleChange}
                placeholder="Full name"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              autoComplete="email"
              onChange={handleChange}
              placeholder="name@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={formData.password}
              autoComplete="current-password"
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </label>

          <button className="btn btn--primary" type="submit">
            {status === "loading"
              ? "Processing..."
              : mode === "login"
              ? "Log in"
              : "Create account"}
          </button>
        </form>

        {message && <p className="hero__notice">{message}</p>}
      </div>
    </section>
  );
};

export default LoginPage;
