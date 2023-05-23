
import path from 'path';

import config from '../shared/utils/config';
import logger from '../shared/utils/logger';

import { getInfo, getData } from '../shared/utils/api';

/** 
 * Message listener 
 * */

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.type) {
      switch (request.type) {
        case 'getInfo':
          getInfo(request.href, sendResponse);
          return true;
        case 'getData':
          getData(request.href, sendResponse, request.maxArticleCount);
          return true;
        default:
          logger.warn(`Unknown message type ${request.type}`);
      }
    }
  }
);

/** 
 * Tabs listeners 
 * */

// We'll need this
// https://stackoverflow.com/questions/69598656/prevent-popup-if-current-tab-url-is-not-permitted-in-manifest-v3

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log('onUpdated', tabId, changeInfo, tab);

  if (changeInfo.status == 'complete') {
    const url: URL = new URL(tab.url);
    const extension: string = path.extname(url.pathname);

    if (!config.defaults.supportedProtocols.includes(url.protocol))
      return setBadgeText(tabId, '');
    if (config.defaults.blacklistedDomains.includes(url.host))
      return setBadgeText(tabId, '');
    if (!url.pathname || url.pathname === '/')
      return setBadgeText(tabId, '');
    if (config.defaults.notAllowedExtensions.includes(extension))
      return setBadgeText(tabId, '');

    setBadge(tabId, tab); // need to rename, it's async
  }
});

/**
 * Local helpers - utils?
 **/

async function setBadge(tabId: any, tab: any) {
  try {
    const data = await getInfo(tab.url, null);

    if (data?.meta?.success && data.meta?.total_results > 0) {
      chrome.action.setBadgeBackgroundColor(
        { color: '#1d9bf0' }
      );

      // @ts-ignore
      chrome.action.setBadgeTextColor(
        { color: '#FFFFFF' }
      )

      setBadgeText(tabId, String(data.meta.total_results))
    } else {
      setBadgeText(tabId, '');
    }
  } catch (error) {
    logger.warn(`Failed to set badge ${error}`);
  }
}

function setBadgeText(tabId: any, text: string) {
  try {
    chrome.action.setBadgeText(
      {
        text: text,
        tabId: tabId,
      }
    );

  } catch (error) {
    logger.warn(`Failed to set badge text ${error}`);
  }
}

/*function tabExists(tabId: any) {
  chrome.tabs.query({}, function (tabs) {
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].id === tabId)
        return true;
    }
  });

  return false;
}*/