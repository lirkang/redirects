/**
 * @Author likan
 * @Date 2022-11-26 18:23:02
 * @Filepath redirect/scripts/google.js
 */

const traceProperties = ['ping', 'data-jsarwt', 'data-usg', 'data-ved'];

function removeRedirects() {
  $('a').each(function () {
    for (const property of traceProperties) $(this).removeAttr(property);
  });
}

new MutationObserver(removeRedirects).observe(document.body, { childList: true, subtree: true });
