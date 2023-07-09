import { mount } from 'redom';

import { IPotentialLink } from '../../shared/types';

import Agent from './agent';
import Observer from '../observer';

import Link from "../../shared/components/link";

import logger from '../../shared/utils/logger';
import config from '../../shared/utils/config';

import { timeDelay } from '../../shared/utils/helpers';
import { isPostPage } from '../../shared/utils/helpers';

export default class RedditAgent extends Agent {

  bodyObserver: Observer
  pageObserver: Observer
  postObserver: Observer
  contentWrapperObserver: Observer
  contentObserver: Observer

  contentBodyClassSelector: string
  contentBodyClass: string
  contentWrapperClass: string
  outboundLinkClass: string
  postWrapperClass: string
  groupWrapperClasses: string[]

  bodyWrapperID: string
  pageWrapperID: string

  pageWrapper: HTMLElement
  bodyWrapper: HTMLElement
  contentWrapper: HTMLElement
  contentBody: HTMLElement
  postBody: HTMLElement

  contentInterval: NodeJS.Timeout

  constructor() {
    logger.log('RedditAgent: constructor');

    super();

    this.providerType = config.agents.reddit.providerType;

    this.outboundLinkClass = 'styled-outbound-link';
    this.contentWrapperClass = '_1OVBBWLtHoSPfGCRaPzpTf';
    this.contentBodyClass = 'rpBJOHq2PR60pnwJlUyP0';
    this.bodyWrapperID = 'SHORTCUT_FOCUSABLE_DIV';
    this.pageWrapperID = 'AppRouter-main-content';
    this.postWrapperClass = 'uI_hDmU5GSiudtABRz_37';
    this.groupWrapperClasses = ['_3-miAEojrCvx_4FQ8x3P-s', '_2IpBiHtzKzIxk2fKI4UOv1', '_3jwri54NGT-SRatPIZYiMo'];
  }

  async start() {
    logger.log('RedditAgent: start');

    super.start();

    this.bodyObserver = new Observer(`#${this.bodyWrapperID}`, document.body, this.onBodyChange.bind(this));
    await this.bodyObserver.start();

    this.pageObserver = new Observer(`#${this.pageWrapperID}`, document.body, this.onPageChange.bind(this));
    await this.pageObserver.start();

    await this.startContentWrapperObserver();

    if (isPostPage()) {
      this.postObserver = new Observer(`.${this.postWrapperClass}`, document.body, this.onDomChange.bind(this));
      await this.postObserver.start();

      this.onDomChange();
    }
    else
      this.startContentObserver();
  }

  async stop() {
    logger.log('RedditAgent: stop');

    this.bodyObserver.disconnect();
    this.pageObserver.disconnect();

    if (this.contentWrapperObserver)
      this.stopContentWrapperObserver();
    if (this.contentObserver)
      this.stopContentObserver();

    super.stop();
  }

  onPageChange(records: MutationRecord[]) {
    logger.log('RedditAgent: onPageChange');

    this.startContentWrapperObserver();
    //this.startContentObserver();
  }

  onContentWrapperChange(records: MutationRecord[]) {
    logger.log('RedditAgent: onContentWrapperChange');

    let started: boolean = false;

    records.forEach((record: MutationRecord) => {
      if (record.type === 'attributes') {
        this.startContentObserver();
        started = true;
      } else if (record.type === 'childList') {
        record.addedNodes.forEach((addedNode: Element) => {
          if (addedNode.classList.contains(this.contentBodyClass) || addedNode.querySelector(`.${this.contentBodyClass}`)) {
            this.startContentObserver();
            started = true;
          }
        });

        if (!started) { //could be "nextSibling" scenario
          const nextSibling: Element = record.nextSibling as Element;

          if (nextSibling && nextSibling.classList && nextSibling.classList.contains(this.contentBodyClass)) {
            this.startContentObserver();
            started = true;
          }
        }
      }
    });
  }

  async onBodyChange() {
    logger.log('RedditAgent: onBodyChange');

    if (isPostPage()) {
      this.postObserver = new Observer(`.${this.postWrapperClass}`, document.body, this.onDomChange.bind(this));
      await this.postObserver.start();

      this.onDomChange();
    } else {
      if (this.postObserver) {
        this.postObserver.disconnect();
        this.postObserver = null;
      }
    }
  }

  getContentBodyClassSelector(): string {
    logger.log('RedditAgent: getContentBody');

    let contentBody: HTMLElement = this.pageObserver.element.querySelector(`[data-testid="posts-list"]`);

    if (contentBody)
      return `[data-testid="posts-list"]`;

    return `.${this.contentBodyClass}`;
  }

  stopContentWrapperObserver() {
    logger.log('RedditAgent: stopContentWrapperObserver');

    this.contentWrapperObserver.disconnect();
    this.contentWrapperObserver = null;
    this.contentWrapper = null;

    this.clearActiveLinks();
  }

  async startContentWrapperObserver() {
    logger.log('RedditAgent: startContentWrapperObserver');

    if (this.contentWrapperObserver)
      this.stopContentWrapperObserver();

    const contentWrapper: HTMLElement = this.pageObserver.element.querySelector(`.${this.contentWrapperClass}`);

    if (contentWrapper) {
      this.contentWrapperObserver = new Observer(contentWrapper, this.pageObserver.element, this.onContentWrapperChange.bind(this), false, true);
      await this.contentWrapperObserver.start();
    }
  }

  stopContentObserver() {
    logger.log('RedditAgent: stopContentObserver');

    this.contentObserver.disconnect();
    this.contentObserver = null;
    this.contentBody = null;
  }

  async startContentObserver() {
    logger.log('RedditAgent: startContentObserver');

    if (this.contentObserver)
      this.stopContentObserver();

    this.contentBodyClassSelector = this.getContentBodyClassSelector();

    this.contentObserver = new Observer(this.contentBodyClassSelector, this.pageObserver.element, this.onDomChange.bind(this));
    await this.contentObserver.start();

    this.onDomChange();
  }

  async findLinks(records?: MutationRecord[], delay?: boolean) {
    logger.log('RedditAgent: findLinks');

    if (delay || !records)
      await timeDelay(500);

    const links: Link[] = [];

    let potentialLinks: IPotentialLink[] = [];

    if (records) {
      records.forEach((record: MutationRecord) => {
        record.addedNodes.forEach((addedNode: Element) => {
          if (addedNode.querySelector && typeof addedNode.querySelector === 'function') {  // all addedNodes are object as type, but can also come in as string, hacky this is..
            potentialLinks = potentialLinks.concat(
              this.getPotentialLinksFromElement(addedNode as HTMLElement)
            )
          }
        });
      });
    } else {
      if (this.contentObserver && !isPostPage())
        potentialLinks = this.getPotentialLinksFromElement(this.contentObserver.element);

      if (this.postObserver && isPostPage())
        potentialLinks = this.getPotentialLinksFromElement(this.postObserver.element);
    }

    potentialLinks.forEach((potentialLink: IPotentialLink) => {
      links.push(new Link(
        this.providerType,
        potentialLink
      ));
    });

    return links;
  }

  appendLink(link: Link) {
    logger.log('RedditAgent: appendLink');

    link.preparetBaseHTML();

    // mounting can differ based on agent
    if (link.isCompactVersion)
      mount(link.wrapper, link, link.wrapper.firstElementChild);
    if (link.wrapper)
      mount(link.wrapper, link, link.wrapper.firstElementChild.nextElementSibling);
  }

  getPotentialLinksFromElement(element: HTMLElement): IPotentialLink[] {
    logger.log('RedditAgent: getPotentialLinksFromElement');

    const potentials: IPotentialLink[] = [];
    const posts: NodeListOf<HTMLElement> = element.querySelectorAll('div[data-testid="post-container"]');

    for (let p = 0; p < posts.length; p++) {
      const post: HTMLElement = posts[p];

      if (post.classList.contains(config.defaults.processedClass))
        continue;

      post.classList.add(config.defaults.processedClass);

      const wrapperNode: HTMLElement = post.querySelector(`.${this.groupWrapperClasses.join(', .')}`);

      if (!wrapperNode)
        continue;

      if (wrapperNode.querySelector('.SCDialog'))
        continue;

      const elements: HTMLElement[] = Array.from(post.querySelectorAll('a[target="_blank"], a[data-testid="outbound-link"]'));

      if (elements.length === 0) {
        potentials.push({
          href: null,
          wrapperNode,
          article: post
        });
        continue;
      }

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLAnchorElement;

        potentials.push({
          href: element.href,
          linkText: element.innerText,
          wrapperNode,
          article: post
        });

        break; // we only want to identify 1 link per article
      }
    }

    return potentials;
  }
}