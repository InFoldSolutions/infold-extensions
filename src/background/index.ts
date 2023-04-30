
import path from 'path';

import config from '../shared/utils/config';

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
          getData(request.href, sendResponse);
          return true;
        default:
          console.warn('Unknown message type', request.type);
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
  //console.log('tabs changeInfo', tabId, changeInfo, tab);

  if (changeInfo.status == 'complete') {
    const url: URL = new URL(tab.url);
    const extension: string = path.extname(url.pathname);

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
  const data = await getInfo(tab.url, null);

  try {
    if (data.meta.success && data.meta.total_results > 0) {
      chrome.action.setBadgeBackgroundColor(
        { color: '#1d9bf0' }
      );

      chrome.action.setBadgeText(
        {
          text: String(data.meta.total_results),
          tabId: tabId,
        }
      );

      // @ts-ignore
      chrome.action.setBadgeTextColor(
        { color: '#FFFFFF' }
      )

      chrome.action.enable(tabId);
    } else {
      chrome.action.setBadgeText(
        {
          text: '',
          tabId: tabId,
        }
      );

      chrome.action.disable(tabId);
    }
  } catch (error) {
    console.warn(error);
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
      })
    });

    const data = await info.json();

    if (sendResponse)
      sendResponse(data);
    else
      return data;
  } catch (error) {
    console.warn(error);

    if (sendResponse)
      sendResponse({ meta: { success: false } });
  }
}

async function getData(href: string, sendResponse: Function) {
  try {
    const info = await fetch(`${config.api.url}?limit=${config.api.maxRelatedArticles}`, {
      method: 'POST',
      headers: config.api.headers,
      body: JSON.stringify({
        url: href,
        similarity: config.api.similarity,
      })
    });

    const data = await info.json();

    if (sendResponse)
      sendResponse(data);
    else
      return data;
  } catch (error) {
    console.warn(error);

    if (sendResponse)
      sendResponse({ meta: { success: false } });
  }
}