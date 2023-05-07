
import path from 'path';

import config from '../shared/utils/config';
import logger from '../shared/utils/logger';

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
  if (changeInfo.status == 'complete') {
    const url: URL = new URL(tab.url);
    const extension: string = path.extname(url.pathname);

    if (!config.supportedProtocols.includes(url.protocol))
      return;
    if (config.blacklistedDomains.includes(url.host))
      return;
    if (config.defaults.notAllowedExtensions.includes(extension))
      return;

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
    logger.warn(error);
  }
}

async function getInfo(href: string, sendResponse: Function) {
  try {
    const info = await fetch(`${config.api.url}/meta`, {
      method: 'POST',
      headers: config.api.headers,
      body: JSON.stringify({
        url: href,
        similarity: config.api.similarity,
        search: 'source'
      })
    });

    if (!info.ok)
      throw new Error('Request failed');

    const data = await info.json();

    if (sendResponse)
      sendResponse(data);
    else
      return data;
  } catch (error) {
    logger.warn(error);

    if (sendResponse)
      sendResponse({ meta: { success: false } });
  }
}

async function getData(href: string, sendResponse: Function, maxRelatedArticles: number = config.api.maxArticleCount) {
  try {
    const info = await fetch(`${config.api.url}?limit=${maxRelatedArticles}`, {
      method: 'POST',
      headers: config.api.headers,
      body: JSON.stringify({
        url: href,
        similarity: config.api.similarity,
        search: 'source'
      })
    });

    if (!info.ok)
      throw new Error('Request failed');

    const data = await info.json();

    if (sendResponse)
      sendResponse(data);
    else
      return data;
  } catch (error) {
    logger.warn(error);

    if (sendResponse)
      sendResponse({ meta: { success: false } });
  }
}

function setBadgeText(tabId: any, text: string) {
  chrome.action.setBadgeText(
    {
      text: text,
      tabId: tabId,
    }
  );

  if (text !== '')
    chrome.action.enable(tabId);
  else
    chrome.action.disable(tabId);
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