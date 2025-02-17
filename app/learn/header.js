export const Header = ({ title }) => {
    return (
        <div className="sticky lg:top-2 top-14 bg-[#2c3748] pb-3 lg:pt-[28px] flex items-center justify-between shadow-lg border-4 border-[#2c3748] border-b-8 border-b-[#11151c] mb-10 text-white rounded-sm z-50 lg:mt-[-28px]">
            
            <div aria-hidden />
            <h1 className="font-bold text-lg">
                {title}
            </h1>
            <div aria-hidden />
        </div>
    )
}