import { ComponentAnnotation as Component, ViewAnnotation as View } from 'angular2/angular2';

@Component({
	selector: 'tasks'
})

@View({
	templateUrl: 'components/tasks/tasks.html',
	directives: []
})

export class Tasks {
	constructor() {}
}