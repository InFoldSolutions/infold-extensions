export function convertToSlug(text: string): string {
    return text.toLowerCase()
               .replace(/[^\w ]+/g, '')
               .replace(/ +/g, '-');
  }
  