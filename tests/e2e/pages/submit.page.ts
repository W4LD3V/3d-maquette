import BasePage from './base.page';
class SubmitPage extends BasePage {
  get fileUrl() { return $('[data-testid="file-url"]'); }
  get plastic() { return $('[data-testid="plastic-select"]'); }
  get color() { return $('[data-testid="color-select"]'); }
  get submit() { return $('[data-testid="submit-btn"]'); }
}
export default new SubmitPage();
