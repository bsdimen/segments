import { useState } from "react"
import { useImageSegments } from "../../Context/ImageSegmentsContext";
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


    return <div className="w-[550px] h-fit  mb-7">
        <h1 className="text-2xl font-bold mb-3">Thumbnails list</h1>
        <div className="flex flex-row w-full  gap-5">
{segments.map((segment, index) => (
        <div
          key={index}
          onClick={() => handleImageClick(index)} 
          style={{
            cursor: 'pointer', 
            width:"fit-content",
          }}
        >
          <img src={segment.original_image_url} alt={`segment ${index}`} style={{ width: 100,    borderRadius:8,             border: selectedDocs === index ? '2px solid #703bf7' : 'none',   }} />
         { selectedDocs === index && <span className="text-[#703bf7] font-medium text-sm w-full text-center my-2 block " >Selected</span>}
        </div>
      ))}
        </div>
    </div>
}