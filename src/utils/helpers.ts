export function convertToSlug(text: string): string {
    return text.toLowerCase()
               .replace(/[^\w ]+/g, '')
               .replace(/ +/g, '-');
  }

export function getParentByCls(node: HTMLElement, cls: string) {
    while (!node.classList || !node.classList.contains(cls)) {
        node = node.parentElement;
        if (!node) {
            return null;
        }
    }

    return node;
}