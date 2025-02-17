import { useState } from "react";

const DeleteModal = ({ show, onClose, onDelete }) => {
  const [inputValue, setInputValue] = useState("");
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsDeleteEnabled(e.target.value === "permanently delete");
  };

  const handleDelete = () => {
    if (isDeleteEnabled) {
      onDelete();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
        <h2 className="text-xl font-semibold mb-4">Are you sure you want to permanently delete this course?</h2>
        <input
          type="text"
          className="border border-gray-300 p-2 rounded w-full mb-4"
          placeholder="Type 'permanently delete' to confirm"
          value={inputValue}
          onChange={handleInputChange}
        />
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`bg-red-700 text-white py-2 px-4 rounded ${!isDeleteEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleDelete}
            disabled={!isDeleteEnabled}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
