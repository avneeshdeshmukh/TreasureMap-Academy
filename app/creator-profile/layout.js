import ProtectedRoute from "@/components/protected-route"

export const metadata = {
    title: "Complete Profile",
    description: "Welcome to the homepage of My App",
};

export default function CompleteCreatorProfileLayout({children}){
    return(
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    )
}