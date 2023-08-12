'use client';
import { useEffect, useRef, useState } from 'react';
import Display from './Display';


export default function Home() {
	const [count, setCount] = useState(0);

	return (
		<div className='grid grid-cols-3 h-full'>
			<Display className='col-span-2 mr-0' updateCount={setCount} />
			<div className='grid grid-cols-1 gap-6 col-span-1 bg-gray-200 p-4'>
				<div>
					<h2 className='text-lg font-bold'>Current Count</h2>
					<p className='text-3xl font-bold'>{count}</p>
				</div>
			</div>
		</div>
	);
}