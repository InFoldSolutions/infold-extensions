import { el } from 'redom';

import logger from '../utils/logger';

export default class LoginBox {

  el: HTMLElement
  loginBtn: HTMLElement

  constructor() {
    logger.log('LoginBox: constructor');

    this.loginBtn = el('span.SCSubmitViewTwitter', [el('i.fad.fa-lock'), 'Login']);
    this.loginBtn.onclick = () => {
      alert('Soon..');
    }

    this.el = el('.SCLoginWrapper', [
      el('hr.SCViewHr'),
      el('.SCViewInfoBox', [
        el('.SCLeftColumn', [
          this.loginBtn
        ]),
        el('.SCRightColumn', [
          el('span.SCViewInfoBoxText', 'Submissions can get a higher credibility score when associated with a registered account.'),
        ])
      ])
    ]);
  }
}