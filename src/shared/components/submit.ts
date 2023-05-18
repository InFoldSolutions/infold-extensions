import { el, mount } from 'redom';

import logger from '../utils/logger';
import events from '../services/events';

export default class SubmitView {

  el: HTMLElement
  backBtn: HTMLElement
  viewContent: HTMLElement
  inputForm: HTMLElement
  infoBox: HTMLElement

  constructor() {
    logger.log('SubmitView: constructor');

    this.backBtn = el('span.SCRelatedViewBtn', ['Back', el('i.fad.fa-arrow-alt-circle-right')]);

    this.backBtn.onclick = () => {
      events.emit('updateDialog');
    }

    this.inputForm = el('form.SCSubmitViewForm', [
      el('input.SCSubmitViewInput', { type: 'text', placeholder: 'https://.. eg. "www.google.com"' }),
      el('input.SCSubmitViewSubmitBtn', { type: 'submit', value: 'Submit' }),
      el('span.SCSubmitViewMsg', '*Please enter a valid URL, hit Enter or press Submit')
    ]);

    this.inputForm.onsubmit = (e) => {
      console.log('SubmitView: inputForm onsubmit');
      e.preventDefault();
    }

    this.infoBox = el('.SCSubmitViewInfoBox', [
      el('.SCLeftColumn', [
        el('span.SCSubmitViewTwitter', [el('i.fab.fa-twitter'), 'Login']),
        //el('span.SCSubmitViewNote', '*Login with Twitter'),
      ]),
      el('.SCRightColumn', [
        //el('span.SCSubmitViewInfoBoxTitle', [el('i.fad.fa-long-arrow-alt-right'), 'Why login?']),
        el('span.SCSubmitViewInfoBoxText', 'Item gets a higher credibility score when associated with a Twitter account.'),
      ])
    ])

    this.viewContent = el('span.SCSubmitViewContent', [
      el('span.SCSubmitViewTitle', 'Submit a new article'),
      el('span.SCSubmitViewBodyText', 'Attach a new article that other users might find relevant:'),
      this.inputForm,
      this.infoBox,
      this.backBtn
    ]);

    this.el = el('span.SCSubmitViewWrapper', this.viewContent);
  }
}