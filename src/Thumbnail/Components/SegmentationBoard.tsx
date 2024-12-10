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

  // Define the types for segments and file data
  interface FileSegment {
    file_title: string;
    file: Blob | null; // The binary data (Blob type)
    bottom_right_x: number;
    bottom_right_y: number;
    upper_left_x: number;
    upper_left_y: number;
  }

  interface FileData {
    file_id: number;
    segments: FileSegment[];
  }

  const handleSave = async () => {
    const formData = new FormData();
    
    // Filter valid segments (not deleted)
    const validImageSegments: ImageSegments[] = segments
      .map((imageSegment) => ({
        ...imageSegment,
        segments: imageSegment.segments.filter((segment) => !segment.isDeleted),
      }))
      .filter((imageSegment) => imageSegment.segments.length > 0);

    console.log(validImageSegments);

    validImageSegments.forEach(async (imageSegment, index) => {
    const transformedData = {
        file_id: index + 1,
      segments:
        imageSegment.segments.map(async (segment) => {
          const response = await fetch(segment.segment_image_url);
          const blob = await response.blob();
          return {
            file_title: segment.title,
            file:blob,  
            bottom_right_x: segment.bottom_right_x,
            bottom_right_y: segment.bottom_right_y,
            upper_left_x: segment.upper_left_x,
            upper_left_y: segment.upper_left_y,
          };
        })
    };
    console.log(transformedData)
    const jsonData = JSON.stringify(transformedData);
    console.log(jsonData);
    formData.append(`file_id: ${transformedData.file_id.toString()}`, jsonData);
    
    
  })

    try {
        for (var key of formData.entries()) {
        console.log(key[0] + ', ' + key[1]);
    }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="flex flex-col items-center py-10 px-8 bg-white my-3 rounded-[16px]">
      <DisplayDocuments handleSelection={handleSelection} />
      <DisplaySegmentation doc={selectedDocs} />

      <button
        className="bg-[#703bf7] text-white rounded-[8px] px-3 py-2 my-6"
        onClick={handleSave}
      >
        Save on server
      </button>
    </div>
  );
}
