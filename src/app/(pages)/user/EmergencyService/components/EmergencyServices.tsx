import React from "react";
import Image from "next/image";
import map from "../../../../../../public/images/gmap_world.gif";

const EmergencyServices = () => {
  return (
    <div>
      <div className="relative bg-[#0E0A3C] w-10 p-12 px-[49%] py-16 left-2 xl:left-4 flex top-10 rounded-3xl xl:py-[88px] ">
        <h1 className="absolute text-center flex top-3 left-14 font-bold xl:left-[500px] xl:text-[30px] text-white ">
          Emergency Service Feature Overview
        </h1>
        <p className="absolute text-center flex top-12 left-1 justify-center font-normal text-[10px] xl:top-[80px] xl:text-[15px] xl:ml-10 xl:mr-12 text-white">
          The emergency service feature is designed to provide users with
          immediate assistance in case of a medical emergency. This feature
          includes three main functionalities: sending an ambulance request,
          providing AI-generated first aid instructions, and allowing users to
          select a suitable hospital.
        </p>
      </div>
      <div className="relative bg-[#0E0A3C] w-10 p-12 px-[49%] py-16 left-2 xl:left-4 flex top-10 rounded-3xl xl:py-[318px] mt-10 mb-20">
        <div>
          <h1 className="absolute text-white left-20 top-14 text-[34px] font-bold gradient-text">
            Hello, <span>Akbar Haleel</span>
          </h1>
          <h1 className="absolute text-[#878787] left-44 top-28 text-[35px] font-bold">
            {" "}
            Describe Your Emergency
          </h1>
          <div>
            <div className="absolute p-[200px] px-[250px] top-[200px] bg-black left-[120px]  ">
             <form action="">
             <input
                type="text"
                className="absolute left-[50px] top-16 p-4 px-28 rounded-full"
                placeholder="What is your emergency?"
              />
              <input
                type="text"
                className="absolute left-[50px] top-40 p-4 px-28 rounded-full"
                placeholder="Enter your current location..!"
              />

             </form>
            </div>
            <div className="absolute p-[200px] top-[50px] left-[730px] px-[340px] py-[270px] rounded-full bg-white overflow-hidden">
              <Image
                src={map}
                alt="About Us Image"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0"
              />
              {/* Optional content can go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyServices;
