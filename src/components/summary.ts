import { el } from 'redom';

import logger from '../utils/logger';
import SummaryBody from './summaryBody';

interface ISummary {
  title: string, 
  description: string, 
  icon: string, 
  date: string, 
  link: string, 
  handle: string, 
  keywords: Array<string>
}

export default class Summary {

  el: HTMLElement

  constructor(summary: ISummary) {
    logger.log('Summary: constructor');

    this.el = el('.SCSummaryWrapper', [
      el('.SCSummaryImage',
        el('img', { src: summary.icon })),
      new SummaryBody({
        title: summary.title, 
        description: summary.description, 
        date: summary.date, 
        link: summary.link, 
        handle: summary.handle, 
        keywords: summary.keywords
      })
    ]);
  }
}