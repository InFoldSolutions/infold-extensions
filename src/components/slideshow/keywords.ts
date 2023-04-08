import { el, mount } from 'redom';

import { IKeyword } from '../../types';

import logger from '../../utils/logger';

import InvestopediaIcon from '../svgs/investopediaIcon';
import RightArrowIcon from '../svgs/rightArrowIcon';
import LeftArrowIcon from '../svgs/leftArrowIcon';

export default class Keywords {
  el: HTMLElement

  x: number
  mx: number
  sx: number
  maxScrollWidth: number

  isDragging: boolean
  hasDragged: boolean

  nextButton: HTMLElement
  prevButton: HTMLElement

  constructor(keywords: Array<IKeyword>) {
    logger.log('Keywords: constructor');

    this.x = 0;
    this.mx = 0;

    this.el = el('.SCKeywordsContent', this.renderKeywords(keywords));

    this.prevButton = el('.SCArrow.SCLeft', new LeftArrowIcon());
    mount(this.el, this.prevButton);

    this.nextButton = el('.SCArrow.SCRight', new RightArrowIcon);
    mount(this.el, this.nextButton);

    if (this.nextButton)
      this.nextButton.addEventListener('click', this.nextClickHandler.bind(this));

    if (this.prevButton)
      this.prevButton.addEventListener('click', this.prevClickHandler.bind(this));

    this.el.addEventListener('mousemove', this.mousemoveHandler.bind(this));
    this.el.addEventListener('mousedown', this.mousedownHandler.bind(this));
    this.el.addEventListener('mouseup', this.mouseupHandler.bind(this));
    this.el.addEventListener('click', this.clickHandler.bind(this));
    this.el.addEventListener('mouseleave', this.mouseupHandler.bind(this));
    this.el.addEventListener('scroll', this.scrollHandler.bind(this));

    console.log('this.el', this.el)
    console.log('this.el.scrollWidth', this.el.scrollWidth)
    console.log('this.el.clientWidth', this.el.clientWidth)
    
    this.maxScrollWidth = this.el.scrollWidth - this.el.clientWidth / 2 - this.el.clientWidth / 2;

    if (this.maxScrollWidth !== 0)
      this.el.parentElement.classList.add('has-arrows');

    console.log('this.maxScrollWidth', this.maxScrollWidth)
  }

  renderKeywords(keywords: Array<IKeyword>) {
    return keywords.map((keyword: IKeyword) => {
      let icon;

      if (keyword.icon.includes('fa-'))
        icon = el(`i.${keyword.icon}`);
      else
        icon = new InvestopediaIcon();

      return el('a.SCKeyword', {
        href: keyword.url,
        target: '_blank'
      }, [icon, keyword.word]);
    });
  }

  clickHandler(e: MouseEvent) {
    logger.log('Keywords: clickHandler');

    if (this.hasDragged) {
      e.preventDefault();
      e.stopImmediatePropagation();

      this.hasDragged = false;
    }
  }

  nextClickHandler(e: MouseEvent) {
    logger.log('Keywords: nextClickHandler');

    e.preventDefault();

    this.x = this.el.clientWidth / 2 + this.el.scrollLeft + 0;
    this.el.scroll({
      left: this.x,
      behavior: 'smooth',
    });
  }

  prevClickHandler(e: MouseEvent) {
    logger.log('Keywords: prevClickHandler');

    e.preventDefault();

    this.x = this.el.clientWidth / 2 - this.el.scrollLeft + 0;
    this.el.scroll({
      left: -this.x,
      behavior: 'smooth',
    });
  }

  mousemoveHandler(e: MouseEvent) {
    logger.log('Keywords: mousemoveHandler');

    e.preventDefault();

    if (this.isDragging)
      this.hasDragged = true;

    const mx2 = e.pageX - this.el.offsetLeft;

    if (this.mx)
      this.el.scrollLeft = this.sx + this.mx - mx2;
  }

  mousedownHandler(e: MouseEvent) {
    logger.log('Keywords: mousedownHandler');

    e.preventDefault();
    e.stopImmediatePropagation();

    this.sx = this.el.scrollLeft;
    this.mx = e.pageX - this.el.offsetLeft;
    this.el.classList.add('dragging');

    this.isDragging = true;
  }

  mouseupHandler = (e: MouseEvent) => {
    logger.log('Keywords: mouseupHandler');

    e.preventDefault();
    e.stopImmediatePropagation();

    this.mx = 0;
    this.el.classList.remove('dragging');
    this.isDragging = false;
  }

  scrollHandler() {
    logger.log('Keywords: scrollHandler');
    this.toggleArrows();
  }

  toggleArrows() {
    logger.log('Keywords: toggleArrows');
    if (this.el.scrollLeft > this.maxScrollWidth - 10) {
      this.nextButton.classList.add('disabled');
    } else if (this.el.scrollLeft < 10) {
      this.prevButton.classList.add('disabled');
    } else {
      this.nextButton.classList.remove('disabled');
      this.prevButton.classList.remove('disabled');
    }
  }

  destroy() {
    this.nextButton.removeEventListener('click', this.nextClickHandler.bind(this));
    this.prevButton.removeEventListener('click', this.prevClickHandler.bind(this));

    this.el.removeEventListener('mousemove', this.mousemoveHandler.bind(this));
    this.el.removeEventListener('mousedown', this.mousedownHandler.bind(this));
    this.el.removeEventListener('mouseup', this.mouseupHandler.bind(this));
    this.el.removeEventListener('mouseleave', this.mouseupHandler.bind(this));
    this.el.removeEventListener('click', this.mouseupHandler.bind(this));
    this.el.removeEventListener('scroll', this.scrollHandler.bind(this));
  }
}