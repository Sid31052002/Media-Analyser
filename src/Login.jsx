import React, { useState } from "react";
import Footer from "./Components/Footer";
import Logo from "./Assets/logo.png";
import MediaLogo from "./Assets/login.svg";
import Background from "./Assets/bg.svg";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from './context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });

    // Clear error when user starts typing again
    if (formErrors[id]) {
      setFormErrors({
        ...formErrors,
        [id]: "",
      });
    }

    // Clear any submission messages
    if (submitMessage.text) {
      setSubmitMessage({ type: "", text: "" });
    }
  };

  // Validate email format
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormErrors({
        ...formErrors,
        email: "Please enter a valid email address",
      });
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset submission state
    setSubmitMessage({ type: "", text: "" });

    // Validate email format
    if (!validateEmail()) {
      return;
    }

    // Proceed with form submission
    try {
      setIsSubmitting(true);

      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        credentials: "include", // Important for cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Set the current user in context
      setCurrentUser(data.user);

      // Success message
      setSubmitMessage({
        type: "success",
        text: "Login successful! Redirecting...",
      });

      // Redirect to dashboard page
      navigate("/");
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text:
          error.message || "Failed to login. Please check your credentials.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex flex-col lg:flex-row flex-grow">
        {/* Left Panel - Modified for responsiveness */}
        <div
          className="relative w-full lg:w-3/5 bg-gradient-to-br p-4 lg:p-8 flex flex-col items-center justify-center min-h-[40vh] lg:min-h-0"
          style={{
            backgroundImage: `url(${Background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex flex-col items-center justify-center max-w-md text-center">
            <img src={Logo} alt="Logo" className="w-auto h-16 lg:h-24 mb-6 lg:mb-20" />
            <img src={MediaLogo} alt="Media Logo" className="hidden lg:block my-16" />
            <h1 className="text-3xl lg:text-4xl font-bold my-4 lg:my-10 text-gray-800">
              Media Analyzer
            </h1>
            <p className="text-gray-600 text-sm lg:text-base hidden lg:block">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full lg:w-2/5 p-4 lg:p-8 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-2xl lg:text-3xl font-bold mb-1 text-gray-800 text-center">
              Login
            </h2>
            <p className="text-gray-600 text-sm lg:text-base mb-6 lg:mb-8 text-center">
              Welcome back! Log in to continue
            </p>

            {/* Success/Error message - Modified for mobile */}
            {submitMessage.text && (
              <div
                className={`p-3 lg:p-4 mb-4 rounded-md text-sm lg:text-base ${
                  submitMessage.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            <form className="space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={validateEmail}
                  required
                  className={`w-full px-3 py-2 text-base border ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs lg:text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 text-base border ${
                    formErrors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-xs lg:text-sm mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 text-base ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
              <div className="text-right">
                <a href="#" className="text-blue-500 hover:underline text-sm">
                  Forgot Password?
                </a>
              </div>

              <div className="text-center mt-4 lg:mt-6">
                <p className="text-gray-600 text-sm lg:text-base mb-4">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-blue-500 hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
