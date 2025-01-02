export const Header = ({ title }) => {
    return (
        <div className="flex items-center mt-10 px-8">
        {/* Header aligned next to the sidebar */}
        <h1 className="font-bold text-3xl text-[#5a3b1a] text-center flex-shrink-0 ml-9">
            {title}
        </h1>
    
        {/* Spacer to push the search bar to the right */}
        <div className="flex-grow"></div>
    
        {/* Search bar aligned to the right */}
        <input
          type="text"
          className="search-bar border rounded-lg px-4 py-2 text-sm"
          placeholder="Search"
        />
    </div>
    )
}