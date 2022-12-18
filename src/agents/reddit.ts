import * as path from 'path';

import { mount, el } from 'redom';

import BaseAgent from './base';

import Link, { IPotentialLink } from "../components/link";

import logger from '../utils/logger';
import config from '../utils/config';

import { findParentByCls } from '../utils/helpers';

export default class RedditAgent extends BaseAgent {

  postObserver: MutationObserver
  pageObserver: MutationObserver
  contentWrapperObserver: MutationObserver
  contentObserver: MutationObserver

  providerType: string

  linkClasses: string[]
  wrapperClass: string
  buttonClasses: string[]
  textClasses: string[]

  contentBodyClass: string
  postWrapperID: string
  pageWrapperID: string

  pageWrapper: HTMLElement
  postWrapper: HTMLElement
  contentBody: HTMLElement

  constructor() {
    logger.log('RedditAgent: constructor');

    super();

    this.providerType = config.agents.reddit.providerType;
    this.linkClasses = config.agents.reddit.linkClasses;
    this.wrapperClass = config.agents.reddit.wrapperClass;
    this.buttonClasses = config.agents.reddit.buttonClasses;
    this.textClasses = config.agents.reddit.textClasses;

    this.contentBodyClass = config.agents.reddit.contentClass;
    this.postWrapperID = 'SHORTCUT_FOCUSABLE_DIV';
    this.pageWrapperID = 'AppRouter-main-content';
  }

  start() {
    logger.log('RedditAgent: start');

    super.start();

    this.pageWrapper = document.getElementById(this.pageWrapperID);

    this.pageObserver = new MutationObserver(this.onPageChange.bind(this));
    this.pageObserver.observe(this.pageWrapper, {
      childList: true
    });

    this.postWrapper = document.getElementById(this.postWrapperID);

    this.postObserver = new MutationObserver(this.onPostChange.bind(this));
    this.postObserver.observe(this.postWrapper, {
      childList: true
    });

    const contentBody: HTMLElement = document.querySelector('.' + this.contentBodyClass);

    if (contentBody)
      this.startContentObserver(contentBody);
  }

  onPageChange(records: MutationRecord[]) {
    logger.log('RedditAgent: onPageChange');

    if (records) {
      records.forEach((record: MutationRecord) => {
        record.addedNodes.forEach((addedNode: Element) => {
          console.log('onPageChange addedNode', addedNode);

          let contentBody: HTMLElement;

          const contentWrapper: HTMLElement = addedNode.querySelector('._1OVBBWLtHoSPfGCRaPzpTf');
          console.log('onPageChange contentWrapper', contentWrapper);

          if (contentWrapper) {
            contentBody = addedNode.querySelector('.rpBJOHq2PR60pnwJlUyP0');
            console.log('onPageChange contentBody', contentBody);
          }

          if (contentWrapper) {
            this.startContentWrapperObserver(contentWrapper);
          } 

          if (contentBody) {
            this.startContentObserver(contentBody);
          }
        });
      });
    }
  }

  onPostChange(records: MutationRecord[]) {
    logger.log('RedditAgent: onPostChange');

    if (records) {
      records.forEach((record: MutationRecord) => {
        record.addedNodes.forEach((addedNode: Element) => {
          console.log('onPostChange addedNone', addedNode);
        });
      });
    }
  }

  startContentWrapperObserver(contentWrapper: HTMLElement) {
    logger.log('RedditAgent: startContentWrapperObserver');
    if (this.contentWrapperObserver)
      this.stopContentWrapperObserver();

    this.contentWrapperObserver = new MutationObserver(this.contentWrapperChange.bind(this))
    this.contentWrapperObserver.observe(contentWrapper, {
      childList: true
    });
  }

  stopContentWrapperObserver() {
    logger.log('RedditAgent: stopContentWrapperObserver');

    this.contentWrapperObserver.disconnect();
    this.contentWrapperObserver = null;
  }

  contentWrapperChange(records: MutationRecord[]) {
    records.forEach((record: MutationRecord) => {
      record.addedNodes.forEach((addedNode: Element) => {
        console.log('contentWrapperChange addedNone', addedNode);
        let contentBody: HTMLElement;

        if (addedNode.classList.contains('rpBJOHq2PR60pnwJlUyP0')) {
          contentBody = addedNode as HTMLElement;
        } else {
          contentBody = addedNode.querySelector('.rpBJOHq2PR60pnwJlUyP0');
        }

        if (contentBody) {
          this.startContentObserver(contentBody);
        }
      });
    });
  }

  stopContentObserver() {
    logger.log('RedditAgent: stopContentObserver');

    this.contentObserver.disconnect();
    this.contentObserver = null;
    this.contentBody = null;
  }

  startContentObserver(contentBody: HTMLElement) {
    logger.log('RedditAgent: startContentObserver');

    /*if (this.contentWrapperObserver)
      this.stopContentWrapperObserver();*/
    if (this.contentObserver)
      this.stopContentObserver();

    this.contentBody = contentBody;
    this.contentObserver = new MutationObserver(this.onDomChange.bind(this))
    this.contentObserver.observe(this.contentBody, {
      childList: true
    });

    super.onDomChange();
  }

  findLinks(records?: MutationRecord[]) {
    logger.log('RedditAgent: findLinks');

    let links: Link[] = [];
    let potentialLinks: IPotentialLink[] = [];

    if (records) {
      records.forEach((record: MutationRecord) => {
        record.addedNodes.forEach((addedNode: Element) => {
          potentialLinks = potentialLinks.concat(
            this.getPotentialLinksFromElement(addedNode as HTMLElement)
          );
        });
      });
    } else if (this.contentBody) {
      potentialLinks = this.getPotentialLinksFromElement(this.contentBody);
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
    mount(link.wrapper, link, link.wrapper.firstElementChild);
  }

  getPotentialLinksFromElement(element: HTMLElement) {
    logger.log('RedditAgent: getPotentialLinksFromElement');

    const potentials = Array.from(
      element.getElementsByClassName(this.linkClasses.join(' ')) // look for specific classes in given element
    );

    return potentials.filter((potential: HTMLAnchorElement) => {
      const url: URL = new URL(potential.href);
      const outBindLink = (potential.dataset['testid'] === 'outbound-link') && !url.host.includes('reddit');
      const extension: string = path.extname(url.pathname);

      return (outBindLink && (!extension || extension === '.html'));
    }).map((potentialElement: HTMLAnchorElement) => {
      const article: HTMLElement = findParentByCls(potentialElement, 'scrollerItem');
      const wrapperNode: HTMLElement = article.querySelector('._3-miAEojrCvx_4FQ8x3P-s');

      return {
        element: potentialElement,
        wrapperNode,
        article
      }
    });
  }
}