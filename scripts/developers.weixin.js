/**
 * @Author likan
 * @Date 2022-11-26 19:14:38
 * @Filepath redirect/scripts/developers.weixin.js
 */

/**
 * @param {MouseEvent} event
 */
function eventHandler(event) {
  event.cancelBubble = true;

  return false;
}

const options = { capture: true, once: true, passive: true };

function removeRedirects() {
  $('a').each(function () {
    $(this).removeAttr('onclick');
    this.removeEventListener('click', eventHandler, options);
    this.addEventListener('click', eventHandler, options);
  });
}

new MutationObserver(removeRedirects).observe(document.documentElement, { childList: true, subtree: true });
