/**
 * @Author likan
 * @Date 2022-11-26 15:12:50
 * @Filepath redirect/scripts/baidu.js
 */

const regexp = /www\.baidu\.com\/link\?url=(?<url>.*)/s;

function removeRedirects() {
  $('a').each(function () {
    const matches = this.href.match(regexp);

    if (matches === null) return;

    chrome.runtime.sendMessage(this.href, value => (this.href = value));
  });
}

function removeNodes() {
  $('#content_right, #content_left > div:not(.c-container), [tpl="recommend_list"], .op-guide-cont').remove();
  $('#foot').parent().remove();

  $('#rs_new a').attr('target', '_blank');
  $('a, a *').css('text-decoration', 'none');
  $('.c-border').css('border-radius', '4px');
}

window.onload = () => {
  removeRedirects();
  removeNodes();
};

new MutationObserver(() => {
  removeRedirects();
  removeNodes();
}).observe(document.body, { childList: true, subtree: true });
