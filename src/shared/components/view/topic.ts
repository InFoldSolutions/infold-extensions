import { el, mount } from 'redom';

import { ITopic, ISource } from '../../types';

import logger from '../../utils/logger';

import TimeAgo from 'javascript-time-ago';

const timeAgo = new TimeAgo('en-US');

export default class Topic {

  topic: ITopic

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

  opened: boolean = false

  nextClickHandlerBind: any
  prevClickHandlerBind: any
  readMoreClickHandlerBind: any

  firstTwoKeyPoints: string[]
  restOfTheKeyPoints: string[]

  constructor(topic: ITopic) {
    logger.log('Topic: constructor');

    this.topic = topic;

    // topic title
    this.title = el('.SCTopicTitle', [
      //el('span.SCMarginRight.SCPrimaryBlue', 'Topic:'),
      this.topic.title
    ]);

    // summary info
    this.summaryInfo = el('.SCSummaryInfo', [
      el('span.SCIcon', [el('i.fad.fa-link'), `Summarized from ${this.topic.sources.length} sources`]),
      el('span.SCDate.SCIcon', [el('i.fad.fa-calendar-alt'), `First seen `, timeAgo.format(this.topic.firstSeen, 'mini'), ` ago`]),
    ]);

    this.readMore = el('span.SCReadMore', `more ..`);

    // key points
    this.firstTwoKeyPoints = this.topic.keyPoints.slice(0, 2);
    this.restOfTheKeyPoints = this.topic.keyPoints.slice(2);

    this.keypointsList = el('ul', this.firstTwoKeyPoints.map(this.mapKeyPoints.bind(this)));
    this.keypoints = el('.SCKeyPoints', this.keypointsList);

    // sources
    this.sourcesList = el('ul', this.topic.sources.map((source: ISource) => {
      const sourceName = source.name;
      const sourceIcon = source.icon;
      const articleLink = (source.articles.length > 0) ? source.articles[0].link : '#';
      const articleTitle = (source.articles.length > 0) ? source.articles[0].title : 'No article found';

      return el('li', { title: source.name }, el('a', { href: articleLink, title: articleTitle, target: '_blank' }, [
        el('img', { src: sourceIcon }),
        el('span.SCHandle', `${sourceName.toLocaleLowerCase().replace(/ /g, '')}`),
      ]));
    }));

    this.sources = el('.SCSources', this.sourcesList);

    this.prevButton = el('.SCArrow.SCLeft', el('i.fa.fa-angle-left'));
    mount(this.sources, this.prevButton);

    this.nextButton = el('.SCArrow.SCRight', el('i.fa.fa-angle-right'));
    mount(this.sources, this.nextButton);

    this.el = el('.SCTopicWrapper', [
      this.title,
      this.summaryInfo,
      this.keypoints,
      this.sources
    ]);

    // Bind functions
    this.nextClickHandlerBind = this.nextClickHandler.bind(this);
    this.prevClickHandlerBind = this.prevClickHandler.bind(this);
    this.readMoreClickHandlerBind = this.readMoreClickHandler.bind(this);

    // Attach click events
    this.nextButton.addEventListener('click', this.nextClickHandlerBind);
    this.prevButton.addEventListener('click', this.prevClickHandlerBind);
    this.readMore.addEventListener('click', this.readMoreClickHandlerBind);
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

  readMoreClickHandler(e: MouseEvent) {
    logger.log('Topic: prevClickHandler');

    e.preventDefault();

    this.opened = true;

    this.readMore.style.display = 'none';
    this.restOfTheKeyPoints.map(this.mapKeyPoints.bind(this)).forEach((keyPoint: HTMLElement) => {
      this.keypointsList.appendChild(keyPoint);
    });
  }

  mapKeyPoints(keyPoint: string, i: number) {
    logger.log('Topic: mapKeyPoints');

    if (!this.opened && i === 1)
      return el('li', [keyPoint, this.readMore]);

    return el('li', keyPoint);
  }

  destroy() {
    logger.log('Topic: destroy');

    this.nextButton.removeEventListener('click', this.nextClickHandlerBind);
    this.prevButton.removeEventListener('click', this.prevClickHandlerBind);

    this.readMore.removeEventListener('click', this.readMoreClickHandlerBind);
  }
}