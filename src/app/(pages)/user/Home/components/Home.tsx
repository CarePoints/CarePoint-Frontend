"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../../../../../public/images/logo.png";
import heartLogo from "../../../../../../public/images/heartLogo.png";
import first from "../../../../../../public/images/mediceneService.webp";
import second from "../../../../../../public/images/homepage2.gif";
import about2 from "../../../../../../public/images/about2.gif";
import ShinyButton from "@/app/components/magicui/shiny-button";
import { testimonials } from "@/app/(pages)/data/testmonials";
import { TextGenerateEffect } from "@/app/components/ui/text-generate-effect";
import "animate.css";
import { useRouter } from "next/navigation";
import { Socket, io } from 'socket.io-client';
import {NotificationModal} from "../NotificationModal/page";


const Home = () => {
  const words = `Your Health, Our Commitment`;
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const token = localStorage.getItem("token");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);



  useEffect(() => {
    const socketInstance = io('http://localhost:10000');
    setSocket(socketInstance);

    let doctorData = localStorage.getItem('doctorOnlineAppoinemnets')
    let userData = localStorage.getItem('user');

    
 if(doctorData && userData){
  let parsedDoctor = JSON.parse(doctorData)
  let parseduserData = JSON.parse(userData)
  let roomId = generateRoomId(parsedDoctor.email,parseduserData.email)

    socketInstance.emit('join-notification', { roomId });

    console.log('Socket instance', socketInstance);
  }
    // Handle socket connection
    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
    });
  
    socketInstance.on('notification', (data) => {
      console.log('Notification received');
      const { roomId, message } = data;
      setRoomId(roomId);
      console.log('Received notification:', { roomId, message });
         setModalMessage(message);
      setIsModalOpen(true);
      // Optionally, update the notifications state
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        { roomId, message }
      ]);
    });
  
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        console.log('Socket disconnected');
      }
    };
  }, []); 
  

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/user-service/user",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setUser(result.user);
          console.log("User blocked status:", result.user.isBlocked);

          // Check if the user is blocked and handle logout
          if (result.user.isBlocked) {
            alert("Your account has been blocked. You will be logged out.");
            hanldeLogout();
          }
        } 
      } catch (error) {
        console.log(error);
      }
    };
    if (token) {
      fetchUser();
    } else {
      router.push("/login");
    }
  }, [router, token, user]);


  const generateRoomId = (doctorEmail: any, userEmail: string) => {
    const combinedString = `${doctorEmail}-${userEmail}`;
    return btoa(combinedString);
  };

  const handleProfile = () => {
    router.push('/user/UserProfile')
  };
  const hanldeLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="relative">
      <div className="relative bg-[#EAEAEA] rounded-3xl m-3 p-32 py-56 ">
        <div className="absolute top-[-15px] left-0 right-0 flex items-center justify-between p-4 z-10 ">
          <Image src={logo} alt="Logo" width={170} height={300} />

          <nav className="flex space-x-4 relative right-10">
            <a href="#" className="text-black hover:text-gray-700">
              Home
            </a>
            <span className="text-black">/</span>
            <a href="#about" className="text-black hover:text-gray-700">
              About
            </a>
            <span className="text-black">/</span>
            <a href="#services" className="text-black hover:text-gray-700">
              Services
            </a>
            <span className="text-black">/</span>
            <button onClick={handleProfile} className="text-black hover:text-gray-700">
              Profile
            </button>
            <span className="text-black">/</span>
            <a
              href="/login"
              className="text-black hover:text-gray-700"
              onClick={hanldeLogout}
            >
              Logout
            </a>
          </nav>
        </div>
        <div className="flex items-center justify-between relative top-[-15px]">
          <div>
            <h1 className="text-5xl font-bold font-inter">
              <TextGenerateEffect words={words} />
            </h1>
            <h1 className="text-[35px] font-light font-inter relative left-64 top-3 animate__animated animate__jackInTheBox">
              Streamlined Hospital Management
            </h1>
          </div>
          <button className="bg-[#0067FF] p-3 px-8 rounded-full text-white font-bold">
            Emergency Call
          </button>
        </div>
        <p className="m-10 mx-24 absolute animate__animated animate__fadeIn">
          We develop revolutionary technologies with delivering <br /> quality
          healthcare through medical technology
        </p>
        <Image
          src={heartLogo}
          alt="Logo"
          width={260}
          height={300}
          className="absolute right-36 bottom-[-110px] z-40 animate-pulse"
        />
      </div>

      <div className="relative bg-[#0067FF] rounded-3xl mt-4 m-3 p-10 flex space-x-10" id="services">
        <div className="flex items-center">
          <h1 className="text-[26px] font-bold text-white">
            Emergency Services
          </h1>
          <span className="text-4xl font-bold text-white ml-10">+</span>
        </div>

        <div className="flex items-center">
          <h1 className="text-[26px] font-bold text-white">
            Abulence Tracking
          </h1>
          <span className="text-4xl font-bold text-white ml-10">+</span>
        </div>

        <div className="flex items-center">
          <h1 className="text-[26px] font-bold text-white">AI Instruction</h1>
          <span className="text-4xl font-bold text-white ml-10">+</span>
        </div>
        <div className="flex items-center">
          <h1 className="text-[26px] font-bold text-white">
            Doctor’s Apponmenets
          </h1>
          {/* <span className="text-4xl font-bold text-white ml-10">+</span> */}
        </div>
      </div>

      {/* <div
        id="Services"
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        className="relative bg-[#0E0A3C] rounded-3xl m-3 p-6 sm:p-8 md:p-16 lg:p-32 py-16 sm:py-24 md:py-32 lg:py-[350px] mt-10"
      >
        <div className="text-white lg:absolute lg:top-32 lg:max-w-[50%]">
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-[40px] leading-tight">
            Emergency Services
          </h2>
          <h2 className="font-thin text-xl sm:text-2xl lg:text-[25px] mt-2">
            Immediate Help When You Need It Most
          </h2>
          <div className="mt-6 lg:mt-10 space-y-6 lg:space-y-10">
            <p>
              <span className="font-sans font-bold">AI-Driven First Aid:</span>{" "}
              Get immediate, tailored instructions.
            </p>
            <p>
              <span className="font-sans font-bold">Ambulance Dispatch:</span>{" "}
              Quickly request an ambulance with real-time tracking.
            </p>
            <p>
              <span className="font-sans font-bold">
                Hospital Recommendations:
              </span>{" "}
              Get analyzed and recommended nearby hospitals
              <br /> best suited for your condition.
            </p>
            <p>
              <span className="font-sans font-bold">Coordinated Response:</span>{" "}
              Seamless communication between ambulance drivers and <br />
              hospitals for optimal care.
            </p>
          </div>
        </div>
        <div className="mt-8 lg:mt-0">
          <Image
            src={first}
            alt="Logo"
            width={580}
            height={300}
            className="rounded-3xl w-full max-w-[580px] h-auto mx-auto lg:absolute lg:right-12 lg:top-[100px] lg:max-w-[40%]"
          />
          <div className="mt-6 lg:mt-0 text-center lg:text-left">
            <ShinyButton
              text="See More"
              className="bg-white lg:absolute lg:right-20 lg:bottom-10"
            />
          </div>
        </div>
      </div> */}
      <div
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        className="relative bg-[#0E0A3C] rounded-3xl m-3 p-6 sm:p-8 md:p-16 lg:p-32 py-16 sm:py-24 md:py-32 lg:py-[350px] mt-10"
      >
        <div className="text-white lg:absolute lg:top-32 lg:max-w-[50%]">
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-[40px] leading-tight">
            Doctor's appointment
          </h2>
          <h2 className="font-thin text-xl sm:text-2xl lg:text-[25px] mt-2">
            Effortless Scheduling for Seamless Care
          </h2>
          <div className="mt-6 lg:mt-10 space-y-6 lg:space-y-10">
            <p>
              <span className="font-sans font-bold">Easy Booking:</span>{" "}
              Schedule, reschedule, or cancel appointments with just a few
              clicks.
            </p>
            <p>
              <span className="font-sans font-bold">
                Real-Time Availability:{" "}
              </span>{" "}
              View doctor availability and choose your preferred time slot.
            </p>
            <p>
              <span className="font-sans font-bold">Automated Reminders:</span>{" "}
              Receive timely notifications for upcoming appointments via <br />
              SMS or email.
            </p>
            <p>
              <span className="font-sans font-bold">
                Patient History Access:
              </span>{" "}
              Doctors can easily access patient records before <br />
              consultations for personalized care.
            </p>
          </div>
        </div>
        <div className="mt-8 lg:mt-0">
          <Image
            src={second}
            alt="Logo"
            width={580}
            height={300}
            className="rounded-3xl w-full max-w-[580px] h-auto mx-auto lg:absolute lg:right-12 lg:top-[100px] lg:max-w-[40%]"
          />
          <div className="mt-6 lg:mt-0 text-center lg:text-left">
          <a href="/user/Appointments">
            <ShinyButton
              text="Book Now"
              className="bg-white lg:absolute lg:right-20 lg:bottom-10"
            />
            </a>
          </div>
        </div>
      </div>
      <div
        data-aos="fade-up"
        data-aos-anchor-placement="top-bottom"
        className="relative bg-[#0E0A3C] rounded-3xl m-3 p-6 sm:p-8 md:p-16 lg:p-32 py-14 sm:py-24 md:py-32 lg:py-[340px] mt-10"
      >
        <div className="text-white lg:absolute lg:top-32 lg:max-w-[50%]">
          <h2 className="font-bold text-3xl sm:text-4xl lg:text-[40px] leading-tight">
            Online Medicine Store
          </h2>
          <h2 className="font-thin text-xl sm:text-2xl lg:text-[25px] mt-2">
            Convenient and Reliable Medicine Shopping
          </h2>
          <div className="mt-6 lg:mt-10 space-y-6 lg:space-y-10">
            <p>
              <span className="font-sans font-bold">Easy Ordering:</span>{" "}
              Browse, select, and purchase medicines with just a few clicks.
            </p>
            <p>
              <span className="font-sans font-bold">
                Real-Time Stock Updates:
              </span>{" "}
              See available stock in real-time and choose from a wide range of
              medicines.
            </p>
            <p>
              <span className="font-sans font-bold">Fast Delivery:</span>{" "}
              Receive your medicines quickly with timely delivery to your
              doorstep.
            </p>
            <p>
              <span className="font-sans font-bold">
                Prescription Management:
              </span>{" "}
              Upload prescriptions and reorder your medications with ease.
            </p>
            <p>
              <span className="font-sans font-bold">Secure Payment:</span>{" "}
              Hassle-free and safe payment options for a smooth shopping
              experience.
            </p>
          </div>
        </div>
        <div className="mt-8 lg:mt-0">
          <Image
            src={first}
            alt="Medicine"
            width={580}
            height={300}
            className="rounded-3xl w-full max-w-[680px] h-auto mx-auto lg:absolute lg:left-[780px] lg:top-[120px] lg:max-w-[50%] "
          />
          <div className="mt-6 lg:mt-0 text-center lg:text-left">
          <a href="/user/MedicalStore">
          <ShinyButton
              text="Shop Now"
              className="bg-white lg:absolute lg:right-20 lg:bottom-10"
            />
          </a>
          </div>
        </div>
      </div>

      <div className="relative bg-[#0E0A3C] rounded-3xl m-3 p-32 py-[175px] mt-10">
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-8 lg:mb-10 text-center px-4">
            What Our Clients Say
          </h2>
          <div className="w-full max-w-[1430px] mx-auto overflow-x-auto scrollbar-hidden">
            <div className="flex space-x-6 md:space-x-8 lg:space-x-10 px-4 md:px-0">
              {testimonials.slice(0, 10).map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white text-black rounded-xl p-6 md:p-8 shadow-lg w-72 md:w-80 flex-shrink-0 animate-scroll"
                >
                  <p className="text-base md:text-lg mb-4">
                    "{testimonial.text}"
                  </p>
                  <h4 className="font-semibold text-sm md:text-base">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-500">
                    {testimonial.position}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* feefef */}
      <div
        id="about"
        className="relative bg-[#feefef] rounded-3xl m-3 p-6 sm:p-10 md:p-16 lg:p-32 py-20 lg:py-[175px] mt-10"
        data-aos="flip-left"
        data-aos-easing="ease-out-cubic"
        data-aos-duration="1000"
      >
        <div className="lg:absolute lg:top-[180px] lg:left-56 m-4 lg:m-10 lg:p-[150px] lg:px-[220px] lg:transform lg:-translate-y-1/2">
          <h2 className="text-black font-serif text-2xl lg:text-3xl mb-4 lg:mb-0 lg:absolute lg:top-4 lg:left-[160px]">
            About Us
          </h2>
          <p className="text-black font-serif text-base lg:absolute lg:top-20 lg:left-[10px] max-w-md lg:max-w-none">
            At CarePoint, our goal is to transform emergency healthcare with
            cutting-edge technology. We connect patients, doctors, hospitals,
            and ambulance drivers to deliver fast and efficient care when it's
            needed most.
          </p>
        </div>
        <div className="mt-8 lg:mt-0 lg:absolute lg:top-[134px] lg:right-56 lg:transform lg:-translate-y-1/2 lg:m-10 lg:p-[150px] lg:px-[220px]">
          <Image
            src={about2}
            alt="About Us Image"
            width={460}
            height={300}
            className="rounded-3xl max-w-full h-auto lg:absolute lg:left-[100px] lg:top-[27px]"
          />
        </div>
      </div>
      <div id="contact"></div>
      <NotificationModal  
        isOpen={isModalOpen}
        onClose={closeModal}
        message={modalMessage}/>
    </div>
  );
};

export default Home;
