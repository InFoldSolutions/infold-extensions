import ReconnectingWebSocket from 'reconnecting-websocket';

import logger from '../utils/logger';

let websocket: ReconnectingWebSocket = null;

export function getWebsocket(url: string, sendResponse?: any) {
  logger.log('Websockets: getWebsocket');

  if (websocket) 
    closeWebsocket()

  websocket = new ReconnectingWebSocket(url);

  if (sendResponse)
    sendResponse(websocket);

  return websocket;
}

export function closeWebsocket() {
  logger.log('Websockets: closeWebsocket');

  if (websocket) {
    websocket.close();
    websocket = null;
  }
}