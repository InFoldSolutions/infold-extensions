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
  date?: string
}

export default class Slideshow {

  el: HTMLElement

  constructor(slides: Array<ISlide>) {
    logger.log('Slideshow: constructor');

    this.el = el('.SCSlideshow', slides.reduce((aggregator: Array<HTMLElement>, slide: ISlide, index: Number) => {
      aggregator.push(el('input', { type: 'radio', id: index, name: 'slider' }))
      aggregator.push(el('label', { for: index }))
      aggregator.push(el('.SCSlide', slide.body))
      return aggregator;
    }, []));
  }
}