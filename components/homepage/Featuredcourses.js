"use client"; 
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import "./home.css"; 

const Featuredcourses = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This will only run on the client
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Initialize Bootstrap carousel only when the component is mounted
    const carouselElement = document.querySelector('#carouselExampleIndicators');

    // Check if the carousel element is found before initializing
    if (carouselElement) {
      const carousel = new bootstrap.Carousel(carouselElement);

      // Cleanup function to dispose of the carousel
      return () => {
        carousel.dispose();
      };
    }
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className='py-24'>
      <div className='featureCourses flex justify-center items-center'>
        <h3 className='text-3xl font-bold'>Featured Courses</h3>
      </div>

      {isClient && ( // Only render the carousel if on the client
        <div id="carouselExampleIndicators" className="carousel slide mb-10 mt-8" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="d-flex justify-content-center">
                <img src="/images/trialcourse1.png" className="d-block w-25 h-64" alt="Course 1" />
                <img src="/images/trialcourse2.png" className="d-block w-25 mx-2 h-64" alt="Course 2" />
                <img src="/images/trialcourse1.png" className="d-block w-25 h-64" alt="Course 3" />
              </div>
            </div>

            <div className="carousel-item">
              <div className="d-flex justify-content-center">
                <img src="/images/trialcourse2.png" className="d-block w-25 h-64" alt="Course 4" />
                <img src="/images/trialcourse1.png" className="d-block w-25 mx-2 h-64" alt="Course 5" />
                <img src="/images/trialcourse2.png" className="d-block w-25 h-64" alt="Course 6" />
              </div>
            </div>
          </div>

          {/* Previous and Next Buttons */}
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev" aria-label="Previous">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next" aria-label="Next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Featuredcourses;
