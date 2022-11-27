/**
 * @Author likan
 * @Date 2022-11-26 18:11:00
 * @Filepath redirect/scripts/juejin.js
 */

const regexp = /https:\/\/link\.juejin\.cn\/\?target=(?<url>.*)/s;

function removeRedirects() {
  $('.article-content a').each(function () {
    const matches = this.href.match(regexp);

    if (matches === null) return;

    this.href = decodeURIComponent(matches.groups.url);
  });
}

function removeNodes() {
  $(
    '.extension, .sidebar, .article-suspended-panel, .category-course-recommend, .article-end, .recommended-links, .aside, .vip-entry, .suspension-panel, .course-aside, .special-activity'
  ).remove();
  $('.advertisement, .juejin-ab-test-wrap, .dock-nav').parent().remove();

  $('.main-area, .course-content, .hot-list').css('max-width', '100%').css('width', 'auto');
  $('.timeline-entry-list, .stream').css('margin', 0).css('width', 'auto');
  $('.main').css('justify-content', 'center');
}

new MutationObserver(() => {
  removeRedirects();
  removeNodes();
}).observe(document.body, { childList: true, subtree: true });
