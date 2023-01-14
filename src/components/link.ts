import { el } from 'redom';

import { IPotentialLink } from '../types';

import { isPostPage } from '../utils/helpers';
import logger from '../utils/logger';

import RedditDialog from './dialog/reddit';
import TwitterDialog from './dialog/twitter';

import Post from './post';

export default class Link {

  status: string
  agent: string

  node: HTMLAnchorElement
  wrapper: HTMLElement
  article: HTMLElement
  el: HTMLElement

  dialog: RedditDialog | TwitterDialog
  post: Post

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

    const buttonContent: Array<HTMLElement> = [];
    const textContent: Array<HTMLElement> = [];
    const btnWrapperClass: string = (this.isDialog) ? 'SCDialog' : 'SCPost';
    const relatedCount: string = '86';

    let btnText: string = (this.agent === 'reddit') ? 'Related' : '';

    if (!this.isTextVersion) {
      buttonContent.push(el(`span.SCIconWrapper`, [
        el('span.SCiconBackground'),
        el(`i.far.fa-lightbulb-on`)
      ]));
    } else {
      btnText = 'Related';
    }

    textContent.push(el('span.SCcount', relatedCount))

    if (btnText && btnText !== '')
      textContent.push(el('span.SCText', btnText));

    buttonContent.push(el(`span.SCTextWrapper`, textContent));

    this.el = el(`.SCbuttonWrapper.${this.agent}.${btnWrapperClass}`, buttonContent);
    this.el.onclick = this.onClick.bind(this);
  }

  onClick(evt: MouseEvent) {
    logger.log('Link: onClick');

    evt.preventDefault();
    evt.stopPropagation();

    if (this.isDialog)
      this.openDialog();
    else
      this.togglePostView();
  }

  togglePostView() {
    logger.log('Link: togglePostView');

    if (this.agent === 'twitter') 
      this.article.style.flexWrap = 'wrap';

    if (this.post) {
      this.post.close();
      this.post = null;
      return;
    }

    this.post = new Post(
      this.agent,
      this.article,
      this.wrapper,
      this.el
    );
  }

  openDialog() {
    logger.log('Link: openDialog');

    let Dialog;

    switch (this.agent) {
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

  get isDialog(): boolean {
    return !isPostPage() || isPostPage() && Number(this.article.getAttribute('tabindex')) !== -1;
  }

  get isTextVersion(): boolean {
    let isTextOnly: boolean = false;

    switch (this.agent) {
      case 'twitter':
        return !this.isDialog;
    }

    return isTextOnly;
  }
}