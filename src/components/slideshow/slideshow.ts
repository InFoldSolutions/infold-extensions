import { el } from 'redom';

import { IDateGroup, ISlide } from '../../types';

import { convertToSlug } from '../../utils/helpers';
import logger from '../../utils/logger';
import config from '../../utils/config';

import Summary from './summary';

export default class Slideshow {

  el: HTMLElement
  slideshow: HTMLElement
  title: HTMLElement
  slides: Array<HTMLElement>

  constructor(slides: Array<ISlide>, title: string, type: string) {
    logger.log('Slideshow: constructor');

    slides.sort((a, b) => {
      return b.timestamp - a.timestamp;
    });

    let initialDateGroup: IDateGroup = this.getDateGroupForSlide(slides[0]);

    //this.title = el('.SCSlideshowHeader', title);
    this.slides = slides.reduce((aggregator: Array<HTMLElement>, slide: ISlide, index: Number) => {
      const currentSlideDateGroup: IDateGroup = this.getDateGroupForSlide(slide);
      const articleBody: HTMLElement = el('.SCSlide', new Summary({
        title: slide.title,
        description: slide.body,
        timestamp: slide.timestamp,
        link: slide.link,
        handle: slide.author,
        icon: slide.icon,
        keywords: slide.keywords,
        type
      }));

      let labelImg: HTMLElement;

      if (slide.icon && type === 'news') 
        labelImg = el('img', { src: slide.icon, title: slide.author, alt: slide.author });

      const titleSlug: string = convertToSlug(title);
      const slideIndex: string = titleSlug + index;

      if (index === 0 || currentSlideDateGroup !== initialDateGroup) {
        aggregator.push(el('.SCDateGroup', el('span', currentSlideDateGroup.label)));
        initialDateGroup = currentSlideDateGroup;
      }

      aggregator.push(el('input', { type: 'radio', id: slideIndex, name: titleSlug, checked: (index === 0) }));
      aggregator.push(el('label.SCNav', labelImg || '', { for: slideIndex }));
      aggregator.push(articleBody);

      return aggregator;
    }, []);

    this.slideshow = el('.SCSlideshow', this.title, this.slides);
    this.el = el(`.SCSlideshowWrapper.${type}`, this.slideshow);
  }

  getDateGroupForSlide(slide: ISlide): IDateGroup {
    return config.dategroups.find(group => slide.timestamp >= group.toDate);
  }
}