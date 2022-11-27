/**
 * @Author likan
 * @Date 2022-11-26 16:54:44
 * @Filepath redirect/scripts/background.js
 */

chrome.runtime.onMessage.addListener((url, sender, callback) => {
  fetch(url)
    .then(r => (r.redirected ? r.url ?? url : url))
    .then(result => callback(result))
    .catch(() => callback(url));

  return true;
});
