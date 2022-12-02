import { el, svg, mount, unmount } from 'redom';

import logger from '../utils/logger';
import Summary from './summary';

export default class Dialog {
  el: HTMLElement
  closeBtn: HTMLElement

  itemSummary: Summary

  constructor() {
    logger.log('Dialog: constructor');

    this.closeBtn = el('.SCDialogCloseWrapper', svg(
      'svg',
      { viewBox: '0 0 24 24' },
      svg('g', svg('path', {
        d: 'M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z'
      })),
    ));

    this.closeBtn.onclick = (evt: Event) => {
      evt.preventDefault();
      evt.stopPropagation();
      console.log('CLICK EVENT');

      this.close()
    };

    this.itemSummary = new Summary(
      'Kearne Solanke and Charlie Bartolo deaths: Two teens charged', 
      "Two boys are charged with murdering Kearne Solanke and Charlie Bartolo a mile apart in London.",
      "https://pbs.twimg.com/profile_images/1150716997254209536/M7gkjsv5_400x400.jpg",
      '7h ago',
      'bbc.in/3B6arKW'
    );

    this.el = el('.SCDialogWrapper', el('.SCDialogBody', [el('.SCDialogHeader', this.closeBtn), el('.SCDialogContent', this.itemSummary)]))

    mount(document.body, this.el);
  }

  close() {
    unmount(document.body, this.el);
  }
}