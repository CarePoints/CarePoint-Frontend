"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Phone, Video } from "lucide-react";
import { io } from "socket.io-client";

interface SenderData {
  id: string;
  name: string;
}

interface Message {
  _id: string;
  roomId: string;
  message: string;
  senderData: SenderData;
  receiverData: SenderData;
  timestamp: string;
}

interface Patient {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessage?: string;
  unreadCount?: number;
  status?: string;
}

const DoctorChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = io("http://localhost:10001");

    socket.current.on("connect", () => {
      console.log("Connected successfully");
    });

    let doctorData = localStorage.getItem("doctor");
    if (doctorData) {
      const parsedDoctorData = JSON.parse(doctorData);
      let doctorId = parsedDoctorData._id;

      socket.current.emit("get-message", doctorId);
      socket.current.emit("join-chat-room", doctorId);
    }

    socket.current.on("receive-full-messages", (messages: any) => {
      console.log("receive-full-messages", messages);

      const { receiverDatas, senderDatas } = messages;

      console.log("senderData", senderDatas);

      setMessages((prevMessages) => {
        const allMessages = [...prevMessages, ...receiverDatas, ...senderDatas];

        // Remove duplicate messages
        const uniqueMessages = allMessages.filter(
          (msg, index, self) =>
            index === self.findIndex((m) => m._id === msg._id)
        );

        return uniqueMessages;
      });

      const newPatients = receiverDatas.map((message: any) => ({
        id: message.senderData.id,
        name: message.senderData.name,
      }));

      // Filter out duplicate patients
      setPatients((prevPatients) => {
        const uniquePatients = [...prevPatients, ...newPatients].filter(
          (patient, index, self) =>
            index === self.findIndex((p) => p.id === patient.id)
        );
        return uniquePatients;
      });
    });

    socket.current.on("receive-message", (message: any) => {
      console.log("receive-message is", message);
      let doctorData = localStorage.getItem("doctor");
      if (doctorData) {
        const parsedDoctorData = JSON.parse(doctorData);
        if (parsedDoctorData._id != message.senderData.id) {
          setMessages((prevMessages) => {
            // Prevent duplicate messages
            const messageExists = prevMessages.some(
              (msg) => msg._id === message._id
            );
            if (messageExists) {
              return prevMessages;
            }

            return [...prevMessages, message];
          });
        }
      }
    });

    socket.current.on("connect_error", (error: any) => {
      console.log("Connection failed:", error);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    console.log("handleSend tiggereedd");
    const doctorData = localStorage.getItem("doctor");
    if (doctorData && inputText.trim() && selectedPatient) {
      const parsedData = JSON.parse(doctorData);

      const newMessage: Message = {
        _id: new Date().toISOString(),
        roomId: parsedData._id,
        message: inputText,
        senderData: {
          id: parsedData._id,
          name: parsedData.firstname + " " + parsedData.lastname,
        },
        receiverData: selectedPatient,
        timestamp: new Date().toISOString(),
      };

      socket.current.emit("send-message", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText("");

      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === selectedPatient.id
            ? { ...patient, lastMessage: inputText.substring(0, 30) + "..." }
            : patient
        )
      );
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);

    setPatients((prevPatients) =>
      prevPatients.map((p) =>
        p.id === patient.id ? { ...p, unreadCount: 0 } : p
      )
    );

    socket.current.emit("join-chat-room", patient.id);
    fetchMessagesForRoom(patient.id);
  };

  const fetchMessagesForRoom = (roomId: string) => {
    fetch(`http://localhost:10001/messages/${roomId}`)
      .then((response) => response.json())
      .then((data) => {
        // Update messages with unique ones from the fetch response
        setMessages((prevMessages) => {
          const allMessages = [...prevMessages, ...data];

          // Remove duplicate messages
          const uniqueMessages = allMessages.filter(
            (msg, index, self) =>
              index === self.findIndex((m) => m._id === msg._id)
          );

          return uniqueMessages;
        });
      })
      .catch((error) => console.error("Error fetching messages:", error));
  };

  const handleSendMsg = (e: any) => {
    console.log("handle msg tiggered");
    setInputText(e.target.value);
  };

  const generateRoomId = (userId: string, doctorId: string) => {
    const combinedString = `${userId}-${doctorId}`;
    return btoa(combinedString); // base64 encode for simplicity
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Patient List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#0E0A3C]">
            Patient Chats
          </h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {patients.map((patient) => (
            <li
              key={patient.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 transition duration-150 ease-in-out ${
                selectedPatient?.id === patient.id ? "bg-blue-50" : ""
              }`}
              onClick={() => handlePatientSelect(patient)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={'https://thumbs.dreamstime.com/b/patient-icon-vector-male-person-profile-avatar-symbol-medical-health-care-flat-color-glyph-pictogram-illustration-146789554.jpg'}
                  alt={patient.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0E0A3C] truncate">
                    {patient.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {patient.lastMessage}
                  </p>
                </div>
                {patient.unreadCount && patient.unreadCount > 0 && (
                  <div className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {patient.unreadCount}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedPatient ? (
          <>
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={'https://thumbs.dreamstime.com/b/patient-icon-vector-male-person-profile-avatar-symbol-medical-health-care-flat-color-glyph-pictogram-illustration-146789554.jpg'}
                  alt={selectedPatient.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold text-[#0E0A3C]">
                    {selectedPatient.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedPatient.status === "online" ? "Online" : "Offline"}
                  </p>
                </div>
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
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.senderData.id === selectedPatient.id
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`p-4 rounded-lg ${
                      msg.senderData.id === selectedPatient.id
                        ? "bg-blue-500 text-white"
                        : "bg-green-500 text-white"
                    } max-w-xs`}
                  >
                    <p>{msg.message}</p>
                    <p className="text-xs text-gray-200">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => handleSendMsg(e)}
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4 mr-2"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSend}
                  className="bg-[#0E0A3C] text-white p-2 rounded-lg flex items-center justify-center hover:bg-opacity-90 transition duration-150 ease-in-out"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a patient to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChatInterface;
