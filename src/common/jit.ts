import { ChangeDetection, JitChangeDetection } from 'angular2/angular2';
import { bind } from 'angular2/angular2';

export var jitInjectables: Array<any> = [
	bind(ChangeDetection).toClass(JitChangeDetection)
];