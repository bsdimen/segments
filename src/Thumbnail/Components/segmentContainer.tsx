import  { useRef , useState, useEffect} from 'react'
import SegmentUi from './segment'
import { Segment } from '../SegmentsFeautre'
import { useImageSegments } from '../../Context/ImageSegmentsContext'
import { ImageSegments } from '../SegmentsFeautre'

interface SegmentContainerProps {
  data: {
    original_image_url: string
    segments: Segment[]
  };
  imgWidth: number
}

export default function SegmentContainer({ data, imgWidth }: SegmentContainerProps) {
  const imgRef = useRef<HTMLImageElement | null>(null) 
  const [isImageLoaded, setIsImageLoaded] = useState(false)
   const [currentDoc, setCurrentDoc] = useState<ImageSegments>()

  const { segments, setSegments } = useImageSegments()


  const handleImageLoad = () => {
    setIsImageLoaded(true) 
  }

  const handleDeleteSegment = (url: string) => {
      const updatedSegments = segments.map(image => {
        const updatedImageSegments = image.segments.map(segment => {
          if (segment.segment_image_url === url) {
            return { ...segment, isDeleted: !segment.isDeleted }; // Toggle isDeleted
          }
          return segment;
        });

        return { ...image, segments: updatedImageSegments };
      });

  console.log(updatedSegments);
  setSegments(updatedSegments);
};


  const toggleDelete = (url: string) => {
      handleDeleteSegment(url)    
  }

  useEffect(() => {
    const foundDoc = segments.find((image) => image.original_image_url === data.original_image_url); // Replace with the correct url
    if (foundDoc) {
      setCurrentDoc(foundDoc); 
    }
  }, [segments,data]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); 

    return () => clearTimeout(timer); 
  }, [data,imgWidth]);

  return (
     <div style={{ position: 'relative', width: imgWidth }}>
        <>
        {currentDoc && (
            <>
              <img
                ref={imgRef}
                src={currentDoc.original_image_url}
                alt="Original Image"
                style={{ width: imgWidth, border: '1px solid #703bf7' }}
                onLoad={handleImageLoad}
              />

              {/* Render the segments */}
              {isImageLoaded && currentDoc.segments.map((segment) => (
                <SegmentUi
                  key={segment.segment_image_url}
                  imgWidth={imgWidth}
                  segment={segment}
                  imgRef={imgRef}
                  onDelete={() => toggleDelete(segment.segment_image_url)}
                />
              ))}
            </>
          )}
        </>
    </div>
   
  )
}



