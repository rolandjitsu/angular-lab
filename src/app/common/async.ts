export class Defer<R> {
	promise: Promise<R>;
	resolve: (value?: R | PromiseLike<R>) => void;
	reject: (error?: any) => void;
	constructor() {
		let that: Defer<R> = this;
		this.promise = new Promise<R>((resolve, reject) => {
			that.resolve = resolve;
			that.reject = reject;
		});
	}
}