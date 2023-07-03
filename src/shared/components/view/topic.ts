import { el } from 'redom';

import { ITopic, ISource } from '../../types';

import logger from '../../utils/logger';

import TimeAgo from 'javascript-time-ago';

const timeAgo = new TimeAgo('en-US');

export default class Topic {

  el: HTMLElement
  title: HTMLElement
  keypoints: HTMLElement
  sources: HTMLElement

  constructor(topic: ITopic) {
    logger.log('Topic: constructor');

    // topic title
    this.title = el('.SCTopicTitle', [
      el('span.SCLabel', 'topic'),
      topic.title
    ]);

    // key points
    this.keypoints = el('.SCKeyPoints', [
      el('span.SCLabel', 'key points'),
      el('ul', topic.keyPoints.map((keyPoint: string) => el('li', keyPoint)))
    ]);

    // sources
    this.sources = el('.SCSources', [
      el('span.SCLabel', 'sources'),
      el('ul', topic.sources.map((source: ISource) => {
        const sourceName = source.name;
        const sourceIcon = source.icon;

        return el('li', [
          el('img.SCIcon', { title: `Source icon`, src: sourceIcon }),
          el('span.SCHandle', `${sourceName}`),
        ]);
      }))
    ]);

    this.el = el('.SCTopicWrapper', [
      this.title,
      this.keypoints,
      this.sources
    ]);
  }
}