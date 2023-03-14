import { el, mount, unmount } from 'redom';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

import { IKeyword, ISlideBody } from '../../types';

import logger from '../../utils/logger';
import CalendarIcon from '../svgs/calendarIcon';
import LinkIcon from '../svgs/linkIcon';
import RedditIcon from '../svgs/redditIcon';
import TipIcon from '../svgs/tipIcon';

const timeAgo = new TimeAgo('en-US');

export default class Slide {

  el: HTMLElement
  summaryBody: HTMLElement
  summaryInfo: Array<HTMLElement>

  data: ISlideBody

  constructor() {
    logger.log('Slide: constructor');
    this.el = el('.SCSlide');
  }

  update(data: ISlideBody, index: number, items: Array<ISlideBody>, context: any) {
    logger.log('Slide: update');

    const _self = this;

    if (this.el.classList.contains('active'))
      this.el.classList.remove('active');

    setTimeout(() => { // let the remove animation finish
      if (index === context.activeSlide)
        _self.el.classList.add('active');
    }, 140);

    if (data.title === this.data?.title && data.timestamp === this.data?.timestamp)
      return;

    this.data = data;

    if (this.summaryBody)
      unmount(this.el, this.summaryBody);

    const linkText: string = data.link.replace(/https\:\/\/|http\:\/\/|www\./gi, '');
    const twitterHandleLink: string = `https://twitter.com/${data.handle.replace('@', '')}`;
    const score: number = data.score ? Math.round(data.score * 100) : 0;

    this.summaryInfo = [
      el('a.SCHandle.SClink', data.handle, { title: data.handle, href: twitterHandleLink, target: '_blank' }),
      el('span.SCdate.SCIcon', [new CalendarIcon(), el('span', timeAgo.format(data.timestamp, 'mini'), ' ago')]),
      el('span.SCIcon', new LinkIcon(), { title: `${score}%` }),
      el('a.SClink.SCMarginRight', linkText, { title: data.link, href: data.link, target: '_blank' }),
      el('span.SCIcon.SCTipIcon', [new TipIcon(), el('span.SCTipIconText', 'Thanks')])
    ]

    let keywords: Array<HTMLElement>;

    if (data.type === 'social' && data.icon) {
      switch (data.icon) {
        case 'reddit':
          this.summaryInfo.unshift(el('.SCIcon', new RedditIcon()));
          break;
        default:
          this.summaryInfo.unshift(el(`i.${data.icon}`));
          break;
      }
    }

    if (data.keywords) {
      keywords = data.keywords.map((keyword: IKeyword) => {
        return el('.SCKeyword', [el(`i.${keyword.icon}`), keyword.word])
      });
    }

    this.summaryBody = el('.SCSummaryBody', [
      el('.SCSummaryTitle', { title: data.title }, data.title),
      el('.SCSummaryInfo', this.summaryInfo),
      el('.SCSummaryContent', data.description),
      el('.SCKeywordsWrapper', keywords)
    ]);

    mount(this.el, this.summaryBody);
  }
}