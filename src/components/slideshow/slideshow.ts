import { el, List, list } from 'redom';

import { IArticle, IDataItem, ISourceGroup, ISource, ISlideBody } from '../../types';

import logger from '../../utils/logger';

import Groups from './groups';
import Slide from './slide';

export default class Slideshow {

  el: HTMLElement
  slideshow: HTMLElement

  groups: Array<ISourceGroup>

  sourceGroups: Groups // HTML component
  slides: List // ReDom component
  currentSlides: Array<ISlideBody>

  activeSlide: number
  activeGroupIndex: number
  activeSourceIndex: number

  title: string

  constructor(dataitems: Array<IDataItem>, totalCount: number) {
    logger.log('Slideshow: constructor');

    this.groups = Groups.mapToSourceGroups(dataitems);
    this.sourceGroups = new Groups(
      this.groups, 
      this.setCurrentSlides.bind(this),
      this.setCurrentArticle.bind(this),
      totalCount
    ); // HTML Component

    // @ts-ignore
    this.slides = list('.SCSlides', Slide);
    this.slideshow = el('.SCSlideshow', this.slides);

    this.el = el(`.SCSlideshowWrapper`, this.slideshow, this.sourceGroups);

    this.activeSlide = 0;
    this.setCurrentSlides(0, 0);
  }

  setCurrentArticle(articleIndex: number) {
    logger.log('setCurrentArticle');
    this.activeSlide = articleIndex;
    this.slides.update(this.currentSlides, { activeSlide: this.activeSlide });
  }

  setCurrentSlides(sourceIndex: number, groupIndex: number) {
    logger.log('setCurrentSlides');

    if (this.activeGroupIndex === groupIndex && this.activeSourceIndex === sourceIndex)
      return;

    this.activeSlide = 0;
    this.activeGroupIndex = groupIndex;
    this.activeSourceIndex = sourceIndex;

    const currentSourceGroup: ISourceGroup = this.groups[this.activeGroupIndex];
    const currentSource: IDataItem = currentSourceGroup.elements[this.activeSourceIndex];

    const articles: Array<IArticle> = currentSource.articles;
    const source: ISource = currentSource.source;

    this.currentSlides = articles.map((article: IArticle): ISlideBody => {
      return {
        title: article.title,
        description: article.body,
        timestamp: article.timestamp,
        link: article.link,
        score: article.score,
        handle: source.handle,
        sourceName: source.name,
        icon: source.icon,
        keywords: article.keywords
      }
    });

    this.slides.update(this.currentSlides, { activeSlide: this.activeSlide });
  }
}