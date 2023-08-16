// export default function resizeImageDataTo224x224(imageData: ImageData) {
// 	const originalWidth = imageData.width;
// 	const originalHeight = imageData.height;
// 	const targetSize = 224;

// 	let newWidth: number, newHeight: number;

// 	if (originalWidth > originalHeight) {
// 		newWidth = targetSize;
// 		newHeight = Math.floor((originalHeight / originalWidth) * targetSize);
// 	}
// 	else {
// 		newHeight = targetSize;
// 		newWidth = Math.floor((originalWidth / originalHeight) * targetSize);
// 	}

// 	const canvas = document.createElement('canvas');
// 	canvas.width = targetSize;
// 	canvas.height = targetSize;
// 	const ctx = canvas.getContext('2d');

// 	// Fill with black
// 	ctx!.fillStyle = 'black';
// 	ctx!.fillRect(0, 0, canvas.width, canvas.height);

// 	const x = Math.floor((targetSize - newWidth) / 2);
// 	const y = Math.floor((targetSize - newHeight) / 2);

// 	const tempCanvas = document.createElement('canvas');
// 	tempCanvas.width = originalWidth;
// 	tempCanvas.height = originalHeight;
// 	const tempCtx = tempCanvas.getContext('2d');
// 	tempCtx!.putImageData(imageData, 0, 0);

// 	ctx!.drawImage(tempCanvas, x, y, newWidth, newHeight);

// 	return ctx!.getImageData(0, 0, targetSize, targetSize);
// }
// export default function resizeImageDataTo224x224(imageData: ImageData) {
// 	var canvas = document.createElement('canvas');
// 	var ctx = canvas.getContext('2d');

// 	// Set the canvas dimensions to the new width and height
// 	canvas.width = 224;
// 	canvas.height = 224;

// 	// Draw the original ImageData onto the canvas with the new dimensions
// 	ctx?.putImageData(imageData, 0, 0);

// 	// Get the resized ImageData from the canvas
// 	var resizedImageData = ctx!.getImageData(0, 0, 224, 224);

// 	return resizedImageData;
// }

// write a function called resizeImageDataToMultiplesOf16 that takes an ImageData object and returns a new ImageData object that is the same as the original but with the width and height rounded down to the nearest multiple of 16.
// export default function resizeImageDataToMultiplesOf16(imageData: ImageData) {
// 	const width = imageData.width & ~15;
// 	const height = imageData.height & ~15;
// 	const canvas = document.createElement('canvas');
// 	canvas.width = width;
// 	canvas.height = height;
// 	const ctx = canvas.getContext('2d');
//   ctx!.putImageData(imageData, 0, 0);
//   const resizedImageData = ctx!.getImageData(0, 0, width, height);
//   return resizedImageData;
// }

export default function resizeImageDataTo224x224(imageData: ImageData) {
	const canvas = document.createElement('canvas');
	canvas.width = 224;
	canvas.height = 224;
	const ctx = canvas.getContext('2d');
  ctx!.imageSmoothingQuality = 'high';
  ctx!.imageSmoothingEnabled = true;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx!.putImageData(imageData, 0, 0);
  const x = Math.floor((canvas.width - imageData.width) / 2);
  const y = Math.floor((canvas.height - imageData.height) / 2);
  ctx!.drawImage(tempCanvas, x, y);
  return ctx!.getImageData(0, 0, canvas.width, canvas.height);
}