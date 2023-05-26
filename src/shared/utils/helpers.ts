export function convertToSlug(text: string): string {
  return text.toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function findChildByText(node: HTMLElement, element: string, text: string): HTMLElement {
  const ElementXPathResult: XPathResult =
    document.evaluate(`.//${element}[contains(., '${text}')]`,
      node,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    );

  if (ElementXPathResult.singleNodeValue)
    return ElementXPathResult.singleNodeValue as HTMLElement;
  else
    return null;
}

export function findChildrenByText(node: HTMLElement, element: string, text: string): HTMLElement[] {
  const ElementXPathResult: XPathResult =
    document.evaluate(`.//${element}[contains(., '${text}')]`,
      node,
      null,
      XPathResult.ANY_TYPE,
      null
    );

  const nodes = [];

  while (node = ElementXPathResult.iterateNext() as HTMLElement) {
    nodes.push(node);
  }

  if (nodes.length > 0)
    return nodes;
  else
    return null;
}

export function findParentByCls(node: HTMLElement, cls: string, maxTries: number = 0): HTMLElement {
  let tries = 0;

  while (!node.classList || !node.classList.contains(cls)) {
    node = node.parentElement;

    if (!node || (maxTries > 0 && tries === maxTries)) {
      return null;
    }

    tries++;
  }

  return node;
}

export function findParentByAttribute(node: HTMLElement, attr: string, attrValue: string): HTMLElement {
  while (!node.hasAttribute(attr) || node.getAttribute(attr) !== attrValue) {
    node = node.parentElement;
    if (!node) {
      return null;
    }
  }

  return node;
}

export function aggregateOffsetTop(node: HTMLElement): number {
  let offsetTop: number = 0;

  while (node) {
    offsetTop += node.offsetTop;
    node = node.parentElement;
  }

  return offsetTop;
}

export function isPostPage(): boolean {
  const url: URL = new URL(location.href);
  const pathname: string[] = url.pathname.split('/');

  // reddit post page
  if (pathname[3] && pathname[3] === 'comments')
    return true;

  const pathArray: string[] = pathname.slice(Math.max(pathname.length - 2, 0));

  // twitter post page
  if (pathArray[0] === 'status' && /^-?\d+$/.test(pathArray[1]))
    return true;

  return false;
}

export function isHttpValid(url: string) {
  try {
    const newUrl = new URL(url);

    if (!newUrl.pathname || newUrl.pathname === '/')
      throw new Error('Invalid URL');

    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

export function timeDelay(time: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, time));
}

export function getAgentFromUrl(url: string): string {
  const newURL = new URL(url);

  if (/^www.reddit\.com/.test(newURL.hostname))
    return 'reddit';
  if (/^twitter\.com/.test(newURL.hostname))
    return 'twitter';

  return 'default';
}

export function getDomainForAgent(agent: string): string {
  switch (agent) {
    case 'reddit':
      return 'www.reddit.com';
    case 'twitter':
      return 'twitter.com';
    default:
      return '';
  }
}

export async function getActiveTab(): Promise<any> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id)
    return null;

  return tab;
}

export async function sendMessageToActiveTab(type: string) {
  const tab = await getActiveTab();

  if (tab)
    await chrome.tabs.sendMessage(tab.id, { type: type });
}

export async function sendMessageToDomainTabs(type: string, domain: string) {
  const tabs = await chrome.tabs.query({
    url: `*://${domain}/*`
  });

  for (const tab of tabs) {
    await chrome.tabs.sendMessage(tab.id, { type: type });
  }
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function setBadgeColor(tabId: any, bg: string, text: string) {
  chrome.action.setBadgeBackgroundColor(
    { color: bg, tabId: tabId }
  );

  // @ts-ignore
  chrome.action.setBadgeTextColor(
    { color: text, tabId: tabId }
  )
}

export function setBadgeText(tabId: any, text: string) {
  chrome.action.setBadgeText(
    { text: text, tabId: tabId, }
  );
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

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffleArray(array: any) {
  return array.map((value: any) => ({ value, sort: Math.random() }))
    .sort((a: any, b: any) => a.sort - b.sort)
    .map((item: any) => item.value);
}