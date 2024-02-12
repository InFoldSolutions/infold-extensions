import { el, mount } from 'redom';

import { ISource, IArticle } from '../../types';

import logger from '../../utils/logger';

import ChatBot from '../chatbot';

import TimeAgo from 'javascript-time-ago';
const timeAgo = new TimeAgo('en-US');

export default class ArticleView {

  article: IArticle

  chatBot: ChatBot

  el: HTMLElement

  title: HTMLElement
  summaryInfo: HTMLElement
  sources: HTMLElement
  summaryContent: HTMLElement

  prevButton: HTMLElement
  nextButton: HTMLElement
  sourcesList: HTMLElement
  readMore: HTMLElement
  readLess: HTMLElement

  initialOutlineLenght: number

  opened: boolean = false

  nextClickHandlerBind: any
  prevClickHandlerBind: any
  readMoreClickHandlerBind: any
  readLessClickHandlerBind: any

  constructor(article: IArticle, sources: ISource[], includeChatBot: boolean = false) {
    logger.log('ArticleView: constructor');

    const wrapperContents: HTMLElement[] = []

    this.article = article;

    this.title = el('a.SCTopicTitle.text-18.mb-0', {
      href: `${this.article.link}`,
      target: '_blank',
      title: 'Read the full article'
    },
      `Article: ${this.article.title}`
    );

    wrapperContents.push(this.title);

    this.readMore = el('span.SCReadMore', 'more ..', { title: 'Show full summary' });
    this.readLess = el('span.SCReadMore', 'less ..', { title: 'Hide part of the summary' });

    this.readMore.style.display = 'inline';
    this.readLess.style.display = 'none';

    // summary info
    this.summaryInfo = el('.SCSummaryInfo.text-12', [
      el('span.SCIcon', [el('i.fad.fa-link'), `Summarized from ${sources.length} sources`]),
      el('span.SCDate.SCIcon', [el('i.fad.fa-calendar-alt'), `First seen `, timeAgo.format(this.article.timestamp, 'mini'), ` ago`]),
      this.readMore,
      this.readLess
    ]);

    wrapperContents.push(this.summaryInfo);

    this.summaryContent = el('.SCSummaryContent', [this.article.body]);

    wrapperContents.push(this.summaryContent);

    this.sourcesList = el('ul', sources.map((source: ISource) => {
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

    // Attach click events
    this.nextButton.addEventListener('click', this.nextClickHandlerBind);
    this.prevButton.addEventListener('click', this.prevClickHandlerBind);
    this.readMore.addEventListener('click', this.readMoreClickHandlerBind);
    this.readLess.addEventListener('click', this.readLessClickHandlerBind);

    if (includeChatBot)
      this.setupChatBot();
  }

  async setupChatBot() {
    logger.log('ArticleView: setupChatBot');
    this.chatBot = new ChatBot(this.article.link);
    mount(this.el, this.chatBot, this.el.lastElementChild);
  }

  nextClickHandler(e: MouseEvent) {
    logger.log('ArticleView: nextClickHandler');

    e.preventDefault();

    const x = this.sourcesList.clientWidth / 2 + this.sourcesList.scrollLeft + 0;
    this.sourcesList.scroll({
      left: x,
      behavior: 'smooth',
    });
  }

  prevClickHandler(e: MouseEvent) {
    logger.log('ArticleView: prevClickHandler');

    e.preventDefault();

    const x = this.sourcesList.clientWidth / 2 - this.sourcesList.scrollLeft + 0;
    this.sourcesList.scroll({
      left: -x,
      behavior: 'smooth',
    });
  }

  readMoreClickHandler(e: MouseEvent) {
    logger.log('ArticleView: readMoreClickHandler');

    e.preventDefault();

    this.opened = true;

    this.readMore.style.display = 'none';
    this.readLess.style.display = 'inline';

    this.summaryContent.classList.add('opened')
  }

  readLessClickHandler(e: MouseEvent) {
    logger.log('ArticleView: readLessClickHandler');

    e.preventDefault();

    this.opened = false;

    this.readMore.style.display = 'inline';
    this.readLess.style.display = 'none';

    this.summaryContent.classList.remove('opened')
  }

  destroy() {
    logger.log('ArticleView: destroy');

    this.nextButton.removeEventListener('click', this.nextClickHandlerBind);
    this.prevButton.removeEventListener('click', this.prevClickHandlerBind);
    this.readMore.removeEventListener('click', this.readMoreClickHandlerBind);
    this.readLess.removeEventListener('click', this.readLessClickHandlerBind);
  }
}