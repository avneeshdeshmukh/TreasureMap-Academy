const WhySection = ({ imageSrc, altText, title, description, imageFirst }) => {
  return (
    <div className="container mt-6 flex py-8">
      {imageFirst ? (
        <>
          <img src={imageSrc} alt={altText} className="w-80 mx-auto" />
          <div className="mx-auto pl-10 py-10">
            <h1 className="text-3xl text-blue-950 font-extrabold">{title}</h1>
            <p className="text-gray-500 text-xl">{description}</p>
          </div>
        </>
      ) : (
        <>
          <div className="mx-auto pr-10 py-10">
            <h1 className="text-3xl text-blue-950 font-extrabold">{title}</h1>
            <p className="text-gray-500 text-xl">{description}</p>
          </div>
          <img src={imageSrc} alt={altText} className="w-80 mx-auto" />
        </>
      )}
    </div>
  );
};

const Whytma = () => {
  return (
    <div>
      <WhySection
        imageSrc="/images/solo4.png"
        altText="Interactive Learning"
        title="interactive learning experience!"
        description="Engage with interactive quizzes, hands-on projects, and collaborative tools that make learning not just informative, but also fun and immersive."
        imageFirst={true} // Image first for this section
      />

      <WhySection
        imageSrc="/images/solo2.png"
        altText="Quality Courses"
        title="quality courses from experts"
        description="Our courses are designed by industry leaders and experienced educators, ensuring you receive top-notch training tailored to your needs."
        imageFirst={false} // Text first for this section
      />

      <WhySection
        imageSrc="/images/solo1.png"
        altText="Personalized Learning"
        title="personalized learning paths!"
        description="Tailor your educational journey with personalized learning paths that adapt to your goals and learning style, helping you progress effectively."
        imageFirst={true} // Image first for this section
      />
    </div>
  );
};

export default Whytma;