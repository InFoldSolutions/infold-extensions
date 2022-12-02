import { el } from 'redom';

import logger from '../utils/logger';
import CalendarIcon from './svgs/calendarIcon';
import LinkIcon from './svgs/linkIcon';

export default class Summary {

  el: HTMLElement

  constructor(title: string, description: string, icon: string, date: string, link: string, handle: string, keywords: Array<string>) {
    logger.log('Summary: constructor');

    this.el = el('.SCSummaryWrapper', [
      el('.SCSummaryImage',
        el('img', { src: icon })),
      el('.SCSummaryBody', [
        el('.SCSummaryTitle', title),
        el('.SCSummaryInfo', [
          el('span.SCHandle.SCMarginRight', handle),
          el('span.SCIcon', new CalendarIcon()),
          el('span.SCdate.SCMarginRight', date),
          el('span.SCIcon', new LinkIcon()),
          el('a.SClink', link, { href: link, target: '_blank' })
        ]),
        el('.SCSummaryContent', description),
        el('.SCKeywordsWrapper', keywords.map((keyword: string) => el('.SCKeyword', keyword)))
      ])
    ]);
  }
}