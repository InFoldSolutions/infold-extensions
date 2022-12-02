import { el } from 'redom';

import logger from '../utils/logger';

import Dialog from './dialog';

export interface IPotentialLink {
  element: HTMLAnchorElement,
  wrapperNode: HTMLElement
}

export default class Link {

  status: string
  type: string

  node: HTMLAnchorElement
  wrapper: HTMLElement
  el: HTMLElement

  dialog: Dialog

  constructor(type: string, potentialLInk: IPotentialLink) {
    logger.log('Link: constructor');

    this.type = type;
    this.node = potentialLInk.element;
    this.wrapper = potentialLInk.wrapperNode;
    this.status = 'pending';
  }

  async getInfo() {
    logger.log('Link: getInfo');
    this.status = 'success';
  }

  preparetBaseHTML(element?: HTMLElement) {
    logger.log('Link: preparetBaseHTML');

    if (element)
      this.el = element;
    else {
      this.el = el(`.SCbuttonWrapper`, [
        el(`span.SCiconWrapper`, [
          el('span.SCiconBackground'),
          el(`i.fal.fa-lightbulb`)
        ]),
        el(`span.SCtextWrapper`, '86')
      ]);
    }

    this.el.onclick = (evt: Event) => {
      evt.preventDefault();
      evt.stopPropagation();
      console.log('CLICK EVENT');

      this.dialog = new Dialog()
    };
  }

  disableLoading() {
    logger.log('Link: disableLoading');
  }

  setTag(tag: string) {
    logger.log('Link: setTag');
  }
}