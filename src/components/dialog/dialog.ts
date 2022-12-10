import { el, svg, mount, unmount } from 'redom';

import logger from '../../utils/logger';

import Summary from '../summary';

export default class Dialog {

  el: HTMLElement
  parent: HTMLElement
  article: HTMLElement
  dialogBody: HTMLElement
  dialogCloseWrapper: HTMLElement

  agent: string

  itemSummary: Summary

  constructor(agent: string, parent: HTMLElement, article: HTMLElement) {
    logger.log('Dialog: constructor');

    this.parent = parent;
    this.agent = agent;
    this.article = article;
  }

  close() {
    logger.log('Dialog: close');
    
    unmount(this.parent, this.el);
  }
}