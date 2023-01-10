import { el, mount, unmount } from 'redom';

import logger from '../../utils/logger';

import Slideshow from '../slideshow/slideshow';
import config from '../../utils/config';

import Dialog from './dialog';

export default class RedditDialog extends Dialog {

  el: HTMLElement
  parent: HTMLElement
  dialogBody: HTMLElement
  dialogCloseWrapper: HTMLElement
  linkElement: HTMLElement

  dialogStyle: Object

  constructor(agent: string, article: HTMLElement, btnWrapper: HTMLElement, linkElement: HTMLElement) {
    logger.log('RedditDialog: constructor');

    super(agent, article, btnWrapper, linkElement);

    this.dialogStyle = {};

    this.parent = article.parentElement.parentElement;
    this.dialogStyle = { style: { left: `${this.offsetLeft}px`, top: `${this.offsetTop}px` } };

    this.dialogBody = el('.SCDialogBody', this.dialogStyle, [
      el('.SCDialogContent',
        new Slideshow(
          config.mock.relatedNews,
          'Related News',
          'fal.fa-newspaper',
          'news'
        ))
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
    let offsetLeft: number = 0;

    const paddingLeft = parseInt(getComputedStyle(this.article, null).getPropertyValue('padding-left').replace('px', ''));

    if (paddingLeft) {
      offsetLeft += paddingLeft + 2; // 2 accounts for margin;
    }

    const btnWrapperParentElement: HTMLElement = this.btnWrapper.parentElement.parentElement;

    if (btnWrapperParentElement && btnWrapperParentElement.offsetLeft !== paddingLeft) {
      offsetLeft += btnWrapperParentElement.offsetLeft;
    }

    const linkWrapperElement: HTMLElement = this.linkElement.parentElement;

    if (linkWrapperElement) {
      offsetLeft += linkWrapperElement.offsetLeft;
    }

    return offsetLeft;
  }

  get offsetTop(): number {
    const marginBottom: number = parseInt(getComputedStyle(this.article).marginBottom, 10) + 2;
    return (marginBottom) ? -marginBottom : 0;
  }

  close() {
    logger.log('Dialog: close');

    unmount(this.parent, this.el);
  }
}