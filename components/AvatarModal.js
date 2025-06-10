import { useState } from "react";
import Image from "next/image";

const avatarList = [
  "avatar1.png",
  "avatar2.jpg",
  "avatar3.png",
  "avatar4.png",
  "avatar5.png",
  "avatar6.png",
  "avatar7.png",
];

export default function AvatarModal({ onClose, onUpdate }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Choose Your Avatar</h2>
        <div className="grid grid-cols-3 gap-4">
          {avatarList.map((avatar) => (
            <div
              key={avatar}
              className={`border rounded cursor-pointer p-1 ${
                selected === avatar ? "border-blue-500" : "border-gray-300"
              }`}
              onClick={() => setSelected(avatar)}
            >
              <Image
                src={`/avatars/${avatar}`}
                alt={avatar}
                width={80}
                height={80}
                className="rounded"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => {
              if (selected) {
                onUpdate(`/avatars/${selected}`);
              }
            }}
            disabled={!selected}
          >
            Update Picture
          </button>
        </div>
      </div>
    </div>
  );
}
