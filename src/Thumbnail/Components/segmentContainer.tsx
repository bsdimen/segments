import { useRef, useState, useEffect } from "react";
import { Segment, ImageSegments } from "../SegmentsFeautre";
import { useImageSegments } from "../../Context/ImageSegmentsContext";
import SegmentViewer from "./segmentViewer";

interface SegmentContainerProps {
  data: {
    original_image_url: string;
    segments: Segment[];
  };
  imgWidth: number;
}

export default function SegmentContainer({ data, imgWidth }: SegmentContainerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [ratio, setRatio] = useState(1);
  const [currentDoc, setCurrentDoc] = useState<ImageSegments>();
   const [draggingState, setDraggingState] = useState<{
  type: "move" | "resizeTL" | "resizeBR" | null;
  startX: number;
  startY: number;
  segmentIndex: number | null; // Track the active segment
}>({ type: null, startX: 0, startY: 0, segmentIndex: null });

  const { segments, setSegments } = useImageSegments();

    const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);


  useEffect(() => {
    const img = imgRef.current;
    if (img && img.naturalWidth) {
      const calculatedRatio = imgWidth / img.naturalWidth;
      setRatio(calculatedRatio);
    }
  }, [imgWidth]);

  useEffect(() => {
    const foundDoc = segments.find((image) => image.original_image_url === data.original_image_url);
    if (foundDoc) setCurrentDoc(foundDoc);
  }, [segments, data]);

  useEffect(() => {
    drawOverlay();
  }, [currentDoc, ratio]);

  const drawOverlay = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imgRef.current;

    if (!canvas || !ctx || !currentDoc || !img) return;

    const imgHeight = img.naturalHeight * ratio;
    canvas.width = imgWidth;
    canvas.height = imgHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    currentDoc.segments.forEach((segment) => {
      const rect = {
        left: segment.upper_left_x * ratio,
        top: segment.upper_left_y * ratio,
        right: segment.bottom_right_x * ratio,
        bottom: segment.bottom_right_y * ratio,
      };

      ctx.strokeStyle =segment.isDeleted ? "#5B5B5B" : "#703bf7";
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);

      const radius = 8;
      ctx.fillStyle = segment.isDeleted ? "#5B5B5B" : "#703bf7";

      ctx.beginPath();
      ctx.arc(rect.left, rect.top, radius, 0, Math.PI * 2);
      ctx.fill();

      // Bottom-right
      ctx.beginPath();
      ctx.arc(rect.right, rect.bottom, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  };

const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
  if (!currentDoc) return;

  const canvas = canvasRef.current;
  const { clientX, clientY } = e.nativeEvent;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const offsetX = clientX - rect.left;
  const offsetY = clientY - rect.top;

  currentDoc.segments.forEach((segment, index) => {
    const segmentRect = {
      left: segment.upper_left_x * ratio,
      top: segment.upper_left_y * ratio,
      right: segment.bottom_right_x * ratio,
      bottom: segment.bottom_right_y * ratio,
    };

    if (checkInRect(offsetX, offsetY, segmentRect)) {
      setDraggingState({ type: "move", startX: offsetX, startY: offsetY, segmentIndex: index });
    } else if (
      checkCloseEnough(offsetX, segmentRect.left) &&
      checkCloseEnough(offsetY, segmentRect.top)
    ) {
      setDraggingState({ type: "resizeTL", startX: offsetX, startY: offsetY, segmentIndex: index });
    } else if (
      checkCloseEnough(offsetX, segmentRect.right) &&
      checkCloseEnough(offsetY, segmentRect.bottom)
    ) {
      setDraggingState({ type: "resizeBR", startX: offsetX, startY: offsetY, segmentIndex: index });
    }
  });
};

const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
  if (!draggingState.type || draggingState.segmentIndex === null || !currentDoc) return;

  const { clientX, clientY } = e.nativeEvent;
  const canvas = canvasRef.current;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const offsetX = clientX - rect.left;
  const offsetY = clientY - rect.top;

  const dx = offsetX - draggingState.startX;
  const dy = offsetY - draggingState.startY;

  currentDoc.segments = currentDoc.segments.map((segment, index) => {
    if (index !== draggingState.segmentIndex) return segment;

    const updatedSegment = { ...segment }; // Copy to avoid mutating directly

    if (draggingState.type === "move") {
      updatedSegment.upper_left_x += dx / ratio;
      updatedSegment.upper_left_y += dy / ratio;
      updatedSegment.bottom_right_x += dx / ratio;
      updatedSegment.bottom_right_y += dy / ratio;
    } else if (draggingState.type === "resizeTL") {
      updatedSegment.upper_left_x = offsetX / ratio;
      updatedSegment.upper_left_y = offsetY / ratio;
    } else if (draggingState.type === "resizeBR") {
      updatedSegment.bottom_right_x = offsetX / ratio;
      updatedSegment.bottom_right_y = offsetY / ratio;
    }

    // Update the selected segment if it matches
    if (selectedSegment?.segment_image_url === segment.segment_image_url) {
      setSelectedSegment(updatedSegment);
    }

    return updatedSegment;
  });

  setDraggingState({ ...draggingState, startX: offsetX, startY: offsetY });
  requestAnimationFrame(drawOverlay);
};


const handleMouseUp = () => {
  if (!currentDoc) return;

  setSegments((prevSegments) =>
    prevSegments.map((doc) =>
      doc.original_image_url === currentDoc.original_image_url ? currentDoc : doc
    )
  );

  setDraggingState({ type: null, startX: 0, startY: 0, segmentIndex: null });
};


const handleSave = (link: Segment) => {
   setSegments((prevSegments) =>
    prevSegments.map((imageSegment) => {
      const updatedSegments = imageSegment.segments.map((segment) => {
        if (segment.segment_image_url === link.segment_image_url) {
          return { ...segment, isDeleted: !segment.isDeleted };
        }
        return segment;
      });
      return { ...imageSegment, segments: updatedSegments };
    })
  );
}
  return (
    <div style={{ position: "relative", width: imgWidth }}>
      <img
        ref={imgRef}
        src={data.original_image_url}
        alt="Segmented"
        style={{ width: "100%", display: "block" }}
        onLoad={() => setRatio(imgWidth / imgRef.current!.naturalWidth)}
      />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      {currentDoc?.segments.map((segment, index) => {
        return (
          <>
          <span style={{
          position: "absolute",
          left: segment.upper_left_x * ratio,
          top: segment.upper_left_y * ratio,
          transform: "translateY(calc(-100% - 10px))", 
          zIndex: 10,
          maxWidth:(segment.upper_left_x - segment.bottom_right_x) * ratio,
          background: segment.isDeleted ? "#5B5B5B" : "#703bf7",
          color: "#fff",
          padding: "2px 5px", 
          borderRadius: "4px", 
          whiteSpace: "normal", 
          textAlign: "start", 
          overflow: "hidden",
          textOverflow: "ellipsis", 
              }}>{segment.title}</span>
          <button
            key={index}
            style={{
              position: "absolute",
              left: segment.bottom_right_x * ratio + 10,
              top: segment.upper_left_y* ratio,
              zIndex: 10,
              background: segment.isDeleted ? "#5B5B5B" : "#703bf7",
              color: "#fff",
              fontWeight:"medium",
              fontSize:14,
              padding:"8px 16px",
              borderRadius: "4px", 
              cursor: "pointer",
            }}
            onClick={(e) => {
              handleSave(segment)
            }}
          >
            {!segment.isDeleted ? "Delete" : "Select"}
          </button>
          <button
            key={segment.segment_image_url}
            style={{
              position: "absolute",
              left: segment.bottom_right_x * ratio + 10,
              top: segment.upper_left_y* ratio + 50,
              zIndex: 10,
              background: segment.isDeleted ? "#5B5B5B" : "#703bf7",
              color: "#fff",
              fontWeight:"medium",
              padding:"8px 16px",
              borderRadius: "4px", 
              fontSize:14,
              cursor: "pointer",
              whiteSpace:"nowrap"
            }}
           onClick={() => setSelectedSegment(segment)}
          >
            View Segment
          </button>
          </>
        );
      })}
       {selectedSegment && currentDoc && (
        <SegmentViewer
          segment={selectedSegment}
          originalImage={currentDoc.original_image_url}
          onClose={() => setSelectedSegment(null)}
        />
      )}
    </div>
  );
}

function checkCloseEnough(p1: number, p2: number, threshold: number = 10) {
  return Math.abs(p1 - p2) < threshold;
}

function checkInRect(
  x: number,
  y: number,
  rect: { left: number; top: number; right: number; bottom: number }
) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}








