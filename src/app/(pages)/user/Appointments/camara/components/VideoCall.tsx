// 'use client'
// import React, { useEffect, useRef, useState } from 'react';
// import { Socket, io } from 'socket.io-client';

// const UserVideoCall = () => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [roomId, setRoomId] = useState<string | null>(null);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isVideoOff, setIsVideoOff] = useState(false);
//   const [isCallActive, setIsCallActive] = useState(false);
//   const localVideoRef = useRef<HTMLVideoElement | null>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
//   const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
//   const localStreamRef = useRef<MediaStream | null>(null);
  

//   useEffect(() => {
//     const socketInstance = io('http://localhost:10000');
//     setSocket(socketInstance);


//     socketInstance.on('connect', () => {
//         console.log('Socket connected:', socketInstance.id);
//       });


//     socketInstance.on('ice-candidate', (data) => {
//       console.log('ICE candidate received:', data);
      
//       const peerConnection = peerConnectionRef.current;  // Assuming you have a reference to your peer connection
    
//       if (peerConnection && data.candidate) {
//         // Create a new RTCIceCandidate object from the received candidate data
//         const candidate = new RTCIceCandidate(data.candidate);
        
//         // Add the ICE candidate to the peer connection
//         peerConnection.addIceCandidate(candidate)
//           .then(() => {
//             console.log('Successfully added ICE candidate');
//           })
//           .catch((error) => {
//             console.error('Error adding ICE candidate', error);
//           });
//       }
//     });
    


//     socketInstance.on('call-created', async (call) => {
//       console.log('Call created:', call);
//       console.log('answer-call is created',0)
//       const peerConnection = peerConnectionRef.current;
//       if (peerConnection) {
//         await peerConnection.setRemoteDescription(new RTCSessionDescription(call.offer));
//         const answer = await peerConnection.createAnswer();
//         await peerConnection.setLocalDescription(answer);
//         socketInstance.emit('answer', { roomId, answer });
//         console.log('answer-call is created',answer)
//       }
//     });
    

//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then(stream => {
//         localStreamRef.current = stream;
//         if (localVideoRef.current) {
//           localVideoRef.current.srcObject = stream;
//         }

//         const peerConnection = new RTCPeerConnection({
//           iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
//         });

//         stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
//         peerConnectionRef.current = peerConnection;

//         peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
//           if (event.candidate && socketInstance) {
//             socketInstance.emit('ice-candidate', {
//               roomId: roomId,
//               candidate: event.candidate,
//             });
//           }
//         };

//         peerConnection.ontrack = (event: RTCTrackEvent) => {
//           if (remoteVideoRef.current) {
//             remoteVideoRef.current.srcObject = event.streams[0];
//           }
//         };
//       });

//     return () => {
//       if (socketInstance) socketInstance.disconnect();
//       if (peerConnectionRef.current) peerConnectionRef.current.close();
//     };
//   }, [roomId]);


//   useEffect(() => {
//     const doctorData = localStorage.getItem('doctorOnlineAppoinemnets')
//     const userData = localStorage.getItem('user')
//     if(doctorData && userData){
//       const parseDocData = JSON.parse(doctorData)
//       const parseUserData = JSON.parse(userData)
//       const doctorEmail = parseDocData.email;
//       const userEmail = parseUserData.email;
//       setRoomId(btoa(`${doctorEmail}-${userEmail}`));
//     }
//   }, []);

//   const startCall = async () => {
//     if (!peerConnectionRef.current || !socket || !roomId) return;
//     socket.emit('join-room', { roomId });
//     setIsCallActive(true);
//   };

//   const endCall = () => {
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//     }
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach(track => track.stop());
//     }
//     setIsCallActive(false);
//   };

//   const toggleMute = () => {
//     if (localStreamRef.current) {
//       localStreamRef.current.getAudioTracks().forEach(track => {
//         track.enabled = !track.enabled;
//       });
//       setIsMuted(!isMuted);
//     }
//   };

//   const toggleVideo = () => {
//     if (localStreamRef.current) {
//       localStreamRef.current.getVideoTracks().forEach(track => {
//         track.enabled = !track.enabled;
//       });
//       setIsVideoOff(!isVideoOff);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg overflow-hidden">
//         <div className="bg-blue-600 text-white p-4">
//           <h2 className="text-2xl font-bold">Video Call</h2>
//         </div>
//         <div className="p-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="relative">
//               <video
//                 ref={localVideoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 className="w-full h-48 bg-gray-200 rounded-lg object-cover"
//               />
//               <span className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">You</span>
//             </div>
//             <div className="relative">
//               <video
//                 ref={remoteVideoRef}
//                 autoPlay
//                 playsInline
//                 className="w-full h-48 bg-gray-200 rounded-lg object-cover"
//               />
//               <span className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm">Doctor</span>
//             </div>
//           </div>
//         </div>
//         <div className="bg-gray-100 p-4 flex justify-center space-x-4">
//           <button
//             onClick={toggleMute}
//             className={`p-2 rounded-full ${isMuted ? 'bg-red-500 text-white' : 'bg-white'}`}
//           >
//             {isMuted ? 'Unmute' : 'Mute'}
//           </button>
//           <button
//             onClick={toggleVideo}
//             className={`p-2 rounded-full ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white'}`}
//           >
//             {isVideoOff ? 'Turn On Video' : 'Turn Off Video'}
//           </button>
//           {isCallActive ? (
//             <button onClick={endCall} className="p-2 rounded-full bg-red-500 text-white">
//               End Call
//             </button>
//           ) : (
//             <button onClick={startCall} className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600">
//               Start Call
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserVideoCall;



'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Phone, MessageSquare, User } from 'lucide-react';
import { useRouter } from 'next/navigation';


const UserVideoCall = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);

  const router = useRouter()

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:10000');
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
    });

    socketInstance.on('ice-candidate', (data) => {
      console.log('ICE candidate received:', data);
      const peerConnection = peerConnectionRef.current;
      if (peerConnection && data.candidate) {
        const candidate = new RTCIceCandidate(data.candidate);
        peerConnection.addIceCandidate(candidate)
          .then(() => {
            console.log('Successfully added ICE candidate');
          })
          .catch((error) => {
            console.error('Error adding ICE candidate', error);
          });
      }
    });

    socketInstance.on('call-created', async (call) => {
      console.log('Call created:', call);
      const peerConnection = peerConnectionRef.current;
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(call.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socketInstance.emit('answer', { roomId, answer });
        console.log('answer-call is created', answer);
      }
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        peerConnectionRef.current = peerConnection;

        peerConnection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
          if (event.candidate && socketInstance) {
            socketInstance.emit('ice-candidate', {
              roomId: roomId,
              candidate: event.candidate,
            });
          }
        };

        peerConnection.ontrack = (event: RTCTrackEvent) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };
      });

    return () => {
      if (socketInstance) socketInstance.disconnect();
      if (peerConnectionRef.current) peerConnectionRef.current.close();
    };
  }, [roomId]);

  useEffect(() => {
    console.log('sssssssss')
    const doctorData = localStorage.getItem('doctorOnlineAppoinemnets')
    const userData = localStorage.getItem('user')
    console.log('userData',userData)
    console.log('doctorData',doctorData)
    if(doctorData && userData){
      const parseDocData = JSON.parse(doctorData)
      const parseUserData = JSON.parse(userData)
      const doctorEmail = parseDocData.email;
      const userEmail = parseUserData.email;
      console.log('doctor',doctorEmail)
      console.log('doctor',userEmail)
      setRoomId(btoa(`${doctorEmail}-${userEmail}`));
    }
  }, []);

  const startCall = async () => {
    console.log('jeeee',peerConnectionRef.current)
    if (!peerConnectionRef.current || !socket || !roomId) return;
    socket.emit('join-room', { roomId });
    setIsCallActive(true);
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCallActive(false);
    router.push('/user/Home')
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8">
      <div className="w-full max-w-6xl bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <h2 className="text-3xl font-extrabold tracking-wider">Video Consultation</h2>
        </div>
        <div className="p-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-64 bg-gray-900 rounded-2xl object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                  You
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 bg-gray-900 rounded-2xl object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                  Doctor
                </div>
              </div>
            </div>
            <div className="flex justify-center space-x-6">
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full transition-all duration-300 ${
                  isMuted ? 'bg-red-500 text-white' : 'bg-white text-gray-800'
                } hover:shadow-lg`}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full transition-all duration-300 ${
                  isVideoOff ? 'bg-red-500 text-white' : 'bg-white text-gray-800'
                } hover:shadow-lg`}
              >
                {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
              </button>
              <button
                onClick={isCallActive ? endCall : startCall}
                className={`p-4 rounded-full transition-all duration-300 ${
                  isCallActive ? 'bg-red-500' : 'bg-green-500'
                } text-white hover:shadow-lg`}
              >
                {isCallActive ? <PhoneOff size={24} /> : <Phone size={24} />}
              </button>
            </div>
          </div>
          {/* <div className="w-full md:w-80 bg-white bg-opacity-50 rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-indigo-600 text-white p-4">
              <h3 className="text-xl font-bold">Chat</h3>
            </div>
            <div className="h-64 overflow-y-auto p-4 space-y-2">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 rounded-l-full border-t border-b border-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="p-2 rounded-r-full bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <MessageSquare size={20} />
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserVideoCall;