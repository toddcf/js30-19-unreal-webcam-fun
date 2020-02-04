const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  // Get user's webcam feed:
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
      // Convert from an object to a URL:
      video.srcObject = localMediaStream;
      // Update the feed continuously:
      video.play();
    })
    .catch(err => {
      console.error(`D'oh!`, err);
    });
}

function paintToCanvas() {
  // Set canvas to same size as video:
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  // Every 16ms, take an image from the video and put it in the canvas:
  return setInterval(() => {
    // Pass the video element into drawImage(), starting at top (0) left (0) and going as far as the width and height values:
    ctx.drawImage(video, 0, 0, width, height);

    // Filter Effects:
    let pixels = ctx.getImageData(0, 0, width, height);
    pixels = redEffect(pixels);
  }, 16);
}

function redEffect(pixels) {
  // Loop over every pixel passed in.
  // This is a special type of array that does not have .map and other methods.
  for(i = 0; i < pixels.length; i += 4) {
    // i incremented by 4 because each 4 values in the array represent r, g, b, and a, respectively. Manipulate each one:
    // RESUME 22:00
    pixels[i]; // R
    pixels[i + 1]; // G
    pixels[i + 2]; // B
    pixels[i + 3]; // A
  }
}

function takePhoto() {
  // Audio Effects:
  snap.currentTime = 0;
  snap.play();

  // Get the data from the canvas:
  const data = canvas.toDataURL('image/jpg');
  // Add it to the script:
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'determined');
  link.innerHTML = `<img src='${data}' alt='Something'>`;
  strip.insertBefore(link, strip.firstChild);
}

// Run paintToCanvas() when the video emits 'canplay:
video.addEventListener('canplay', paintToCanvas);

document.querySelector('.shutter').addEventListener('click', takePhoto);

getVideo();