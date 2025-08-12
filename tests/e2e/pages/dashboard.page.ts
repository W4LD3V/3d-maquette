import BasePage from './base.page';
class DashboardPage extends BasePage {
  get heading() { return $('h2=Welcome to your dashboard'); }
}
export default new DashboardPage();
