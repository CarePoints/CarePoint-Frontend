"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
  Users,
  Clock,
  Settings,
  ChevronRight,
} from "lucide-react";
import io, { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ModalComponent from './PrescriptionUploadModal'

interface Doctor {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  alternateEmail: string;
  alternativePhoneNumber: string;
  bio: string;
  certificationDetails: string;
  consultationTypes: string[]; // Array for multiple consultation types
  createdAt: string;
  isBlocked: boolean;
  isVerified: boolean;
  licenseNumber: string;
  onCallAvailability: string;
  otp: number;
  password: string;
  phonenumber: string;
  practiceAddress: string;
  profilePic: string;
  residentialAddress: string;
  roles: string;
  specialization: string;
  workingHours: string;
  yearsOfExperience: number;
}

interface User {
  id: string;
  userName:string;
  email: string;
}
const DoctorVideoCall = () => {
  const [roomId, setRoomId] = useState(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>(
    []
  );
  const [callDuration, setCallDuration] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [patientQueue, setPatientQueue] = useState([
    "John Doe",
    "Jane Smith",
    "Bob Johnson",
  ]);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const router = useRouter()

  const appoinmentData = useSelector(
    (state: any) => state.search.appoinmentData
  );



  useEffect(() => {
    const doctorData = localStorage.getItem("doctor");
    if (doctorData) {
      const parseDoctor = JSON.parse(doctorData);
      setDoctor(parseDoctor);
    }

    if (socket) {
      socket.on("call-created", (call) => {
        console.log("Call created:", call);
      });
    }
    return () => {
      if (socket) socket.off("call-created");
    };
  }, [socket]);

  useEffect(() => {
    const socketInstance = io("http://localhost:10000");
    setSocket(socketInstance);

    if (socketInstance) {
      const doctorData = localStorage.getItem("doctor");
      if (doctorData) {
        const parseDoctor = JSON.parse(doctorData);
      
     
      let doctorEmail = parseDoctor.email
      let userEmail = appoinmentData.user.email;

      const roomId = generateRoomId(doctorEmail, userEmail);
      socketInstance.emit('notify-user', {
        roomId: roomId,
        message: 'The doctor wants to notify you.'
      });
      console.log('nofication is sending..')
    }
  }


    const initializeMediaDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(
          (device) => device.kind === "audioinput"
        );
        setAudioInputDevices(audioDevices);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

        peerConnectionRef.current = peerConnection;

        peerConnection.onicecandidate = (event) => {
          if (event.candidate && socketInstance && doctor) {
            socketInstance.emit("ice-candidate", {
              roomId: roomId,
              candidate: event.candidate,
            });
          }
        };

        socketInstance.on("ice-candidate", (data) => {
          console.log("ICE candidate received:", data);

          const peerConnection = peerConnectionRef.current;

          if (peerConnection && data.candidate) {
            const candidate = new RTCIceCandidate(data.candidate);

            peerConnection
              .addIceCandidate(candidate)
              .then(() => {
                console.log("Successfully added ICE candidate");
              })
              .catch((error) => {
                console.error("Error adding ICE candidate", error);
              });
          }
        });

        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    initializeMediaDevices();

    socketInstance.on("answer", (data) => {
      console.log("Received answer from:", data);

      const peerConnection = peerConnectionRef.current;
      if (peerConnection) {
        peerConnection
          .setRemoteDescription(new RTCSessionDescription(data.answer))
          .then(() => {
            console.log("Remote description set successfully");
          })
          .catch((error) => {
            console.error("Error setting remote description:", error);
          });
      }
    });

    return () => {
      socketInstance.disconnect();
      if (peerConnectionRef.current) peerConnectionRef.current.close();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const startCall = async () => {
    console.log('user',appoinmentData.user)
    const userObj = {
      id:appoinmentData.user._id,
      userName: appoinmentData.user.firstname + appoinmentData.user.lastname,
      email: appoinmentData.user.email
    }
    setUser(userObj)
    let doctorEmail = doctor?.email;
    let userEmail = appoinmentData.user.email;
    const roomId = generateRoomId(doctorEmail, userEmail);
    console.log("roomId", roomId);
    if (!peerConnectionRef.current || !socket) return;
    console.log("startCall is working");
    try {
      const offer = await peerConnectionRef.current.createOffer();
      console.log("offer is", offer);
      await peerConnectionRef.current.setLocalDescription(offer);

      socket.emit("create-call", { roomId, offer });
      setIsCallActive(true);
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const endCall = () => {
    console.log("endCall is working");

    if (peerConnectionRef.current) peerConnectionRef.current.close();
    if (socket) socket.emit("end-call", { callId: "doctor-call-id" });
    setIsCallActive(false);
    setCallDuration(0);
    router.push('/doctor/appoinments')
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const generateRoomId = (doctorEmail: any, userEmail: string) => {
    const combinedString = `${doctorEmail}-${userEmail}`;
    return btoa(combinedString);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePrescription = ()=>{
    setIsModalOpen(true)
    console.log('handlePrescription')
  }

  return (
    <div className="flex h-screen bg-[#0E0A3C]">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Doctor's Dashboard
          </h2>
        </div>
        <nav className="mt-4">
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-200"
          >
            <Camera className="mr-3 h-5 w-5" />
            Video Call
          </a>
        </nav>
          <button
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
            onClick={handlePrescription}
          >
            <Users className="mr-3 h-5 w-5" />
            Add Prescription
          </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-white">
              Video Consultation
            </h1>
            <div className="flex items-center space-x-4">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-gray-700">{formatTime(callDuration)}</span>
            </div>
          </div>
        </header>

        {/* Video call area */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-4 h-full">
            <div className="col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-48 object-cover"
                />
              </div>
              {/* <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold mb-2">Patient Queue</h3>
                <ul className="space-y-2">
                  {patientQueue.map((patient, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                    >
                      <span>{patient}</span>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </li>
                  ))}
                </ul>
              </div> */}
            </div>
          </div>
        </main>

        {/* Footer with controls */}
        <footer className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-center space-x-4">
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full ${
                  isMuted
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {isMuted ? (
                  <MicOff className="text-white" />
                ) : (
                  <Mic className="text-gray-700" />
                )}
              </button>
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full ${
                  isVideoOff
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {isVideoOff ? (
                  <VideoOff className="text-white" />
                ) : (
                  <Video className="text-gray-700" />
                )}
              </button>
              {isCallActive ? (
                <button
                  onClick={endCall}
                  className="p-3 rounded-full bg-red-500 hover:bg-red-600"
                >
                  <PhoneOff className="text-white" />
                </button>
              ) : (
                <button
                  onClick={startCall}
                  className="p-3 rounded-full bg-green-500 hover:bg-green-600"
                >
                  <Camera className="text-white" />
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
      {user && (
  <ModalComponent
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    doctorName={`${doctor?.firstname} ${doctor?.lastname}`}
    userData={user}
  />
)}


    </div>
  );
};

export default DoctorVideoCall;
