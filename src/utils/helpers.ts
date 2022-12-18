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

export function findParentByCls(node: HTMLElement, cls: string): HTMLElement {
  while (!node.classList || !node.classList.contains(cls)) {
    node = node.parentElement;
    if (!node) {
      return null;
    }
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