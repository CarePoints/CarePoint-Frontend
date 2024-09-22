"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Phone, Video } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import demoDoctor2 from "../../../../../../public/images/demoDoctor.png";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  status: "available" | "busy";
  avatarUrl: string;
}

interface Message {
  id: string;
  text: string;
  senderData: any;
  receiverData: any;
  timestamp: string;
  roomId: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const selectedDoctorForMessage = useSelector(
    (state: RootState) => state.search.messageDoctor
  );

  useEffect(() => {
    const obj: Doctor = {
      id: selectedDoctorForMessage._id,
      name: selectedDoctorForMessage.firstname,
      specialty: selectedDoctorForMessage.specialization,
      status: "available",
      avatarUrl: selectedDoctorForMessage.profilePic,
    };
    setDoctors([obj]);
  }, [selectedDoctorForMessage]);

  useEffect(() => {
    const socketConnection = io("http://localhost:10001");

    socketConnection.on("connect", () => {
      console.log("Connected successfully");
    });

    socketConnection.on("connect_error", (error) => {
      console.error("Connection failed:", error);
    });

    const doctorData = localStorage.getItem('doctorOnlineAppoinemnets');
    if(doctorData){
      const parsedData = JSON.parse(doctorData)
      console.log('parsedData', parsedData)
      socketConnection.emit("get-message", parsedData._id);
    }
 

    // socketConnection.on("receive-full-messages", (messages: any) => {
    //   console.log("receive-full-messages", messages);

    //   const { receiverDatas, senderDatas } = messages;

    //   // console.log("senderData", senderDatas);

    //   // setMessages((prevMessages) => {
    //   //   const allMessages = [...prevMessages, ...receiverDatas, ...senderDatas];

    //   //   // Remove duplicate messages
    //   //   const uniqueMessages = allMessages.filter(
    //   //     (msg, index, self) =>
    //   //       index === self.findIndex((m) => m._id === msg._id)
    //   //   );

    //   //   return uniqueMessages;
    //   // });

    //   // const newPatients = receiverDatas.map((message: any) => ({
    //   //   id: message.senderData.id,
    //   //   name: message.senderData.name,
    //   // }));

    //   // // Filter out duplicate patients
    //   // setPatients((prevPatients) => {
    //   //   const uniquePatients = [...prevPatients, ...newPatients].filter(
    //   //     (patient, index, self) =>
    //   //       index === self.findIndex((p) => p.id === patient.id)
    //   //   );
    //   //   return uniquePatients;
    //   // });
    // });



    socketConnection.on("receive-message", (message: any) => {
      console.log("Received message:", message);
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedData = JSON.parse(userData);
        if (parsedData._id != message.senderData.id) {
          const newMessage: Message = {
            id: message._id,
            text: message.message,
            senderData: message.senderData,
            receiverData: message.receiverData,
            timestamp: message.timestamp,
            roomId: message.roomId,
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      }
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() === "") return;

    const userData = localStorage.getItem("user");

    if (userData && socket && selectedDoctor) {
      const parsedData = JSON.parse(userData);
      const roomId = generateRoomId(
        parsedData._id,
        selectedDoctor.id.toString()
      );

      const senderdata = {
        id: parsedData._id,
        name: parsedData.firstname + " " + parsedData.lastname,
      };

      const receiverdata = {
        id: selectedDoctor.id,
        name: selectedDoctor.name,
      };

      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        senderData: senderdata,
        receiverData: receiverdata,
        timestamp: new Date().toISOString(),
        roomId: roomId,
      };

      console.log("Sending message:", newMessage);

      // Add message to state immediately
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Emit message to server
      socket.emit("send-message", {
        roomId: selectedDoctor.id,
        message: inputText,
        senderData: senderdata,
        receiverData: receiverdata,
      });

      setInputText("");
    }
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    if (doctor.status === "available") {
      setSelectedDoctor(doctor);
      setMessages([]);
      const userData = localStorage.getItem("user");
      if (userData && socket) {
        const parsedData = JSON.parse(userData);
        const roomId = generateRoomId(parsedData._id, doctor.id.toString());
        socket.emit("join-chat-room", doctor.id.toString());
      }
    }
  };

  const generateRoomId = (userId: string, doctorId: string) => {
    const combinedString = `${userId}-${doctorId}`;
    return btoa(combinedString); // base64 encode for simplicity
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-[#EAEAEA] rounded-3xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row h-[calc(100vh-200px)]">
          {/* Doctor List Sidebar */}
          <div className="w-full md:w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#0E0A3C]">
                Available Doctors
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Select a doctor to start a consultation
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <li
                  key={doctor.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition duration-150 ease-in-out ${
                    selectedDoctor?.id === doctor.id ? "bg-blue-50" : ""
                  } ${doctor.status === "busy" ? "opacity-50" : ""}`}
                  onClick={() => handleDoctorSelect(doctor)}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={'https://tse1.mm.bing.net/th?id=OIP.f_xTjeYbEhaQr4ABcdS8HQHaHa&pid=Api&P=0&h=180'}
                      alt={doctor.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0E0A3C] truncate">
                        {doctor.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {doctor.specialty}
                      </p>
                    </div>
                    <div
                      className={`flex-shrink-0 ${
                        doctor.status === "available"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      <span className="inline-block h-2 w-2 rounded-full bg-current"></span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedDoctor ? (
              <>
                <div className="bg-white border-b border-gray-200 p-4 flex items-center">
                  <img
                    src={'https://tse1.mm.bing.net/th?id=OIP.f_xTjeYbEhaQr4ABcdS8HQHaHa&pid=Api&P=0&h=180'}
                    alt={selectedDoctor.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-[#0E0A3C]">
                      {selectedDoctor.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedDoctor.specialty}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-[#0E0A3C] text-white p-2 rounded-full hover:bg-opacity-90 transition duration-150 ease-in-out">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="bg-[#0E0A3C] text-white p-2 rounded-full hover:bg-opacity-90 transition duration-150 ease-in-out">
                      <Video className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderData.id ===
                        JSON.parse(localStorage.getItem("user") || "{}")._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl ${
                          message.senderData.id ===
                          JSON.parse(localStorage.getItem("user") || "{}")._id
                            ? "bg-[#0E0A3C] text-white"
                            : "bg-white text-[#0E0A3C] border border-gray-200"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`text-xs ${
                            message.senderData.id ===
                            JSON.parse(localStorage.getItem("user") || "{}")._id
                              ? "text-gray-200"
                              : "text-gray-500"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="bg-white border-t border-gray-200 p-4 flex items-center">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleSend}
                    className="ml-2 bg-[#0E0A3C] text-white p-2 rounded-lg hover:bg-opacity-90 transition duration-150 ease-in-out"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-100 p-4">
                <p className="text-gray-500">
                  Select a doctor to start chatting.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
