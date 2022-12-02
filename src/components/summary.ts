import { el } from 'redom';

import logger from '../utils/logger';

export default class Summary {
  el: HTMLElement

  constructor(title: string, description: string, icon: string, date: string, link: string) {
    logger.log('Summary: constructor');

    this.el = el('.SCSummaryWrapper', [
      el('.SCSummaryImage',
        el('img', { src: icon })),
      el('.SCSummaryBody', [
        el('.SCSummaryTitle', title),
        el('.SCSummaryInfo', [el('span.SCdate', date), el('a.SClink', link)]),
        el('.SCSummaryContent', description)
      ])
    ]);
  }
}