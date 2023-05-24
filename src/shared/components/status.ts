import { el, mount } from 'redom';

import logger from '../utils/logger';
import { getActiveTab, getAgentFromUrl, sendMessageToActiveTab, capitalizeFirstLetter } from '../utils/helpers';

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

  constructor() {
    logger.log('StatusBar: constructor');

    this.el = el('.SCStatusBar.SCFormRow');

    this.setup()
  }

  async setup() {
    const currentTab = await getActiveTab();
    
    this.agent = getAgentFromUrl(currentTab.url);

    const settingName = `${this.agent}Agent`;
    const agentSetting = await settings.get(settingName);

    this.sliderInput = el('input.SCSlider', { type: 'checkbox', checked: agentSetting }) as HTMLInputElement;
    this.sliderInput.onchange = this.setSliderState.bind(this);

    this.labelInput = el('label.SCSettingsViewLabel.SCSwitch', [
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

    mount(this.el, this.statusContent);
  }

  async setSliderState() {
    const settingName = `${this.agent}Agent`;

    if (this.sliderInput.checked) {
      await settings.set(settingName, true);
      await sendMessageToActiveTab("startAgent");

      this.statusText.classList.add('SCStatusActive');
      this.status.innerText = 'Running';
    } else {
      await settings.set(settingName, false);
      await sendMessageToActiveTab("stopAgent");

      this.statusText.classList.remove('SCStatusActive');
      this.status.innerText = 'Disabled';
    }
  }

  destroy() {
    logger.log('StatusBar: destroy');

    this.el.remove();
  }
}