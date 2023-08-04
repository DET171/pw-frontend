import * as ort from 'onnxruntime-web';


export default async function processFrame(
	frame: ImageData,
	width: number,
	height: number,
) {
	// resize frame to 224x224
	const canvas = document.createElement('canvas');
	canvas.width = 224;
	canvas.height = 224;
	const ctx = canvas.getContext('2d');
	ctx?.putImageData(frame, 0, 0);
	frame = ctx?.getImageData(0, 0, 224, 224);


	const tensor = await ort.Tensor.fromImage(frame);
	console.log(tensor.size);
	console.log(tensor);

	const session = await ort.InferenceSession.create(
		'/models/model.onnx',
		{
			executionProviders: ['webgl'],
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


	return frame;
}
