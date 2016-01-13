import {Analytics} from '../common/analytics';

export const NG2_LAB_TRACKING_CODE = 'UA-72311263-1';

export class Tracker extends Analytics {
	constructor() {
		super(NG2_LAB_TRACKING_CODE);
	}
}