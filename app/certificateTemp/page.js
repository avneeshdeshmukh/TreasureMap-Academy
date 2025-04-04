"use client";
import { useState, useRef } from "react";
import Certificate from "@/components/certificate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

//npm install html2canvas jspdf --> make sure to delete if not used

export default function GetCertificate() {
  const [isOpen, setIsOpen] = useState(false);
  const certificateRef = useRef(null);

  const downloadPDF = () => {
    if (!certificateRef.current) return;

    html2canvas(certificateRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape");
      pdf.addImage(imgData, "PNG", 10, 10, 280, 200);
      pdf.save("certificate.pdf");
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      {/* Button to open modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Get Your Certificate
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl relative">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-2xl"
            >
              &times;
            </button>

            {/* Certificate Component */}
            <div ref={certificateRef}>
              <Certificate
                username="John Doe"
                courseName="Advanced Treasure Hunting"
                creatorName="Captain Silver"
                issueDate="April 4, 2025"
              />
            </div>

            {/* Download Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={downloadPDF}
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
              >
                Download as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
