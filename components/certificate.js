export default function Certificate({
  username = "Jane Doe",
  courseName = "Advanced Treasure Hunting",
  creatorName = "Captain Silver",
  issueDate = "April 4, 2025",
}) {
  return (
    <div className="w-full max-w-3xl mx-auto bg-gradient-to-br from-[#fdf6e3] to-[#fdfcf7] border-4 border-yellow-600 rounded-xl shadow-2xl p-10 relative overflow-hidden text-[#1a1a2e]">
      {/* Decorative Top Border Pattern */}
      <div className="absolute top-0 left-0 w-full h-5 bg-[url('/pattern-top.svg')] bg-repeat-x opacity-10" />

      {/* Header with Logo */}
      <div className="flex justify-center mb-10">
        <div className="flex items-center">
          
          <h1 className="text-3xl font-extrabold text-[#0a1d37] tracking-wide">
            TREASURE MAP ACADEMY
          </h1>
        </div>
      </div>

      {/* Certificate Title */}
      <div className="text-center mb-10">
        <h2 className="text-xl uppercase tracking-wider text-yellow-600 font-semibold">
          Certificate of Completion
        </h2>
        <div className="h-1 w-24 bg-yellow-500 mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Certificate Content */}
      <div className="text-center mb-12 space-y-6">
        <div>
          <p className="text-[#333] italic mb-1">This certifies that</p>
          <p className="text-4xl font-serif font-bold text-[#0a1d37]">
            {username}
          </p>
        </div>

        <div>
          <p className="text-[#333] italic mb-1">has successfully completed</p>
          <p className="text-2xl font-medium text-[#0a1d37]">{courseName}</p>
        </div>
      </div>

      {/* Footer with Signatures and Date */}
      <div className="flex justify-between items-end pt-6 border-t border-yellow-400">
        <div className="text-center">
          <div className="w-32 h-px bg-yellow-400 mb-1"></div>
          <p className="font-medium text-[#0a1d37]">{creatorName}</p>
          <p className="text-sm text-gray-600">Course Creator</p>
        </div>

        {/* Decorative Seal */}
        <div className="bg-[#0a1d37] text-yellow-400 mr-4 shadow-md rounded-full w-20 h-20 flex items-center justify-center">
            <img src="/images/logo.png" alt="Logo" className="w-16 h-16" />
          </div>        

        <div className="text-center">
          <div className="w-32 h-px bg-yellow-400 mb-1"></div>
          <p className="font-medium text-[#0a1d37]">Date Issued</p>
          <p className="text-sm text-gray-600">{issueDate}</p>
        </div>
      </div>

      {/* Bottom Pattern Decoration */}
      <div className="absolute bottom-0 left-0 w-full h-5 bg-[url('/pattern-bottom.svg')] bg-repeat-x opacity-10" />
    </div>
  );
}
