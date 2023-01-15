import { el, mount, unmount } from 'redom';

import logger from '../../utils/logger';

import Sources from '../slideshow/groups';
import Slideshow from '../slideshow/slideshow';
import config from '../../utils/config';

import Dialog from './dialog';
import { aggregateOffsetTop, findChildByText, findParentByAttribute } from '../../utils/helpers';

export default class TwitterDialog extends Dialog {

  el: HTMLElement
  parent: HTMLElement
  dialogBody: HTMLElement
  dialogCloseWrapper: HTMLElement
  mainElement: HTMLElement
  sectionElement: HTMLElement

  constructor(agent: string, article: HTMLElement, btnWrapper: HTMLElement, linkElement: HTMLElement) {
    logger.log('TwitterDialog: constructor');

    super(agent, article, btnWrapper, linkElement);

    this.mainElement = document.querySelector('main');
    this.sectionElement = this.mainElement.querySelector('section');
    this.parent = document.getElementById('layers');

    this.dialogBody = el('.SCDialogBody', { style: { top: `${this.offsetTop}px`, left: `${this.offsetLeft}px` } }, [
      el('.SCDialogContent', new Slideshow(config.mock.relatedSources, 'Title'))
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
      ])

    mount(this.parent, this.el);
  }

  get offsetLeft(): number {
    let offsetLeft: number = 0;

    // calculate offset left
    if (this.mainElement) {
      offsetLeft += this.mainElement.offsetLeft;
    }

    const btnWrapperParentElement: HTMLElement = this.btnWrapper.parentElement.parentElement.parentElement;

    if (btnWrapperParentElement) {
      offsetLeft += btnWrapperParentElement.offsetLeft + 15; // 15 accounts for the margin value, needs refactor
    }

    return offsetLeft
  }

  get offsetTop(): number {
    let offsetTop: number = aggregateOffsetTop(this.sectionElement);

    // compensate for "Show this thread" btn
    const showThreadElement: HTMLElement = findChildByText(this.article, 'span', 'Show this thread');

    if (showThreadElement) {
      const showThreadParentElement: HTMLElement = showThreadElement.parentElement.parentElement;

      if (showThreadParentElement && showThreadParentElement.classList.contains('r-1777fci')) {
        offsetTop -= (showThreadParentElement.clientHeight + 2); // 2 accounts for margin
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

    const currentParent: HTMLElement = findParentByAttribute(this.article, 'data-testid', 'cellInnerDiv');
    const transform: string = currentParent.style.transform;

    const topPixels: number =
      parseInt(transform.split('(')[1].replace(')', '').replace('px', '')) + // painfull style attribute parsing
      currentParent.clientHeight +
      offsetTop -
      (this.btnWrapper.clientHeight + 15); // 15 accounts for the btnWrapper margin value, needs refactor

    return topPixels;
  }

  close() {
    logger.log('Dialog: close');

    unmount(this.parent, this.el);
  }
}