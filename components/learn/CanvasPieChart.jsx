'use client'
import { useRef, useEffect } from "react";

const CanvasPieChart = ({ data, colors }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const total = data.reduce((sum, value) => sum + value, 0);
    let currentAngle = 0;

    // Function to draw a segment of the pie chart
    const drawSegment = (ctx, data, colors, currentAngle, index) => {
      const sliceAngle = (2 * Math.PI * data[index]) / total;

      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2); // Move to the center
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width / 2, canvas.height / 2), // Radius
        currentAngle,
        currentAngle + sliceAngle
      );
      ctx.closePath();

      // Fill the segment with the corresponding color
      ctx.fillStyle = colors[index];
      ctx.fill();

      // Add a stroke for better visibility
      ctx.strokeStyle = "#fff";
      ctx.stroke();
    };

    // Draw each segment of the pie chart
    for (let i = 0; i < data.length; i++) {
      drawSegment(ctx, data, colors, currentAngle, i);
      currentAngle += (2 * Math.PI * data[i]) / total;
    }
  }, [data, colors]);

  return (
    <canvas
      ref={canvasRef}
      width={100}
      height={100}
      style={{ border: "1px solid #000" }}
    />
  );
};

export default CanvasPieChart;
