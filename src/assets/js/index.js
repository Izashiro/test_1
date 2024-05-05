let isSupected = 0;
let canNotify = false;

function startTrack(LOOK_DELAY = 5000){
  window.saveDataAcrossSession = true;

  LEFT_CUTOFF = window.innerWidth * 0.1;
  RIGHT_CUTOFF = window.innerWidth - window.innerWidth * 0.1;
  TOP_CUTOFF = window.innerHeight * 0.1;
  BOTTOM_CUTOFF = window.innerHeight - window.innerHeight * 0.1;

  let startLookTime = Number.POSITIVE_INFINITY;

  webgazer.setGazeListener((data, timestamp) =>{
    if (data == null) {
      if(startLookTime == Number.POSITIVE_INFINITY)
        startLookTime = timestamp;
    }
    else if (!(data.x < LEFT_CUTOFF || data.x > RIGHT_CUTOFF || data.y < TOP_CUTOFF || data.y > BOTTOM_CUTOFF)){
      startLookTime = Number.POSITIVE_INFINITY;
    }
    else if (startLookTime == Number.POSITIVE_INFINITY) {
      startLookTime = timestamp;
    }

    if (startLookTime + LOOK_DELAY < timestamp && canNotify) {
      isSupected = 1;
      startLookTime = Number.POSITIVE_INFINITY;
    }

  }).begin()
}

function yesCanNotifity() {
  canNotify = true;
}

function suspectedStatus() {
  var status = isSupected;
  isSupected = 0;
  return status;
}

function isScreenWidthHeightOK(){
  var screenWidth = screen.width;
  var screenHeight = screen.height;
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  return (screenWidth == windowWidth && screenHeight*0.8 <= windowHeight);
}

function stopWebGazer(){
  webgazer.end();
}

// function startFaceRecognition() {
//   const video = document.getElementById('videoInput')

//   console.log("It's works, index");

//   Promise.all([
//       faceapi.nets.faceRecognitionNet.loadFromUri('../models'),
//       faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
//       faceapi.nets.ssdMobilenetv1.loadFromUri('../models') //heavier/accurate version of tiny face detector
//   ]).then(start)

//   function start() {
//       document.body.append('Models Loaded')

//       navigator.getUserMedia(
//           { video:{} },
//           stream => video.srcObject = stream,
//           err => console.error(err)
//       )

//       //video.src = '../videos/speech.mp4'
//       console.log('video added')
//       recognizeFaces()
//   }

//   async function recognizeFaces() {

//       const labeledDescriptors = await loadLabeledImages()
//       console.log(labeledDescriptors)
//       const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7)


//       video.addEventListener('play', async () => {
//           console.log('Playing')
//           const canvas = faceapi.createCanvasFromMedia(video)
//           document.body.append(canvas)

//           const displaySize = { width: video.width, height: video.height }
//           faceapi.matchDimensions(canvas, displaySize)



//           setInterval(async () => {
//               const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()

//               const resizedDetections = faceapi.resizeResults(detections, displaySize)

//               canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

//               const results = resizedDetections.map((d) => {
//                   return faceMatcher.findBestMatch(d.descriptor)
//               })
//               results.forEach( (result, i) => {
//                   const box = resizedDetections[i].detection.box
//                   const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
//                   drawBox.draw(canvas)
//               })
//           }, 100)



//       })
//   }


//   function loadLabeledImages() {
//       //const labels = ['Black Widow', 'Captain America', 'Hawkeye' , 'Jim Rhodes', 'Tony Stark', 'Thor', 'Captain Marvel']
//       const labels = ['Prashant Kumar'] // for WebCam
//       return Promise.all(
//           labels.map(async (label)=>{
//               const descriptions = []
//               for(let i=1; i<=2; i++) {
//                   const img = await faceapi.fetchImage(`../labeled_images/${label}/${i}.jpg`)
//                   const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
//                   console.log(label + i + JSON.stringify(detections))
//                   descriptions.push(detections.descriptor)
//               }
//               document.body.append(label+' Faces Loaded | ')
//               return new faceapi.LabeledFaceDescriptors(label, descriptions)
//           })
//       )
//   }

// }
