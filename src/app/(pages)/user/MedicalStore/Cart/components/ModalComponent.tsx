import React, { useState } from "react";
import { X, Upload, Check } from "lucide-react";
import axiosInstance from "@/app/hooks/useApi";

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

const Alert: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center p-4 mt-4 text-sm text-green-800 rounded-lg bg-green-50">
    {children}
  </div>
);

const PrescriptionUploadModal: React.FC<ModalComponentProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "uploading" | "error"
  >("idle");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setUploadStatus("idle");
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedImage(e.dataTransfer.files[0]);
      setUploadStatus("idle");
    }
  };

//   const handleSubmit = async () => {
//     if (selectedImage) {
//       const formData = new FormData();
//       formData.append("photo", selectedImage);
     
//       const entries = Array.from(formData.entries());
//       entries.forEach(([key, value]) => {
//         console.log(key, value);
//       });

//       console.log("formData", formData);

//       try {
//         const response = await axiosInstance.post(
//           "/user-service/upload",
//           formData
//         );
//         //   setUploadStatus('uploading',formData);

//         if (response) {
//           setUploadStatus("success");
//           console.log("Uploading prescription:", selectedImage);
//         } else {
//           setUploadStatus("error");
//           console.error("Upload failed");
//         }
//       } catch (error) {
//         setUploadStatus("error");
//         console.error("Error during upload:", error);
//       }
//     }
//   };

const handleSubmit = async () => {
    if (selectedImage) {
        // Convert the image to a Base64 string
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onloadend = async () => {
            const base64String = reader.result;

            // Prepare the data to send
            const dataToSend = {
                photo: base64String,
            };

            console.log("Sending Data:", dataToSend);

            try {
                const response = await axiosInstance.post(
                    "/user-service/upload",
                    dataToSend,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response) {
                    setUploadStatus("success");
                    console.log("Uploading prescription:", selectedImage);
                } else {
                    setUploadStatus("error");
                    console.error("Upload failed");
                }
            } catch (error) {
                setUploadStatus("error");
                console.error("Error during upload:", error);
            }
        };

        reader.onerror = (error) => {
            console.error("Error reading file:", error);
        };
    }
};


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="flex justify-between items-center p-6 bg-blue-50">
          <h2 className="text-2xl font-bold text-blue-800">
            Upload Prescription
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedImage ? (
              <div className="space-y-4">
                <img
                  className="mx-auto h-48 w-48 object-cover rounded-lg shadow-md"
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected prescription"
                />
                <p className="text-sm text-gray-600">{selectedImage.name}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-blue-500" />
                <p className="text-gray-600">
                  Drag and drop your prescription here, or{" "}
                  <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </p>
              </div>
            )}
          </div>

          {uploadStatus === "success" && (
            <Alert>
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <span>Prescription uploaded successfully!</span>
            </Alert>
          )}

          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedImage || uploadStatus === "success"}
              className={`px-4 py-2 rounded-md text-white transition-colors ${
                selectedImage && uploadStatus !== "success"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {uploadStatus === "success" ? "Uploaded" : "Upload Prescription"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionUploadModal;
