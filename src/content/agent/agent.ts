import Link from "../../shared/components/link";

import config from "../../shared/utils/config";
import logger from "../../shared/utils/logger";

import events from "../../shared/services/events";

export default class Agent {

  processing: boolean

  currentProcesses: Link[] = []
  pendingProcesses: Link[] = []

  activeLinks: Link[] = []

  providerType: string

  constructor() {
    logger.log('Agent: constructor');

    this.onEvents();
    this.processing = false;
  }

  async start() {
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

      if (this.isNotDetectedLink(link)) {
        this.activeLinks.push(link);
        newItems = true;
      }
    }

    if (newItems)
      this.queueLinks();
  }

  isNotDetectedLink(link: Link) {
    logger.log('Agent: isNotActiveLink');
    return !this.activeLinks.find((activeItem: Link) => activeItem.article === link.article && activeItem.href === link.href)
  }

  queueLinks() {
    logger.log('Agent: queueLinks');

    const newPending = this.activeLinks.filter((link: Link) => link.status === 'pending');

    for (let i = 0; i < newPending.length; i++) {
      const link = newPending[i];

      link.setStatus('processing');
      
      if (this.pendingProcesses.length < 20)
        this.pendingProcesses.push(link);
      else
        this.pendingProcesses.unshift(link);
    }

    this.processLinks();
  }

  async processLinks() {
    logger.log('Agent: processLinks');

    if (this.pendingProcesses.length > 0 && this.currentProcesses.length < config.api.lookupConcurrency) {
      this.processing = true;

      const newProcessesCount = config.api.lookupConcurrency - this.currentProcesses.length;
      const addNewCount = newProcessesCount > this.pendingProcesses.length ? this.pendingProcesses.length : newProcessesCount;

      // feed new from pending
      for (let i = 0; i < addNewCount; i++) {
        const link = this.pendingProcesses[i];

        if (!link || !link.href)
          continue;

        this.currentProcesses.push(link);
        this.pendingProcesses.splice(i, 1);

        this.appendLink(link);

        link.getInfo(this.processCallback.bind(this), i);
      }

      this.queueLinks();
    } else
      this.processing = false;
  }

  processCallback(link: Link, index: number) {
    logger.log('Agent: processCallback');

    this.currentProcesses.splice(index, 1);
    this.queueLinks();
  }

  clearActiveLinks() {
    logger.log('Agent: clearActiveLinks');

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

  onEvents() {
    logger.log('Agent: onEvents');

    events.on('clearOpenDialogs', this.clearOpenDialogs.bind(this))
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