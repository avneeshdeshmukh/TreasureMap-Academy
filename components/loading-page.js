export default function Loading(){
    return(
    <div className="flex space-x-2 items-center justify-center h-screen bg-[#2c3748]">
      <div className="bg-yellow-500 w-4 h-16 animate-wave"></div>
      <div className="bg-yellow-500 w-4 h-16 animate-wave" style={{ animationDelay: '0.1s' }}></div>
      <div className="bg-yellow-500 w-4 h-16 animate-wave" style={{ animationDelay: '0.2s' }}></div>
      <div className="bg-yellow-500 w-4 h-16 animate-wave" style={{ animationDelay: '0.3s' }}></div>
      <div className="bg-yellow-500 w-4 h-16 animate-wave" style={{ animationDelay: '0.4s' }}></div>
    </div>
    );
}