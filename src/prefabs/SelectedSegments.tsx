import { useImageSegments } from "../Context/ImageSegmentsContext";
import { ImageSegments } from "../SegmentsFeautre";


export default function SelectedSegments() {
    const {segments} = useImageSegments();


    return <div className="w-[200px] h-fit ">
        <h1 className="text-2xl font-medium border-b border-b-solid border-b-gray-600 py-2">Selected Segments</h1>
        <div className="flex flex-col w-full  gap-3">
{segments.map((segment: ImageSegments,index: number)=>(
            <img src={segment.original_image_url} style={{width:80}} />

            ))}
        </div>
    </div>
}