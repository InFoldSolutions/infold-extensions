import { el } from 'redom';

import { convertToSlug } from '../utils/helpers';
import logger from '../utils/logger';

import SummaryBody from './summaryBody';

interface IKeyword {
  icon: string,
  word: string
}
interface ISlide {
  body: string,
  title?: string,
  author?: string,
  date?: string,
  icon?: string,
  link?: string,
  keywords?: Array<IKeyword>
}

export default class Slideshow {

  el: HTMLElement
  slideshow: HTMLElement
  title: HTMLElement

  constructor(slides: Array<ISlide>, title: string, icon: string, type: string) {
    logger.log('Slideshow: constructor');

    //this.title = el('.SCSlideshowHeader', title);
    this.slideshow = el('.SCSlideshow', this.title, slides.reduce((aggregator: Array<HTMLElement>, slide: ISlide, index: Number) => {
      const articleBody = el('.SCSlide', new SummaryBody({
        title: slide.title,
        description: slide.body,
        date: slide.date,
        link: slide.link,
        handle: slide.author,
        icon: slide.icon,
        keywords: slide.keywords,
        type
      }));

      let labelImg: HTMLElement;

      if (slide.icon && type === 'news') {
        labelImg = el('img', { src: slide.icon });
      }

      const titleSlug = convertToSlug(title);
      const slideIndex = titleSlug + index;

      aggregator.push(el('input', { type: 'radio', id: slideIndex, name: titleSlug, checked: (index === 0) }));
      aggregator.push(el('label.SCNav', labelImg || '', { for: slideIndex }));
      aggregator.push(articleBody);

      return aggregator;
    }, []));

    this.el = el(`.SCSlideshowWrapper.${type}`, this.slideshow)
  }
}