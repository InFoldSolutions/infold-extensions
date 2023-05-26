import { el, mount } from 'redom';

import logger from '../utils/logger';
import { getActiveTab, getAgentFromUrl, sendMessageToActiveTab, capitalizeFirstLetter, sendMessageToDomainTabs, getDomainForAgent } from '../utils/helpers';

import CircleIcon from './svgs/circle';

import settings from '../services/settings';

export default class StatusBar {

  el: HTMLElement
  sliderInput: HTMLInputElement
  labelInput: HTMLElement
  statusContent: HTMLElement
  statusText: HTMLElement
  status: HTMLElement

  agent: string
  meta: any

  constructor(meta?: any) {
    logger.log('StatusBar: constructor');

    this.meta = meta;
    this.el = el('.SCStatusBar.SCFormRow');

    this.setup()
  }

  async setup() {
    logger.log('StatusBar: setup')

    const currentTab = await getActiveTab();
    const url = new URL(currentTab.url);

    this.agent = getAgentFromUrl(currentTab.url);

    const settingName = `${this.agent}Agent`;

    if (settingName === 'defaultAgent') {
      this.status = el('span.SCStatus', capitalizeFirstLetter(this.meta?.status));

      const hostname = url.hostname.replace('www.', '');
      this.statusText = el('span.SCSettingsViewBodyText', [new CircleIcon(), `Status for ${hostname}:`, this.status]);

      if (this.meta?.status) {
        switch (this.meta.status) {
          case 'analyzed':
            this.statusText.classList.add('SCStatusActive');
            break;
          case 'processing':
          case 'analyzing':
            this.statusText.classList.add('SCStatusProcessing');
            break;
          case 'error':
            this.statusText.classList.add('SCStatusError');
            break;
          default:
            break;
        }
      }

      this.statusContent = el('.SCStatusBarContent', this.statusText);
    } else {
      const agentSetting = await settings.get(settingName);

      this.sliderInput = el('input.SCSlider', { type: 'checkbox', checked: agentSetting }) as HTMLInputElement;
      this.sliderInput.onchange = this.setSliderState.bind(this);

      this.labelInput = el('label.SCMarginLeftAuto.SCSwitch', [
        this.sliderInput,
        el('span.SCSlider')
      ]);

      this.status = el('span.SCStatus', (agentSetting) ? 'Running' : 'Disabled');
      this.statusText = el('span.SCSettingsViewBodyText', [new CircleIcon(), `Active on ${capitalizeFirstLetter(this.agent)}:`, this.status]);

      if (agentSetting)
        this.statusText.classList.add('SCStatusActive');

      this.statusContent = el('.SCStatusBarContent', [
        this.statusText,
        this.labelInput
      ]);
    }

    mount(this.el, this.statusContent);
  }

  async setSliderState() {
    const settingName = `${this.agent}Agent`;
    const domain = getDomainForAgent(this.agent);

    if (this.sliderInput.checked) {
      await settings.set(settingName, true);
      await sendMessageToDomainTabs("startAgent", domain);

      this.statusText.classList.add('SCStatusActive');
      this.status.innerText = 'Running';
    } else {
      await settings.set(settingName, false);
      await sendMessageToDomainTabs("stopAgent", domain);

      this.statusText.classList.remove('SCStatusActive');
      this.status.innerText = 'Disabled';
    }
  }

  destroy() {
    logger.log('StatusBar: destroy');

    this.el.remove();
  }
}