import "./globals.css";
import { Nunito } from "next/font/google";
import { AuthProvider } from "./context/AuthProvider";
import ProgressUpdate from "@/components/progress-update";

const font = Nunito({ subsets: ["latin"] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <AuthProvider>
          <ProgressUpdate>
            {children}
          </ProgressUpdate>
        </AuthProvider>
      </body>
    </html>
  );
}
