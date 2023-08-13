'use client';
import { useEffect, useRef, useState } from 'react';
// Import @tensorflow/tfjs-core
import processFrame from './processFrame';

export default function Home({
	updateCount,
	...props
}: {
	updateCount: (count: number) => void;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const resultCanvasRef = useRef<HTMLCanvasElement>(null);
	// display webcam in canvas
	useEffect(() => {
		(async () => {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					frameRate: {
						exact: 10,
					},
					width: {
						exact: 256 * 3,
					},
					height: {
						exact: 196 * 3,
					},
				},
			});

			// display the video in the canvas
			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext('2d', {
				willReadFrequently: true,
			});
			if (!ctx) return;
			const resultCanvas = resultCanvasRef.current;
			if (!resultCanvas) return;
			const resultCtx = resultCanvas.getContext('2d', {
				willReadFrequently: true,
			});
			if (!resultCtx) return;
			const video = document.createElement('video');
			video.srcObject = stream;
			video.play();
			setInterval(async () => {
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

				const imageData = ctx.getImageData(
					0,
					0,
					canvas.width,
					canvas.height,
				);

				// unint8 array
				// data is unint8clampedarray
				const dataURL = canvas.toDataURL('image/png');

				// process the frame
				const processedFrame = await processFrame(dataURL, canvas.width, canvas.height);

				// put the processed frame back into the canvas
				// const img = new Image();
				// img.src = processedFrame.frame;
				// img.onload = () => {
				// 	resultCtx.drawImage(img, 0, 0);
				// };
				const processedImageData = new ImageData(
					new Uint8ClampedArray(processedFrame.reiszedImg),
					224,
					224,
				);
				resultCtx.putImageData(processedImageData, 0, 0);

				updateCount(((processedFrame.count as unknown as number).toFixed(0)) as unknown as number);
			}, 1000);
		})();
	}, []);

	return (
		<div {...props}>
			<canvas className='w-full hidden' id='canvas' ref={canvasRef}></canvas>
			<canvas className='w-full' id='resultCanvas' ref={resultCanvasRef}></canvas>
		</div>
	);
}
