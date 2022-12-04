import { el } from 'redom';

import logger from '../utils/logger';
import CalendarIcon from './svgs/calendarIcon';
import LinkIcon from './svgs/linkIcon';

interface ISummaryBody {
  title: string,
  description: string,
  date: string,
  link: string,
  handle: string,
  icon?: string,
  keywords?: Array<string>
}

export default class SummaryBody {

  el: HTMLElement
  summaryInfo: Array<HTMLElement>

  constructor(summaryBody: ISummaryBody) {
    logger.log('SummaryBody: constructor');

    this.summaryInfo = [
      el('span.SCHandle.SCMarginRight', summaryBody.handle),
      el('span.SCIcon', new CalendarIcon()),
      el('span.SCdate.SCMarginRight', summaryBody.date),
      el('span.SCIcon', new LinkIcon()),
      el('a.SClink', summaryBody.link, { href: summaryBody.link, target: '_blank' })
    ]

    /*if (summaryBody.icon)
      this.summaryInfo.unshift(el('img', { src: summaryBody.icon }));*/

    this.el =
      el('.SCSummaryBody', [
        el('.SCSummaryTitle', summaryBody.title),
        el('.SCSummaryInfo', this.summaryInfo),
        el('.SCSummaryContent', summaryBody.description),
        el('.SCKeywordsWrapper', (summaryBody.keywords) ? summaryBody.keywords.map((keyword: string) => el('.SCKeyword', keyword)) : [])
      ])
  }
}