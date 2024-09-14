
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import doctor from "../../../../../../public/images/profile.png";
import axiosInstance from "@/app/hooks/useApi";
import { SuccessModal } from "./modal";
import demoDoctor2 from '../../../../../../public/images/demoDoctor.png'

interface FormData {
  firstname?: string;
  lastname?: string;
  email?: string;
  phonenumber?: string;
  specialization?: string;
  licenseNumber?: string;
  certificationDetails?: string;
  yearsOfExperience?: string;
  residentialAddress?: string;
  practiceAddress?: string;
  alternativePhoneNumber?: string;
  alternateEmail?: string;
  workingHours?: string;
  onCallAvailability?: string;
  consultationTypes?: string[];
  profilePic?: any
}

const Profile = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [data, setData] = useState<FormData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = localStorage.getItem("doctor");
        if (user) {
          const parsedUser = JSON.parse(user);
          const email = parsedUser.email;
          console.log("Doctor data is", email);
    
          const response = await axiosInstance.post('/doctor-service/getDoctorData', { email });
          console.log('Response:', response.data.result);
          
          setData(response.data.result);
          setFormData(response.data.result);
        } else {
          console.log("User does not exist");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const validateForm = (data: FormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.firstname?.trim()) errors.firstname = "First name is required";
    if (!data.lastname?.trim()) errors.lastname = "Last name is required";
    if (!data.email?.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "Email is invalid";
    if (!data.phonenumber?.trim()) errors.phonenumber = "Phone number is required";
    else if (!/^\d{10}$/.test(data.phonenumber)) errors.phonenumber = "Phone number must be 10 digits";
    if (!data.specialization?.trim()) errors.specialization = "Specialization is required";
    if (!data.licenseNumber?.trim()) errors.licenseNumber = "License number is required";
    if (!data.yearsOfExperience) errors.yearsOfExperience = "Years of experience is required";
    else if (isNaN(Number(data.yearsOfExperience)) || Number(data.yearsOfExperience) < 0) {
      errors.yearsOfExperience = "Years of experience must be a positive number";
    }
    if (!data.residentialAddress?.trim()) errors.residentialAddress = "Residential address is required";
    if (!data.practiceAddress?.trim()) errors.practiceAddress = "Practice address is required";
    if (!data.workingHours?.trim()) errors.workingHours = "Working hours are required";
    if (!data.onCallAvailability?.trim()) errors.onCallAvailability = "On-call availability is required";

    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      setIsModalOpen(true);
    } else {
      setErrors(validationErrors);
      setIsErrorModalOpen(true);
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await axiosInstance.post("/doctor-service/updateDocData", {formData,selectedFile});
      if (response) {
        console.log("Update response:", response);
        // alert("Changes saved successfully!");
        setIsSuccessModalOpen(true); 
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file.name);
    
    if (file) {
      console.log('file is', selectedFile)
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const renderPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="text-3xl font-bold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-2">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField
                name="firstname"
                value={formData?.firstname || ""}
                placeholder="First Name"
                onChange={handleInputChange}
              />
              <InputField
                name="lastname"
                value={formData?.lastname || ""}
                placeholder="Last Name"
                onChange={handleInputChange}
              />
              <InputField
                name="email"
                value={formData?.email || ""}
                placeholder="Email Address"
                type="email"
                onChange={handleInputChange}
              />
              <InputField
                name="phonenumber"
                value={formData?.phonenumber || ""}
                placeholder="Phone Number"
                type="tel"
                onChange={handleInputChange}
              />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="text-3xl font-bold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-2">
              Professional Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField
                name="specialization"
                value={formData.specialization || ""}
                placeholder="Specialization"
                onChange={handleInputChange}
              />
              <InputField
                name="licenseNumber"
                value={formData.licenseNumber || ""}
                placeholder="License Number"
                onChange={handleInputChange}
              />
              <InputField
                name="certificationDetails"
                value={formData.certificationDetails || ""}
                placeholder="Certification Details"
                onChange={handleInputChange}
              />
              <InputField
                name="yearsOfExperience"
                value={formData.yearsOfExperience || ""}
                placeholder="Years of Experience"
                type="number"
                onChange={handleInputChange}
              />
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="text-3xl font-bold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-2">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField
                name="residentialAddress"
                value={formData.residentialAddress || ""}
                placeholder="Residential Address"
                onChange={handleInputChange}
              />
              <InputField
                name="practiceAddress"
                value={formData.practiceAddress || ""}
                placeholder="Practice Address"
                onChange={handleInputChange}
              />
              <InputField
                name="alternativePhoneNumber"
                value={formData.alternativePhoneNumber || ""}
                placeholder="Alternative Phone Number"
                type="tel"
                onChange={handleInputChange}
              />
              <InputField
                name="alternateEmail"
                value={formData.alternateEmail || ""}
                placeholder="Alternate Email"
                type="email"
                onChange={handleInputChange}
              />
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="text-3xl font-bold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-2">
              Availability & Consultation Types
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <InputField
                name="workingHours"
                value={formData.workingHours || ""}
                placeholder="Working Hours"
                onChange={handleInputChange}
              />
              <InputField
                name="onCallAvailability"
                value={formData.onCallAvailability || ""}
                placeholder="On-Call Availability"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-wrap gap-6">
              <CheckboxField
                name="consultationTypes"
                value="in-person"
                label="In-Person"
                onChange={handleInputChange}
              />
              <CheckboxField
                name="consultationTypes"
                value="online"
                label="Online"
                onChange={handleInputChange}
              />
            </div>
          </motion.div>
        );
      default:
        return (
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="text-3xl font-bold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-2">
            Are you happ
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Every thing is okay */}
          </div>
        </motion.div>
        )
    }
    
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen p-6 flex flex-col items-center">
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative bg-gradient-to-tr from-[#0E0A3C] to-[#0E0A3C] p-8 rounded-3xl flex flex-col md:flex-row items-center text-white shadow-lg mb-12 ">
          {/* <div className="flex-shrink-0 mb-6 md:mb-0">
            <Image
              alt="doctor"
              src={doctor}
              width={180}
              height={180}
              className="rounded-full border-4 border-white shadow-lg"
            />
          </div> */}
             <div className="flex flex-col items-center">
    
      <div className="relative flex-shrink-0 mb-6 md:mb-0">
        {preview ? (
          <Image
            alt="doctor"
            src={preview}
            width={180}
            height={180}
            className="rounded-full border-4 border-white shadow-lg"
          />
        ) : (
          <Image
            alt="default doctor"
            // src={`/images/${formData?.profilePic}` || doctor}
            src={formData?.profilePic ? `/images/${formData.profilePic}` : demoDoctor2}
            width={180}
            height={180}
            className="rounded-full border-4 border-white shadow-lg"
          />
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
          <div className="md:ml-6 flex-1 text-center md:text-left ">
            <h1 className="text-2xl md:text-4xl font-bold text-indigo-600 mb-2">
              {`${formData?.firstname} ${formData?.lastname}`}
            </h1>
            <p className="text-base md:text-lg text-white mb-4">
              {formData?.specialization}
            </p>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
              Make Appointment
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          {renderPage()}
          <div className="flex justify-between mt-6">
            {currentPage > 1 && (
              <button
                type="button"
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
            )}
            {currentPage < 4 ? (
              <button
                type="button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded "
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </motion.form>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Confirm Changes</h3>
            <p className="mb-4">Are you sure you want to save these changes?</p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleConfirm}
              >
                Confirm
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isErrorModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4 text-red-600">Validation Errors</h3>
            <ul className="list-disc pl-5 mb-4">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field} className="text-sm text-gray-700">{message}</li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setIsErrorModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
            {isSuccessModalOpen && (
        <SuccessModal
          message="Changes saved successfully!"
          onClose={handleSuccessModalClose}
        />
      )}

    </div>
  );
};

const InputField = ({
  name,
  value,
  placeholder,
  type = "text",
  onChange,
}: any) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm font-semibold text-gray-700 mb-1">
      {placeholder}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="border border-gray-300 rounded-lg p-2"
    />
  </div>
);

const CheckboxField = ({ name, value, label, onChange }: any) => (
  <div className="flex items-center">
    <input
      id={value}
      name={name}
      type="checkbox"
      value={value}
      onChange={onChange}
      className="mr-2"
    />
    <label htmlFor={value} className="text-sm font-semibold text-gray-700">
      {label}
    </label>
  </div>
);

export default Profile;

