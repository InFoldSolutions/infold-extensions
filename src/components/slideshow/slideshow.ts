import { el } from 'redom';

import { IArticle, IDataItem, ISourceGroup, ISlide, ISource } from '../../types';

import { convertToSlug } from '../../utils/helpers';
import logger from '../../utils/logger';

import Summary from './summary';
import Groups from './groups';

export default class Slideshow {

  el: HTMLElement
  slideshow: HTMLElement
  slides: Array<HTMLElement>

  groups: Array<ISourceGroup>
  sourceGroups: Groups // HTML component

  title: string

  constructor(dataitems: Array<IDataItem>, title: string) {
    logger.log('Slideshow: constructor');

    this.title = title;
    this.groups = Groups.mapToSourceGroups(dataitems);
    this.sourceGroups = new Groups(this.groups); // HTML Component
    this.slideshow = el('.SCSlideshow', this.slides);

    this.el = el(`.SCSlideshowWrapper`, this.slideshow, this.sourceGroups);
  }

  setCurrentSlides(itemindex: number, groupindex: number) {
    const currentSourceGroup: ISourceGroup = this.groups[groupindex];
    const currentSource: IDataItem = currentSourceGroup.elements[itemindex];

    const articles: Array<IArticle> = currentSource.articles;
    const source: ISource = currentSource.source;

    this.slides = el('.SCSlideshow', articles.reduce((aggregator: Array<HTMLElement>, article: IArticle, index: Number) => {
      const articleBody: HTMLElement = el('.SCSlide', new Summary({
        title: article.title,
        description: article.body,
        timestamp: article.timestamp,
        link: article.link,
        handle: source.name,
        icon: source.icon,
        keywords: article.keywords
      }));

      const titleSlug: string = convertToSlug(this.title);
      const slideIndex: string = titleSlug + index;

      aggregator.push(el('input', { type: 'radio', id: slideIndex, name: titleSlug, checked: (index === 0) }));
      aggregator.push(articleBody);

      return aggregator;
    }, []));
  }
}