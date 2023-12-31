'use client';
import { useEffect, useRef, useState } from 'react';
// Import @tensorflow/tfjs-core
import processFrame from './processFrame';

export default function Home({
	updateCount,
	deviceId,
	fps,
	...props
}: {
	updateCount: (count: number) => void;
	fps: number;
	deviceId: string;
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const resultCanvasRef = useRef<HTMLCanvasElement>(null);
	// display webcam in canvas
	useEffect(() => {
		(async () => {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					deviceId: {
						exact: deviceId,
					},
					frameRate: {
						ideal: 60,
					},
					width: {
						ideal: 1920,
					},
					height: {
						ideal: 1080,
					},
				},
			});

			// display the video in the canvas
			const canvas = canvasRef.current;
			if (!canvas) return;
			// canvas.height = 1920;
			// canvas.width = 1080;
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
			video.width = canvas.width;
			video.height = canvas.height;
			video.srcObject = stream;
			video.play();
			setInterval(async () => {
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
				console.log(canvas.height, canvas.width);

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
				const processedFrame = await processFrame(dataURL, canvas.width, canvas.height, imageData);

				// put the processed frame back into the canvas
				// const img = new Image();
				// img.src = processedFrame.frame;
				// img.onload = () => {
				// 	resultCtx.drawImage(img, 0, 0);
				// };

				console.log('processed frame');
				console.log(processedFrame);
				resultCtx.putImageData(processedFrame.resizedImage, 0, 0);
				// resultCtx.drawImage(processedFrame.reiszedImg, 0, 0);

				updateCount(((processedFrame.count as unknown as number).toFixed(0)) as unknown as number);
			}, 1000 / fps);
		})();
	}, []);

	return (
		<div {...props}>
			<canvas className='w-full h-full hidden' id='canvas' ref={canvasRef}></canvas>
			<canvas className='w-full h-full' id='resultCanvas' ref={resultCanvasRef}></canvas>
		</div>
	);
}
