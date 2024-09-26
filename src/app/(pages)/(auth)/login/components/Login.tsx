"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import loginIntroImag from "../../../../../../public/images/LoginPage.webp";
import logo from "../../../../../../public/images/logo.png";
import { DirectionAwareHover } from "@/app/components/ui/direction-aware-hover";
import SparklesText from "@/app/components/magicui/sparkles-text";
import axiosInstance from "../../../../hooks/useApi";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  isBlocked: boolean;
  isVerified: boolean;
  roles: string;
  profilePic: string | null;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState({ email: "" });
  const [passErrors, setPassErrors] = useState({ password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const router = useRouter();

  useEffect(() => {
    // Parse query parameters from URL
    const query = new URLSearchParams(window.location.search);
    const userData = query.get("user");
    const tokenData = query.get("token");

    if (userData && tokenData) {
      
      const user: User = JSON.parse(decodeURIComponent(userData));
      
      // Store user and token in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", decodeURIComponent(tokenData));
      console.log('useresrwerew',localStorage.getItem('user'));
      console.log('dfsadfasfsadf',localStorage.getItem('token'));
      
      // Redirect to the home page or any other page
      router.push("/user/Home");
    } else {
      // Handle the case where there are no query parameters
      console.log("No user data or token found in query parameters.");
      // router.push("/login");
    }
  }, [router]);

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
      console.log("Login data we are sending:", email, password);
      if(email=='admin123@gmail.com'&&password=='admin123'){
        router.push("/admin/userManagement");
        return
      }
      
      // Make the login request
      const response = await axiosInstance.post("/login", { email, password });
 
      // Check if the response contains a token
      if (response.data.token) {
        const user = response.data.user;
        const userString = JSON.stringify(user);
  
        let getUser;
        // Store user data and token in sessionStorage
        if (user?.roles === 'user') {
          sessionStorage.setItem("user", userString);
          localStorage.setItem("user", userString); 
          getUser = sessionStorage.getItem("user");
        } else {
          sessionStorage.setItem("doctor", userString);
          localStorage.setItem("doctor", userString); 
          getUser = sessionStorage.getItem("doctor");
        }
        sessionStorage.setItem("token", response.data.token);
        localStorage.setItem("token", response.data.token);
        // Retrieve user data from sessionStorage
        if (getUser) {
          const parsedUser = JSON.parse(getUser);
  
          // Redirect based on user role
          switch (parsedUser.roles) {
            case "user":
              router.push("/user/Home");
              break;
            case "doctor":
              router.push("/doctor/profile");
              break;
            default:
              router.push("/admin/userManagement");
          }
        }
      } else if (response.data.result?.error === 'Email is not found') {
        // Handle case where email is not found
        console.log('Email is incorrect');
        setEmailError({ email: "Email is not found" });
      } else if (response.data.result?.error === 'Invalid password') {
        // Handle case where password is incorrect
        setPassErrors({ password: 'Invalid Password' });
      } else {
        // Handle other unexpected cases
        setErrors({ ...errors, password: "An error occurred. Please try again." });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrors({ ...errors, password: "An error occurred. Please try again." });
    }
  };
  


  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/user-service/auth/google";
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
            <button
              onClick={handleGoogleLogin}
              className="absolute bottom-2 flex items-center justify-center px-3 py-[8px] rounded-3xl w-full left-0 border border-black bg-white text-black font-medium hover:bg-gray-100"
            >
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
              className={`absolute text-black bottom-[-25px] px-3 py-[8px] rounded-3xl w-full left-0 border ${
                emailError.email ? "border-red-500" : "border-black"
              }`}
              placeholder="Enter your email"
            />
            {emailError.email && (
              <p className="text-red-500 text-xs absolute bottom-[-45px] left-2">
                {emailError.email}
              </p>
            )}
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`absolute text-black bottom-[-88px] px-3 py-[8px] rounded-3xl w-full left-0 border ${
                passErrors.password ? "border-red-500" : "border-black"
              }`}
              placeholder="Enter your password"
            />
            {passErrors.password && (
              <p className="text-red-500 text-xs absolute bottom-[-108px] left-2">
                {passErrors.password}
              </p>
            )}
            <p className="absolute text-center text-blue-700 top-[169px] right-4 whitespace-nowrap">
              <a href="/forgotPassword">Forgot Password</a>
            </p>
            <button
              type="submit"
              className="bg-black absolute flex top-5 justify-center left-2 mt-[180px] py-2 px-[160px] rounded-3xl"
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
