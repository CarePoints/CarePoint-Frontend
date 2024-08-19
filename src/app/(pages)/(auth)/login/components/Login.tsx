
"use client";

import React, { useState } from "react";
import Image from "next/image";
import loginIntroImag from "../../../../../../public/images/LoginPage.webp";
import logo from "../../../../../../public/images/logo.png";
import { DirectionAwareHover } from "@/app/components/ui/direction-aware-hover";
import SparklesText from "@/app/components/magicui/sparkles-text";
import axiosInstance from "../../../../hooks/useApi";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      console.log("Login data we are sending..", email, password);

      const response = await axiosInstance.post("/login", { email, password });
      console.log("Login successful:", response);

      if (response.data.token) {
        const user = response.data.user;
        const userString = JSON.stringify(user);

        localStorage.setItem("user", userString);
        localStorage.setItem("token", response.data.token);

        switch (user.roles) {
          case "user":
            router.push("/user/Home");
            break;
          case "doctor":
            router.push("/doctor/dashboard");
            break;
          default:
            router.push("/admin");
        }
      } else {
        setErrors({ ...errors, password: "Invalid email or password" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrors({ ...errors, password: "An error occurred. Please try again." });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:4000/user-service/google';
  };

  return (
    <div className="flex mr-36 items-center justify-center min-h-screen bg-white space-x-20">
      <div className="absolute top-0 left-10 flex-grow flex items-center justify-center space-x-20">
        <Image
          src={logo}
          alt="Logo"
          width={170}
          height={300}
          className="flex"
        />
      </div>
      <div className="relative left-20 bg-white text-white px-64 py-80 rounded-lg bottom-8 w-80 h-80 flex items-center justify-center">
        <h1 className="absolute text-black top-28 items-center text-5xl font-inter font-bold">
          <SparklesText text="Login" />
        </h1>
        <p className="absolute text-gray-400 top-48 items-center text-[13px] font-inter">
          Describe yourself as clearly so that there are no mistakes.
        </p>
        <form onSubmit={handleSubmit}>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          />
          <div className="relative m-10px p-10 px-48 py-14">
            <button className="absolute bottom-16 flex items-center justify-center px-3 py-[8px] rounded-3xl w-full left-0 border border-black bg-white text-black font-medium hover:bg-gray-100">
              <i className="fab fa-facebook-f text-blue-600 mr-2"></i>
              Continue with Facebook
            </button>
            <button onClick={handleGoogleLogin} className="absolute bottom-2 flex items-center justify-center px-3 py-[8px] rounded-3xl w-full left-0 border border-black bg-white text-black font-medium hover:bg-gray-100">
              <i className="fab fa-google text-red-600 mr-2"></i>
              Continue with Google
            </button>
          </div>
          <p className="text-black absolute justify-center text-center mt-[0px] left-60">
            or
          </p>
          <div className="relative m-10px top-[-12px] px-48 py-9">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`absolute text-black bottom-[-25px] px-3 py-[8px] rounded-3xl w-full left-0 border ${errors.email ? 'border-red-500' : 'border-black'}`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-xs absolute bottom-[-45px] left-2">{errors.email}</p>}
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`absolute text-black bottom-[-88px] px-3 py-[8px] rounded-3xl w-full left-0 border ${errors.password ? 'border-red-500' : 'border-black'}`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-xs absolute bottom-[-108px] left-2">{errors.password}</p>}
            <button
              type="submit"
              className="bg-black absolute flex top-3 justify-center left-2 mt-[180px] py-2 px-[160px] rounded-3xl"
            >
              Login
            </button>
            <p className="absolute text-center text-black top-[255px] right-20 whitespace-nowrap">
              <a href="/signup"> Create an account? SignUp</a>
            </p>
          </div>
        </form>
      </div>
      <DirectionAwareHover imageUrl={loginIntroImag}>
        <p className="font-bold text-xl">Welcome Back!</p>
        <p className="font-normal text-sm">
          Your journey continues here. Log in to proceed.
        </p>
      </DirectionAwareHover>
    </div>
  );
};

export default Login;