"use client"; 
import React from "react";

const WhySection = ({ imageSrc, altText, title, description, imageFirst }) => {
  return (
    <div className={`container mx-auto flex flex-col-reverse lg:flex-row items-center gap-8 py-10 px-6 lg:px-20 ${imageFirst ? "lg:flex-row-reverse" : ""}`}>
      <img 
        src={imageSrc} 
        alt={altText} 
        className="w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto"
      />
      <div className="text-center lg:text-left max-w-lg">
        <h1 className="text-2xl sm:text-3xl text-blue-950 font-extrabold">{title}</h1>
        <p className="text-gray-600 text-lg sm:text-xl mt-4">{description}</p>
      </div>
    </div>
  );
};

const Whytma = () => {
  return (
    <div>
      <WhySection
        imageSrc="/images/solo4.png"
        altText="Interactive Learning"
        title="Interactive Learning Experience!"
        description="Engage with interactive quizzes, hands-on projects, and collaborative tools that make learning not just informative, but also fun and immersive."
        imageFirst={true} 
      />

      <WhySection
        imageSrc="/images/solo2.png"
        altText="Quality Courses"
        title="Quality Courses from Experts"
        description="Our courses are designed by industry leaders and experienced educators, ensuring you receive top-notch training tailored to your needs."
        imageFirst={false} 
      />

      <WhySection
        imageSrc="/images/solo1.png"
        altText="Personalized Learning"
        title="Personalized Learning Paths!"
        description="Tailor your educational journey with personalized learning paths that adapt to your goals and learning style, helping you progress effectively."
        imageFirst={true} 
      />
    </div>
  );
};

export default Whytma;