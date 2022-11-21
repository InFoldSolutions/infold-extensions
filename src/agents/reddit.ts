import BaseAgent from './base';

import Link from "../models/link";

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

  findLinks(records: MutationRecord[]) {
    logger.log('RedditAgent: findLinks');

    let links: Link[] = [];
    let elements: Element[] = [];

    if (records) {
      records.forEach((record) => {
        //console.log('record', record, record.addedNodes);
        if (record.addedNodes.length > 0) {
          record.addedNodes.forEach((addedNode: Element) => {
            console.log('addedNode', addedNode)
            const elementList: Element[] = Array.from(
              addedNode.getElementsByClassName(this.linkClasses.join(' ')) // look for specific classes in newly added nodes
            );

            console.log('elementList', elementList);
            if (elementList.length > 0) {
              elements = elements.concat(elementList);
            }
          });
        }
      })
    } else if (this.listBody)
      elements = Array.from(this.listBody.getElementsByClassName(this.linkClasses.join(' ')));

    if (elements.length > 0) {
      console.log('elements', elements)
      elements.forEach((element: HTMLAnchorElement) => {
        links.push(new Link(
          element.href,
          this.providerType,
          element.parentNode as HTMLElement
        ));
      });
    }

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
}