import { el } from 'redom';

import logger from '../utils/logger';

/**
 * 
 *   <input type="radio" id="trigger1" name="slider">
 *   <label for="trigger1">
 *       <span class="sr-only">
 *           Slide 1 of 5. A photo of a mountain pass with a winding path along the river and a view of distant mountains hiding in the mist.
 *       </span>
 *   </label>
 *   <div class="slide bg1"></div>
 */

interface ISlide {
  body: string,
  title?: string,
  author?: string,
  date?: string,
  icon?: string
}

export default class Slideshow {

  el: HTMLElement
  slideshow: HTMLElement

  constructor(slides: Array<ISlide>, icon: string) {
    logger.log('Slideshow: constructor');

    this.slideshow = el('.SCSlideshow', slides.reduce((aggregator: Array<HTMLElement>, slide: ISlide, index: Number) => {
      const img = el('img', {src: slide.icon})
      aggregator.push(el('input', { type: 'radio', id: index, name: 'slider', checked: (index === 0) }));
      aggregator.push(el('label', img, { for: index }));
      aggregator.push(el('.SCSlide', slide.body));
      return aggregator;
    }, []));

    this.el = el('.SCSlideshowWrapper', [el('.SCSlideshowIcon', el('.SCSlideshowIconWrapper', el(`i.${icon}`))), this.slideshow])
  }
}