
import { ImageSegments } from '../../SegmentsFeautre';
import SegmentContainer from './components/segmentContainer';

interface DisplaySegmentationProps {
  doc: ImageSegments | null
}
export default function DisplaySegmentation({doc} : DisplaySegmentationProps) {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center'>
      <h1 className='text-2xl font-bold mb-3 text-left w-full'>Image Segments</h1>
      {doc ?  <SegmentContainer data={doc} imgWidth={500}/> : <div className='h-full w-full flex items-center justify-center text-[#703bf7] '>No documents has been selected</div>}
    </div>
  );
}