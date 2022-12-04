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

    this.itemSummary = new Summary({
      title: 'Kearne Solanke and Charlie Bartolo deaths: Two teens charged',
      description: 'Two boys are charged with murdering Kearne Solanke and Charlie Bartolo a mile apart in London.',
      icon: 'https://pbs.twimg.com/profile_images/1150716997254209536/M7gkjsv5_400x400.jpg',
      date: '7h ago',
      link: 'bbc.in/3B6arKW',
      handle: 'BBC News',
      keywords: ['Charlie Bartolo', 'Kearne Solanke', 'London Crime']
    });

    this.el = el('.SCDialogWrapper',
      el('.SCDialogBody', [
        el('.SCDialogHeader', this.closeBtn),
        el('.SCDialogContent', [
          this.itemSummary,
          new Slideshow([{
            title: 'G-7 joins EU on $60-per-barrel price cap on Russian oil',
            body: 'The Group of Seven nations and Australia agreed Friday to adopt a reached unanimous agreement on the...',
            icon: 'https://pbs.twimg.com/profile_images/807306191395241984/s8xmWAvU_400x400.jpg',
            link: 'vox.in/3B6arKW',
            author: 'Vox',
            date: '2d ago'
          }, {
            title: 'After Hawaii crash, NTSB calls for helicopters',
            body: 'Federal officials investigating a helicopter crash in Hawaii helicopters that are commonly used by air tour operators,...',
            icon: 'https://pbs.twimg.com/profile_images/576079042664738817/yT48F_Qq_400x400.jpeg',
            link: 'apnews.in/3B6arKW',
            author: 'AP News',
            date: '1h ago'
          }, {
            title: 'Teenager canvassing for Warnock shot in Savannah ahead runoff',
            body: 'Police say no indication shooting politically motivated as teen working for Democrat is treated for non-life threatening injuries',
            icon: 'https://pbs.twimg.com/profile_images/1175141826870861825/K2qKoGla_400x400.png',
            link: 'guardian.in/3B6arKW',
            author: 'Guardian',
            date: '13h ago'
          }, {
            title: 'Australia Set to Raise Rates as Tightening Cycle Approaches End',
            body: 'Australia is set to raise interest rates as it closes in on the end of its tightening cycle, while nearby New Zealand...',
            icon: 'https://pbs.twimg.com/profile_images/991818020233404416/alrBF_dr_400x400.jpg',
            link: 'bloomberg.in/3B6arKW',
            author: 'Bloomberg',
            date: '52m ago'
          }, {
            title: 'Americans think they’ll need $1.9 million to retire',
            body: 'Your main retirement goal should focus on savings and not on age, according to financial expert Chris Hogan.',
            icon: 'https://pbs.twimg.com/profile_images/1583214318719475713/rP1UOXbz_400x400.jpg',
            link: 'bloomberg.in/3B6arKW',
            author: 'CNBC',
            date: '52m ago'
          }, {
            title: 'Smithsonian exhibit explores how entertainment shaped',
            body: '"Entertainment Nation/Nación del espectáculo," a new exhibition at the "Star Wars" and...',
            icon: 'https://pbs.twimg.com/profile_images/1374394535883673604/4VIECtDH_400x400.jpg',
            link: 'cbsnews.in/3B6arKW',
            author: 'CBSNews',
            date: '2d ago'
          }], 'Related News', 'fal.fa-newspaper')
        ])
      ]))

    mount(document.body, this.el);
  }

  close() {
    logger.log('Dialog: close');

    unmount(document.body, this.el);
  }
}