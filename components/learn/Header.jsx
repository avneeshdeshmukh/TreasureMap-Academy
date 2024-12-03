const Header = () => {
  return (
    <div className="text-white rounded-sm my-2 fixed left-0 top-0 right-0 h-20 z-50 border-4 border-[#2c3748] border-b-8 border-b-[#11151c] bg-[#2c3748] flex items-center justify-center py-5 px-3 shadow-lg md:left-1/4 md:w-3/4 lg:w-3/6 lg:ml-24">
      <div className="flex flex-col text-center w-full px-2">
        <h1 className="text-yellow-400 text-sm sm:text-md md:text-xl lg:text-lg font-semibold truncate">
          Data Structures & Algorithms
        </h1>
        <h2 className="text-xs sm:text-sm md:text-lg font-semibold truncate">
          Unit 2 : Arrays
        </h2>
      </div>
    </div>
  );
};

export default Header;
