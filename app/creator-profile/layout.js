import ProtectedRoute from "@/components/protected-route"


export default function CompleteCreatorProfileLayout({children}){
    return(
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    )
}