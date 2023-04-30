
import config from '../utils/config';

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
      }
    }
  }
);

/** 
 * Navigation listeners 
 * */

chrome.webNavigation.onDOMContentLoaded.addListener(function (details) {
  console.log('webNavigation details', details);

  // @ts-ignore
  if (details.frameType === 'outermost_frame') 
    console.log('webNavigation url', details.url);

  /*chrome.action.setBadgeBackgroundColor(
    { color: '#00FF00' },  // Also green
    () => {  }
  )

  /*chrome.action.setBadgeText(
    {
      text: "2",
      tabId: getTabId()
    }
  );*/
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log('tabs changeInfo', tabId, changeInfo, tab);

  if (changeInfo.status == 'complete') {
   }
});

/**
 * Local helpers
 * might go to utils
 */

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
    sendResponse(data);
  } catch (error) {
    console.error(error);
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
    sendResponse(data);
  } catch (error) {
    console.error(error);
    sendResponse({ meta: { success: false } });
  }
}