import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Login = () => {
  const { token, setToken, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();

  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Account created successfully");
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful");
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <p className="text-3xl font-semibold text-gray-900">{currentState}</p>
          <p className="text-sm text-gray-500 mt-2">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="space-y-5">
          {currentState === "Sign Up" && (
            <div className="relative">
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="peer w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-800 placeholder-transparent focus:outline-none focus:border-gray-900 transition-colors bg-white"
                placeholder="Name"
                required
              />
              <label
                htmlFor="name"
                className="absolute left-4 -top-2 bg-white px-1 text-xs text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-900"
              >
                Name
              </label>
            </div>
          )}

          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-800 placeholder-transparent focus:outline-none focus:border-gray-900 transition-colors bg-white"
              placeholder="Email"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-4 -top-2 bg-white px-1 text-xs text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-900"
            >
              Email
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full border border-gray-200 rounded-lg py-3 px-4 text-sm text-gray-800 placeholder-transparent focus:outline-none focus:border-gray-900 transition-colors bg-white"
              placeholder="Password"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-4 -top-2 bg-white px-1 text-xs text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-gray-900"
            >
              Password
            </label>
          </div>

          {currentState === "Login" && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-black transition"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gray-900 text-white text-xs tracking-[0.15em] uppercase font-semibold px-8 py-4 rounded-lg hover:bg-black active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading
              ? "Please wait..."
              : currentState === "Login"
                ? "Sign In"
                : "Sign Up"}
            {!loading && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          {currentState === "Login" ? (
            <p>
              Don't have an account?{" "}
              <button
                onClick={() => setCurrentState("Sign Up")}
                className="font-medium text-black hover:underline"
              >
                Create one
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setCurrentState("Login")}
                className="font-medium text-black hover:underline"
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
