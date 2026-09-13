export function siteLink(wish) {
  if (!wish) return "";
  if (wish.publicUrl) return wish.publicUrl;
  const origin = window.location.origin;
  if (wish.shareCode) return `${origin}/s/${wish.shareCode}`;
  if (wish.id) return `${origin}/wish/${wish.id}/home`;
  return "";
}

export async function copyText(text) {
  await navigator.clipboard.writeText(text);
}

export async function nativeShare({ title, url, text }) {
  if (navigator.share) {
    await navigator.share({ title, url, text });
    return true;
  }
  await copyText(url);
  return false;
}
