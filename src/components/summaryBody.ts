import { el } from 'redom';

import logger from '../utils/logger';
import CalendarIcon from './svgs/calendarIcon';
import LinkIcon from './svgs/linkIcon';

interface IKeyword {
  icon: string,
  word: string
}
interface ISummaryBody {
  title: string,
  description: string,
  date: string,
  link: string,
  handle: string,
  icon?: string,
  keywords?: Array<IKeyword>
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

    let keywords: Array<HTMLElement>;

    if (summaryBody.keywords) {
      keywords = summaryBody.keywords.map((keyword: IKeyword) => {
        return el('.SCKeyword', [el(`i.${keyword.icon}`), keyword.word])
      });
    }

    this.el =
      el('.SCSummaryBody', [
        el('.SCSummaryTitle', summaryBody.title),
        el('.SCSummaryInfo', this.summaryInfo),
        el('.SCSummaryContent', summaryBody.description),
        el('.SCKeywordsWrapper', keywords)
      ])
  }
}