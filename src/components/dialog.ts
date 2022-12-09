import { el, svg, mount, unmount } from 'redom';

import logger from '../utils/logger';

import Summary from './summary';
import Slideshow from './slideshow';
import config from '../utils/config';

export default class Dialog {

  el: HTMLElement
  parent: HTMLElement
  dialogBody: HTMLElement
  dialogCloseWrapper: HTMLElement

  itemSummary: Summary

  constructor(agent: string, parent: HTMLElement, article: HTMLElement, btnWrapper: HTMLElement) {
    logger.log('Dialog: constructor');

    this.parent = parent;

    let offsetTop: number = 0;
    let offsetLeft: number = 0;

    const mainElement: HTMLElement = document.querySelector('main');
    const sectionElement: HTMLElement = mainElement.querySelector('section');

    // This is messed up
    // Need to account for offest top that the custom scroll mechanism has

    // calculate offset top
    if (sectionElement) {
      offsetTop += sectionElement.offsetTop;
    }

    const sectionParentElement: HTMLElement = sectionElement.parentElement.parentElement;

    if (sectionParentElement) {
      offsetTop += sectionParentElement.offsetTop;
    }

    const sectionParentParentElement: HTMLElement = sectionElement.parentElement.parentElement.parentElement;

    if (sectionParentParentElement) {
      offsetTop += sectionParentParentElement.offsetTop;
    }

    const showThreadXPathResult: XPathResult = document.evaluate(".//span[contains(., 'Show this thread')]", article, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

    if (showThreadXPathResult.singleNodeValue) {
      const showThreadElement: HTMLElement = showThreadXPathResult.singleNodeValue.parentElement;

      if (showThreadElement) {
        offsetTop -= (showThreadElement.parentElement.clientHeight + 2); // 2 accounts for margin
      }
    }

    // calculate offset left
    if (mainElement) {
      offsetLeft += mainElement.offsetLeft;
    }

    const btnWrapperParentElement: HTMLElement = btnWrapper.parentElement.parentElement.parentElement;

    if (btnWrapperParentElement) {
      offsetLeft += btnWrapperParentElement.offsetLeft + 15; // 15 accounts for the margin value, needs refactor
    }

    const currentParent: HTMLElement = article.parentElement.parentElement.parentElement.parentElement as HTMLElement;
    const transform: string = currentParent.style.transform;

    const topPixels: number =
      parseInt(transform.split('(')[1].replace(')', '').replace('px', '')) + // painfull style attribute parsing
      currentParent.clientHeight +
      offsetTop -
      (btnWrapper.clientHeight + 15); // 15 accounts for the btnWrapper margin value, needs refactor

    this.dialogBody = el('.SCDialogBody', { style: { top: `${topPixels}px`, left: `${offsetLeft}px` } }, [
      el('.SCDialogContent', [
        this.itemSummary,
        new Slideshow(config.mock.relatedNews, 'Related News', 'fal.fa-newspaper', 'news'),
      ])
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

  close() {
    logger.log('Dialog: close');
    unmount(this.parent, this.el);
  }
}