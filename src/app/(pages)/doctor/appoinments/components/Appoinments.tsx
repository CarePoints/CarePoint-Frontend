"use client";
import axiosInstance from "@/app/hooks/useApi";
import { setAppoinmentData } from "@/redux/yourSlice";
import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPhone, FaCalendar, FaClock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

interface User {
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  profilePic: string | null;
}

interface Appointment {
  _id: string;
  user: User;
  doctorId: string;
  doctor: {
    email: string;
    consultationTypes: string[];
  };
  date: string;
  time: string;
  appointmentType: string;
  status: string;
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorData, setDoctorData] = useState<{ _id: string } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(
    null
  );

  const dispatch = useDispatch();
  const navigation = useRouter();
  useEffect(() => {
    const fetchDoctorData = async () => {
      const doctor = localStorage.getItem("doctor");
      if (doctor) {
        const parsedDoctor = JSON.parse(doctor);
        setDoctorData(parsedDoctor);
      } else {
        console.log("No doctor data found in localStorage.");
      }
    };

    fetchDoctorData();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get(
          "/doctor-service/appointments"
        );
        const appointmentsData = response.data.result;
        console.log("Appointments response:", appointmentsData);

        if (doctorData) {
          const doctorAppointments = appointmentsData.filter(
            (appointment: Appointment) =>
              appointment.doctorId === doctorData._id
          );
          setAppointments(doctorAppointments);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    if (doctorData) {
      fetchAppointments();
    }
  }, [doctorData]);

  const handleAcceptClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setActionType("accept");
    setShowModal(true);
    // window.location.reload()
  };

  const handleRejectClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setActionType("reject");
    setShowModal(true);
    // window.location.reload()
  };

  const handleConfirm = async () => {
    if (!selectedAppointment || !actionType) return;

    const { email: doctorEmail } = JSON.parse(
      sessionStorage.getItem("doctor") || "{}"
    );
    const userEmail = selectedAppointment.user.email;

    try {
      if (actionType === "accept") {
        await axiosInstance.post("/user-service/appointmentAccepted", {
          doctorEmail,
          userEmail,
        });
        await axiosInstance.post("/doctor-service/appointmentAccepted", {
          doctorEmail,
          userEmail,
        });
        await axiosInstance.post("/admin-service/appointmentAccepted", {
          doctorEmail,
          userEmail,
        });
      } else if (actionType === "reject") {
        await axiosInstance.post("/user-service/appointmentRejected", {
          doctorEmail,
          userEmail,
        });
        await axiosInstance.post("/doctor-service/appointmentRejected", {
          doctorEmail,
          userEmail,
        });
        await axiosInstance.post("/admin-service/appointmentRejected", {
          doctorEmail,
          userEmail,
        });
      }

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === selectedAppointment._id
            ? {
                ...appointment,
                status: actionType === "accept" ? "accepted" : "rejected",
              }
            : appointment
        )
      );
    } catch (error) {
      console.error(
        `Error ${
          actionType === "accept" ? "accepting" : "rejecting"
        } appointment:`,
        error
      );
    } finally {
      setShowModal(false);
      setSelectedAppointment(null);
      setActionType(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    setActionType(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStartVideoCall = (appointment: any) => {
    console.log("handleStartVideoCall is workign", appointment);
    dispatch(setAppoinmentData(appointment));
    navigation.push("/doctor/camara");
  };

  const ConfirmationModal: React.FC<{
    isVisible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    action: "accept" | "reject";
  }> = ({ isVisible, onConfirm, onCancel, action }) => {
    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            {action === "accept" ? "Confirm Acceptance" : "Confirm Rejection"}
          </h2>
          <p className="mb-4">
            Are you sure you want to {action} this appointment?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onConfirm}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
            >
              Confirm
            </button>
            <button
              onClick={onCancel}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Appointments
        </h1>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex flex-col lg:flex-row items-center justify-between p-6 border-b border-gray-200 hover:bg-gray-50 transition duration-300 ease-in-out"
              >
                <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-6 mb-4 lg:mb-0 w-full lg:w-2/3">
                  <img
                    src={
                      appointment.user.profilePic || "/api/placeholder/80/80"
                    }
                    alt={`${appointment.user.firstname || "User"}'s profile`}
                    className="w-24 h-24 rounded-full object-cover shadow-md mb-4 lg:mb-0"
                  />
                  <div className="text-center lg:text-left">
                    <h2 className="font-semibold text-2xl text-gray-800 mb-2">
                      {appointment.user.firstname || "Unknown"}{" "}
                      {appointment.user.lastname || ""}
                    </h2>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center text-gray-600">
                        <FaEnvelope className="mr-2 text-indigo-500" />
                        <span>
                          {appointment.user.email || "No email available"}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaPhone className="mr-2 text-indigo-500" />
                        <span>
                          {appointment.user.phoneNumber || "No phone available"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center lg:items-end space-y-4 w-full lg:w-1/3">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        appointment.appointmentType === "offline"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {appointment.appointmentType === "offline"
                        ? "Offline"
                        : "Online"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        appointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : appointment.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    {appointment.status === "confirmed" &&
                      appointment.appointmentType == "online" && (
                        <button
                          onClick={() => handleStartVideoCall(appointment)}
                          className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-full shadow-2xl transition-all duration-300 ease-out bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                        >
                          Start Call
                        </button>
                      )}
                  </div>
                  <div className="flex space-x-4">
                    {appointment.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAcceptClick(appointment)}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectClick(appointment)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No appointments found.
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isVisible={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        action={actionType!}
      />
    </div>
  );
};

export default Appointments;
