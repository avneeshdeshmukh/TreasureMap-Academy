"use client"

import Homehero from "@/components/homepage/Homehero";
import Rolesection from "@/components/homepage/Rolesection";
import Whytma from "@/components/homepage/Whytma";
import Howitworks from "@/components/homepage/Howitworks";
import Newsletter from "@/components/homepage/Newsletter";
import { auth } from "@/lib/firebase";
import { redirect, useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  if(auth.currentUser){
    router.push("/learn");
  }
  return (
    <div className="flex flex-col">
      <Homehero />
      <div className="flex justify-center mt-14">
        <div className="w-3/4 h-[1px] bg-gray-400"></div>
      </div>
      <div className="px-4 md:px-6 lg:px-8 mt-8 md:mt-12 lg:mt-16">
        <Rolesection />
      </div>
      <div className="flex justify-center mt-9">
        <div className="w-3/4 h-[1px] bg-gray-400"></div>
      </div>
      <div className="px-4 md:px-6 lg:px-8 mt-8 md:mt-12 lg:mt-16">
        <Howitworks />
      </div>
      <div className="flex justify-center mt-9">
        <div className="w-3/4 h-[1px] bg-gray-400"></div>
      </div>
      <div className="px-4 md:px-6 lg:px-8 mt-8 md:mt-12 lg:mt-16">
        <Whytma />
      </div>
    </div>
  );
}
