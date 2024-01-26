import { el, mount } from 'redom';

import ReconnectingWebSocket from 'reconnecting-websocket';

import { getWebsocket, closeWebsocket } from '../../services/websockets';

import { ITopic, ISource } from '../../types';

import logger from '../../utils/logger';

import TimeAgo from 'javascript-time-ago';
import config from '../../utils/config';
import CommentIcon from '../svgs/commentIcon';

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

  chatBot: HTMLElement
  chatEntries: HTMLElement
  chatTextArea: HTMLTextAreaElement
  chatBtn: HTMLButtonElement
  currentMessageEntry: HTMLElement

  opened: boolean = false

  nextClickHandlerBind: any
  prevClickHandlerBind: any
  readMoreClickHandlerBind: any
  readLessClickHandlerBind: any
  keyDownHandlerBind: any

  firstKeyPoint: string[]
  firstTwoKeyPoints: string[]
  restOfTheKeyPoints: string[]

  webSocket: ReconnectingWebSocket

  typeWriterInterval: any
  msgWords: string[]

  constructor(topic: ITopic, includeChatBot: boolean = false) {
    logger.log('Topic: constructor');

    const wrapperContents: HTMLElement[] = []

    this.topic = topic;

    // topic title
    this.title = el('a.SCTopicTitle.text-18.mb-0', { href: `${config.host}/topics/${this.topic.slug}`, target: '_blank', title: 'Explore topic on our website' },
      [`Topic: ${this.topic.title}`, el('i.fad.fa-external-link')]);

    wrapperContents.push(this.title);

    // summary info
    this.summaryInfo = el('.SCSummaryInfo.text-12', [
      el('span.SCIcon', [el('i.fad.fa-link'), `Summarized from ${this.topic.sources.length} sources`]),
      el('span.SCDate.SCIcon', [el('i.fad.fa-calendar-alt'), `First seen `, timeAgo.format(this.topic.firstSeen, 'mini'), ` ago`]),
    ]);

    wrapperContents.push(this.summaryInfo);

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

    this.keypoints = el('.SCKeyPoints.text-14', this.keypointsList);

    wrapperContents.push(this.keypoints);

    // sources
    this.sourcesList = el('ul', this.topic.sources.map((source: ISource) => {
      const sourceName = source.name;
      const sourceIcon = source.icon;
      const articleLink = (source.articles.length > 0) ? source.articles[0].link : '#';
      const articleTitle = (source.articles.length > 0) ? source.articles[0].title : 'No article found';

      return el('li.mt-0.w-auto', { title: source.name }, el('a.w-full', { href: articleLink, title: articleTitle, target: '_blank' }, [
        el('img', { src: sourceIcon }),
        el('span.SCHandle', `${sourceName.toLocaleLowerCase().replace(/ /g, '')}`),
      ]));
    }));

    this.sources = el('.SCSources', this.sourcesList);

    this.prevButton = el('.SCArrow.SCLeft', el('i.fa.fa-angle-left'));
    mount(this.sources, this.prevButton);

    this.nextButton = el('.SCArrow.SCRight', el('i.fa.fa-angle-right'));
    mount(this.sources, this.nextButton);

    wrapperContents.push(this.sources);

    this.el = el('.SCTopicWrapper', wrapperContents);

    // Bind functions
    this.nextClickHandlerBind = this.nextClickHandler.bind(this);
    this.prevClickHandlerBind = this.prevClickHandler.bind(this);
    this.readMoreClickHandlerBind = this.readMoreClickHandler.bind(this);
    this.readLessClickHandlerBind = this.readLessClickHandler.bind(this);
    this.keyDownHandlerBind = this.keyDownHandler.bind(this);

    // Attach click events
    this.nextButton.addEventListener('click', this.nextClickHandlerBind);
    this.prevButton.addEventListener('click', this.prevClickHandlerBind);
    this.readMore.addEventListener('click', this.readMoreClickHandlerBind);
    this.readLess.addEventListener('click', this.readLessClickHandlerBind);

    if (includeChatBot)
      this.setupChatBot();
  }

  async setupChatBot() {
    const socketURL = `${config.ws.chat}/${config.ws.path}/${this.topic.slug}`;
    this.webSocket = getWebsocket(socketURL);

    if (!this.webSocket)
      throw new Error('No websocket');

    this.chatEntries = el('.SCChatEntries')
    this.chatTextArea = el('textarea.m-0.p-0', { placeholder: 'Ask a question about this topic' }) as HTMLTextAreaElement
    this.chatBtn = el('button', { disabled: true }, new CommentIcon())
    this.chatBot = el('.SCChatBotWrapper', [
      this.chatEntries,
      el('.SCChatBot',
        [
          el('.SCChatBotInput', [
            this.chatTextArea,
            this.chatBtn
          ])
        ]
      )
    ]);

    this.webSocket.onmessage = (event: any) => {
      if (this.currentMessageEntry) {

        if (this.typeWriterInterval)
          clearInterval(this.typeWriterInterval);

        this.msgWords = event.data.trim().split(" ").reverse();
        
        this.currentMessageEntry.innerHTML = '';
        this.currentMessageEntry.innerHTML = this.msgWords.pop().trim();

        this.typeWriterInterval = setInterval(() => {
          this.addNextWord();
        }, 80);
      }
    }

    this.chatTextArea.addEventListener('keydown', this.keyDownHandlerBind);

    mount(this.el, this.chatBot, this.el.lastElementChild);
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

  keyDownHandler(e: KeyboardEvent) {
    logger.log('Topic: keyDownHandler');

    const textValue = this.chatTextArea.value.trim();

    if (textValue.length > 0)
      this.chatBtn.disabled = false;
    else
      this.chatBtn.disabled = true;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      this.webSocket.send(textValue);

      this.addChatEntry({ user: 'me', message: textValue });
      this.addChatEntry({ user: 'bot', message: '' });

      this.chatTextArea.value = '';
      this.chatBtn.disabled = true;
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

  addChatEntry(entry: any) {
    logger.log('Topic: addChatEntry');

    const entryClass = entry.user === 'me' ? `.SCChatEntry.SCMe` : '.SCChatEntry';
    const entryIcon = entry.user === 'me' ? `fa-user-alt` : 'fa-robot';
    const entryMsg = entry.message !== '' ? el('pre', entry.message) : el('span.SCChatEntryLoading', [
      el('span.SCLoadingDot'),
      el('span.SCLoadingDot.animation-delay-1'),
      el('span.SCLoadingDot.animation-delay-2'),
    ]);

    this.currentMessageEntry = el('pre', entryMsg);

    const chatEntry = el(entryClass, [
      el('span.SCChatEntryIcon', el(`i.fad.${entryIcon}`)),
      el('span.SCChatEntryMsg', this.currentMessageEntry),
    ]);

    mount(this.chatEntries, chatEntry);
  }

  addNextWord() {
    logger.log('Topic: addNextWord');

    if (this.currentMessageEntry) {
      if (this.msgWords.length > 0) {
        const entryMsg = this.currentMessageEntry;
        entryMsg.innerHTML = entryMsg.innerHTML + ' ' + this.msgWords.pop().trim();
      } else {
        clearInterval(this.typeWriterInterval);
        this.currentMessageEntry = null;
        this.typeWriterInterval = null;
      }
    }
  }

  destroy() {
    logger.log('Topic: destroy');

    this.nextButton.removeEventListener('click', this.nextClickHandlerBind);
    this.prevButton.removeEventListener('click', this.prevClickHandlerBind);
    this.readMore.removeEventListener('click', this.readMoreClickHandlerBind);
    this.readLess.removeEventListener('click', this.readLessClickHandlerBind);

    if (this.chatTextArea)
      this.chatTextArea.removeEventListener('keydown', this.keyDownHandlerBind);
    if (this.webSocket)
      closeWebsocket()
  }
}