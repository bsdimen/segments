import React, { useState } from 'react';
import axios from 'axios';
import SegmentFeature from '../Thumbnail/SegmentsFeautre';
import { useComponentState } from '../Context/StateContext';
import { ImageSegments } from '../Thumbnail/SegmentsFeautre';

interface GenerateSegmentProps {
  doc: string[];
}

export function GenerateSegment({ doc }: GenerateSegmentProps) {
  const [ImageSegments, setImageSegments] = useState<ImageSegments[]>([]);

  const { state, setCurrentState, setIsLoading } = useComponentState();
  const { currentState, isLoading } = state;

  const handleGetData = async () => {
    setIsLoading(true);
    const transformedDoc = {
      url: doc, // doc is the array of URLs
    };

    try {
      const jsonData = JSON.stringify(transformedDoc);
      console.log(jsonData);

      const response = await axios.post(
        `https://gemini.vitalls.ai/sub_images_and_coordinates`,
       jsonData,
        {headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer 907|RbET3dm7WQosev4x3HsAXkL3gN2UbhjAoMM1hGvW91664de0`
          }},
      );

      const updatedRes = transformData(response.data);
      console.log(response.data);
      console.log(updatedRes);

      setImageSegments(updatedRes);
      setCurrentState('editing');
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  function transformData(response: any[]): ImageSegments[] {
    return response.map((item) => ({
      original_image_url: item.original_image_url,
      segments: item.segments.map((segment: any) => ({
        bottom_right_x: segment['bottom_right x'],
        bottom_right_y: segment['bottom_right y'],
        segment_image_url: segment['segment image url'],
        title: segment.title,
        upper_left_x: segment['upper_left x'],
        upper_left_y: segment['upper_left y'],
        isDeleted: false,
      })),
    }));
  }

  const renderContent = () => {
    if (currentState === 'initial') {
      return (
        <div className="bg-white rounded-[24px] p-6 text-center max-w-md mx-auto">
          <h1 className="text-2xl font-medium mb-4">Generate Segmentation</h1>
          <p className="text-gray-600 mb-6">
            Easily generate precise segmentation for your data with a single click. Perfect for streamlining workflows!
          </p>
          <button
            onClick={handleGetData}
            disabled={isLoading}
            className={`px-4 py-3 text-white rounded-full transition-all duration-300 ${
              isLoading ? 'bg-[#a785f9]' : 'bg-[#703bf7] hover:bg-[#5a29c8]'
            }`}
          >
            {isLoading ? 'Loading...' : 'Start Segmentation'}
          </button>
        </div>

      );
    } else if (currentState === 'editing') {
      return (
        <div>
          <SegmentFeature imagesSegments={ImageSegments} />
        </div>
      );
    } else if (currentState === 'completed') {
      return <h1>Process Completed!</h1>;
    }
  };

  return (

      <div className='min-w-[100vw] min-h-[100vh] flex items-center justify-center bg-[#f6f6f6]'>{renderContent()}</div>
  );
}

