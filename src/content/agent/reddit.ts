import { mount } from 'redom';

import { IPotentialLink } from '../../shared/types';

import Agent from './agent';
import Observer from '../observer';

import Link from "../../shared/components/link";

import logger from '../../shared/utils/logger';
import config from '../../shared/utils/config';

import { timeDelay } from '../../shared/utils/helpers';

export default class RedditAgent extends Agent {

  appObserver: Observer
  contentObserver: Observer

  contentBodySelector: string
  appBodySelector: string
  feedBodySelector: string
  postItemTag: string
  currentRoute: string

  contentInterval: NodeJS.Timeout

  constructor() {
    logger.log('RedditAgent: constructor');

    super();

    this.providerType = config.agents.reddit.providerType;

    this.postItemTag = 'shreddit-post';
    this.contentBodySelector = 'main > div:last-child';
    this.appBodySelector = 'shreddit-app';
    this.feedBodySelector = 'shreddit-feed';
  }

  async start() {
    logger.log('RedditAgent: start');

    super.start();

    await this.startAppObserver();
    this.startContentObserver();
  }

  async stop() {
    logger.log('RedditAgent: stop');

    this.appObserver.disconnect();

    if (this.contentObserver)
      this.stopContentObserver();

    super.stop();
  }

  async startAppObserver() {
    logger.log('RedditAgent: startAppObserver');

    const appElements: HTMLCollectionOf<Element> = document.body.getElementsByTagName(this.appBodySelector);

    this.appObserver = new Observer(appElements[0] as HTMLElement, document.body, this.onAppChange.bind(this), false, true, false);

    await this.appObserver.start();

    this.currentRoute = this.appObserver.element.getAttribute('routename');
  }

  async stopAppObserver() {
    logger.log('RedditAgent: stopAppObserver');

    this.appObserver.disconnect();
  }

  async onAppChange() {
    logger.log('RedditAgent: onAppChange');

    this.currentRoute = this.appObserver.element.getAttribute('routename');

    this.clearActiveLinks();
    this.startContentObserver();
  }

  async startContentObserver() {
    logger.log('RedditAgent: startContentObserver');

    if (this.contentObserver)
      this.stopContentObserver();

    let contentSelector: string = this.contentBodySelector

    switch (this.currentRoute) {
      case 'frontpage':
        contentSelector = this.feedBodySelector;
        break;
      case 'post_page':
        contentSelector = this.postItemTag;
        break;
    }

    this.contentObserver = new Observer(contentSelector, document.body, this.onDomChange.bind(this), true);

    await this.contentObserver.start();

    if (this.contentObserver.element)
      this.onDomChange();
  }

  stopContentObserver() {
    logger.log('RedditAgent: stopContentObserver');

    this.contentObserver.disconnect();
    this.contentObserver = null;
  }

  async findLinks(records?: MutationRecord[], delay?: boolean) {
    logger.log('RedditAgent: findLinks');

    if (delay || !records)
      await timeDelay(100);

    const links: Link[] = [];

    let potentialLinks: IPotentialLink[] = [];

    if (records) {
      records.forEach((record: MutationRecord) => {
        record.addedNodes.forEach((addedNode: Element) => {
          potentialLinks = potentialLinks.concat(
            this.getPotentialLinksFromElement(addedNode as HTMLElement)
          )
        });
      });
    } else {
      if (this.contentObserver?.element) {
        potentialLinks = this.getPotentialLinksFromElement(this.contentObserver.element);
      }
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

    link.el.classList.add('button', 'border-md', 'flex', 'flex-row', 'text-neutral-content-weak', 'justify-center', 'items-center', 'h-xl', 'transition-all', 'font-semibold', 'relative', 'button-secondary', 'inline-flex', 'py-px', 'px-xs', 'opacity-50', 'hover:text-primary', 'hover:bg-secondary');

    // mounting can differ based on agent
    mount(link.wrapper, link);
  }

  getPotentialLinksFromElement(element: HTMLElement): IPotentialLink[] {
    logger.log('RedditAgent: getPotentialLinksFromElement');

    if (!element || !element.getElementsByTagName)
      return [];

    const potentials: IPotentialLink[] = [];

    let posts: HTMLCollectionOf<Element>;

    if (this.currentRoute === 'post_page' && element.tagName === this.postItemTag.toUpperCase()) {
      // @ts-ignore
      posts = [element];
    } else {
      posts = element.getElementsByTagName(this.postItemTag);
    }

    for (let p = 0; p < posts.length; p++) {
      const post: HTMLElement = posts[p] as HTMLElement;

      if (post.classList.contains(config.defaults.processedClass))
        continue;

      post.classList.add(config.defaults.processedClass);

      const wrapperNode: HTMLElement = post.shadowRoot.querySelector('[name="share-button"]')?.parentElement;

      if (!wrapperNode)
        continue;

      if (wrapperNode.querySelector('.SCDialog'))
        continue;

      const elements: HTMLElement[] = Array.from(post.querySelectorAll('a[target="_blank"]'));

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