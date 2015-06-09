import { ChangeDetection, JitChangeDetection } from 'angular2/change_detection';
import { bind } from 'angular2/di';

export var jitInjectables: Array<any> = [
	bind(ChangeDetection).toClass(JitChangeDetection)
];