import "./globals.css";
import {Nunito} from "next/font/google";
import { AuthProvider } from "./context/AuthProvider";

const font = Nunito({subsets : ["latin"]})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
