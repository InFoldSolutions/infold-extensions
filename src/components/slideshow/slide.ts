import { el } from 'redom';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

import { IKeyword, ISlideBody } from '../../types';

import logger from '../../utils/logger';
import CalendarIcon from '../svgs/calendarIcon';
import LinkIcon from '../svgs/linkIcon';
import RedditIcon from '../svgs/redditIcon';

const timeAgo = new TimeAgo('en-US');

export default class Slide {

  el: HTMLElement
  summaryInfo: Array<HTMLElement>

  constructor(slide: ISlideBody) {
    logger.log('Slide: constructor');

    this.summaryInfo = [
      el('span.SCHandle.SCMarginRight', slide.handle),
      el('span.SCIcon', new CalendarIcon()),
      el('span.SCdate.SCMarginRight', timeAgo.format(slide.timestamp)),
      el('span.SCIcon', new LinkIcon()),
      el('a.SClink', slide.link, { href: slide.link, target: '_blank' })
    ]

    let keywords: Array<HTMLElement>;

    if (slide.type === 'social' && slide.icon) {
      switch (slide.icon) {
        case 'reddit':
          this.summaryInfo.unshift(el('.SCIcon', new RedditIcon()));
          break;
        default:
          this.summaryInfo.unshift(el(`i.${slide.icon}`));
          break;
      }
    }

    if (slide.keywords) {
      keywords = slide.keywords.map((keyword: IKeyword) => {
        return el('.SCKeyword', [el(`i.${keyword.icon}`), keyword.word])
      });
    }

    this.el = el('li.SCSlide',
      el('.SCSummaryBody', [
        el('.SCSummaryTitle', slide.title),
        el('.SCSummaryInfo', this.summaryInfo),
        el('.SCSummaryContent', slide.description),
        el('.SCKeywordsWrapper', keywords)
      ])
    );
  }

  update(item: any, index: number, data: any, context?: any) {
    console.log('Slide update item', item);
    console.log('Slide update index', index);
    console.log('Slide update data', data);
    console.log('Slide update context', context);
  }
}