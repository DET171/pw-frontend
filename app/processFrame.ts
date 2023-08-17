import * as ort from 'onnxruntime-web';
import Jimp from 'jimp/es';
import resizeImageDataToMultiplesOf16 from './resizeImageData';

export default async function processFrame(
	url: string /* the data url */,
	width: number,
	height: number,
	imageData: ImageData,
) {
	const dims = [
		1,
		3,
		224,
		224,
	];

	// eslint-disable-next-line no-shadow
	const image = await Jimp.read(url).then((image: Jimp) => {
		return image.resize(224, 224, Jimp.RESIZE_BILINEAR);
	});

	console.log(image);

	var imageBufferData = image.bitmap.data;
	console.log(imageBufferData);
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


	const session = await ort.InferenceSession.create(
		'/models/model.onnx',
		{
			executionProviders: ['wasm'],
			graphOptimizationLevel: 'all',
		},
	);

	const resizedImage = resizeImageDataToMultiplesOf16(imageData);

	const tensor = await ort.Tensor.fromImage(resizedImage);
	console.log(tensor);

	const input = new ort.Tensor(
		'float32',
		tensor.data,
		// float32Data,
		[1, 3, 224, 224],
	);

	const feeds = {
		'input.1': input,
	};
	const output = await session.run(feeds);
	// this 1, 1, 224, 224
	console.log('stringified version below');
	console.log(JSON.stringify(output, null, 2));

	const arr = Array.from(output['75'].data);
	// convert arr (Float32Array) to ImageData


	// find the mean of the array
	const sum = arr.reduce((a, b) => a + b, 0);

	console.log(sum);

	return {
		url,
		count: sum,
		data: output['75'].data as Float32Array,
		resizedImage: resizedImage,
		// resizedImage: new ImageData(
		// 	new Uint8ClampedArray(image.bitmap.data),
		// 	224,
		// 	224,
		// ),
	};
}
