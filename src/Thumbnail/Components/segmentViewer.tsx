import { useEffect, useRef } from "react";
import { Segment } from "../SegmentsFeautre";

interface SegmentViewerProps {
  segment: Segment;
  originalImage: string | null;
  onClose: () => void;
}

export default function SegmentViewer({ segment, originalImage, onClose }: SegmentViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx && originalImage) {
      const width = segment.bottom_right_x - segment.upper_left_x;
      const height = segment.bottom_right_y - segment.upper_left_y;

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);
      const doc = new Image()

      doc.src= originalImage

      ctx.drawImage(
        doc,
        segment.upper_left_x,
        segment.upper_left_y,
        width,
        height,
        0,
        0,
        width,
        height
      );
    }
  }, [segment, originalImage]);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#fff",
        zIndex: 1000,
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        borderRadius: "8px",
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", marginBottom: "10px" , border:"2px solid #703bf7"}} />
      <button
        onClick={onClose}
        style={{
          display: "block",
          margin: "0 auto",
          padding: "10px 20px",
          background: "#703bf7",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  );
}
