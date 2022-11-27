/**
 * @Author likan
 * @Date 2022-11-27 10:19:58
 * @Filepath redirect/scripts/bilibili.js
 */

function removeNodes() {
  $(
    '.login-tip, .feed-card:has(.bili-video-card__info--ad), .bili-video-card:has(.bili-video-card__info--ad), .floor-card, .palette-button-wrap > *:not(.top-btn), .bili-live-card, .right-entry-item:has(.right-entry--vip), .right-entry-item:has(.header-upload-entry), .left-entry .v-popover-wrap:not(:first-child)'
  ).remove();
  $(
    '.video-card-ad-small, #slide_ad, .act-end, .fixed-nav, .float-nav-exp > .nav-menu > *:not(.backup), .pop-live-small-mode, .left-loc-entry, .new-charge-btn, .show-more, .reply-decorate, .bpx-player-toast-wrap'
  ).hide();
  $('.ad-floor-cover, .download-entry').parent().remove();
  $('.video-data-list').css('margin', 0);
  $('.view-more').css('color', 'var(--text_link)');
}

new MutationObserver(() => {
  removeNodes();
}).observe(document.documentElement, { childList: true, subtree: true });

window.addEventListener('load', () => {
  setTimeout(() => {
    $('.bpx-player-ctrl-wide-enter, .toggle-btn, .bui-collapse-header, .tag-more').click();
  }, 3000);
});
