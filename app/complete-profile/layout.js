import ProtectedRoute from "@/components/protected-route"


export default function CompleteProfileLayout({children}){
    return(
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    )
}