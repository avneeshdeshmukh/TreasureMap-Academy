import "../globals.css";
import Footer from "@/components/homepage/Footer";
import Homenavbar from "@/components/homepage/Homenavbar";
import 'bootstrap/dist/css/bootstrap.min.css';


export const metadata = {
  title: "TMA - Treasure Map Academy",
  description:
    "Gamify your learning experience with TMA where adventure of knowlegde awaits you!",
};

export default function HomeLayout({ children }) {
  return (

    <>
      <Homenavbar />
      <div className="min-h-screen">
        {/* <Homehero /> */}
        {children}
      </div>
      <Footer />
    </>

  );
}