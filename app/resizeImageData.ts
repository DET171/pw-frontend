export default function resizeImageDataTo224x224(imageData: ImageData) {
	const originalWidth = imageData.width;
	const originalHeight = imageData.height;
	const targetSize = 224;

	let newWidth: number, newHeight: number;

	if (originalWidth > originalHeight) {
		newWidth = targetSize;
		newHeight = Math.floor((originalHeight / originalWidth) * targetSize);
	}
	else {
		newHeight = targetSize;
		newWidth = Math.floor((originalWidth / originalHeight) * targetSize);
	}

	const canvas = document.createElement('canvas');
	canvas.width = targetSize;
	canvas.height = targetSize;
	const ctx = canvas.getContext('2d');

	// Fill with black
	ctx!.fillStyle = 'black';
	ctx!.fillRect(0, 0, canvas.width, canvas.height);

	const x = Math.floor((targetSize - newWidth) / 2);
	const y = Math.floor((targetSize - newHeight) / 2);

	const tempCanvas = document.createElement('canvas');
	tempCanvas.width = originalWidth;
	tempCanvas.height = originalHeight;
	const tempCtx = tempCanvas.getContext('2d');
	tempCtx!.putImageData(imageData, 0, 0);

	ctx!.drawImage(tempCanvas, x, y, newWidth, newHeight);

	return ctx!.getImageData(0, 0, targetSize, targetSize);
}
