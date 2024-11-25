import DisplayDocuments from "./DisplayDocuments";
import DisplaySegmentation from "./SegmentationFeat/DiaplaySegmentation";
import {ImageSegments} from "../SegmentsFeautre";
import { useState } from "react";

export default function SegmentationBoard() {

    const [selectedDocs, setSelectedDocs]=useState<ImageSegments | null>(null);

    const handleSelection = (docs: ImageSegments)=> {
        setSelectedDocs(null)
        setSelectedDocs(null)
        setSelectedDocs(docs)
    }
    return <div className="flex flex-row px-3 py-5 bg-white my-3 rounded-md">
        <DisplayDocuments handleSelection={handleSelection} />
        <DisplaySegmentation  doc={selectedDocs}/>
    </div>
}