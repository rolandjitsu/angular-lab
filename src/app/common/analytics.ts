export class Analytics {
	constructor(trackingCode: string) {
		(<any>window).ga(() => {
			let trackers = (<any>window).ga.getAll();
			if (!trackers.length) {
				this.create(trackingCode, 'auto');
			}
		});
	}
	execute(command: string, args: any[]) {
		args.unshift(command);
		(<any>window).ga.apply((<any>window).ga, args);
	}
	create(...args) {
		this.execute('create', args);
	}
	send(...args) {
		this.execute('send', args);
	}
}