import Link from "../components/link";

import logger from "../utils/logger";

export default class Agent {

  processing: boolean

  currentProcess: Link
  activeLinks: Link[] = []

  providerType: string

  constructor() {
    logger.log('Agent: constructor');
    this.processing = false;
  }

  start() {
    logger.log('Agent: start');

    /*if (typeof chrome !== 'undefined') { // detect chrome (is global)
      chrome.runtime.onMessage.addListener(this.onExtensionMessage.bind(this));
    }*/
  }

  async onDomChange(records?: MutationRecord[], delay?: boolean) {
    logger.log('Agent: onDomChange');

    let newItems: boolean = false;
    let links: Link[] = await this.findLinks(records, delay);

    for (let l = 0; l < links.length; l++) {
      const link = links[l];

      if (!this.activeLinks.find((activeItem: Link) => activeItem.node === link.node)) {
        this.activeLinks.push(link);
        newItems = true;
      }
    }

    if (this.processing === false && newItems)
      this.processLinks();
  }

  async processLinks() {
    logger.log('Agent: processLinks');

    this.processing = true;
    this.currentProcess = this.activeLinks.find((link: Link) => link.status === 'pending');

    if (this.currentProcess !== undefined) {
      this.appendLink(this.currentProcess);

      try {
        await this.currentProcess.getInfo();
        this.processLinks();
      } catch (error) {
        logger.error(`There was a problem while fetching the link data ${this.currentProcess}, error ${error}`);

        this.currentProcess.disableLoading();
        this.processLinks();
      }
    } else
      this.processing = false;
  }

  clearActiveLinks() {
    logger.log('Agent: clearActiveLinks');

    if (this.currentProcess)
      this.currentProcess.disableLoading();

    this.activeLinks = [];
    this.processing = false;
  }

  clearOpenDialogs() {
    logger.log('Agent: clearOpenDialogs');

    this.activeLinks.filter((link: Link) => link.dialog)
      .forEach((link: Link) => {
        link.dialog.close();
      });
  }

  async findLinks(records: MutationRecord[], delay: boolean): Promise<Link[]> {
    logger.log('Agent: findLinks');

    // Must be overwritten by child
    // Needs an abstract interface

    return [];
  }

  appendLink(link: Link) {
    logger.log('Agent: appendLink');

    // Must be overwritten by child
    // Needs an abstract interface
  }
}