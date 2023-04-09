import { el, unmount, mount } from 'redom';

import logger from '../../utils/logger';

import Slideshow from '../slideshow/slideshow';

import { IDataItem } from '../../types';

export default class Dialog {

  el: HTMLElement
  parent: HTMLElement
  article: HTMLElement
  btnWrapper: HTMLElement
  linkElement: HTMLElement
  dialogBody: HTMLElement
  slideshow: Slideshow

  agent: string

  constructor(agent: string, article: HTMLElement, btnWrapper: HTMLElement, linkElement: HTMLElement) {
    logger.log('Dialog: constructor');

    this.btnWrapper = btnWrapper;
    this.agent = agent;
    this.article = article;
    this.linkElement = linkElement;
  }

  open() {
    logger
      .log('Dialog: open')
  }

  update(data?: IDataItem[], totalCount?: number) {
    logger
      .log('Dialog: update');

    this.dialogBody.innerHTML = '';
    this.slideshow = new Slideshow(data, totalCount);

    mount(this.dialogBody, el('.SCDialogContent', this.slideshow));
  }

  close() {
    logger.log('Dialog: close');

    unmount(this.parent, this.el);

    if (this.slideshow)
      this.slideshow.destroy();
  }
}