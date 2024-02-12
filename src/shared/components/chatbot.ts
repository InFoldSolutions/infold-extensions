import { el, mount } from 'redom';

import ReconnectingWebSocket from 'reconnecting-websocket';

import { getWebsocket, closeWebsocket } from '../services/websockets';

import logger from '../utils/logger';
import config from '../utils/config';

import CommentIcon from './svgs/commentIcon';

export default class Chatbot {

  el: HTMLElement

  chatEntries: HTMLElement
  chatTextArea: HTMLTextAreaElement
  chatBtn: HTMLButtonElement
  currentMessageEntry: HTMLElement

  webSocket: ReconnectingWebSocket

  keyDownHandlerBind: any

  typeWriterInterval: any
  msgWords: string[]

  constructor(slug: string) {
    logger.log('Chatbot: constructor');

    const socketURL = `${config.ws.chat}/${config.ws.path}/${slug}`;
    this.webSocket = getWebsocket(socketURL);

    if (!this.webSocket)
      throw new Error('No websocket');

    this.chatEntries = el('.SCChatEntries')
    this.chatTextArea = el('textarea.m-0.p-0', { placeholder: 'Ask a question about this topic' }) as HTMLTextAreaElement
    this.chatBtn = el('button', { disabled: true }, new CommentIcon())

    this.el = el('.SCChatBotWrapper', [
      this.chatEntries,
      el('.SCChatBot',
        [
          el('.SCChatBotInput', [
            this.chatTextArea,
            this.chatBtn
          ])
        ]
      )
    ]);

    this.webSocket.onmessage = (event: any) => {
      if (this.currentMessageEntry) {

        if (this.typeWriterInterval)
          clearInterval(this.typeWriterInterval);

        this.msgWords = event.data.trim().split(" ").reverse();

        this.currentMessageEntry.innerHTML = '';
        this.currentMessageEntry.innerHTML = this.msgWords.pop().trim();

        this.typeWriterInterval = setInterval(() => {
          this.addNextWord();
        }, 80);
      }
    }

    this.keyDownHandlerBind = this.keyDownHandler.bind(this);
    this.chatTextArea.addEventListener('keydown', this.keyDownHandlerBind);
  }

  addChatEntry(entry: any) {
    logger.log('Topic: addChatEntry');

    const entryClass = entry.user === 'me' ? `.SCChatEntry.SCMe` : '.SCChatEntry';
    const entryIcon = entry.user === 'me' ? `fa-user-alt` : 'fa-robot';
    const entryMsg = entry.message !== '' ? el('pre', entry.message) : el('span.SCChatEntryLoading', [
      el('span.SCLoadingDot'),
      el('span.SCLoadingDot.animation-delay-1'),
      el('span.SCLoadingDot.animation-delay-2'),
    ]);

    this.currentMessageEntry = el('pre', entryMsg);

    const chatEntry = el(entryClass, [
      el('span.SCChatEntryIcon', el(`i.fad.${entryIcon}`)),
      el('span.SCChatEntryMsg', this.currentMessageEntry),
    ]);

    mount(this.chatEntries, chatEntry);
  }

  addNextWord() {
    logger.log('Topic: addNextWord');

    if (this.currentMessageEntry) {
      if (this.msgWords.length > 0) {
        const entryMsg = this.currentMessageEntry;
        entryMsg.innerHTML = entryMsg.innerHTML + ' ' + this.msgWords.pop().trim();
      } else {
        clearInterval(this.typeWriterInterval);
        this.currentMessageEntry = null;
        this.typeWriterInterval = null;
      }
    }
  }

  keyDownHandler(e: KeyboardEvent) {
    logger.log('Topic: keyDownHandler');

    const textValue = this.chatTextArea.value.trim();

    if (textValue.length > 0)
      this.chatBtn.disabled = false;
    else
      this.chatBtn.disabled = true;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      this.webSocket.send(textValue);

      this.addChatEntry({ user: 'me', message: textValue });
      this.addChatEntry({ user: 'bot', message: '' });

      this.chatTextArea.value = '';
      this.chatBtn.disabled = true;
    }
  }

  destroy() {
    logger.log('Article: destroy');
    //unmount(this.el, this.summaryBody);

    if (this.chatTextArea)
      this.chatTextArea.removeEventListener('keydown', this.keyDownHandlerBind);
    if (this.webSocket)
      closeWebsocket()
  }
}