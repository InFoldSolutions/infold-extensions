import { el, mount, RedomComponent, unmount } from 'redom';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

import { ISlideBody } from '../../types';

import logger from '../../utils/logger';

import Tip from '../tip';

import RedditIcon from '../svgs/redditIcon';
import Keywords from './keywords';

const timeAgo = new TimeAgo('en-US');

export default class Slide {

  el: HTMLElement
  summaryBody: HTMLElement
  summaryInfo: Array<HTMLElement>

  tipBtn: RedomComponent
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

    const score: number = data.score ? Math.round(data.score * 100) : 0;
    const linkText: string = data.link.replace(/https\:\/\/|http\:\/\/|www\./gi, '');
    const twitterHandleLink: string = `https://twitter.com/${data.handle.replace('@', '')}`;
    
    this.summaryInfo = [
      el('a.SCHandle.SClink', data.handle, { title: data.handle, href: twitterHandleLink, target: '_blank' }),
      el('span.SCdate.SCIcon', { title: `Publish date` }, [el('i.fad.fa-calendar-alt'), el('span', timeAgo.format(data.timestamp, 'mini'), ' ago')]),
      el('span.SCIcon', { title: `Relevance` }, [el('i.fad.fa-link'), el('span.SCScore', `${score}%`)]),
      el('a.SClink.SCMarginRight', linkText, { title: data.link, href: data.link, target: '_blank' }),
      //el('span.SCIcon.SCTipIcon', new Tip(data.sourceName, 5))
    ]

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

    this.summaryBody = el('.SCSummaryBody', [
      el('.SCSummaryTitle', { title: data.title }, data.title),
      el('.SCSummaryInfo', this.summaryInfo),
      el('.SCSummaryContent', data.description),
      el('.SCKeywordsWrapper', new Keywords(data.keywords))
    ]);

    mount(this.el, this.summaryBody);
  }

  destroy() {
    logger.log('Slide: destroy');
    //unmount(this.el, this.summaryBody);
  }
}