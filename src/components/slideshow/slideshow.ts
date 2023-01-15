import { el, List, list, RedomComponentClass } from 'redom';

import { IArticle, IDataItem, ISourceGroup, ISource } from '../../types';

import logger from '../../utils/logger';

import Groups from './groups';
import Slide from './slide';

export default class Slideshow {

  el: HTMLElement
  slideshow: HTMLElement

  groups: Array<ISourceGroup>

  sourceGroups: Groups // HTML component
  slides: List // ReDom component

  activeSlide: number
  title: string

  constructor(dataitems: Array<IDataItem>, title: string) {
    logger.log('Slideshow: constructor');

    this.title = title;
    this.groups = Groups.mapToSourceGroups(dataitems);
    this.sourceGroups = new Groups(this.groups); // HTML Component

    // @ts-ignore
    this.slides = list(".SCSlides", Slide);
    this.slideshow = el('.SCSlideshow', this.slides);

    this.el = el(`.SCSlideshowWrapper`, this.slideshow, this.sourceGroups);

    this.activeSlide = 0;
    this.setCurrentSlides(0, 0);
  }

  setCurrentSlides(itemindex: number, groupindex: number) {
    const currentSourceGroup: ISourceGroup = this.groups[groupindex];
    const currentSource: IDataItem = currentSourceGroup.elements[itemindex];

    const articles: Array<IArticle> = currentSource.articles;
    const source: ISource = currentSource.source;

    this.slides.update(articles.map((article: IArticle) => {
      return {
        title: article.title,
        description: article.body,
        timestamp: article.timestamp,
        link: article.link,
        handle: source.name,
        icon: source.icon,
        keywords: article.keywords
      }
    }), { activeSlide: this.activeSlide });
  }
}