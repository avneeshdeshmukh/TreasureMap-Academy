export const Header = ({ user }) => {
    return (
        <div className="flex items-center mt-10 px-8">
        {/* Header aligned next to the sidebar */}
        <h1 className="font-bold text-3xl text-[#5a3b1a] text-center flex-shrink-0 ml-9">
            Welcome {user.username}!
        </h1>
    
        {/* Spacer to push the search bar to the right */}
        <div className="flex-grow"></div>
    
    </div>
    )
}