
import config from '../utils/config';

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