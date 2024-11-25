import SegmentationBoard from "./Components/SegmentationBoard";
import { ImageSegmentsProvider } from "./Context/ImageSegmentsContext"; 
export interface Segment {
  "bottom_right x": number;
  "bottom_right y": number;
  "segment image url": string;
  title: string;
  "upper_left x": number;
  "upper_left y": number;
  isDeleted?: boolean;
}

export interface ImageSegments {
  original_image_url: string;
  segments: Segment[];
}
interface SegmentFeatureProps {
imagesSegments: ImageSegments[]
}

export default function SegmentFeature({imagesSegments} : SegmentFeatureProps) {
    return (
    <ImageSegmentsProvider initialValue={imagesSegments}>
      <SegmentationBoard />
    </ImageSegmentsProvider>
  ) 
}