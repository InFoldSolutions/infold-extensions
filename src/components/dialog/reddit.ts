import { el, svg, mount, unmount } from 'redom';

import logger from '../../utils/logger';

import Summary from '../summary';
import Slideshow from '../slideshow';
import config from '../../utils/config';

import Dialog from './dialog';

export default class RedditDialog extends Dialog {

  el: HTMLElement
  parent: HTMLElement
  dialogBody: HTMLElement
  dialogCloseWrapper: HTMLElement

  constructor(agent: string, article: HTMLElement) {
    super(agent, article);

    logger.log('RedditDialog: constructor');

    console.log('offsetLeft', this.offsetLeft);

    this.parent = article.parentElement.parentElement;

    this.dialogBody = el('.SCDialogBody', { style: { left: `${this.offsetLeft}px` } }, [
      el('.SCDialogContent', new Slideshow(config.mock.relatedNews, 'Related News', 'fal.fa-newspaper', 'news'))
    ]);

    this.dialogCloseWrapper = el('.SCDialogBGWrapper');
    this.dialogCloseWrapper.onclick = (evt: Event) => {
      evt.stopPropagation();

      const target: HTMLElement = evt.target as HTMLElement;

      if (target.classList.contains('SCDialogBGWrapper'))
        this.close();
    };

    this.el = el(`.SCDialogWrapper.${agent}`,
      [
        this.dialogCloseWrapper,
        this.dialogBody
      ]);

    mount(this.parent, this.el);
  }

  get offsetLeft(): number {
    return parseInt(getComputedStyle(this.article, null).getPropertyValue('padding-left').replace('px', '')) + 2; // 2 accounts for margin
  }

  get offsetTop(): number {
    return this.article.clientHeight;
  }

  close() {
    logger.log('Dialog: close');

    unmount(this.parent, this.el);
  }
}