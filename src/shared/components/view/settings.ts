import { el, mount } from 'redom';

import logger from '../../utils/logger';

import { isHttpValid } from '../../utils/helpers';
import LoginBox from '../login';
import CircleIcon from '../svgs/circle';

export default class SettingsView {

  el: HTMLElement
  backBtn: HTMLElement
  viewContent: HTMLElement
  inputForm: HTMLFormElement
  input: HTMLInputElement
  inputAlwaysRunPermission: HTMLInputElement
  labelAlwaysRunPermission: HTMLElement
  inputSubmit: HTMLButtonElement
  inputMsg: HTMLElement
  infoBox: HTMLElement

  constructor() {
    logger.log('SettingsView: constructor');

    this.input = el('input.SCSubmitViewInput', { type: 'text', placeholder: 'https://.. eg. "www.google.com"' }) as HTMLInputElement;

    this.inputAlwaysRunPermission = el('input.SCSlider', { type: 'checkbox', checked: true }) as HTMLInputElement;

    this.inputAlwaysRunPermission.onchange = () => {
      console.log('inputAlwaysRunPermission', this.inputAlwaysRunPermission.checked);
    }

    this.labelAlwaysRunPermission = el('label.SCSettingsViewLabel.SCSwitch', [
      this.inputAlwaysRunPermission,
      el('span.SCSlider')
    ]);

    this.inputSubmit = el('button.SCSubmitViewSubmitBtn', 'Submit', { type: 'submit' }) as HTMLButtonElement;
    this.inputMsg = el('span.SCSubmitViewMsg', '*Please enter a valid URL, hit Enter or press Submit');

    this.inputForm = el('form.SCSubmitViewForm', [
      this.input,
      this.inputSubmit,
      this.inputMsg
    ]) as HTMLFormElement

    this.inputForm.oninput = () => {
      this.inputMsg.classList.remove('SCSubmitViewMsgError');
    }

    this.inputForm.onsubmit = async (e) => {
      e.preventDefault();

      if (!isHttpValid(this.input.value)) {
        this.inputMsg.classList.add('SCSubmitViewMsgError');
        return;
      }

      try {
        this.inputSubmit.innerHTML = '';
        mount(this.inputSubmit, el('span.SCLoader'));

        await chrome.runtime.sendMessage({ type: "getInfo", href: this.input.value });

        this.inputSubmit.innerHTML = 'Success!';
        this.inputSubmit.classList.add('SCSubmitViewSubmitBtnSuccess');
        this.inputSubmit.disabled = true;

        this.inputMsg.innerHTML = 'Your submission was received and is being processed.';

        this.input.value = 'Thank you for your submission!';
        this.input.disabled = true;
      } catch (error) {
        this.inputSubmit.innerHTML = 'Error!';
        this.inputMsg.classList.add('SCSubmitViewMsgError');
      }
    }

    this.viewContent = el('.SCSubmitViewContent', [
      el('span.SCSettingsViewTitle', 'Site Status'),
      el('.SCFormRow', [
        el('span.SCSettingsViewBodyText', [new CircleIcon(), 'Active on Reddit: Running']),
        this.labelAlwaysRunPermission,
      ]),
      new LoginBox(),
      el('hr.SCViewHr'),
      el('span.SCSubmitViewTitle', 'Debug Settings'),
      this.inputForm,
      this.backBtn
    ]);

    this.el = el('.SCSettingsViewWrapper', this.viewContent);
  }
}