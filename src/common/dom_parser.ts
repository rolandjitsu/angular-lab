export class DOMParserMIMEType {
	static isParsable(type: any): boolean {
		return type === this.html || type === this.xml || type === this.svg; 
	}
	static html: string = 'text/html';
	static xml: string = 'text/xml';
	static svg: string = 'image/svg+xml';
}


/**
 * Naive implementation of a [DOMParser]@{https://developer.mozilla.org/en-US/docs/Web/API/DOMParser}.
 */

export class HTTPDOMParser {
	
	/**
	 * Use this method to parse the body of a [fetch]@{https://github.com/github/fetch} response to a HTMLDocument and return a HTMLElement.
	 * 
	 * @param {Response} response
	 * @returns {HTMLElement}
	 */
	
	static parse(response: Response): Promise<HTMLElement> {
		let parser: DOMParser = new DOMParser();
		let mimeType: string = response.headers.get('Content-Type');
		if (!DOMParserMIMEType.isParsable(mimeType)) return Promise.reject(
			new Error('HTTPDOMParser MIME type cannot pe parsed')
		);
		return response
			.text()
			.then(body => {
				let doc: Document = parser.parseFromString(
					body,
					mimeType
				);
				if (doc.documentElement.nodeName === "parsererror") return Promise.reject(
					new Error('HTTPDOMParser cannot parse the response body')
				);
				else return doc.documentElement;	
			});
	}
}