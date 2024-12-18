import SegmentationBoard from "./Components/SegmentationBoard";
import { ImageSegmentsProvider } from "../Context/ImageSegmentsContext"; 
export interface Segment {
  bottom_right_x: number;
  bottom_right_y: number;
  segment_image_url: string;
  title: string;
  upper_left_x: number;
  upper_left_y: number;
  isDeleted?: boolean;
}

export interface ImageSegments {
  original_image_url: string;
  segments: Segment[];
}
 export interface SegmentFeatureProps {
imagesSegments: ImageSegments[]
}

export default function SegmentFeature({imagesSegments} : SegmentFeatureProps) {
    return (
    <ImageSegmentsProvider initialValue={imagesSegments}>
      <SegmentationBoard />
    </ImageSegmentsProvider>
  ) 
}