console.log('start add food script');

function hasGetUserMedia() {
  // Note: Opera builds are unprefixed.
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
	};

if (hasGetUserMedia()) {
  console.log('getUserMedia() is OK supported in your browser');
} else {
  console.log('getUserMedia() is not supported in your browser');
};

console.log('finish addFood.js script');
