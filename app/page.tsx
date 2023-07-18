'use client';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	// display webcam in canvas
	useEffect(() => {
		(async () => {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					frameRate: {
						exact: 10,
					},
				},
			});

			// display the video in the canvas
			const canvas = canvasRef.current;
			if (!canvas) return;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			const video = document.createElement('video');
			video.srcObject = stream;
			video.play();
			setInterval(() => {
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

				const imageData = ctx.getImageData(
					0,
					0,
					canvas.width,
					canvas.height,
				);

				// unint8 array
				// data is unint8clampedarray
				const data = imageData.data;
				console.log(data);
			}, 1000);
		})();
	}, []);

	return (
		<div className='w-full h-96'>
			<canvas className='h-full' id='canvas' ref={canvasRef}></canvas>
		</div>
	);
}
