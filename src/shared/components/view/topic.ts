import { el, mount } from 'redom';

import { ITopic, ISource } from '../../types';

import logger from '../../utils/logger';

import TimeAgo from 'javascript-time-ago';
import config from '../../utils/config';

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

  initialOutlineLenght: number

  readMore: HTMLElement
  readLess: HTMLElement

  opened: boolean = false

  nextClickHandlerBind: any
  prevClickHandlerBind: any
  readMoreClickHandlerBind: any
  readLessClickHandlerBind: any

  firstKeyPoint: string[]
  firstTwoKeyPoints: string[]
  restOfTheKeyPoints: string[]

  constructor(topic: ITopic) {
    logger.log('Topic: constructor');

    this.topic = topic;

    // topic title
    this.title = el('a.SCTopicTitle', { href: `${config.host}/topics/${this.topic.slug}`, target: '_blank', title: 'Explore topic on our website' },
      [el('b', `Topic: ${this.topic.title}`), el('i.fad.fa-external-link')]);

    // summary info
    this.summaryInfo = el('.SCSummaryInfo', [
      el('span.SCIcon', [el('i.fad.fa-link'), `Summarized from ${this.topic.sources.length} sources`]),
      el('span.SCDate.SCIcon', [el('i.fad.fa-calendar-alt'), `First seen `, timeAgo.format(this.topic.firstSeen, 'mini'), ` ago`]),
    ]);

    this.readMore = el('span.SCReadMore', 'more ..', { title: 'Show full outline' });
    this.readLess = el('span.SCReadMore', 'less ..', { title: 'Hide part of the outline' });

    // key points
    this.firstKeyPoint = this.topic.keyPoints.slice(0, 1);
    this.firstTwoKeyPoints = this.topic.keyPoints.slice(0, 2);

    this.initialOutlineLenght = 2;
    this.restOfTheKeyPoints = this.topic.keyPoints.slice(this.initialOutlineLenght);

    if (this.initialOutlineLenght === 2)
      this.keypointsList = el('ul', this.firstTwoKeyPoints.map(this.mapKeyPoints.bind(this)));
    else
      this.keypointsList = el('ul', this.firstKeyPoint.map(this.mapKeyPoints.bind(this)));

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
    this.readLessClickHandlerBind = this.readLessClickHandler.bind(this);

    // Attach click events
    this.nextButton.addEventListener('click', this.nextClickHandlerBind);
    this.prevButton.addEventListener('click', this.prevClickHandlerBind);
    this.readMore.addEventListener('click', this.readMoreClickHandlerBind);
    this.readLess.addEventListener('click', this.readLessClickHandlerBind);
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
    logger.log('Topic: readMoreClickHandler');

    e.preventDefault();

    this.opened = true;

    this.readMore.style.display = 'none';
    this.readLess.style.display = 'inline';

    this.restOfTheKeyPoints.map(this.mapKeyPoints.bind(this)).forEach((keyPoint: HTMLElement) => {
      this.keypointsList.appendChild(keyPoint);
    });
  }

  readLessClickHandler(e: MouseEvent) {
    logger.log('Topic: readLessClickHandler');

    e.preventDefault();

    this.opened = false;
    this.keypointsList.innerHTML = '';

    this.readMore.style.display = 'inline';
    this.readLess.style.display = 'none';

    if (this.initialOutlineLenght === 2) {
      this.firstTwoKeyPoints.map(this.mapKeyPoints.bind(this)).forEach((keyPoint: HTMLElement) => {
        this.keypointsList.appendChild(keyPoint);
      });
    } else {
      this.firstKeyPoint.map(this.mapKeyPoints.bind(this)).forEach((keyPoint: HTMLElement) => {
        this.keypointsList.appendChild(keyPoint);
      });
    }
  }

  mapKeyPoints(keyPoint: string, i: number) {
    logger.log('Topic: mapKeyPoints');

    if (!this.opened && i === (this.initialOutlineLenght - 1))
      return el('li', [keyPoint, this.readMore]);
    else if (this.opened && i === this.topic.keyPoints.length - (1 + this.initialOutlineLenght))
      return el('li', [keyPoint, this.readLess]);

    return el('li', keyPoint);
  }

  destroy() {
    logger.log('Topic: destroy');

    this.nextButton.removeEventListener('click', this.nextClickHandlerBind);
    this.prevButton.removeEventListener('click', this.prevClickHandlerBind);

    this.readMore.removeEventListener('click', this.readMoreClickHandlerBind);
  }
}