import { mount, el } from 'redom';

import BaseAgent from './base';

import Link from "../components/link";

import logger from '../utils/logger';
import config from '../utils/config';

export default class TwitterAgent extends BaseAgent {

  contentBody: HTMLElement
  contentObserver: MutationObserver
  bodyObserver: MutationObserver
  listBody: Element
  rootBody: HTMLElement

  providerType: string
  linkClasses: string[]
  contentClass: string
  rootID: string

  constructor() {
    logger.log('TwitterAgent: constructor');

    super();

    this.providerType = config.agents.twitter.providerType;
    this.linkClasses = config.agents.twitter.linkClasses;
    this.contentClass = config.agents.twitter.contentClass;
    this.rootID = config.agents.twitter.rootID;
  }

  start() {
    logger.log('TwitterAgent: start');

    super.start();

    this.contentObserver = null;
    this.bodyObserver = null;

    this.listBody = document.querySelector(`[data-testid="primaryColumn"]`);

    if (!this.listBody) {
      this.rootBody = document.getElementById(this.rootID);
      this.bodyObserver = new MutationObserver(this.onBodyChange.bind(this));
      this.bodyObserver.observe(this.rootBody, {
        childList: true,
        subtree: true
      });
    } else
      this.startContentObserver();
  }

  onBodyChange(records?: MutationRecord[]) {
    console.log('onBodyChange', records);

    if (records) { // check newly added nodes for potential links
      records.forEach((record: MutationRecord) => {
        record.addedNodes.forEach((addedNode: Element) => {
          let body = addedNode.querySelector(`[data-testid="primaryColumn"]`);

          if (body) {
            this.bodyObserver.disconnect();
            this.listBody = body;
          }
        });
      });

      if (this.listBody) {
        this.startContentObserver();
      }
    }
  }

  startContentObserver() {
    this.contentObserver = new MutationObserver(this.onDomChange.bind(this))
    this.contentObserver.observe(this.listBody, {
      childList: true,
      subtree: true
    });

    super.onDomChange();
  }

  findLinks(records?: MutationRecord[]) {
    logger.log('TwitterAgent: findLinks');

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

    console.log('elements', elements);

    elements.forEach((element: HTMLAnchorElement) => {
      links.push(new Link(
        this.providerType,
        element
      ));
    });

    return links;
  }

  appendLink(link: Link) {
    logger.log('TwitterAgent: appendLink');

    const parent: Element = link.node.parentNode.parentNode.parentNode.parentNode.lastElementChild.firstElementChild;
    const element: HTMLElement = el(`.r-1h0z5md.r-18u37iz.r-bt1l66.r-1777fci`, [
      el(`span.r-1bwzh9t`, el(`i.fal.fa-lightbulb`)), 
      el(`span.r-1k6nrdp.r-1cwl3u0.r-n6v787.r-1e081e0.css-901oao.r-1bwzh9t`, '86')
    ])

    link.preparetBaseHTML(element);

    mount(parent, link, parent.lastElementChild);
  }

  getPotentialLinksFromElement(element: Element) {
    logger.log('TwitterAgent: getPotentialLinksFromElement');

    const potentials = Array.from(
      element.getElementsByClassName(this.linkClasses.join(' ')) // look for specific classes in given element
    );

    return potentials.filter((potential: HTMLAnchorElement) => {
      //const url: URL = new URL(potential.href);
      return potential.getAttribute('role') === 'link';
    });
  }
}