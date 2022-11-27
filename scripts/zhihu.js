/**
 * @Author likan
 * @Date 2022-11-26 19:04:08
 * @Filepath redirect/scripts/zhihu.js
 */

const regexp = /https:\/\/link\.zhihu\.com\/\?target=(?<url>.*)/s;

function removeRedirects() {
  $('.Question-mainColumn a, .RichContent a').each(function () {
    const matches = this.href.match(regexp);

    if (matches === null) return;

    this.href = decodeURIComponent(matches.groups.url);
  });
}

function removeNodes() {
  $('.Modal-wrapper, .Question-mainColumnLogin, .Question-sideColumn, .Profile-sideColumn').remove();
  $('.Pc-word').remove();
  $(
    '.Topstory-container > div:not(.Topstory-mainColumn), .QuestionWaiting > div:not(.QuestionWaiting-mainColumn)'
  ).remove();
  $('.TopstoryItem--advertCard').remove();

  $('.ProfileHeader').css('padding', 0);
  $('html').css('overflow', '');
  $('.Search-container').css('width', '100%');
  $(
    '.Question-mainColumn, .Topstory-mainColumn, .Profile-mainColumn, .ProfileHeader, .QuestionWaiting-mainColumn, .Search-container, .SearchMain'
  )
    .css('width', '1200px')
    .css('box-sizing', 'border-box');
  $('.AnswerItem-authorInfo').css('max-width', '100%');

  $(
    '.Topstory-container, .Profile-main, .QuestionWaiting, .QuestionWaiting-mainColumn, .Question-main, .AuthorInfo-badgeText, .Search-container, .SearchMain'
  )
    .css('margin-left', 0)
    .css('margin-right', 0)
    .css('justify-content', 'center')
    .css('width', 'auto');
  $('.QuestionWaiting-typesContainer').parent().remove();

  $('.Search-container > div:not(.SearchMain)').remove();
  $('.Feed').each(function () {
    const infos = JSON.parse($(this).attr('data-za-extra-module') ?? '{}');

    if (infos?.card?.has_video) $(this).parent().remove();
  });
}

new MutationObserver(() => {
  removeRedirects();
  removeNodes();
}).observe(document.documentElement, { childList: true, subtree: true });
