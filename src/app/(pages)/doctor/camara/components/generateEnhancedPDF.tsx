// import jsPDF from "jspdf";
// import "jspdf-autotable";

// // Extend the jsPDF type to include the autoTable method
// interface jsPDFWithAutoTable extends jsPDF {
//   autoTable: (options: any) => void;
//   lastAutoTable: {
//     finalY: number;
//   };
// }

// interface MedicationItem {
//   name: string;
//   dosage: string;
//   frequency: string;
//   duration: string;
// }

// interface PrescriptionData {
//   doctorName: string;
//   patientName: string;
//   patientEmail: string;
//   medications: MedicationItem[];
//   notes: string;
//   date: string;
// }

// const generateEnhancedPDF = (prescriptionData: PrescriptionData): jsPDFWithAutoTable => {
//   const { doctorName, patientName, patientEmail, medications, notes, date } = prescriptionData;
  
//   const doc = new jsPDF() as jsPDFWithAutoTable;
  
//   // Add a background color
//   doc.setFillColor(240, 248, 255); // Light blue background
//   doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
  
//   // Add a header
//   doc.setFillColor(70, 130, 180); // Steel blue header
//   doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
  
//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(24);
//   doc.setFont("helvetica", "bold");
//   doc.text("Medical Prescription", 105, 25, { align: "center" });
  
//   // Reset text color for the rest of the document
//   doc.setTextColor(0, 0, 0);
  
//   // Doctor information
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "normal");
//   doc.text(`Dr. ${doctorName}`, 20, 50);
//   doc.setFontSize(10);
//   doc.text("Licensed Medical Practitioner", 20, 56);
  
//   // Patient information
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "bold");
//   doc.text("Patient Information:", 20, 70);
//   doc.setFont("helvetica", "normal");
//   doc.text(`Name: ${patientName}`, 25, 78);
//   doc.text(`Email: ${patientEmail}`, 25, 86);
//   doc.text(`Date: ${date}`, 25, 94);
  
//   // Medications
//   doc.setFontSize(14);
//   doc.setFont("helvetica", "bold");
//   doc.text("Prescribed Medications:", 20, 110);
  
//   const tableData = medications.map(med => [med.name, med.dosage, med.frequency, med.duration]);
  
//   doc.autoTable({
//     startY: 115,
//     head: [["Medication", "Dosage", "Frequency", "Duration"]],
//     body: tableData,
//     theme: 'striped',
//     headStyles: { fillColor: [70, 130, 180], textColor: 255 },
//     styles: { cellPadding: 5, fontSize: 10 },
//     columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 40 }, 2: { cellWidth: 50 }, 3: { cellWidth: 40 } }
//   });
  
//   // Additional Notes
//   if (notes) {
//     const finalY = doc.lastAutoTable.finalY || 150;
//     doc.setFontSize(12);
//     doc.setFont("helvetica", "bold");
//     doc.text("Additional Notes:", 20, finalY + 20);
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(10);
//     const splitNotes = doc.splitTextToSize(notes, 170);
//     doc.text(splitNotes, 25, finalY + 30);
//   }
  
//   // Footer
//   const pageHeight = doc.internal.pageSize.height;
//   doc.setFontSize(8);
//   doc.setTextColor(100, 100, 100);
//   doc.text("This prescription is valid for 30 days from the date of issue.", 105, pageHeight - 20, { align: "center" });
//   doc.text("For any queries, please contact your healthcare provider.", 105, pageHeight - 15, { align: "center" });
  
//   return doc;
// };

// export default generateEnhancedPDF;


import jsPDF from "jspdf";

// Extend the jsPDF type to include the autoTable method
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

interface MedicationItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface PrescriptionData {
  doctorName: string;
  patientName: string;
  patientEmail: string;
  medications: MedicationItem[];
  notes: string;
  date: string;
}

const generateEnhancedPDF = (prescriptionData: PrescriptionData): jsPDFWithAutoTable => {
  const { doctorName, patientName, patientEmail, medications, notes, date } = prescriptionData;

  const doc = new jsPDF() as jsPDFWithAutoTable;

  // Add a background color
  doc.setFillColor(240, 248, 255); // Light blue background
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

  // Header Section
  doc.setFillColor(70, 130, 180); // Steel blue header
  doc.rect(0, 0, doc.internal.pageSize.width, 50, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("Medical Prescription", 105, 35, { align: "center" });

  // Subheading
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${date}`, 105, 45, { align: "center" });

  // Reset text color for the rest of the document
  doc.setTextColor(0, 0, 0);

  // Doctor Information
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Dr. ${doctorName}`, 20, 60);
  doc.setFontSize(12);
  doc.text("Licensed Medical Practitioner", 20, 66);

  // Patient Information
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Information:", 20, 85);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${patientName}`, 25, 95);
  doc.text(`Email: ${patientEmail}`, 25, 105);

  // Medications - Card Design
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Prescribed Medications:", 20, 125);

  let currentY = 135; // Start position for medications
  medications.forEach(med => {
    // Draw a rounded rectangle for each medication
    doc.setFillColor(255, 255, 255); // White background for cards
    doc.roundedRect(20, currentY, 170, 40, 5, 5, 'F');

    // Medication details
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 102, 204); // Blue color for medication names
    doc.setFontSize(12);
    doc.text(med.name, 25, currentY + 12); // Medication Name

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Black color for other details
    doc.setFontSize(10);
    doc.text(`Dosage: ${med.dosage}`, 25, currentY + 22); // Dosage
    doc.text(`Frequency: ${med.frequency}`, 90, currentY + 22); // Frequency
    doc.text(`Duration: ${med.duration}`, 155, currentY + 22); // Duration

    currentY += 45; // Move down for the next medication
  });

  // Additional Notes
  if (notes) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Additional Notes:", 20, currentY + 20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const splitNotes = doc.splitTextToSize(notes, 170);
    doc.text(splitNotes, 25, currentY + 30);
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("This prescription is valid for 30 days from the date of issue.", 105, pageHeight - 20, { align: "center" });
  doc.text("For any queries, please contact your healthcare provider.", 105, pageHeight - 15, { align: "center" });

  return doc;
};

export default generateEnhancedPDF;
