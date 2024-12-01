import DisplayDocuments from "./DisplayDocuments";
import DisplaySegmentation from "./DiaplaySegmentation";
import {ImageSegments} from "../SegmentsFeautre";
import { useState } from "react";
import { useImageSegments } from "../../Context/ImageSegmentsContext";

export default function SegmentationBoard() {

    const [selectedDocs, setSelectedDocs]=useState<ImageSegments | null>(null);

    const {segments} = useImageSegments();

    const handleSelection = (docs: ImageSegments)=> {
        setSelectedDocs(null)
        setSelectedDocs(docs)
    }

    const SaveSegmentsOnServer = () => {
        const savedSegments = segments.map((imageSegment) => {
    return {
        ...imageSegment,
        segments: imageSegment.segments.filter((segment) => !segment.isDeleted)
    };
}).filter((imageSegment) => imageSegment.segments.length > 0);

console.log(savedSegments); 
    }

    return <div className="flex flex-col items-center py-10 px-8 bg-white my-3 rounded-[16px]">
        <DisplayDocuments handleSelection={handleSelection} />
        <DisplaySegmentation  doc={selectedDocs}/>

        <button className="bg-[#703bf7] text-white rounded-[8px] px-3 py-2 my-6" onClick={SaveSegmentsOnServer}>Save on server</button>
    </div>
}