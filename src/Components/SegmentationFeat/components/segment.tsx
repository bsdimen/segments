import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useImageSegments } from "../../../Context/ImageSegmentsContext";
import { Segment } from '../../../SegmentsFeautre';

// import CloseIcon from "../../../icons/closeCricle.svg"

interface SegmentProps {
  key: string;
  imgRef: React.RefObject<HTMLImageElement>; // Receive the imgRef directly
  imgWidth: number;
  segment: Segment;
  onDelete: (url: string) => void;
}

export default function SegmentUi({
  key,
  imgRef, 
  imgWidth,
  segment,
  onDelete,
}: SegmentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [newX, setNewX] = useState(0);
  const [newY, setNewY] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const[isDeleted,setIsDeleted] = useState(segment.isDeleted)
  // Get the segment's coordinates from the segment prop
  const { "upper_left x": x1, "upper_left y": y1, "bottom_right x": x2, "bottom_right y": y2, "segment image url": segmentImageUrl } = segment;

useEffect(() => {
  console.log(segment.isDeleted);
}, [isDeleted]);

  const calculateDimensions = useCallback(() => {
    if (imgRef.current) {
      const naturalWidth = imgRef.current.naturalWidth;
      const naturalHeight = imgRef.current.naturalHeight;

      if (naturalWidth === 0 || naturalHeight === 0) {
        console.error("Image has no natural dimensions.");
        return;
      }

      setNewX((x1 * imgWidth) / naturalWidth);
      setNewY((y1 * imgWidth) / naturalWidth);
      setWidth(((x2 - x1) * imgWidth) / naturalWidth);
      setHeight(((y2 - y1) * imgWidth) / naturalWidth);

      console.log("Dimensions recalculated:", { newX, newY, width, height });
    }
  }, [imgRef, imgWidth, x1, y1, x2, y2]);

  useEffect(() => {
    // Only recalculate dimensions when the image or segment changes
    if (imgRef.current) {
      calculateDimensions();
      console.log("Dimensions recalculated:", { newX, newY, width, height });
    }
  }, [imgWidth, x1, y1, x2, y2]);

  useEffect(() => {
    const handleResize = () => {
      calculateDimensions();
    };

    // Attach the resize listener
    window.addEventListener("resize", handleResize);

    // Perform initial calculation
    calculateDimensions();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateDimensions]); // Include calculateDimensions as a dependency

  // Handle hover state based on mouse position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (
      mouseX >= newX &&
      mouseX <= newX + width &&
      mouseY >= newY &&
      mouseY <= newY + height
    ) {
      setIsHovered(true);
    } else {
      setIsHovered(false);
    }
  };

  const handleDelete = () => {
    onDelete(segmentImageUrl);
  };
  useEffect(()=> {
    console.log(segment.isDeleted)
  })

  return (
    <motion.div
       key={key}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.5, zIndex: 10000 }}
      onClick={handleDelete}
      style={{
        position: 'absolute',
        top: newY - 1,
        left: newX - 1,
        width: width,
        flex: "0 0 auto",
        height: height,
        transform: 'translate(-50%, -50%)',
        border : segment.isDeleted ? '1px solid #DD4040': '1px solid #703bf7',
        boxSizing: 'content-box',
        cursor: 'pointer',
      }}
      transition={{ ease: 'linear' }}
      onMouseMove={handleMouseMove}
    >
      <motion.img src={segmentImageUrl} alt="Segment Image" style={{ width: width }} />
      <motion.span
        style={{
          position: 'absolute',
          top: -2,
          left: width,
          color: 'white',
          fontSize: 10,
          borderTopRightRadius: 4,
          borderBottomRightRadius: 4,
          backgroundColor: segment.isDeleted ? '#DD4040': '#703bf7',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          maxWidth: 150,
        }}
      >
        {/* <img src={CloseIcon} style={{ width: 16, fill: '#fff'}} /> */}
        {segment.title}
      </motion.span>
    </motion.div>
  );
}





