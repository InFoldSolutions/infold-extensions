export function isPostPage() {
  const url: URL = new URL(location.href);
  const pathname = url.pathname.split('/');

  if (pathname[3] && pathname[3] === 'comments')
    return true;

  return false;
}