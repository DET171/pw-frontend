'use client';
import { useEffect, useRef, useState } from 'react';
import Display from './Display';


export default function Home() {
	const [count, setCount] = useState(0);
	const [deviceId, setDeviceId] = useState('');
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

	useEffect(() => {
		(async () => {
			await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
			const inputDevices = await navigator.mediaDevices.enumerateDevices();
			const videoDevices = inputDevices.filter(device => device.kind === 'videoinput');

			setDevices(videoDevices);
			setDeviceId(videoDevices[0].deviceId);

			console.log(devices);
		})();
	}, []);

	return (
		<div className='grid grid-cols-3 h-full'>
			{deviceId && <Display className='col-span-2 mr-0' updateCount={setCount} deviceId={deviceId} />}
			<div className='grid grid-cols-1 gap-6 col-span-1 bg-gray-200 p-4'>
				<div>
					<h2 className='text-lg font-bold'>Current Count</h2>
					<p className='text-3xl font-bold'>{count}</p>
				</div>
				<div>
					<h2 className='text-lg font-bold'>Select Camera</h2>
					<select className='w-full' onChange={e => setDeviceId(e.target.value)}>
						{devices.map(device => (
							<option key={device.deviceId} value={device.deviceId}>{device.label}</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}