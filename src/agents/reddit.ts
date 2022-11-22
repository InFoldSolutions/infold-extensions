import * as path from 'path';

import BaseAgent from './base';

import Link from "../components/link";

import logger from '../utils/logger';
import config from '../utils/config';

export default class RedditAgent extends BaseAgent {

  contentBody: HTMLElement
  contentObserver: MutationObserver
  listBody: HTMLElement

  providerType: string
  linkClasses: string[]
  contentID: string
  listClass: string

  constructor() {
    logger.log('RedditAgent: constructor');

    super();

    this.providerType = config.agents.reddit.providerType;
    this.linkClasses = config.agents.reddit.linkClasses;
    this.contentID = config.agents.reddit.contentID;
    this.listClass = config.agents.reddit.listClass;
  }

  start() {
    logger.log('RedditAgent: start');

    super.start();

    this.contentBody = document.getElementById(this.contentID);
    this.contentObserver = null;

    this.listBody = document.querySelector('.' + this.listClass);

    if (this.listBody) {
      this.contentObserver = new MutationObserver(this.onDomChange.bind(this))
      this.contentObserver.observe(this.listBody, {
        childList: true
      });
    }

    super.onDomChange();
  }

  findLinks(records?: MutationRecord[]) {
    logger.log('RedditAgent: findLinks');

    let links: Link[] = [];
    let elements: Element[] = [];

    if (records) { // check newly added nodes for potential links
      records.forEach((record: MutationRecord) => {
        record.addedNodes.forEach((addedNode: Element) => {
          elements = elements.concat(this.getPotentialLinksFromElement(addedNode));
        });
      })
    } else if (this.listBody) { // default to listBody
      elements = this.getPotentialLinksFromElement(this.listBody);
    }

    elements.forEach((element: HTMLAnchorElement) => {
      links.push(new Link(
        this.providerType,
        element
      ));
    });

    return links;
  }

  appendLink(link: Link) {
    logger.log('RedditAgent: appendLink');

    super.appendLink(link);

    if (link.node.parentNode.nextSibling)
      link.node.parentNode.nextSibling.appendChild(link.elWrapper);
    else if (link.node.parentNode.parentNode)
      link.node.parentNode.parentNode.appendChild(link.elWrapper);
  }

  getPotentialLinksFromElement(element: Element) {
    logger.log('RedditAgent: getPotentialLinksFromElement');

    const potentials = Array.from(
      element.getElementsByClassName(this.linkClasses.join(' ')) // look for specific classes in given element
    );

    return potentials.filter((potential: HTMLAnchorElement) => {
      const url: URL = new URL(potential.href);
      const extension: string = path.extname(url.pathname);

      return (!extension || extension === 'html');
    });
  }
}