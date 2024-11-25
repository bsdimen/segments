
import { ImageSegments } from '../../SegmentsFeautre';
import SegmentContainer from './components/segmentContainer';

interface DisplaySegmentationProps {
  doc: ImageSegments | null
}
export default function DisplaySegmentation({doc} : DisplaySegmentationProps) {
  return (
    <div className='grow'>
      <h1>Image Segments</h1>
      {doc ?  <SegmentContainer data={doc} imgWidth={500}/> : <div>No documents has been selected</div>}
    </div>
  );
}