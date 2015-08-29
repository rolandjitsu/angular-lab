interface ObjectConstructor {
	observe(target: any, callback: Function, acceptList?: Array<any>): void;
	assign(target: any, ...sources: any[]): any
}