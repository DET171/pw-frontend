'use client';
import { useEffect, useRef, useState } from 'react';
// Import @tensorflow/tfjs-core
import processFrame from './processFrame';

export default function Home(props: any) {
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
					width: 1366,
					height: 768,
				},
			});

			// display the video in the canvas
			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			const resultCanvas = resultCanvasRef.current;
			if (!resultCanvas) return;
			const resultCtx = resultCanvas.getContext('2d');
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

				// process the frame
				const processedFrame = await processFrame(imageData, canvas.width, canvas.height);

				// put the processed frame back into the canvas

				resultCtx.putImageData(processedFrame, 0, 0);
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
