"use client";
import React, { useState, useEffect } from "react";
import { Button, Modal, Space, Typography } from "antd";
import Image from "next/image";
import { Calendar } from "./outSideComponents/Calendar";
import { PlaceholdersAndVanishInputDemo } from "./outSideComponents/SearchBar";
import ResponsiveTimePickers from "./outSideComponents/TimePicker";
import axiosInstance from "@/app/hooks/useApi";
import demoDoctor2 from "../../../../../../public/images/demoDoctor.png";
import dayjs from "dayjs";
import RazorpayButton from "../razorpay/RazorpayButton";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setDoctorForMessage } from "@/redux/yourSlice";

// Define a type for the doctor data
type Doctor = {
  profilePic?: string;
  firstname: string;
  lastname: string;
  email: string;
  specialization?: string;
  workingHours?: string;
  practiceAddress?: string;
};
type Booking = {
  doctor: Doctor;
  status?: string;
  userId: string;
};

interface UserData {
  _id: string;
}
const Appointments = () => {
  const [doctorData, setDoctorData] = useState<Doctor[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<dayjs.Dayjs | undefined>(undefined);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [appointmentType, setAppointmentType] = useState<string | null>(null);
  const [isBooked, setBooked] = useState<Booking[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [doctorToCancel, setDoctorToCancel] = useState<Doctor | null>(null);
  const [open, setOpen] = useState(false);
  const [isBookedModalVisible, setIsBookedModalVisible] = useState(false);
  const [cancelDoctor, setCancelDoctor] = useState<string | null>(null);
  const [specializationFilter, setSpecializationFilter] = useState<string>("");
  const filters = useSelector((state: RootState) => state.search.filters);
  const [userData, setUserData] = useState<UserData | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const doctorSearchValue = useSelector(
    (state: RootState) => state.search.doctorSearchValue
  );
  const locationSearchValue = useSelector(
    (state: RootState) => state.search.locationSearchValue
  );
  const selectedSearchType = useSelector(
    (state: RootState) => state.search.selectedSearchType
  );

  const router = useRouter();
  const { Text } = Typography;

  const amount = 1; // Define the amount for payment

  const handleChildDate = (data: any) => {
    setDate(data);
  };

  const handleChildTime = (data: any) => {
    setTime(data);
  };

  const handleDoctorSelection = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleSheduleAppoinment = () => {
    if (selectedDoctor && date && time) {
      setIsModalVisible(true);
    } else {
      console.error(
        "Please select a doctor, date, and time before scheduling."
      );
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleAppointmentTypeChange = (type: string) => {
    setAppointmentType(type);
  };

  useEffect(() => {
    const fetchDocData = async () => {
      try {
        const response = await axiosInstance.get(
          "/doctor-service/getDoctorData"
        );

        setDoctorData(response.data.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchDocData();
  }, []);

  const fetchDocData = async () => {
    try {
      const result = await axiosInstance.get("/user-service/bookedDoctors");
      setBooked(result.data.result);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
    }
  };

  useEffect(() => {
    fetchDocData();
  }, []);

  useEffect(() => {
    fetchDocData();
  }, [isBooked]);

  const handleCancelAppointment = () => {
    setShowCancelModal(false);
  };

  const handleModalOk = async () => {
    let Date = date?.toDateString();
    let Time = time?.format("HH:mm:ss");
    let user = localStorage.getItem("user");
    const response = await axiosInstance.post("/user-service/appoinments", {
      selectedDoctor,
      Date,
      Time,
      appointmentType,
      user,
    });
    if (!response) {
      alert("appoinment failed");
    }
    if (appointmentType == "offline") {
      setOpen(true);
    } else {
      const selectedDoctorString = JSON.stringify(selectedDoctor);
      localStorage.setItem("doctorOnlineAppoinemnets", selectedDoctorString);
    }

    setIsModalVisible(false);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const cancelBooking = async () => {
    if (!cancelDoctor) {
      return null;
    }
    localStorage.removeItem("doctorOnlineAppoinemnets");
    await axiosInstance.post("/user-service/cancelBooking", { cancelDoctor });
    await axiosInstance.post("/admin-service/cancelBooking", { cancelDoctor });
    await axiosInstance.post("/doctor-service/cancelBooking", { cancelDoctor });
    setIsBookedModalVisible(false);
  };

  const handleClick = () => {
    if (selectedDoctor?.email) {
      router.push(`/user/Appointments/map?email=${selectedDoctor.email}`);
    } else {
      console.error("No doctor selected");
    }
  };

  const filteredDoctors = doctorData.filter((doctor) => {
    const fullName = `${doctor.firstname} ${doctor.lastname}`.toLowerCase();
    const matchesName = fullName.includes(doctorSearchValue.toLowerCase());

    // Ensure filters is an array of strings
    const specializationFilters: string[] =
      filters?.map((filter) => filter.trim().toLowerCase()) || [];
    const doctorSpecialization =
      doctor.specialization?.toLowerCase().trim() || "";

    // Check if any specialization filter matches the doctor's specialization
    const matchesSpecialization =
      specializationFilters.length > 0
        ? specializationFilters.some((filter: string) => {
            const isMatch = doctorSpecialization.includes(filter);
            console.log(
              `Checking if '${doctorSpecialization}' includes '${filter}': ${isMatch}`
            );
            return isMatch;
          })
        : true;

    // Check if the doctor’s location matches the search location
    const matchesLocation = locationSearchValue
      ? doctor.practiceAddress
          ?.toLowerCase()
          .includes(locationSearchValue.toLowerCase())
      : true;

    return matchesName && matchesSpecialization && matchesLocation;
  });

  useEffect(() => {
    let user = sessionStorage.getItem("user");
    if (user) {
      setUserData(JSON.parse(user)); // Parse the JSON string to an object
    }
  }, []);

  const messageDoctor = (doctor: any) => {
    console.log("doctor is get");
    dispatch(setDoctorForMessage(doctor));
    router.push("/user/Appointments/chat");
  };

  return (
    <div className="flex flex-col lg:flex-row p-4 lg:p-10 lg:px-20 mt-6">
      {/* Calendar and Clock Section */}
      <div className="bg-[#1E1F25] p-6 lg:p-10 flex flex-col w-full lg:w-[490px] rounded-3xl mb-6 lg:mb-0 order-2 lg:order-1">
        <Calendar className="ml-5" onDateChange={handleChildDate} />
        <span className="border-b-2 border-white text-white inline-block mt-4"></span>
        <ResponsiveTimePickers onTimeChange={handleChildTime} />
        <Button
          onClick={handleSheduleAppoinment}
          className="bg-white py-3 rounded-full mt-5"
        >
          Schedule Appointment
        </Button>
      </div>

      {/* Doctor Cards Section */}
      <div className="bg-blue-300 p-6 lg:p-10 flex flex-col lg:ml-10 rounded-3xl w-full order-1 lg:order-2">
        <div>
          <h1 className="font-extrabold text-xl lg:text-[22px] mb-4">
            List of Physicians
          </h1>
          <PlaceholdersAndVanishInputDemo />
        </div>
        <div className="flex flex-wrap -mx-2 lg:-mx-4 mt-6">
          {doctorData.length === 0 ? (
            // Loading state
            <div className="w-full text-center py-6">
              <p>Loading doctors...</p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            // No search results state
            <div className="w-full text-center py-6">
              <p>No doctors found matching your search.</p>
            </div>
          ) : (
            filteredDoctors.map((doctor, index) => (
              <div
                key={index}
                className="w-full sm:w-1/2 lg:w-1/3 px-2 lg:px-4 mb-4 lg:mb-8"
              >
                <div className="p-4 lg:p-6 rounded-3xl bg-white shadow-lg relative h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <Image
                      src={
                        doctor?.profilePic
                          ? `/images/${doctor?.profilePic}`
                          : demoDoctor2
                      }
                      alt="profileImg"
                      width={50}
                      height={50}
                      className="rounded-full mr-3"
                    />
                    <div className="flex-grow">
                      <h2 className="font-bold text-base lg:text-lg">
                        Dr.{doctor.firstname} {doctor.lastname}
                      </h2>
                      <p className="text-xs lg:text-sm text-gray-600">
                        {doctor.specialization || "No specialization provided"}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-8 lg:w-16 lg:h-10 bg-blue-100 rounded-full">
                      <svg
                        className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="border-b border-gray-200 my-3 lg:my-4"></div>
                  <div className="mb-3 lg:mb-4">
                    <h3 className="font-semibold mb-1 lg:mb-2 text-gray-700 text-sm lg:text-base">
                      Available Time
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-600">
                      {doctor.workingHours || "No hours available"}
                    </p>
                  </div>
                  <div className="mb-3 lg:mb-4">
                    <h3 className="font-semibold mb-1 lg:mb-2 text-gray-700 text-sm lg:text-base">
                      Location
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-600">
                      {doctor.practiceAddress || "No address available"}
                    </p>
                  </div>
                  <div className="border-b border-gray-200 my-3 lg:my-4"></div>
                  <div className="flex justify-between mt-auto">
                    {/* <a href="http://localhost:3000/user/Appointments/chat"> */}
                    <Button
                      className="bg-blue-500 text-white px-3 lg:px-5 py-2 lg:py-3 rounded-full text-xs font-medium hover:bg-blue-600 transition duration-300 ease-in-out shadow-md"
                      onClick={() => messageDoctor(doctor)}
                    >
                      Message
                    </Button>
                    {/* </a> */}

                    <Button
                      onClick={() => {
                        if (userData) {
                          const doctorBooking = isBooked.find(
                            (booking: Booking) =>
                              booking.doctor.firstname === doctor.firstname &&
                              booking.userId === userData._id
                          );

                          if (doctorBooking) {
                            setCancelDoctor(doctor.email);
                            setIsBookedModalVisible(true);
                          } else {
                            handleDoctorSelection(doctor);
                          }
                        }

                        // handleDoctorSelection(doctor);
                      }}
                      className={`${(() => {
                        if (userData) {
                          const doctorBooking = isBooked.find(
                            (booking: Booking) =>
                              booking.doctor.firstname === doctor.firstname &&
                              booking.userId === userData._id
                          );
                          if (doctorBooking) {
                            switch (doctorBooking.status) {
                              case "pending":
                                return "bg-orange-500 hover:bg-orange-600";
                              case "canceled":
                                return "bg-slate-700  hover:bg-tan-400";
                              case "confirmed":
                                return "bg-red-500 hover:bg-red-600";
                              default:
                                return "bg-gray-500 hover:bg-gray-600";
                            }
                          }
                        }
                        return selectedDoctor === doctor
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-500 hover:bg-green-600";
                      })()} text-white px-3 lg:px-4 py-2 lg:py-3 rounded-full text-xs font-medium transition duration-300 ease-in-out shadow-md`}
                    >
                      {(() => {
                        if (userData) {
                          const doctorBooking = isBooked.find(
                            (booking: Booking) =>
                              booking.doctor.firstname === doctor.firstname &&
                              booking.userId === userData._id
                          );
                          if (doctorBooking) {
                            switch (doctorBooking.status) {
                              case "pending":
                                return "Pending";
                              case "canceled":
                                return "Rejected";
                              case "confirmed":
                                return "Booked";
                              default:
                                return "Unknown Status";
                            }
                          }
                        }
                        return selectedDoctor === doctor
                          ? "Selected"
                          : "Assign Doctor";
                      })()}
                    </Button>

                    <Modal
                      visible={isBookedModalVisible}
                      onCancel={() => setIsBookedModalVisible(false)}
                      footer={[
                        <Button
                          key="cancel"
                          onClick={() => cancelBooking()}
                          style={{
                            backgroundColor: "#FF4D4F", // Red color for cancel
                            color: "#fff",
                            borderRadius: "5px",
                            border: "none",
                          }}
                        >
                          Cancel Appointment
                        </Button>,
                        <Button
                          key="close"
                          onClick={() => setIsBookedModalVisible(false)}
                          style={{
                            backgroundColor: "#1890FF", // Blue color for close
                            color: "#fff",
                            borderRadius: "5px",
                            border: "none",
                          }}
                        >
                          Close
                        </Button>,
                      ]}
                      style={{ borderRadius: "10px", padding: "20px" }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <ExclamationCircleOutlined
                          style={{
                            fontSize: "40px",
                            color: "#FAAD14",
                            marginBottom: "20px",
                          }}
                        />
                        <Text
                          strong
                          style={{
                            fontSize: "18px",
                            display: "block",
                            marginBottom: "10px",
                          }}
                        >
                          This doctor is already booked!
                        </Text>
                        <Text style={{ color: "#8c8c8c" }}>
                          You cannot book this doctor again. Please try another
                          doctor or cancel the appointment.
                        </Text>
                      </div>
                    </Modal>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Appointment Type Modal */}
      <Modal
        title="Select Appointment Type"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <p>Choose appointment type:</p>
        <Button
          onClick={() => handleAppointmentTypeChange("offline")}
          type="primary"
          className={`mr-2 ${
            appointmentType === "offline"
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Offline Appointment
        </Button>
        <Button
          onClick={() => handleAppointmentTypeChange("online")}
          type="primary"
          className={`${
            appointmentType === "online"
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Online Appointment
        </Button>

        {/* Show RazorpayButton after appointment type selection */}
        {appointmentType && (
          <div className="mt-4">
            <RazorpayButton amount={amount} onSuccess={handleModalOk} />
          </div>
        )}
      </Modal>

      <Modal
        open={open}
        title="Title"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {/* <a href="/user/Appointments/map">
              {" "} */}
            <Button onClick={handleClick}>Track Doctor</Button>
            {/* </a> */}

            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <h3>Appoinment scheduling successully</h3>
      </Modal>
    </div>
  );
};

export default Appointments;
