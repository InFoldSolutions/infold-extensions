import { el } from 'redom';

import { IArticle, IDataItem, IHeadline, ISource, ISourceGroup } from '../types';

import logger from '../utils/logger';

import TimeAgo from 'javascript-time-ago';
import CalendarIcon from './svgs/calendarIcon';

const timeAgo = new TimeAgo('en-US');

export default class TopHeadlines {

  el: HTMLElement
  wrapper: HTMLElement

  constructor(groups: Array<ISourceGroup>) {
    logger.log('TopHeadlines: constructor');

    const maxArticles = 3;
    const headlines: IHeadline[] = []

    for (let g = 0; g < groups.length; g++) {

      if (headlines.length >= maxArticles)
        break;

      const group: ISourceGroup = groups[g];
      const elements: IDataItem[] = group.elements; // group has multiple data items (sources and data)
      const item: IDataItem = elements[0]; // first data item from the group is chosen as top headline
      const articles: IArticle[] = item.articles;
      const source: ISource = item.source;

      let articleIndex = 0; // use the first article from the chosen data item

      if (g === 0 && articles.length > 1)
        articleIndex = 1;
      else if (g === 0 && articles.length === 1)
        continue;

      const article = articles[articleIndex];

      headlines.push({
        title: article.title,
        timestamp: article.timestamp,
        link: article.link,
        score: article.score,
        groupLabel: group.label,
        sourceName: source.name
      });
    }

    this.el = el('.SCTopHeadingsWrapper', [el('h3', 'Top Headlines'), el('.SCTopHeadlines', headlines.map((headline: IHeadline) => {
      const score: number = headline.score ? Math.round(headline.score * 100) : 0;
      const linkText: string = headline.link.replace(/https\:\/\/|http\:\/\/|www\./gi, '');
      const summaryInfo = [
        el('span.SCHandle', `${headline.sourceName}`),
        el('span.SCdate.SCIcon', { title: `Publish date` }, ['-', timeAgo.format(headline.timestamp, 'mini'), ` ago`, '-']),
        el('span.SCIcon', { title: `Relevance` }, [el('span.SCScore', `${score}%`)]),
        el('a.SClink.SCMarginRight', linkText, { title: headline.link, href: headline.link, target: '_blank' }),
        el('a.SClink', el('i.fad.fa-external-link'), { title: headline.link, href: headline.link, target: '_blank' })
      ]

      return el('.SCSummaryBody', [
        el('.SCSummaryTitle', { title: headline.title }, headline.title),
        el('.SCSummaryInfo', summaryInfo)
      ]);
    }))]);
  }
}