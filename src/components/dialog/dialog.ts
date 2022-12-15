import { el, svg, mount, unmount } from 'redom';

import logger from '../../utils/logger';

import Summary from '../summary';

export default class Dialog {

  el: HTMLElement
  parent: HTMLElement
  article: HTMLElement
  btnWrapper: HTMLElement
  dialogBody: HTMLElement
  dialogCloseWrapper: HTMLElement

  agent: string

  itemSummary: Summary

  constructor(agent: string, article: HTMLElement, btnWrapper: HTMLElement) {
    logger.log('Dialog: constructor');

    this.btnWrapper = btnWrapper;
    this.agent = agent;
    this.article = article;
  }
}