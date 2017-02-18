import {AstronautsPage} from './astronauts.po';
import {ElementFinder} from 'protractor';


describe('Astronauts', () => {
	let astronautsPage: AstronautsPage;

	beforeEach(() => {
		astronautsPage = new AstronautsPage();
		astronautsPage.navigateTo();
	});

	describe('List', () => {
		it('should render each astronaut name on the page after a successful fetch', () => {
			expect(astronautsPage.list.count())
				.toBeGreaterThan(0);

			astronautsPage.list.each((item: ElementFinder) => {
				expect(item.getText())
					.toBeNonEmptyString();
			});
		});
	});
});
