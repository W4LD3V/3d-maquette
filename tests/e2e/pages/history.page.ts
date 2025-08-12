import BasePage from './base.page';
class HistoryPage extends BasePage {
  get table() { return $('[data-testid="history-table"]'); }
  get rows() { return $$('[data-testid="history-table"] tbody tr'); }
  deleteButtonById(id: string) { return $(`[data-testid="delete-${id}"]`); }
}
export default new HistoryPage();
