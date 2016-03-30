export class Defer<R> {
	promise: Promise<R>;
	resolve: (value?: R | PromiseLike<R>) => void;
	reject: (error?: any) => void;
	constructor() {
		this.promise = new Promise<R>((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}
}
