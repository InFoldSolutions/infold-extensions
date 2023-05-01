import { el } from 'redom';

import { IArticle, IHeadline, ISource, ISourceGroup } from '../types';

import logger from '../utils/logger';

import TimeAgo from 'javascript-time-ago';
import CalendarIcon from './svgs/calendarIcon';

const timeAgo = new TimeAgo('en-US');

export default class TopHeadlines {

  el: HTMLElement
  wrapper: HTMLElement

  constructor(groups: Array<ISourceGroup>) {
    logger.log('TopHeadlines: constructor');

    const headlines: IHeadline[] = groups.reduce((acc: IHeadline[], group: ISourceGroup) => {
      const firstArticle: IArticle = group.elements[0].articles[0];
      const source: ISource = group.elements[0].source;

      acc.push({
        title: firstArticle.title,
        timestamp: firstArticle.timestamp,
        link: firstArticle.link,
        score: firstArticle.score,
        groupLabel: group.label,
        sourceName: source.name
      })

      return acc;
    }, []);

    this.el = el('.SCTopHeadingsWrapper', [el('h3', 'Top Headlines'), el('.SCTopHeadlines', headlines.map((headline: IHeadline) => {
      const linkText: string = headline.link.replace(/https\:\/\/|http\:\/\/|www\./gi, '');
      const summaryInfo = [
        el('span.SCdate.SCIcon', { title: `Publish date` }, [`${headline.sourceName} - `, new CalendarIcon(), timeAgo.format(headline.timestamp, 'mini'), ` ago`]),
        el('a.SClink.SCMarginRight', linkText, { title: headline.link, href: headline.link, target: '_blank' }),
      ]

      return el('.SCSummaryBody', [
        el('.SCSummaryTitle', { title: headline.title }, headline.title),
        el('.SCSummaryInfo', summaryInfo)
      ]);
    }))]);
  }
}