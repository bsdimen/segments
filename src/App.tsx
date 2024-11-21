import React from 'react';
import ImageWithSegments from './components/imageSegment';

const data = {
  original_image_url:
    "https://hubforward-drive.fra1.cdn.digitaloceanspaces.com/GeminiSamples/CT%20Brain%201.png",
  segments: [
    {
      "bottom_right x": 444,
      "bottom_right y": 771,
      "segment image url":
        "https://gemini.vitalls.ai/static/processed_image_102_brainmriseries.png",
      title: "brain mri series",
      "upper_left x": 166,
      "upper_left y": 604,
    },
    {
      "bottom_right x": 393,
      "bottom_right y": 433,
      "segment image url":
        "https://gemini.vitalls.ai/static/processed_image_103_ctscanaxialsectionofbrainstemandcerebellarhemisphere.png",
      title: "ct scan axial section of brainstem and cerebellar hemisphere",
      "upper_left x": 248,
      "upper_left y": 308,
    },
  ],
};

export default function App() {
  return (
    <div>
      <ImageWithSegments
        originalImageUrl={data.original_image_url}
        imgWidth={500} // Adjust the width as needed
        segments={data.segments}
      />
    </div>
  );
}

