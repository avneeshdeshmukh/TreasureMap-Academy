export const StickyWrapper = ({children}) =>{
    return (
        <div className="hidden lg:block w-[256px] sticky self-end bottom-6">
            <div className="min-h-[calc(100vh-48px)] sticky pt-5 top-6 flex flex-col gap-y-4">
                {children}
            </div>
        </div>
    )
}