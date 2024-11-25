import React, { useRef , useState} from 'react'
import SegmentUi from './segment'
import { Segment } from '../../../SegmentsFeautre'
import { useImageSegments } from '../../../Context/ImageSegmentsContext'

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

  return (
    <div style={{position:"relative", width: imgWidth}}>
      <img ref={imgRef} src={data.original_image_url} alt="Original Image" style={{ width: imgWidth }} onLoad={handleImageLoad}/>
        {data.segments.map((segment, index) => (
        <SegmentUi
          key={index}
          imgWidth={imgWidth} 
          segment= {segment}
          imgRef={imgRef} 
          onDelete={() => toggleDelete(segment["segment image url"])}
        />
      ))}
    </div>
  );
}



