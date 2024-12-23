import DisplayDocuments from "./DisplayDocuments";
import DisplaySegmentation from "./DiaplaySegmentation";
import { ImageSegments } from "../SegmentsFeautre";
import { useState } from "react";
import { useImageSegments } from "../../Context/ImageSegmentsContext";
import axios from "axios";

export default function SegmentationBoard() {
  const [selectedDocs, setSelectedDocs] = useState<ImageSegments | null>(null);
  const { segments } = useImageSegments();

  const handleSelection = (docs: ImageSegments) => {
    setSelectedDocs(null);
    setSelectedDocs(docs);
  };

  interface FileSegment {
    file_id: number;
    segments: {
      segment_id: string;
      file_title: string;
      bottom_right_x: number;
      bottom_right_y: number;
      upper_left_x: number;
      upper_left_y: number;
    }[];
  }

  const transformSegmentsToServerFormat = (imageSegments: ImageSegments[]): FileSegment[] => {
  return imageSegments
    .map((imageSegment, index) => ({
      file_id: 7 + index,
      segments: imageSegment.segments
        .filter((segment) => segment.isDeleted !== true) 
        .map((segment, segmentIndex) => ({
          segment_id: segment.segment_image_url, 
          file_title: segment.title,
          bottom_right_x: segment.bottom_right_x,
          bottom_right_y: segment.bottom_right_y,
          upper_left_x: segment.upper_left_x,
          upper_left_y: segment.upper_left_y,
        })),
    }))
    .filter((file) => file.segments.length > 0); 
};


 const saveImageSegmentsToServer = async () => {
  const transformedData = transformSegmentsToServerFormat(segments);
  console.log(transformedData);

  if (transformedData.length === 0) {
    console.warn("No valid segments to save. Skipping API call.");
    return;
  }

  try {
    const response = await axios.post(
      "https://server.vitalls.ai/api/v2/Admin/storeSegments",
      { files: transformedData }, 
      {
        headers: {
          Authorization: `Bearer 907|RbET3dm7WQosev4x3HsAXkL3gN2UbhjAoMM1hGvW91664de0`,
          "Content-Type": "application/json",  
        },
      }
    );
    console.log("Data saved successfully:", response.data);
  } catch (error) {
    console.error("Failed to save data:", error);
  }
};


  return (
    <div className="flex flex-col items-center py-10 px-8 bg-white my-3 rounded-[16px]">
      <DisplayDocuments handleSelection={handleSelection} />
      <DisplaySegmentation doc={selectedDocs} />

      <button
        className="bg-[#703bf7] text-white rounded-[8px] px-3 py-2 my-6"
        onClick={() => saveImageSegmentsToServer()}
      >
        Save on server
      </button>
    </div>
  );
}

