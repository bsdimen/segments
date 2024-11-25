import { useState } from "react"
import { useImageSegments } from "../Context/ImageSegmentsContext";
import { ImageSegments } from "../SegmentsFeautre";

interface DisplayDocumentsProps {
    handleSelection : (docs: ImageSegments) => void
}
export default function DisplayDocuments({handleSelection}: DisplayDocumentsProps) {
    const {segments} = useImageSegments();
    const [selectedDocs, setSelectedDocs] = useState<number | undefined>();

     const handleImageClick = (index: number) => {
    setSelectedDocs(index);
    handleSelection(segments[index])
  };


    return <div className="w-[200px] h-fit ">
        <h1 className="text-2xl font-medium border-b border-b-solid border-b-gray-600 py-2">Documents</h1>
        <div className="flex flex-col w-full  gap-3">
{segments.map((segment, index) => (
        <div
          key={index}
          onClick={() => handleImageClick(index)} 
          style={{
            cursor: 'pointer', 
            border: selectedDocs === index ? '1px solid blue' : 'none', 
            width:"fit-content"
          }}
        >
          <img src={segment.original_image_url} alt={`segment ${index}`} style={{ width: 80 }} />
        </div>
      ))}
        </div>
    </div>
}