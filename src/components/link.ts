import logger from '../utils/logger';

import { el } from 'redom';

export default class Link {

  status: string
  type: string
  node: HTMLAnchorElement
  el: HTMLElement

  constructor(type: string, element: HTMLAnchorElement) {
    logger.log('Link: constructor');
    
    this.type = type;
    this.node = element;
    this.status = 'pending';
  }

  async getInfo() {
    logger.log('Link: getInfo');
    this.status = 'success';
  }

  preparetBaseHTML() {
    logger.log('Link: preparetBaseHTML');
    this.el = el('.SCWrapper', el('i.far.fa-spinner-third.fa-spin'));
  }

  disableLoading() {
    logger.log('Link: disableLoading');
  }

  setTag(tag: string) {
    logger.log('Link: setTag');
  }
}