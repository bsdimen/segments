import React, { useRef , useState, useEffect} from 'react'
import SegmentUi from './segment'
import { Segment } from '../../../SegmentsFeautre'
import { useImageSegments } from '../../../Context/ImageSegmentsContext'
import { ImageSegments } from '../../../SegmentsFeautre'

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


  // Handle image load event
  const handleImageLoad = () => {
    setIsImageLoaded(true) // Set state once image is fully loaded
  };
const handleDeleteSegment = (url: string) => {

  const newSegments = segments.map(image => {

    const updatedSegments = segments.map(image => {
      const updatedImageSegments = image.segments.map(segment => {
        if (segment["segment image url"] === url) {
          return { ...segment, isDeleted: !segment.isDeleted } // Toggle isDeleted
        }
        return segment
      })

      return { ...image, segments: updatedImageSegments }
    })
    console.log(updatedSegments)

    setSegments(updatedSegments)
  
  })}

   const toggleDelete = (url: string) => {
      handleDeleteSegment(url)    
  }
  useEffect(() => {
    const foundDoc = segments.find((image) => image.original_image_url === data.original_image_url); // Replace with the correct url
    if (foundDoc) {
      setCurrentDoc(foundDoc); // Store the found ImageSegments object in state
    }
  }, [segments,data]);

  return (
    <div style={{position:"relative", width: imgWidth}}>
         {currentDoc && (
    <>
      {/* Render the image */}
      <img
        ref={imgRef}
        src={currentDoc.original_image_url}
        alt="Original Image"
        style={{ width: imgWidth }}
        onLoad={handleImageLoad}
      />

      {/* Render the segments */}
      {currentDoc.segments.map((segment) => (
        <SegmentUi
          key={segment['segment image url']}
          imgWidth={imgWidth}
          segment={segment}
          imgRef={imgRef}
          onDelete={() => toggleDelete(segment["segment image url"])}
        />
      ))}
    </>
  )}
    </div>
  );
}



