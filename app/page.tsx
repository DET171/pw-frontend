'use client';
import { useEffect, useRef, useState } from 'react';
import Display from './Display';


export default function Home() {
	const [panel1Value, setPanel1Value] = useState(0);
	const [panel2Value, setPanel2Value] = useState(0);
	const [panel3Value, setPanel3Value] = useState(0);

	return (
		<div className='grid grid-cols-4 h-full'>
			<Display className='col-span-3 mr-0' />
			<div className='grid grid-cols-1 gap-6 col-span-1 bg-gray-200 p-4'>
				<div>
					<h2 className='text-lg font-bold'>Current Count</h2>
					<p className='text-3xl font-bold'>{panel1Value}</p>
				</div>
				<div>
					<h2 className='text-lg font-bold'>Panel 2</h2>
					<p className='text-3xl font-bold'>{panel2Value}</p>
					<button
						className='px-4 py-2 mt-4 text-white bg-blue-500 rounded-md'
						onClick={() => setPanel2Value(panel2Value + 1)}
					>
						Increment
					</button>
				</div>
				<div>
					<h2 className='text-lg font-bold'>Panel 3</h2>
					<p className='text-3xl font-bold'>{panel3Value}</p>
					<button
						className='px-4 py-2 mt-4 text-white bg-blue-500 rounded-md'
						onClick={() => setPanel3Value(panel3Value + 1)}
					>
						Increment
					</button>
				</div>
			</div>
		</div>
	);
}