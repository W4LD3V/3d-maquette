import BasePage from './base.page';

class LoginPage extends BasePage {
  get email() { return $('[data-testid="email"]'); }
  get password() { return $('[data-testid="password"]'); }
  get submit() { return $('[data-testid="submit-auth"]'); }
  get toggle() { return $('[data-testid="toggle-auth"]'); }

  async registerMode() {
    await this.toggle.click();
  }
}
export default new LoginPage();
