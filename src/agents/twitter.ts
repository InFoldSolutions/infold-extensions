import { mount } from 'redom';

import BaseAgent from './base';

import Link, { IPotentialLink } from "../components/link";

import logger from '../utils/logger';
import config from '../utils/config';

export default class TwitterAgent extends BaseAgent {

  bodyObserver: MutationObserver
  contentObserver: MutationObserver
  mainObserver: MutationObserver

  contentBody: HTMLElement
  listBody: Element
  mainBody: Element
  rootBody: HTMLElement
  providerType: string
  rootID: string

  constructor() {
    logger.log('TwitterAgent: constructor');

    super();

    this.providerType = config.agents.twitter.providerType;
    this.rootID = config.agents.twitter.rootID;
  }

  start() {
    logger.log('TwitterAgent: start');

    super.start();

    this.contentObserver = null;
    this.bodyObserver = null;

    this.rootBody = document.getElementById(this.rootID);
    this.bodyObserver = new MutationObserver(this.onBodyChange.bind(this));
    this.bodyObserver.observe(this.rootBody, {
      childList: true,
      subtree: true
    });
  }

  onBodyChange(records?: MutationRecord[]) {
    logger.log('TwitterAgent: onBodyChange');

    if (records) { // check newly added nodes for potential links
      records.forEach((record: MutationRecord) => {
        record.addedNodes.forEach((addedNode: Element) => {
          const main = addedNode.querySelector(`main > div`);

          if (main && !this.mainBody) {
            this.mainBody = main;
            this.bodyObserver.disconnect();
            this.startMainObserver();
          }
        });
      });
    }
  }

  startMainObserver() {
    logger.log('TwitterAgent: startMainObserver');

    this.mainObserver = new MutationObserver(this.mainBodyChange.bind(this))
    this.mainObserver.observe(this.mainBody, {
      childList: true
    });
  }

  mainBodyChange() {
    logger.log('mainBodyChange');

    const url: URL = new URL(location.href);
    const pathname = url.pathname.split('/');
    const pathArray = pathname.slice(Math.max(pathname.length - 2, 0));

    let subpage: Boolean = false;

    if (pathArray[0] === 'status' && /^-?\d+$/.test(pathArray[1]))
      subpage = true;

    console.log('subpage', subpage);

    if (this.contentObserver)
      this.stopContentObserver();

    if (!subpage) {
      this.startContentObserver();
    }
  }

  startContentObserver() {
    logger.log('TwitterAgent: startContentObserver');

    this.listBody = document.querySelector(`[data-testid="primaryColumn"]`);

    if (!this.listBody)
      return;

    this.contentObserver = new MutationObserver(this.onDomChange.bind(this))
    this.contentObserver.observe(this.listBody, {
      childList: true,
      subtree: true
    });

    super.onDomChange();
  }

  stopContentObserver() {
    logger.log('TwitterAgent: stopContentObserver');

    this.contentObserver.disconnect();
    this.contentObserver = null;
  }

  findLinks(records?: MutationRecord[]) {
    logger.log('TwitterAgent: findLinks');

    let links: Link[] = [];
    let potentialLinks: IPotentialLink[] = [];

    if (records) { // check newly added nodes for potential links
      records.forEach((record: MutationRecord) => {
        record.addedNodes.forEach((addedNode: Element) => {
          potentialLinks = potentialLinks.concat(this.getPotentialLinksFromElement(addedNode));
        });
      })
    } else if (this.listBody) { // default to listBody
      potentialLinks = this.getPotentialLinksFromElement(this.listBody);
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
    logger.log('TwitterAgent: appendLink');

    link.preparetBaseHTML();

    mount(link.wrapper, link, link.wrapper.lastElementChild);
  }

  getPotentialLinksFromElement(addedNode: Element): IPotentialLink[] {
    logger.log('TwitterAgent: getPotentialLinksFromElement');

    const potentials: IPotentialLink[] = [];
    const article: HTMLElement = addedNode.querySelector('article[data-testid="tweet"]');

    if (article && !article.classList.contains(config.defaults.processedClass)) {
      const elements: HTMLElement[] = Array.from(article.querySelectorAll('a[target="_blank"]'));

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLAnchorElement;

        if (!element)
          continue;

        const url: URL = new URL(element.href);
        const linksToTwitter: Boolean = url.host.includes('twitter.com');

        if (linksToTwitter)
          continue;

        const wrapperNode: HTMLElement = article.querySelector('div[role="group"]');

        if (!wrapperNode)
          continue;

        potentials.push({
          element,
          wrapperNode,
          article
        });

        article.classList.add(config.defaults.processedClass);

        break; // we only want to identify 1 link per article
      }
    }

    return potentials;
  }
}