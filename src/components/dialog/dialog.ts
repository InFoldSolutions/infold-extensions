import { unmount } from 'redom';

import logger from '../../utils/logger';

export default class Dialog {

  el: HTMLElement
  parent: HTMLElement
  article: HTMLElement
  btnWrapper: HTMLElement
  linkElement: HTMLElement

  dialogBody: HTMLElement
  dialogCloseWrapper: HTMLElement

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

  close() {
    logger.log('Dialog: close');

    unmount(this.parent, this.el);
  }
}