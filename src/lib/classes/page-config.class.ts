export class PageConfig {
  fullPage?: boolean;
  orientation?: string;
  title?: string;
  margin?: { top?: string, right?: string, bottom?: string, left?: string };

  constructor() {
    this.fullPage = false;
    this.orientation = 'portrait';
    this.title = '';
    this.margin = { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm'};
  }
}
