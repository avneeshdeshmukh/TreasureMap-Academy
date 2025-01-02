"use client"
const Notifications = () => {
    const notifications = [
      { id: 1, message: "Your course 'React Basics' received a 5-star review!" },
      { id: 2, message: "You have 10 new enrollments this week." },
    ];
  
    return (
      <div className="bg-[#f8f4eb] rounded-lg shadow-md p-6 mt-6 mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold text-[#5a3b1a] mb-4">Notifications</h2>
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li key={notif.id} className="text-sm text-gray-700">
              {notif.message}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  export default Notifications;