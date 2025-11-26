import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api";
import { loginUser } from "../api-login";
import { useUser } from "../../../contexts/useUser";
import "./AuthPage.css";

type AuthMode = "login" | "register";

export function AuthPage() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [mode, setMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "firstName":
      case "lastName":
        return mode === "register" && value.trim() === ""
          ? "This field is required"
          : "";
      case "email":
        if (value.trim() === "") {
          return "Email is required";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Invalid email format";
        }
        return "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {
      firstName:
        mode === "register"
          ? validateField("firstName", formData.firstName)
          : "",
      lastName:
        mode === "register" ? validateField("lastName", formData.lastName) : "",
      email: validateField("email", formData.email),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (mode === "login") {
        const user = await loginUser(formData.email);
        login(user);
        navigate("/tasks");
      } else {
        const user = await createUser(formData);
        login(user);
        navigate("/tasks");
      }
    } catch (error) {
      console.error(
        `Error ${mode === "login" ? "logging in" : "registering"}:`,
        error,
      );
      setSubmitError(
        error instanceof Error
          ? error.message
          : mode === "login"
            ? "User not found. Please register first."
            : "Failed to create account",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrors({ firstName: "", lastName: "", email: "" });
    setSubmitError(null);
  };

  return (
    <div className="auth-page">
      <h1>Welcome</h1>
      <p className="subtitle">
        {mode === "login" ? "Sign in to your account" : "Create a new account"}
      </p>

      <div className="auth-tabs">
        <button
          className={`tab ${mode === "login" ? "active" : ""}`}
          onClick={() => switchMode("login")}
          type="button"
        >
          Sign In
        </button>
        <button
          className={`tab ${mode === "register" ? "active" : ""}`}
          onClick={() => switchMode("register")}
          type="button"
        >
          Register
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {submitError && (
          <div className="submit-error" role="alert">
            {submitError}
          </div>
        )}

        {mode === "register" && (
          <>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? "error" : ""}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? "error" : ""}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <button type="submit" className="btn-submit" disabled={isSubmitting}>
          {isSubmitting
            ? mode === "login"
              ? "Signing in..."
              : "Creating account..."
            : mode === "login"
              ? "Sign In"
              : "Create Account"}
        </button>
      </form>
    </div>
  );
}
