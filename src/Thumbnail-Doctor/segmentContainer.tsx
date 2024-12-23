import { useRef, useState, useEffect } from "react";
import { Segment, ImageSegments } from "../Thumbnail/SegmentsFeautre";
import { useImageSegments } from "../Context/ImageSegmentsContext";
import SegmentViewer from "../Thumbnail/Components/segmentViewer";

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

    });
  };
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








