import Image from "next/image";
import React from "react";
import logo from "../../public/images/logo.png";
import landingImg from "../../public/images/landingImg.gif";

const index = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#ffffff] to-[#FBF6DD] overflow-hidden h-screen ">
      <div className="flex justify-between items-center">
        <div className="absolute top-0 left-10  ">
          <Image
            src={logo}
            alt="Logo"
            width={170}
            height={300}
            className="flex "
          />
        </div>
        <div className="absolute right-24 top-16  border-2 border-violet-300 p-2 px-5 rounded-full ">
          <button className="text-violet-300">Contact Us</button>
        </div>
      </div>
      <div className="font-semibold text-[60px] absolute left-28 z-10">
        <h1>Welcome to HealthConnect</h1>
        <h2 className="text-[40px] font-thin relative left-36">
          Your Comprehensive Healthcare Companion
        </h2>
        <button className="font-medium font-serif text-[20px] bg-violet-400 p-2 px-16 py-3 rounded-full text-white relative left-[900px] top-28">
          Start
        </button>
        <button className=" font-normal text-[16px] text-gray-500 relative left-[950px] top-28">
          Watch Review
        </button>
        
      </div>
      <div className="absolute bottom-[-7px] left-[30px] z-0 ">
        <Image
          src={landingImg}
          alt="Landing Image"
          width={670}
          height={300}
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default index;
