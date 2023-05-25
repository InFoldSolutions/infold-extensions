import { el, mount } from 'redom';

import logger from '../../utils/logger';

import { isHttpValid, sendMessageToActiveTab } from '../../utils/helpers';

import LoginBox from '../login';
import StatusBar from '../status';

import settings from '../../services/settings';
import { IDataItem } from '../../types';
export default class SettingsView {

  el: HTMLElement
  viewContent: HTMLElement
  status: HTMLElement

  // API setting
  apiInput: HTMLInputElement
  apiInputRow: HTMLElement

  // Search type setting
  searchTypeInput: HTMLSelectElement
  searchTypeRow: HTMLElement

  // API setting
  similarityInput: HTMLInputElement
  similarityInputRow: HTMLElement

  // Limit setting
  limitInput: HTMLInputElement
  limitInputRow: HTMLElement

  // Restart button
  restartInput: HTMLButtonElement

  constructor(meta?: any) {
    logger.log('SettingsView: constructor');

    this.apiInput = el('input.SCSubmitViewInput.SCWidthAuto.SCMinWidth', { type: 'text', value: 'https://api.infold.ai' }) as HTMLInputElement;
    this.apiInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;

      if (isHttpValid(target.value))
        await settings.set('apiUrl', target.value);
    };

    this.apiInputRow = el('.SCSettingsViewRow', [
      el('span.SCSettingsViewLabel', 'API endpoint:'),
      this.apiInput,
    ]);

    this.searchTypeInput = el('select.SCSubmitViewInput.SCWidthAuto', [
      el('option', { value: 'similarity' }, 'Similarity'),
      el('option', { value: 'source' }, 'Source')
    ]) as HTMLSelectElement;

    this.searchTypeInput.onchange = async (e) => {
      const target = e.target as HTMLSelectElement;
      await settings.set('searchType', target.value);
    };

    this.searchTypeRow = el('.SCSettingsViewRow', [
      el('span.SCSettingsViewLabel', 'Search Type:'),
      this.searchTypeInput,
    ]);

    this.similarityInput = el('input.SCSubmitViewInput.SCInputWidthSmall', { type: 'number', step: 0.01, min: 0.1, max: 1.0, value: 0.81 }) as HTMLInputElement;
    this.similarityInputRow = el('.SCSettingsViewRow', [
      el('span.SCSettingsViewLabel', 'Similarity Threshold:'),
      this.similarityInput,
    ]);

    this.similarityInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      await settings.set('similarityScore', target.value);
    };

    this.limitInput = el('input.SCSubmitViewInput.SCInputWidthSmall', { type: 'number', step: 1, min: 1, max: 50, value: 15 }) as HTMLInputElement;
    this.limitInputRow = el('.SCSettingsViewRow', [
      el('span.SCSettingsViewLabel', 'Result Limit:'),
      this.limitInput,
    ]);

    this.limitInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      await settings.set('articleCount', target.value);
    };

    this.restartInput = el('button.SCSubmitViewSubmitBtn.SCRestartAgentBtn', 'Restart Agent') as HTMLButtonElement;
    this.restartInput.onclick = async (e) => {
      await sendMessageToActiveTab('restartAgent');
    };

    this.viewContent = el('.SCSubmitViewContent', [
      new StatusBar(meta),
      new LoginBox(),
      el('hr.SCViewHr'),
      el('span.SCSubmitViewTitle', 'Debug Settings'),
      this.apiInputRow,
      this.searchTypeRow,
      this.similarityInputRow,
      this.limitInputRow,
      this.restartInput
    ]);

    this.el = el('.SCSettingsViewWrapper', this.viewContent);

    this.loadFromSettings();
  }

  async loadFromSettings() {
    logger.log('SettingsView: loadFromSettings');
    this.apiInput.value = await settings.get('apiUrl');
    this.searchTypeInput.value = await settings.get('searchType');
    this.similarityInput.value = await settings.get('similarityScore');
    this.limitInput.value = await settings.get('articleCount');
  }
}