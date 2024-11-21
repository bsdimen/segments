import React from 'react';
import HoverText from './cropImage';

interface Segment {
  "bottom_right x": number;
  "bottom_right y": number;
  "segment image url": string;
  title: string;
  "upper_left x": number;
  "upper_left y": number;
}

interface ImageWithSegmentsProps {
  originalImageUrl: string;
  imgWidth: number;
  segments: Segment[];
}

export default function ImageWithSegments({
  originalImageUrl,
  imgWidth,
  segments,
}: ImageWithSegmentsProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Render the original image */}
      <img
        src={originalImageUrl}
        alt="Original"
        style={{ width: imgWidth, display: 'block' }}
      />
      {/* Render segments over the original image */}
      {segments.map((segment, index) => (
        <HoverText
          key={index}
          imageUrl={originalImageUrl}
          imgWidth={imgWidth}
          x1={segment["upper_left x"]}
          y1={segment["upper_left y"]}
          x2={segment["bottom_right x"]}
          y2={segment["bottom_right y"]}
          hoverText={segment.title}
          segment_image_url={segment["segment image url"]}
        />
      ))}
    </div>
  );
}

