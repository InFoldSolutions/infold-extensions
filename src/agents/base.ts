import Link from "../models/link";

import logger from "../utils/logger";

export default class BaseAgent {

  processing: boolean
  currentProcess: Link
  activeLinks: Link[] = []

  constructor() {
    logger.log('BaseAgent: constructor');
  }

  start() {
    logger.log('BaseAgent: start');

    /*if (typeof chrome !== 'undefined') { // detect chrome (is global)
      chrome.runtime.onMessage.addListener(this.onExtensionMessage.bind(this));
    }*/
  }

  appendLink(link: Link) {
    logger.log('BaseAgent: appendLink');

    link.preparetBaseHTML();
  }

  onDomChange(records: HTMLElement[]) {
    logger.log('BaseAgent: findLinks');

    let newItems = false;
    let links: Link[] = this.findLinks(records);

    // logger.log('onDomChange links', links);

    if (links.length > 0) {
      this.activeLinks = this.activeLinks.concat(links);
      newItems = true;
    }

    if (this.processing === false && newItems)
      this.processLinks();
  }

  async processLinks() {
    logger.log('BaseAgent: findLinks');

    this.processing = true;
    this.currentProcess = this.activeLinks.find((link) => link.status === 'pending');

    if (this.currentProcess !== undefined) {
      this.appendLink(this.currentProcess);

      try {
        await this.currentProcess.getInfo();
        this.processLinks();
      } catch (error) {
        logger.error(`There was a problem while fetching the link data ${this.currentProcess}, error ${error}`);

        this.currentProcess.disableLoading();
        this.currentProcess.setTag('fa-exclamation-circle');
        this.processLinks();
      }
    } else
      this.processing = false;
  }

  findLinks(records: HTMLElement[]): Link[] {
    logger.log('BaseAgent: findLinks');

    // Must be overwritten by child
    // Needs an interface

    return [];
  }
}