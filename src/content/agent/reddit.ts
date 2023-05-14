import * as path from 'path';
import { mount } from 'redom';

import { IPotentialLink } from '../../shared/types';

import Agent from './agent';

import Link from "../../shared/components/link";

import logger from '../../shared/utils/logger';
import config from '../../shared/utils/config';

import { findParentByAttribute, timeDelay } from '../../shared/utils/helpers';
import { isPostPage } from '../../shared/utils/helpers';

export default class RedditAgent extends Agent {

  bodyObserver: MutationObserver
  pageObserver: MutationObserver
  contentWrapperObserver: MutationObserver
  contentObserver: MutationObserver

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

  start() {
    logger.log('RedditAgent: start');

    super.start();

    this.pageWrapper = document.getElementById(this.pageWrapperID);

    if (!this.pageWrapper)
      return;

    this.pageObserver = new MutationObserver(this.onPageChange.bind(this));
    this.pageObserver.observe(this.pageWrapper, {
      childList: true
    });

    this.bodyWrapper = document.getElementById(this.bodyWrapperID);

    if (!this.bodyWrapper)
      return;

    this.bodyObserver = new MutationObserver(this.onBodyChange.bind(this));
    this.bodyObserver.observe(this.bodyWrapper, {
      childList: true
    });

    const contentWrapper: HTMLElement = this.pageWrapper.querySelector(`.${this.contentWrapperClass}`);

    if (contentWrapper)
      this.startContentWrapperObserver(contentWrapper);

    let contentBody: HTMLElement = this.getContentBody();

    if (contentBody) {
      this.startContentObserver(contentBody);
      return;
    }

    const postBody: HTMLElement = document.querySelector(`.${this.postWrapperClass}`);

    if (postBody) {
      this.postBody = postBody;
      this.onDomChange();
    }
  }

  onPageChange() {
    logger.log('RedditAgent: onPageChange');

    if (this.contentObserver)
      this.stopContentObserver();

    const contentWrapper: HTMLElement = this.pageWrapper.querySelector(`.${this.contentWrapperClass}`);

    if (contentWrapper)
      this.startContentWrapperObserver(contentWrapper);

    if (this.contentInterval)
      clearInterval(this.contentInterval);

    this.contentInterval = setInterval(() => {
      const contentBody = this.getContentBody();

      if (contentBody) {
        clearInterval(this.contentInterval);
        this.startContentObserver(contentBody);
      }
    }, 1000);
  }

  onContentWrapperChange() {
    logger.log('RedditAgent: onContentWrapperChange');

    if (this.contentObserver)
      this.stopContentObserver();

    if (this.contentInterval)
      clearInterval(this.contentInterval);

    this.contentInterval = setInterval(() => {
      const contentBody = this.getContentBody();

      if (contentBody) {
        clearInterval(this.contentInterval);
        this.startContentObserver(contentBody);
      }
    }, 1000);
  }

  onBodyChange(records: MutationRecord[]) {
    logger.log('RedditAgent: onBodyChange');

    if (isPostPage()) {
      super.onDomChange(records, true);
    }
  }

  getContentBody(): HTMLElement {
    logger.log('RedditAgent: getContentBody');

    let contentBody: HTMLElement = this.pageWrapper.querySelector(`[data-testid="posts-list"]`);

    if (!contentBody)
      contentBody = this.pageWrapper.querySelector(`.${this.contentBodyClass}`);

    return contentBody;
  }

  stopContentWrapperObserver() {
    logger.log('RedditAgent: stopContentWrapperObserver');

    this.contentWrapperObserver.disconnect();
    this.contentWrapperObserver = null;
    this.contentWrapper = null;
  }

  startContentWrapperObserver(contentWrapper: HTMLElement) {
    logger.log('RedditAgent: startContentWrapperObserver');

    if (this.contentWrapperObserver)
      this.stopContentWrapperObserver();

    this.contentWrapper = contentWrapper;
    this.contentWrapperObserver = new MutationObserver(this.onContentWrapperChange.bind(this))
    this.contentWrapperObserver.observe(this.contentWrapper, {
      childList: true,
      attributes: true,
    });
  }

  stopContentObserver() {
    logger.log('RedditAgent: stopContentObserver');

    this.contentObserver.disconnect();
    this.contentObserver = null;
    this.contentBody = null;

    //this.clearActiveLinks();
  }

  startContentObserver(contentBody: HTMLElement) {
    logger.log('RedditAgent: startContentObserver');

    if (this.contentObserver)
      this.stopContentObserver();

    this.contentBody = contentBody;
    this.contentObserver = new MutationObserver(this.onDomChange.bind(this))
    this.contentObserver.observe(this.contentBody, {
      childList: true
    });

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
      if (this.contentBody && !isPostPage())
        potentialLinks = this.getPotentialLinksFromElement(this.contentBody);

      if (this.postBody && isPostPage())
        potentialLinks = this.getPotentialLinksFromElement(this.postBody);
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

      if (elements.length === 0) 
        continue;

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLAnchorElement;
        const url: URL = new URL(element.href);
        const extension: string = path.extname(url.pathname);

        if (config.defaults.blacklistedDomains.includes(url.host)) 
          continue;

        if (config.defaults.notAllowedExtensions.includes(extension)) 
          continue;

        potentials.push({
          href: element.href,
          wrapperNode,
          article: post
        });

        break; // we only want to identify 1 link per article
      }
    }

    return potentials;
  }
}