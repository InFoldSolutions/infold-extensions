import { el } from 'redom';

import logger from '../utils/logger';

import RedditDialog from './dialog/reddit';
import TwitterDialog from './dialog/twitter';
export interface IPotentialLink {
  element: HTMLAnchorElement,
  wrapperNode: HTMLElement,
  article: HTMLElement
}

export default class Link {

  status: string
  agent: string

  node: HTMLAnchorElement
  wrapper: HTMLElement
  article: HTMLElement
  el: HTMLElement

  dialog: RedditDialog | TwitterDialog

  constructor(agent: string, potentialLInk: IPotentialLink) {
    logger.log('Link: constructor');

    this.agent = agent;
    this.article = potentialLInk.article;
    this.node = potentialLInk.element;
    this.wrapper = potentialLInk.wrapperNode;
    this.status = 'pending';
  }

  async getInfo() {
    logger.log('Link: getInfo');
    this.status = 'success';
  }

  preparetBaseHTML() {
    logger.log('Link: preparetBaseHTML');

    const btnText = (this.agent === 'reddit') ? 'Related' : '';

    this.el = el(`.SCbuttonWrapper.${this.agent}`, [
      el(`span.SCiconWrapper`, [
        el('span.SCiconBackground'),
        el(`i.fal.fa-lightbulb`)
      ]),
      el(`span.SCtextWrapper`, (btnText !== '') ? `86 ${btnText}` : '86')
    ]);

    this.el.onclick = this.onClick.bind(this);
  }

  onClick(evt: MouseEvent) {
    logger.log('Link: onClick');

    evt.preventDefault();
    evt.stopPropagation();

    let Dialog;

    switch(this.agent) {
      case 'reddit':
        Dialog = RedditDialog;
        break;
      case 'twitter':
        Dialog = TwitterDialog;
        break;
    }

    this.dialog = new Dialog(
      this.agent,
      this.article,
      this.wrapper,
      this.el
    );
  }

  disableLoading() {
    logger.log('Link: disableLoading');
  }

  setTag(tag: string) {
    logger.log('Link: setTag');
  }
}