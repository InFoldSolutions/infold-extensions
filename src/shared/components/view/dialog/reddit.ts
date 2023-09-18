import { el, mount, unmount } from 'redom';

import logger from '../../../utils/logger';

import Dialog from './dialog';
import CloseIcon from '../../svgs/closeIcon';

export default class RedditDialog extends Dialog {

  closeCallback: Function

  el: HTMLElement
  parent: HTMLElement
  dialogBody: HTMLElement
  closeBtn: HTMLElement

  linkElement: HTMLElement

  dialogStyle: Object

  constructor(agent: string, article: HTMLElement, btnWrapper: HTMLElement, linkElement: HTMLElement, loadingMsg: string, closeCallback: Function) {
    logger.log('RedditDialog: constructor');

    super(agent, article, btnWrapper, linkElement, closeCallback);

    this.parent = article.parentElement.parentElement;
    this.parent.style.position = 'relative';

    this.dialogStyle = { style: { left: `${this.offsetLeft}px`, top: `${this.offsetTop}px` } };

    this.closeBtn = el('.SCDialogCloseWrapper', new CloseIcon);
    this.closeBtn.onclick = () => {
      this.close();
    }

    this.setLoadingUI();
    this.el = el(`.SCDialogWrapper.${agent}`, this.dialogStyle,
      [
        this.closeBtn,
        this.dialogBody
      ]);

    mount(this.parent, this.el);
  }

  close() {
    logger.log('RedditDialog: close');

    super.close();
    this.parent.style.removeProperty('position');
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

    if (this.btnWrapper.classList.contains('_3jwri54NGT-SRatPIZYiMo')) {
      offsetLeft -= 390;
    }

    return offsetLeft;
  }

  get offsetTop(): number {
    if (this.btnWrapper.classList.contains('_3jwri54NGT-SRatPIZYiMo')) {
      return ((this.btnWrapper.offsetHeight / 2) + (this.article.offsetHeight / 2));
    }

    return this.article.offsetHeight - 2; // 4 accounts for margin;
  }
}