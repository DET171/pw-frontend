import * as ort from 'onnxruntime-web';
import * as Jimp from 'jimp';


export default async function processFrame(
	frame: ImageData,
	width: number,
	height: number,
) {
	const tensor = await ort.Tensor.fromImage(frame, { resizedWidth: 224, resizedHeight: 224 });

	const session = await ort.InferenceSession.create(
		'/models/model.onnx',
		{
			executionProviders: ['webgl'],
			graphOptimizationLevel: 'all',
		},
	);

	const dummyTensor = new ort.Tensor(
		'float32',
		new Float32Array(3 * 224 * 224),
		[1, 3, 224, 224],
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
