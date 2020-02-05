const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

const webcamManipulator = {
  getVideo: () => {
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
  },
  paintToCanvas: () => {
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
      // Take the pixels out:
      let pixels = ctx.getImageData(0, 0, width, height);
      
      // Add an effect:
      
      // pixels = webcamManipulator.redEffect(pixels);
      
      // pixels = webcamManipulator.rgbSplit(pixels);
      // The previous pixels still display for an additional ten frames:
      // ctx.globalAlpha = .1; // .8 would have less of a ghosting effect.

      pixels = webcamManipulator.greenScreen(pixels);
      // Put the pixels back:
      ctx.putImageData(pixels, 0, 0);
    }, 16);
  },
  redEffect: (pixels) => {
    // Loop over every pixel passed in.
    // This is a special type of array that does not have .map and other methods.
    for(i = 0; i < pixels.data.length; i += 4) {
      // i incremented by 4 because each 4 values in the array represent r, g, b, and a, respectively. Manipulate each one:
      pixels.data[i] = pixels.data[i] + 100; // R
      pixels.data[i + 1] = pixels.data[i + 1] -50; // G
      pixels.data[i + 2] = pixels.data[i + 2] * .5; // B
    }
    // After changing all the values, return the results:
    return pixels;
  },
  rgbSplit: (pixels) => {
    // Loop over every pixel passed in.
    // This is a special type of array that does not have .map and other methods.
    for(i = 0; i < pixels.data.length; i += 4) {
      // i incremented by 4 because each 4 values in the array represent r, g, b, and a, respectively. Manipulate each one:
      pixels.data[i - 150] = pixels.data[i] + 100; // R
      pixels.data[i + 500] = pixels.data[i + 1] -50; // G
      pixels.data[i - 550] = pixels.data[i + 2] * .5; // B
    }
    // After changing all the values, return the results:
    return pixels;
  },
  greenScreen: (pixels) => {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });

    for (i = 0; i < pixels.data.length; i += 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];

      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }

    return pixels;
  },
  takePhoto: () => {
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
  },
  init: () => {
    // Run paintToCanvas() when the video emits 'canplay:
    video.addEventListener('canplay', webcamManipulator.paintToCanvas);

    document.querySelector('.shutter').addEventListener('click', webcamManipulator.takePhoto);

    webcamManipulator.getVideo();
  }
}

webcamManipulator.init();