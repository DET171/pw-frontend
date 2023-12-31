'use client';
import { useEffect, useRef, useState } from 'react';
import Display from './Display';


export default function Home() {
	const [count, setCount] = useState(0);
	const [deviceId, setDeviceId] = useState('');
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
	const [fps, setFps] = useState(1);

	useEffect(() => {
		(async () => {
			await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
			const inputDevices = await navigator.mediaDevices.enumerateDevices();
			const videoDevices = inputDevices.filter(device => device.kind === 'videoinput');

			setDevices([
				{ deviceId: '', groupId: '', kind: 'videoinput', label: 'Select Camera' } as unknown as MediaDeviceInfo,
				...videoDevices,
			]);

			console.log(videoDevices);
			console.log(devices);
		})();
	}, []);

	return (
		<div className='grid grid-cols-3 h-full'>
			{deviceId && <Display className='col-span-2 mr-0 w-full' updateCount={setCount} deviceId={deviceId} fps={fps} />}
			<div className='grid grid-cols-1 gap-6 col-span-1 bg-gray-200 p-4'>
				<div>
					<h2 className='text-lg font-bold'>Current Count</h2>
					<p className='text-3xl font-bold'>{count}</p>
				</div>
				<div>
					<h2 className='text-lg font-bold'>Select Camera</h2>
					<select className='w-full' onChange={e => {
						console.log(e.target.value);
						setDeviceId(e.target.value);
					}}>
						{devices.map(device => (
							<option key={device.deviceId} value={device.deviceId}>{device.label}</option>
						))}
					</select>
				</div>
				<div>
					<h2 className='text-lg font-bold'>Set FPS</h2>
					<input type='number' value={fps} className='w-full' onChange={e => {
						console.log(e.target.value);
						setFps(parseInt(e.target.value));
					}} />
				</div>
			</div>
		</div>
	);
}