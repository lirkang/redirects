/**
 * @Author likan
 * @Date 2022-11-26 17:33:53
 * @Filepath redirect/scripts/csdn.js
 */

/**
 * @param {MouseEvent} event
 */
function eventHandler(event) {
  event.cancelBubble = true;
}

const options = { capture: true, once: true };

function removeRedirects() {
  $('#article_content a').each(function () {
    $(this).attr('target', '_blank');
    this.removeEventListener('click', eventHandler, options);
    this.addEventListener('click', eventHandler, options);
  });
}

function removeNodes() {
  $(
    '.blog_container_aside, .template-box, .blog-footer-bottom, #recommendNps, #blogColumnPayAdvert, #treeSkill, .recommend-box, .left-toolbox, .passport-login-container, .blog-slide, [classs="blog-top-banner"]'
  ).remove();

  $('.csdn-side-toolbar, .picture-ad').parent().remove();
  $('main').css('width', 'auto');
  $('.blog-content').css('width', 'auto');
}

new MutationObserver(() => {
  removeRedirects();
  removeNodes();
}).observe(document.body, { childList: true, subtree: true });
