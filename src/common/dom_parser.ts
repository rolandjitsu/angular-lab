import { Response } from 'angular2/src/http/static_response';

export class HttpResponseParser {

	/**
	 * Use this method to parse the body of a HTTP response to a HTMLDocument and return the parsed value's document element.
	 *
	 * @param {Response} response
	 * @returns {Node}
	 */

	static svg(response: Response): Node {
		return parseResponseAs(response, 'image/svg+xml');
	}
}

function parseResponseAs(response: Response, mimeType: string): Node {
	let parser: DOMParser = new DOMParser();
	let doc: Document = parser.parseFromString(
		response.text(),
		mimeType
	);
	var svg = doc.querySelector('svg');
	return svg.cloneNode(true);
}