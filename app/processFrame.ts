import init, { Session, Input } from '@webonnx/wonnx-wasm';
import Jimp from 'jimp/es';

export default async function processFrame(
	frame: ImageData,
	width: number,
	height: number,
) {
	// make a canvas with frame
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');
	ctx!.putImageData(frame, 0, 0);
	const url = canvas.toDataURL();

	// resize the image
	const dims = [
		1,
		3,
		224,
		224,
	];

	const image = await Jimp.read(frame).then((image) => {
		return image.resize(224, 224);
	});

	var imageBufferData = image.bitmap.data;
	const [redArray, greenArray, blueArray] = new Array(new Array<number>(), new Array<number>(), new Array<number>());

	// 2. Loop through the image buffer and extract the R, G, and B channels
	for (let i = 0; i < imageBufferData.length; i += 4) {
		redArray.push(imageBufferData[i]);
		greenArray.push(imageBufferData[i + 1]);
		blueArray.push(imageBufferData[i + 2]);
		// skip data[i + 3] to filter out the alpha channel
	}

	// 3. Concatenate RGB to transpose [224, 224, 3] -> [3, 224, 224] to a number array
	const transposedData = redArray.concat(greenArray).concat(blueArray);

	// 4. convert to float32
	let i, l = transposedData.length; // length, we need this for the loop
	// create the Float32Array size 3 * 224 * 224 for these dimensions output
	const float32Data = new Float32Array(dims[1] * dims[2] * dims[3]);
	for (i = 0; i < l; i++) {
		float32Data[i] = transposedData[i] / 255.0; // convert to float
	}

	await init();
	const model = await fetchBytes('/models/model.onnx');

	try {
		const session = await Session.fromBytes(model);
		const input = new Input();
		input.insert('input.1', float32Data);

		const result = await session.run(input);
		console.log(result);
		input.free();
		// i have no clue how to continue from here
		// heres some docs
		// https://www.npmjs.com/package/@webonnx/wonnx-wasm
	}
	catch (err) {
		console.log(err);
	}

	return frame;
}

async function fetchBytes(url: string) {
	const reply = await fetch(url);
	const blob = await reply.arrayBuffer();
	const arr = new Uint8Array(blob);
	return arr;
}


// export default async function processFrame(
// 	frame: ImageData,
// 	width: number,
// 	height: number,
// ) {
// 	// resize frame to 224x224
// 	if (width * height !== 50176) frame = await resizeImageData(frame, 224 * (8 / 7), 224 / (8 / 7));


// 	const tensor = await ort.Tensor.fromImage(frame);

// 	const session = await ort.InferenceSession.create(
// 		'/models/model.onnx',
// 		{
// 			executionProviders: ['webgl'],
// 			graphOptimizationLevel: 'all',
// 		},
// 	);


// 	const input = new ort.Tensor(
// 		'float32',
// 		tensor.data,
// 		[1, 3, 224, 224],
// 	);

// 	const feeds = {
// 		'input.1': input,
// 	};
// 	const output = await session.run(feeds);
// 	// this 1, 1, 224, 224

// 	const arr = Array.from(output['75'].data);

// 	// find the mean of the array
// 	const sum = arr.reduce((a, b) => a + b, 0);

// 	console.log(sum);

// 	return {
// 		frame,
// 		count: sum,
// 	};
// }
