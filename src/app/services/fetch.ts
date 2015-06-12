import { HTTPDOMParser } from 'common/dom_parser';

export function status (response: Response): any {
	if (response.status >= 200 && response.status < 300) return response;
	throw new Error(response.statusText)
}

export function svg (response: Response): Promise<HTMLElement> {
	return HTTPDOMParser.parse(response);
}