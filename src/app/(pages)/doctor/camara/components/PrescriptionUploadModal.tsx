
// 'use client'
// import React, { useEffect, useState } from "react";
// import { X, Plus, Trash2, Send, Eye } from "lucide-react";
// import jsPDF from "jspdf";
// import axiosInstance from "@/app/hooks/useApi";
// import axios from "axios";
// import generateEnhancedPDF from "./generateEnhancedPDF";


// interface User {
//   id: string;
//   userName:string;
//   email: string;
// }

// interface ModalComponentProps {
//   isOpen: boolean;
//   onClose: () => void;
//   doctorName: string;
//   userData:User
// }

// interface MedicationItem {
//   name: string;
//   dosage: string;
//   frequency: string;
//   duration: string;
// }

// const PrescriptionCreationModal: React.FC<ModalComponentProps> = ({
//   isOpen,
//   onClose,
//   doctorName,
//   userData
// }) => {
//   const [patientName, setPatientName] = useState("");
//   const [patientEmail, setPatientEmail] = useState("");
//   const [medications, setMedications] = useState<MedicationItem[]>([
//     { name: "", dosage: "", frequency: "", duration: "" },
//   ]);
//   const [notes, setNotes] = useState("");
//   const [showPreview, setShowPreview] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(()=>{
//     setPatientName(userData.userName)
//     setPatientEmail(userData.email)
//   },[])

//   const handleAddMedication = () => {
//     setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }]);
//   };

//   const handleRemoveMedication = (index: number) => {
//     const newMedications = medications.filter((_, i) => i !== index);
//     setMedications(newMedications);
//   };

//   const handleMedicationChange = (index: number, field: keyof MedicationItem, value: string) => {
//     const newMedications = [...medications];
//     newMedications[index][field] = value;
//     setMedications(newMedications);
//   };


//   const handleSend = async () => {
//     setLoading(true);
//     const prescriptionData = {
//       doctorName,
//       patientName,
//       patientEmail,
//       medications,
//       notes,
//       date: new Date().toLocaleDateString(),
//     };
  
//     // Generate enhanced PDF
//     const doc = generateEnhancedPDF(prescriptionData);
  
//     // Save PDF
//     const pdfData = doc.output('blob');
//     const formData = new FormData();
//     formData.append('file', pdfData, 'prescription.pdf');
//     formData.append('patientEmail', prescriptionData.patientEmail);
    
//     try {
//       // Send the prescription to the backend using Axios
//       const response = await axiosInstance.post('/doctor-service/sendPrescription', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
  
//       alert(`Prescription sent to ${patientEmail}`);
//     } catch (error) {
//       console.error('Error sending prescription:', error);
//       alert('There was an error sending the prescription. Please try again.');
//     } finally {
//       setLoading(false);
//       onClose();
//     }
//   };
  

//   const PrescriptionPreview = () => (
//     <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
//       <div className="text-center mb-6">
//         <h1 className="text-2xl font-bold text-blue-800">Medical Prescription</h1>
//         <p className="text-sm text-gray-600">Dr. {doctorName}</p>
//       </div>
//       <div className="mb-6">
//         <p className="font-semibold">Patient: {patientName}</p>
//         <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
//       </div>
//       <div className="mb-6">
//         <h2 className="text-lg font-semibold mb-2">Medications:</h2>
//         <ul className="list-disc pl-5">
//           {medications.map((med, index) => (
//             <li key={index} className="mb-2">
//               <span className="font-medium">{med.name}</span> - {med.dosage}, {med.frequency} for {med.duration}
//             </li>
//           ))}
//         </ul>
//       </div>
//       {notes && (
//         <div className="mb-6">
//           <h2 className="text-lg font-semibold mb-2">Additional Notes:</h2>
//           <p className="text-sm">{notes}</p>
//         </div>
//       )}
//       <div className="text-center text-sm text-gray-600 mt-8">
//         <p>This prescription is valid for 30 days from the date of issue.</p>
//         <p>For any queries, please contact your healthcare provider.</p>
//       </div>
//     </div>
//   );

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
//         <div className="flex justify-between items-center p-6 bg-blue-50">
//           <h2 className="text-2xl font-bold text-blue-800">Create Prescription</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <X size={24} />
//           </button>
//         </div>

//         <div className="p-6 flex-grow overflow-y-auto">
//           {showPreview ? (
//             <PrescriptionPreview />
//           ) : (
//             <div className="space-y-6">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
//                   <input
//                     type="text"
//                     id="patientName"
//                     value={patientName}
//                     onChange={(e) => setPatientName(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter patient name"
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700 mb-1">Patient Email</label>
//                   <input
//                     type="email"
//                     id="patientEmail"
//                     value={patientEmail}
//                     onChange={(e) => setPatientEmail(e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="Enter patient email"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-2">Medications</h3>
//                 {medications.map((medication, index) => (
//                   <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 relative">
//                     <button onClick={() => handleRemoveMedication(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
//                       <Trash2 size={18} />
//                     </button>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
//                         <input
//                           type="text"
//                           value={medication.name}
//                           onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                           placeholder="Enter medication name"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
//                         <input
//                           type="text"
//                           value={medication.dosage}
//                           onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                           placeholder="Enter dosage"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
//                         <input
//                           type="text"
//                           value={medication.frequency}
//                           onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                           placeholder="Enter frequency"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
//                         <input
//                           type="text"
//                           value={medication.duration}
//                           onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                           placeholder="Enter duration"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 <button onClick={handleAddMedication} className="flex items-center text-blue-600">
//                   <Plus size={18} className="mr-2" /> Add Medication
//                 </button>
//               </div>

//               <div>
//                 <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
//                 <textarea
//                   id="notes"
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Enter any additional notes..."
//                   rows={4}
//                 />
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="flex justify-between items-center p-6 bg-gray-100">
//           <button onClick={() => setShowPreview(!showPreview)} className="flex items-center text-blue-600">
//             <Eye size={18} className="mr-2" /> {showPreview ? "Edit Prescription" : "Preview Prescription"}
//           </button>
//           <button
//             onClick={handleSend}
//             disabled={loading}
//             className={`flex items-center text-white bg-blue-600 px-4 py-2 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//           >
//             {loading ? "Sending..." : <><Send size={18} className="mr-2" /> Send Prescription</>}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PrescriptionCreationModal;



'use client'
import React, { useEffect, useState } from "react";
import { X, Plus, Trash2, Send, Eye } from "lucide-react";
import jsPDF from "jspdf";
import axiosInstance from "@/app/hooks/useApi";
import generateEnhancedPDF from "./generateEnhancedPDF";

interface User {
  id: string;
  userName: string;
  email: string;
}

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  userData: User;
}

interface MedicationItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

const PrescriptionCreationModal: React.FC<ModalComponentProps> = ({
  isOpen,
  onClose,
  doctorName,
  userData
}) => {
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [medications, setMedications] = useState<MedicationItem[]>([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);
  const [notes, setNotes] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPatientName(userData.userName);
    setPatientEmail(userData.email);
  }, [userData]);

  const handleAddMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const handleRemoveMedication = (index: number) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
  };

  const handleMedicationChange = (index: number, field: keyof MedicationItem, value: string) => {
    const newMedications = [...medications];
    newMedications[index][field] = value;
    setMedications(newMedications);
  };

  const handleSend = async () => {
    setLoading(true);
    const prescriptionData = {
      doctorName,
      patientName,
      patientEmail,
      medications,
      notes,
      date: new Date().toLocaleDateString(),
    };
  
    const doc = generateEnhancedPDF(prescriptionData);
    const pdfData = doc.output('blob');
    const formData = new FormData();
    formData.append('file', pdfData, 'prescription.pdf');
    formData.append('patientEmail', prescriptionData.patientEmail);
    
    try {
      const response = await axiosInstance.post('/doctor-service/sendPrescription', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(`Prescription sent to ${patientEmail}`);
    } catch (error) {
      console.error('Error sending prescription:', error);
      alert('There was an error sending the prescription. Please try again.');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const PrescriptionPreview = () => (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Medical Prescription</h1>
        <p className="text-sm text-gray-600">Dr. {doctorName}</p>
      </div>
      <div className="mb-6">
        <p className="font-semibold">Patient: {patientName}</p>
        <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Medications:</h2>
        <ul className="list-disc pl-5">
          {medications.map((med, index) => (
            <li key={index} className="mb-2">
              <span className="font-medium">{med.name}</span> - {med.dosage}, {med.frequency} for {med.duration}
            </li>
          ))}
        </ul>
      </div>
      {notes && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Additional Notes:</h2>
          <p className="text-sm">{notes}</p>
        </div>
      )}
      <div className="text-center text-sm text-gray-600 mt-8">
        <p>This prescription is valid for 30 days from the date of issue.</p>
        <p>For any queries, please contact your healthcare provider.</p>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 bg-blue-50">
          <h2 className="text-2xl font-bold text-blue-800">Create Prescription</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex-grow overflow-y-auto">
          {showPreview ? (
            <PrescriptionPreview />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700 mb-1">Patient Email</label>
                  <input
                    type="email"
                    id="patientEmail"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter patient email"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Medications</h3>
                {medications.map((medication, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 relative">
                    <button onClick={() => handleRemoveMedication(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                        <input
                          type="text"
                          value={medication.name}
                          onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter medication name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                        <input
                          type="text"
                          value={medication.dosage}
                          onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter dosage"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                        <input
                          type="text"
                          value={medication.frequency}
                          onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter frequency"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          value={medication.duration}
                          onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter duration"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={handleAddMedication} className="flex items-center text-blue-600 hover:underline">
                  <Plus size={16} className="mr-1" />
                  Add Medication
                </button>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter additional notes"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center p-6 bg-blue-50">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center text-blue-600 hover:underline"
          >
            <Eye size={20} className="mr-1" />
            {showPreview ? "Edit Prescription" : "Preview Prescription"}
          </button>
          <button
            onClick={handleSend}
            className={`flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 disabled:opacity-50`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Prescription"}
            <Send className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionCreationModal;
