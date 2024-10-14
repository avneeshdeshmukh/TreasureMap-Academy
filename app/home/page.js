import Homehero from "@/components/homepage/Homehero";
import Rolesection from "@/components/homepage/Rolesection";
import Whytma from "@/components/homepage/Whytma";
import Howitworks from "@/components/homepage/Howitworks";
import Newsletter from "@/components/homepage/Newsletter";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Homehero/>
      <div className="px-3 mt-16">
      <Rolesection/>
      </div>
      <div className="px-3 mt-16">
      <Howitworks/>
      </div>
      <div className="px-3 mt-16">
      <Whytma/>
      </div>
      <div className="px-3 mt-16">
      <Newsletter/>
      </div>
    </div>
  );
}