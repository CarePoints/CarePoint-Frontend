"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import OtpImg from "../../../../../../public/images/mobile-otp.gif";
import axiosInstance from "@/app/hooks/useApi";
import { useRouter } from "next/navigation";

const Otp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(3);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");

  const params = new URLSearchParams(window.location.search);
  const emailParam = params.get('email');
  const roleParam = params.get('role');

  const router = useRouter();

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOtpChange = (e: any, index: number) => {
    const value = e.target.value;
    if (value.length > 1) return; // Limit input length to 1 digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus on the next input field
    if (value && index < otp.length - 1) {
      const nextInput = document.querySelector(
        `input[name="otp-${index + 1}"]`
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const otpCode = otp.join(""); // Combine OTP inputs into a single string

    // Validation
    if (otpCode.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    setError(""); // Clear any previous errors

    try {
      const response = await axiosInstance.post("/verify-otp", {
        otp: otpCode, email: emailParam
      });
      console.log("OTP verified successfully:", response.data);
      const isVerified = response.data.user.isVerified;
      if (isVerified) {
        console.log("we can navigate to dashboard", isVerified);
        const email = emailParam ?? '';
        if(roleParam === 'doctor'){
          router.push(`/doctorVerification?email=${encodeURIComponent(email)}`);
        } else {
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleResend = async () => {
    try {
      const response = await axiosInstance.post("/signup", { email: emailParam, role: roleParam });
      if (response.data.success) {
        setTimeLeft(60); // Reset timer
        setCanResend(false);
        setError(""); // Clear any previous errors
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("Failed to resend OTP. Please try again later.");
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-[#EAEAEA] to-blue-400">
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg w-full max-w-sm">
        <Image
          src={OtpImg}
          alt="OTP Verification"
          width={200}
          height={200}
          className="mb-4"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Verification Code
        </h1>
        <p className="text-gray-600 mb-4">Please enter the code sent to</p>
        <p className="text-gray-800 font-bold mb-6">{emailParam}</p>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex justify-between mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                name={`otp-${index}`}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                className="w-14 h-14 border border-gray-300 rounded-lg text-center text-xl font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                maxLength={1}
                inputMode="numeric"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>
          <div className="flex justify-center mb-6">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
            >
              Continue
            </button>
          </div>
        </form>
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-700">
              Time left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Otp;