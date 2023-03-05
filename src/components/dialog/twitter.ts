import { el, mount, unmount } from 'redom';

import logger from '../../utils/logger';

import Slideshow from '../slideshow/slideshow';
import config from '../../utils/config';

import Dialog from './dialog';
import CloseIcon from '../svgs/closeIcon';
import { findChildByText, findChildrenByText, findParentByAttribute } from '../../utils/helpers';

export default class TwitterDialog extends Dialog {

  closeCallback: Function

  el: HTMLElement
  parent: HTMLElement
  dialogBody: HTMLElement
  closeBtn: HTMLElement
  
  mainElement: HTMLElement
  sectionElement: HTMLElement

  constructor(agent: string, article: HTMLElement, btnWrapper: HTMLElement, linkElement: HTMLElement, closeCallback: Function) {
    logger.log('TwitterDialog: constructor');

    super(agent, article, btnWrapper, linkElement);

    this.closeCallback = closeCallback;

    this.mainElement = document.querySelector('main');
    this.sectionElement = this.mainElement.querySelector('section');
    this.parent = findParentByAttribute(article, 'data-testid', 'cellInnerDiv')
    this.parent.style.zIndex = '9999';

    this.closeBtn = el('.SCDialogCloseWrapper', new CloseIcon);
    this.closeBtn.onclick = () => {
      this.close();
    }

    this.dialogBody = el('.SCDialogBody', [ // { style: { top: `${this.offsetTop}px`, left: `${this.offsetLeft}px` } },
      el('.SCDialogContent', new Slideshow(config.mock.relatedSources))
    ]);

    this.el = el(`.SCDialogWrapper.${agent}`, { style: { bottom: `-${this.offsetTop}px` } },
      [
        this.closeBtn,
        this.dialogBody
      ])

    mount(this.parent, this.el);
  }

  close() {
    logger.log('TwitterDialog: close');

    this.closeCallback();
    unmount(this.parent, this.el);

    this.parent.style.zIndex = '0';
  }

  get offsetTop(): number {
    let offsetTop: number = 205;

    // compensate for "Show this thread" btn
    const showThreadElements: HTMLElement[] = findChildrenByText(this.article, 'span', 'Show this thread');
    console.log('showThreadElements');

    if (showThreadElements && showThreadElements.length > 0) {
      for (let i = 0; i < showThreadElements.length; i++) {
        const showThreadElement: HTMLElement = showThreadElements[i];
        console.log('showThreadElement', showThreadElement)
        const showThreadParentElement: HTMLElement = showThreadElement.parentElement.parentElement;

        if (showThreadParentElement && (showThreadParentElement.classList.contains('r-1777fci') || showThreadParentElement.classList.contains('r-1iusvr4'))) {
          offsetTop -= (showThreadParentElement.clientHeight + 4); // 4 accounts for margin
        }
      }
    }

    // compensate for "Promoted" btn
    const promotedElement: HTMLElement = findChildByText(this.article, 'span', 'Promoted');

    if (promotedElement) {
      const promotedParentElement: HTMLElement = promotedElement.parentElement.parentElement.parentElement;

      if (promotedParentElement) {
        offsetTop -= (promotedParentElement.clientHeight + 12); // 12 accounts for margin
      }
    }

    return offsetTop;
  }
}