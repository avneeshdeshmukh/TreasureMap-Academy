import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/homepage/Footer";
import Homenavbar from "@/components/homepage/Homenavbar";
import Homehero from "@/components/homepage/Homehero";
import Rolesection from "@/components/homepage/Rolesection";
import 'bootstrap/dist/css/bootstrap.min.css';


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "TMA - Treasure Map Academy",
  description:
    "Gamify your learning experience with TMA where adventure of knowlegde awaits you!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Homenavbar />
        <div className="min-h-screen">
          {/* <Homehero /> */}
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
