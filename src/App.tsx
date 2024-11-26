import SegmentFeature, { ImageSegments } from "./SegmentsFeautre";

const imageSegments = [
    {
        original_image_url: "https://hubforward-drive.fra1.cdn.digitaloceanspaces.com/GeminiSamples/derm-report-scaled-1.jpeg",
        segments: [
            {
                "bottom_right x": 1954,
                "bottom_right y": 2162,
                "segment image url": "https://gemini.vitalls.ai/static/processed_image_105_photomicrographofasymmetricneoplasm.png",
                title: "photomicrograph of asymmetric neoplasm",
                "upper_left x": 987,
                "upper_left y": 1261
            }
        ]
    },
    {
        original_image_url: "https://hubforward-drive.fra1.cdn.digitaloceanspaces.com/GeminiSamples/CT%20Brain%201.png",
        segments: [
            {
                "bottom_right x": 444,
                "bottom_right y": 771,
                "segment image url": "https://gemini.vitalls.ai/static/processed_image_102_brainmriseries.png",
                title: "brain mri series",
                "upper_left x": 166,
                "upper_left y": 604
            },
            {
                "bottom_right x": 393,
                "bottom_right y": 433,
                "segment image url": "https://gemini.vitalls.ai/static/processed_image_103_ctscanaxialsectionofbrainstemandcerebellarhemisphere.png",
                title: "ct scan axial section of brainstem and cerebellar hemisphere",
                "upper_left x": 248,
                "upper_left y": 308
            }
        ]
    },
    {
        original_image_url: "https://hubforward-drive.fra1.cdn.digitaloceanspaces.com/VitallsProdFolder/Vitalls/patient/decryptedMedicalRecords/1b52a879/1730893361_672b5631d04f30.53752244_1000088918.png",
        segments: [
            {
                "bottom_right x": 603,
                "bottom_right y": 738,
                "segment image url": "https://gemini.vitalls.ai/static/processed_image_104_axialctbrainscans.png",
                title: "axial ct brain scans",
                "upper_left x": 28,
                "upper_left y": 543
            }
        ]
    },
    {
        original_image_url: "https://hubforward-drive.fra1.cdn.digitaloceanspaces.com/GeminiSamples/ECG%20Template%202.png",
        segments: [
            {
                "bottom_right x": 377,
                "bottom_right y": 948,
                "segment image url": "https://gemini.vitalls.ai/static/processed_image_101_ecgqualityinterpretationandrhythm.png",
                title: "ecg quality interpretation and rhythm",
                "upper_left x": 33,
                "upper_left y": 352
            },
            {
                "bottom_right x": 714,
                "bottom_right y": 309,
                "segment image url": "https://gemini.vitalls.ai/static/processed_image_102_ecgexplanationandreferences.png",
                title: "ecg explanation and references",
                "upper_left x": 50,
                "upper_left y": 116
            },
            {
                "bottom_right x": 423,
                "bottom_right y": 945,
                "segment image url": "https://gemini.vitalls.ai/static/processed_image_103_ecginterpretationguide.png",
                title: "ecg interpretation guide",
                "upper_left x": 43,
                "upper_left y": 575
            },
            {
                "bottom_right x": 585,
                "bottom_right y": 610,
                "segment image url": "https://gemini.vitalls.ai/static/processed_image_104_ecgcalibrationandinterpretation.png",
                title: "ecg calibration and interpretation",
                "upper_left x": 111,
                "upper_left y": 352
            }
        ]
    }
]

function addIsDeletedAttribute(imageSegments: ImageSegments[]) : ImageSegments[]{
    return imageSegments.map(segment => {
        return {
            ...segment,
            segments: segment.segments.map(subSegment => ({
                ...subSegment,
                isDeleted: false
            }))
        };
    });
}

const updatedImageSegments = addIsDeletedAttribute(imageSegments);
console.log(updatedImageSegments)

export default function App() {
  return (
    <div className="bg-[#f4f4f4] min-h-[100vh] flex item-center justify-center">
<SegmentFeature imagesSegments={updatedImageSegments} />
    </div>
  );
}

