import { ReacommodaterPage } from './app.po';

describe('reacommodater App', () => {
  let page: ReacommodaterPage;

  beforeEach(() => {
    page = new ReacommodaterPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
