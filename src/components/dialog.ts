import { el, svg, mount, unmount } from 'redom';

import logger from '../utils/logger';

import CloseIcon from './svgs/closeIcon';
import Summary from './summary';
import Slideshow from './slideshow';
import config from '../utils/config';

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

      this.close();
    };

    this.itemSummary = new Summary({
      title: 'Kearne Solanke and Charlie Bartolo deaths: Two teens charged',
      description: 'Two boys are charged with murdering Kearne Solanke and Charlie Bartolo a mile apart in London.',
      icon: 'https://pbs.twimg.com/profile_images/1150716997254209536/M7gkjsv5_400x400.jpg',
      date: '7h ago',
      link: 'bbc.in/3B6arKW',
      handle: 'BBC News',
      keywords: [{
        icon: 'fab.fa-youtube',
        word: 'Charlie Bartolo'
      }, {
        icon: 'fab.fa-google',
        word: 'Kearne Solanke'
      }, {
        icon: 'fab.fa-wikipedia-w',
        word: 'London Crime'
      }]
    });

    this.el = el('.SCDialogWrapper',
      el('.SCDialogBody', [
        el('.SCDialogHeader', this.closeBtn),
        el('.SCDialogContent', [
          this.itemSummary,
          new Slideshow(config.mock.relatedNews, 'Related News', 'fal.fa-newspaper', 'news'),
          new Slideshow(config.mock.relatedSocialPosts, 'Social Posts', 'fal.fa-comments', 'social')
        ])
      ]))

    mount(document.body, this.el);
  }

  close() {
    logger.log('Dialog: close');

    unmount(document.body, this.el);
  }
}