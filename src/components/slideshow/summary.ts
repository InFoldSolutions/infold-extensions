import { el } from 'redom';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

import { ISummaryBody, IKeyword } from '../../types';

import logger from '../../utils/logger';
import CalendarIcon from '../svgs/calendarIcon';
import LinkIcon from '../svgs/linkIcon';
import RedditIcon from '../svgs/redditIcon';

const timeAgo = new TimeAgo('en-US');

export default class Summary {

  el: HTMLElement
  summaryInfo: Array<HTMLElement>

  constructor(summaryBody: ISummaryBody) {
    logger.log('SummaryBody: constructor');

    this.summaryInfo = [
      el('span.SCHandle.SCMarginRight', summaryBody.handle),
      el('span.SCIcon', new CalendarIcon()),
      el('span.SCdate.SCMarginRight', timeAgo.format(summaryBody.timestamp)),
      el('span.SCIcon', new LinkIcon()),
      el('a.SClink', summaryBody.link, { href: summaryBody.link, target: '_blank' })
    ]

    let keywords: Array<HTMLElement>;

    if (summaryBody.type === 'social' && summaryBody.icon) {
      switch (summaryBody.icon) {
        case 'reddit':
          this.summaryInfo.unshift(el('.SCIcon', new RedditIcon()));
          break;
        default:
          this.summaryInfo.unshift(el(`i.${summaryBody.icon}`));
          break;
      }
    }

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