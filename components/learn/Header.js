const Header = () => {
    return (
        <div
            className="text-white rounded-sm my-2 fixed left-1/3 w-1/2 h-24 z-50 border-4 border-[#2c3748] border-b-8 border-b-[#11151c] text-lg bg-[#2c3748] flex items-center justify-center py-10 px-5 shadow-lg" // Increase the height slightly to make the header more prominent
        >
            <div className="flex-col">
                <h1 className="text-center text-yellow-400 text-2xl font-semibold">Data Structures & Algorithms</h1>
                <h2 className="text-center text-2xl font-semibold">Unit 2 : Arrays</h2>
            </div>
        </div>
    );
};

export default Header;
