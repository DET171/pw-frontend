import * as ort from 'onnxruntime-web';
import { resizeImageData } from './resizeImageData';

export default async function processFrame(
	frame: ImageData,
	width: number,
	height: number,
) {
	// resize frame to 224x224
	if (width * height !== 50176) frame = await resizeImageData(frame, 224 * (8 / 7), 224 / (8 / 7));


	const tensor = await ort.Tensor.fromImage(frame);

	const session = await ort.InferenceSession.create(
		'/models/model.onnx',
		{
			executionProviders: ['wasm'],
			graphOptimizationLevel: 'all',
		},
	);


	const input = new ort.Tensor(
		'float32',
		tensor.data,
		[1, 3, 224, 224],
	);

	const feeds = {
		'input.1': input,
	};
	const output = await session.run(feeds);
	// this 1, 1, 224, 224

	const arr = Array.from(output['75'].data);

	// find the mean of the array
	const sum = arr.reduce((a, b) => a + b, 0);

	console.log(sum);

	return {
		frame,
		count: sum,
	};
}
