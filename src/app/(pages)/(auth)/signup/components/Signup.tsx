
"use client";
import React, { useState } from "react";
import Image from "next/image";
import loginIntroImag from "../../../../../../public/images/LoginPage.webp";
import logo from "../../../../../../public/images/logo.png";
import { DirectionAwareHover } from "@/app/components/ui/direction-aware-hover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import axiosInstance from "@/app/hooks/useApi";
import { useRouter } from "next/navigation";

interface SignUpResponse {
  message: string;
}

const Signup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("");
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
    email: "",
    password: "",
    role: "",
  });

  const router = useRouter();

  const handleRoleChange = (value: string) => {
    setRole(value);
    setErrors((prev) => ({ ...prev, role: "" }));
  };
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:4000/user-service/auth/google';
  };
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstname: "",
      lastname: "",
      phonenumber: "",
      email: "",
      password: "",
      role: "",
    };

    if (!firstname.trim()) {
      newErrors.firstname = "First name is required";
      isValid = false;
    }

    if (!lastname.trim()) {
      newErrors.lastname = "Last name is required";
      isValid = false;
    }

    if (!phonenumber.trim()) {
      newErrors.phonenumber = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(phonenumber)) {
      newErrors.phonenumber = "Invalid phone number format";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    if (!role) {
      newErrors.role = "Please select a role";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = {
      firstname,
      lastname,
      email,
      phonenumber,
      password,
      role,
    };

    try {
      const response = await axiosInstance.post("/signup", formData);

      if (response) {
        const url = `/otp?email=${encodeURIComponent(
          email
        )}&role=${encodeURIComponent(role)}`;
        router.push(url);
      } else {
        console.log("Signup unsuccessful:");
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="flex mr-36 items-center justify-center min-h-screen bg-white space-x-20">
      <div className="absolute top-0 left-10">
        <Image
          src={logo}
          alt="Logo"
          width={170}
          height={300}
          className="flex"
        />
      </div>
      <div className="relative left-20 bg-white text-white px-64 py-80 rounded-lg bottom-8 w-80 h-80 flex items-center justify-center">
        <h1 className="absolute text-black top-20 items-center text-5xl font-inter font-bold">
          Create an account
        </h1>
        <p className="absolute text-gray-400 top-36 items-center text-[13px] font-inter">
          Describe yourself as clearly so that there are no mistakes.
        </p>
        <form onSubmit={handleSubmit}>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          />

          <div className="relative m-10px p-10 px-48 py-14">
            <button
              type="button"
              className="absolute bottom-24 flex items-center justify-center px-3 py-[8px] rounded-3xl w-full left-0 border border-black bg-white text-black font-medium hover:bg-gray-100"
            >
              <i className="fab fa-facebook-f text-blue-600 mr-2"></i>
              Continue with Facebook
            </button>
            <button
              type="button"
              className="absolute bottom-10 flex items-center justify-center px-3 py-[8px] rounded-3xl w-full left-0 border border-black bg-white text-black font-medium hover:bg-gray-100"
              onClick={handleGoogleLogin}
            >
              <i className="fab fa-google text-red-600 mr-2"></i>
              Continue with Google
            </button>
          </div>

          <p className="text-black justify-center text-center mt-[-35px]">or</p>
          <div className="relative m-10px top-[-12px] px-48 py-9">
            <input
              type="text"
              id="firstname"
              name="firstname"
              className={`absolute text-black bottom-4 px-[-1px] py-[8px] rounded-lg left-0 border ${
                errors.firstname ? "border-red-500" : "border-black"
              } placeholder-black-500 placeholder:start-60`}
              placeholder=" First name"
              style={{ width: "188px" }}
              onChange={(e) => {
                setFirstname(e.target.value);
                setErrors((prev) => ({ ...prev, firstname: "" }));
              }}
            />
            {errors.firstname && (
              <p className="absolute text-red-500 text-xs bottom-[-3px] left-0">
                {errors.firstname}
              </p>
            )}

            <input
              type="text"
              id="lastname"
              name="lastname"
              className={`absolute text-black bottom-4 px-[-112px] py-[8px] left-[195px] border ${
                errors.lastname ? "border-red-500" : "border-black"
              } rounded-lg placeholder-black-500`}
              placeholder=" Last name"
              style={{ width: "190px" }}
              onChange={(e) => {
                setLastname(e.target.value);
                setErrors((prev) => ({ ...prev, lastname: "" }));
              }}
            />
            {errors.lastname && (
              <p className="absolute text-red-500 text-xs bottom-[-3px] left-[195px]">
                {errors.lastname}
              </p>
            )}

            <input
              type="email"
              id="email"
              name="email"
              className={`absolute text-black bottom-[-45px] px-3 py-[8px] rounded-3xl w-full left-0 border ${
                errors.email ? "border-red-500" : "border-black"
              } rounded-lg`}
              placeholder="Enter your email"
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
            />
            {errors.email && (
              <p className="absolute text-red-500 text-xs bottom-[-60px] left-0">
                {errors.email}
              </p>
            )}

            <input
              type="tel"
              id="phonenumber"
              name="phonenumber"
              className={`absolute text-black bottom-[-102px] px-3 py-[8px] rounded-3xl w-full left-0 border ${
                errors.phonenumber ? "border-red-500" : "border-black"
              } rounded-lg placeholder-gray-500`}
              placeholder="Enter your Phone number"
              onChange={(e) => {
                setPhonenumber(e.target.value);
                setErrors((prev) => ({ ...prev, phonenumber: "" }));
              }}
            />
            {errors.phonenumber && (
              <p className="absolute text-red-500 text-xs bottom-[-118px] left-0">
                {errors.phonenumber}
              </p>
            )}

            <input
              type="password"
              id="password"
              name="password"
              className={`absolute text-black bottom-[-158px] px-3 py-[8px] rounded-3xl w-full left-0 border ${
                errors.password ? "border-red-500" : "border-black"
              } rounded-lg placeholder-gray-500`}
              placeholder="Enter your password"
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
            />
            {errors.password && (
              <p className="absolute text-red-500 text-xs bottom-[-172px] left-0">
                {errors.password}
              </p>
            )}

            <div className="absolute flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-[260px]">
              <Select onValueChange={handleRoleChange} value={role}>
                <SelectTrigger
                  className={`w-[180px] border ${
                    errors.role ? "border-red-500" : "border-black"
                  } text-black bg-white`}
                >
                  <SelectValue placeholder="Select" className="text-black" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="ambulance">Ambulance Driver</SelectItem>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.role && (
              <p className="absolute text-red-500 text-xs top-[278px] left-1/2 transform -translate-x-1/2">
                {errors.role}
              </p>
            )}

            <button className="bg-black absolute flex top-3 justify-center left-2 mt-[280px] py-2 px-[160px] rounded-3xl text-white">
              SignUp
            </button>
            <p className="absolute text-center text-black top-[340px] right-16 whitespace-nowrap">
              <a href="/login">Already have an account? Login</a>
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

export default Signup;
