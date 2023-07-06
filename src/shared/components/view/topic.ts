import { el, mount } from 'redom';

import { ITopic, ISource } from '../../types';

import logger from '../../utils/logger';

import TimeAgo from 'javascript-time-ago';

const timeAgo = new TimeAgo('en-US');

export default class Topic {

  el: HTMLElement
  title: HTMLElement
  keypoints: HTMLElement
  summaryInfo: HTMLElement

  sources: HTMLElement
  prevButton: HTMLElement
  nextButton: HTMLElement

  sourcesList: HTMLElement
  keypointsList: HTMLElement

  readMore: HTMLElement

  constructor(topic: ITopic) {
    logger.log('Topic: constructor');

    // topic title
    this.title = el('.SCTopicTitle', [
      topic.title
    ]);

    // summary info
    this.summaryInfo = el('.SCSummaryInfo', [
      `Summarized from ${topic.sources.length} sources,`,
      el('span.SCdate.SCIcon', [`first seen `, timeAgo.format(topic.firstSeen, 'mini'), ` ago`]),
    ]);

    this.readMore = el('span.SCReadMore', `more ..`);

    // key points
    this.keypointsList = el('ul', topic.keyPoints.map((keyPoint: string, i: number) => {
      if (i === topic.keyPoints.length - 1)
        return el('li', [keyPoint, this.readMore]);

      return el('li', keyPoint);
    }));

    this.keypoints = el('.SCKeyPoints', this.keypointsList);

    // sources
    this.sourcesList = el('ul', topic.sources.map((source: ISource) => {
      const sourceName = source.name;
      const sourceIcon = source.icon;

      return el('li', [
        el('img.SCIcon', { title: `Source icon`, src: sourceIcon }),
        el('span.SCHandle', `${sourceName.toLocaleLowerCase().replace(/ /g, '')}`),
      ]);
    }));

    this.sources = el('.SCSources', this.sourcesList);

    this.prevButton = el('.SCArrow.SCLeft', el('i.fa.fa-angle-left'));
    mount(this.sources, this.prevButton);

    this.nextButton = el('.SCArrow.SCRight', el('i.fa.fa-angle-right'));
    mount(this.sources, this.nextButton);

    this.nextButton.addEventListener('click', this.nextClickHandler.bind(this));
    this.prevButton.addEventListener('click', this.prevClickHandler.bind(this));

    this.el = el('.SCTopicWrapper', [
      this.title,
      this.summaryInfo,
      this.keypoints,
      this.sources
    ]);
  }

  nextClickHandler(e: MouseEvent) {
    logger.log('Topic: nextClickHandler');

    e.preventDefault();

    const x = this.sourcesList.clientWidth / 2 + this.sourcesList.scrollLeft + 0;
    this.sourcesList.scroll({
      left: x,
      behavior: 'smooth',
    });
  }

  prevClickHandler(e: MouseEvent) {
    logger.log('Topic: prevClickHandler');

    e.preventDefault();

    const x = this.sourcesList.clientWidth / 2 - this.sourcesList.scrollLeft + 0;
    this.sourcesList.scroll({
      left: -x,
      behavior: 'smooth',
    });
  }
}