
import path from 'path';

import config from '../shared/utils/config';
import logger from '../shared/utils/logger';

import { getInfo, getData, getTopic } from '../shared/utils/api';
import { setBadgeText, setBadgeColor } from '../shared/utils/helpers';

import settings from '../shared/services/settings';
import { getWebsocket } from '../shared/services/websockets';

/** 
 * Message listener 
 * */

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (!request.type)
      return;

    switch (request.type) {
      case 'getInfo':
        getInfo(request.href, sendResponse);
        return true;
      case 'getTopic':
        getTopic(request.href, sendResponse);
        return true;
      case 'getData':
        getData(request.href, sendResponse, request.maxArticleCount);
        return true;
      case 'getWebsocket':
        getWebsocket(request.url, sendResponse);
        return true;
      case 'settingsUpdated':  // refresh settings
        settings.synced = false;
        break;
      default:
        logger.warn(`Unknown message type ${request.type}`);
    }
  }
);

/** 
 * Tabs listeners 
 * */

// We'll need this
// https://stackoverflow.com/questions/69598656/prevent-popup-if-current-tab-url-is-not-permitted-in-manifest-v3

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete')
    return;

  const url: URL = new URL(tab.url);
  const host = url.host.replace('www.', '');
  const extension: string = path.extname(url.pathname);

  if (!config.sourcesBackgroundWhiteList.includes(host))
    return setBadgeText(tabId, '');
  if (!config.defaults.supportedProtocols.includes(url.protocol))
    return setBadgeText(tabId, '');
  if (!url.pathname || url.pathname === '/')
    return setBadgeText(tabId, '');
  if (config.defaults.notAllowedExtensions.includes(extension))
    return setBadgeText(tabId, '');

  const data = await getInfo(tab.url, null);

  if (data?.meta?.success) {
    if (data.meta.total_results > 0) {
      setBadgeColor(tabId, '#1d9bf0', '#FFFFFF')
      setBadgeText(tabId, String(data.meta.total_results))
    } else if (data.meta.status === 'processing' || data.meta.status === 'analyzing') {
      setBadgeColor(tabId, '#1d9bf0', '#FFFFFF')
      setBadgeText(tabId, '...')
    } else
      setBadgeText(tabId, '');
  } else {
    setBadgeText(tabId, '');
  }
});

// On install redirect to URL

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason !== 'install')
    return;

  chrome.tabs.create({
    url: config.defaults.installRedirectUrl
  });
}
);