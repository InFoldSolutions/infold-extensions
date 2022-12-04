import { el, svg, mount, unmount } from 'redom';

import logger from '../utils/logger';

import CloseIcon from './svgs/closeIcon';
import Summary from './summary';
import Slideshow from './slideshow';

export default class Dialog {

  el: HTMLElement
  closeBtn: HTMLElement

  itemSummary: Summary

  constructor() {
    logger.log('Dialog: constructor');

    this.closeBtn = el('.SCDialogCloseWrapper', new CloseIcon());

    this.closeBtn.onclick = (evt: Event) => {
      evt.preventDefault();
      evt.stopPropagation();
      console.log('CLICK EVENT');

      this.close();
    };

    this.itemSummary = new Summary(
      'Kearne Solanke and Charlie Bartolo deaths: Two teens charged', 
      "Two boys are charged with murdering Kearne Solanke and Charlie Bartolo a mile apart in London.",
      "https://pbs.twimg.com/profile_images/1150716997254209536/M7gkjsv5_400x400.jpg",
      '7h ago',
      'bbc.in/3B6arKW',
      'BBC News',
      ['Charlie Bartolo', 'Kearne Solanke', 'London', 'Murder', 'Thamesmead', 'Abbey Wood']
    );

    this.el = el('.SCDialogWrapper', 
      el('.SCDialogBody', [
        el('.SCDialogHeader', this.closeBtn), 
        el('.SCDialogContent', [
          this.itemSummary,
          new Slideshow([{body: "Test content"}, {body: "Test content 2"}])
        ])
      ]))

    mount(document.body, this.el);
  }

  close() {
    logger.log('Dialog: close');

    unmount(document.body, this.el);
  }
}