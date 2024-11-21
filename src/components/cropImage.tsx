import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Icon from '../details-o-svgrepo-com.svg';
import CloseIcon from "../close-circle-svgrepo-com.svg";
import ReturnIcon from "../back-square-svgrepo-com.svg";

interface CropImageProps {
  imageUrl: string;
  imgWidth: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  hoverText: string;
}

export default function CropImage({
  imgWidth,
  x1,
  y1,
  x2,
  y2,
  hoverText,
}: CropImageProps){
  const [isHovered, setIsHovered] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);

  const [newX, setNewX] = useState(0);
  const [newY, setNewY] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const calculateDimensions = useCallback(() => {
    if (imgRef.current) {
      const naturalWidth = imgRef.current.naturalWidth;

      setNewX((x1 * imgWidth) / naturalWidth);
      setNewY((y1 * imgWidth) / naturalWidth);
      setWidth(((x2 - x1) * imgWidth) / naturalWidth);
      setHeight(((y2 - y1) * imgWidth) / naturalWidth);
    }
  }, [imgWidth, x1, y1, x2, y2]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCancel = () => {
    setIsCanceled(!isCanceled);
  };

  useEffect(() => {
    calculateDimensions();
  }, [calculateDimensions]);

  return (
    <div style={{ position: 'relative' }}>
      {!isCanceled && (
        <motion.div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: newY,
            left: newX,
            width: width,
            height: height,
            border: '1px solid #703bf7',
            cursor: 'pointer',
          }}
          initial={{ scale: 1 }}
          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span
            style={{
              position: 'absolute',
              top: -20,
              left: 0,
              backgroundColor: '#703bf7',
              color: 'white',
              fontSize: '12px',
              padding: '4px',
              borderRadius: '4px',
              display: isHovered ? 'block' : 'none',
            }}
          >
            {hoverText}
          </motion.span>
          <motion.span
            onClick={handleCancel}
            style={{
              position: 'absolute',
              top: -20,
              right: 0,
              cursor: 'pointer',
              backgroundColor: '#703bf7',
              color: 'white',
              padding: '4px',
              borderRadius: '50%',
            }}
          >
            <img
              src={isCanceled ? ReturnIcon : CloseIcon}
              alt="Cancel"
              style={{ width: 16 }}
            />
          </motion.span>
        </motion.div>
      )}
    </div>
  );
};
