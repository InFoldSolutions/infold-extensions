import { el, mount } from 'redom';

import logger from '../utils/logger';
import events from '../services/events';

import { isHttpValid, timeDelay } from '../utils/helpers';

export default class SubmitView {

  el: HTMLElement
  backBtn: HTMLElement
  viewContent: HTMLElement
  inputForm: HTMLFormElement
  input: HTMLInputElement
  inputSubmit: HTMLButtonElement
  inputMsg: HTMLElement
  infoBox: HTMLElement
  userLogin: HTMLElement
  loginBtn: HTMLElement

  constructor() {
    logger.log('SubmitView: constructor');

    this.backBtn = el('span.SCRelatedViewBtn', ['Back', el('i.fad.fa-arrow-alt-circle-right')]);

    this.backBtn.onclick = () => {
      events.emit('updateDialog');
    }

    this.input = el('input.SCSubmitViewInput', { type: 'text', placeholder: 'https://.. eg. "www.google.com"' }) as HTMLInputElement;
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

    this.loginBtn = el('span.SCSubmitViewTwitter', [el('i.fad.fa-lock'), 'Login']);
    this.userLogin = el('.SCSubmitViewInfoBox', [
      el('.SCLeftColumn', [
        this.loginBtn
      ]),
      el('.SCRightColumn', [
        el('span.SCSubmitViewInfoBoxText', 'Submissions can get a higher credibility score when associated with a registered account.'),
      ])
    ]);

    this.loginBtn.onclick = () => {
      alert('Soon..');
    }

    this.infoBox = el('.SCSubmitViewInfoBox', [
      el('.SCLeftColumn', [
        el('span.SCSubmitViewInfoBoxTitle', [el('i.fad.fa-long-arrow-alt-right'), 'How is score calculated?']),
        el('span.SCSubmitViewInfoBoxText', 'Item gets a higher credibility score when associated with a Twitter account.'),
      ]),
      el('.SCRightColumn', [
        el('span.SCSubmitViewInfoBoxTitle', [el('i.fad.fa-long-arrow-alt-right'), 'Why login?']),
        el('span.SCSubmitViewInfoBoxText', 'Item gets a higher credibility score when associated with a Twitter account.'),
      ])
    ]);

    this.viewContent = el('span.SCSubmitViewContent', [
      el('span.SCSubmitViewTitle', 'Submit a new article'),
      el('span.SCSubmitViewBodyText', 'Attach a new article that other users might find relevant:'),
      this.inputForm,
      this.userLogin,
      this.backBtn
    ]);

    this.el = el('span.SCSubmitViewWrapper', this.viewContent);
  }
}