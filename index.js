/**
 * @Author likan
 * @Date 2022-11-27 11:32:59
 * @Filepath redirect/index.js
 */

/** @typedef {{match: string, selectors: { removes: Array<string>, hides: Array<string>, parents: Array<string>, css: { [k: string]: Array<string> } }, onload?: () => void, runner?: () => void }} Site  */

(async function bootstrap() {
  /**
   *
   * @param {MouseEvent} event
   */
  function csdnEventHandler(event) {
    event.cancelBubble = true;
  }

  /**
   *
   * @param {MouseEvent} event
   */
  function wxEventHandler(event) {
    event.cancelBubble = true;

    return false;
  }

  const options = { capture: true, once: true };
  const traceProperties = ['ping', 'data-jsarwt', 'data-usg', 'data-ved'];
  const juejinRegexp = /https:\/\/link\.juejin\.cn\/\?target=(?<url>.*)/s;
  const zhihuRegexp = /https:\/\/link\.zhihu\.com\/\?target=(?<url>.*)/s;
  const baiduRgexp = /www\.baidu\.com\/link\?url=(?<url>.*)/s;

  /** @type {Array<Site>} */
  const sites = [
    {
      match: 'https://www.baidu.com',
      selectors: {
        css: {
          'a, a *': ['text-decoration', 'none'],
          '.c-border': ['border-radius', '4px'],
        },
        hides: [],
        removes: [
          '#content_right',
          '#content_left > div:not(.c-container)',
          '[tpl="recommend_list"]',
          '.op-guide-cont',
        ],
        parents: ['#foot'],
      },
      runner() {
        $('a').each(function () {
          const matches = this.href.match(baiduRgexp);

          if (matches === null) return;

          chrome.runtime.sendMessage(this.href, value => (this.href = value));
        });
      },
    },
    {
      match: 'https://blog.csdn.net',
      runner() {
        $('#article_content a').each(function () {
          $(this).attr('target', '_blank');
          this.removeEventListener('click', csdnEventHandler, options);
          this.addEventListener('click', csdnEventHandler, options);
        });
      },
      selectors: {
        css: {
          'main, .blog-content': ['width', '100%'],
        },
        hides: [],
        removes: [
          '.blog_container_aside',
          '.template-box',
          '.blog-footer-bottom',
          '#recommendNps',
          '#blogColumnPayAdvert',
          '#treeSkill',
          '.recommend-box',
          '.left-toolbox',
          '.passport-login-container',
          '.blog-slide',
          '[classs="blog-top-banner"]',
          '.toolbar-menus',
          '.toolbar-container-right',
        ],
        parents: ['.csdn-side-toolbar', '.picture-ad'],
      },
    },
    {
      match: 'https://juejin.cn',
      runner() {
        $('.article-content a').each(function () {
          const matches = this.href.match(juejinRegexp);

          if (matches === null) return;

          this.href = decodeURIComponent(matches.groups.url);
        });
      },
      selectors: {
        css: {
          '.main-area, .course-content, .hot-list': ['max-width', '100%', 'width', 'auto'],
          '.timeline-entry-list, .stream': ['margin', '0', 'width', 'auto'],
          '.main': ['justify-content', 'center'],
        },
        hides: [],
        removes: [
          '.extension',
          '.sidebar',
          '.article-suspended-panel',
          '.category-course-recommend',
          '.article-end',
          '.recommended-links',
          '.aside',
          '.vip-entry',
          '.suspension-panel',
          '.course-aside',
          '.special-activity',
          '.download-icon',
          '.extension-icon',
        ],
        parents: ['.advertisement', '.juejin-ab-test-wrap', '.dock-nav'],
      },
    },
    {
      match: 'https://www.google.com',
      runner() {
        $('a').each(function () {
          for (const property of traceProperties) $(this).removeAttr(property);
        });
      },
      selectors: {
        css: {},
        hides: [],
        removes: [],
        parents: [],
      },
    },
    {
      match: 'https://www.zhihu.com',
      runner() {
        $('.Feed').each(function () {
          const infos = JSON.parse($(this).attr('data-za-extra-module') ?? '{}');

          if (infos?.card?.has_video) $(this).parent().remove();
        });

        $('.Question-mainColumn a, .RichContent a').each(function () {
          const matches = this?.href?.match(zhihuRegexp);

          if (matches === null) return;

          this.href = decodeURIComponent(matches.groups.url);
        });
      },
      selectors: {
        css: {
          '.ProfileHeader': ['padding', '0'],
          'html': ['overflow', ''],
          '.Search-container': ['width', '100%'],
          '.Question-mainColumn, .Topstory-mainColumn, .Profile-mainColumn, .ProfileHeader, .QuestionWaiting-mainColumn, .Search-container, .SearchMain':
            ['width', '1200px', 'box-sizing', 'border-box'],
          '.AnswerItem-authorInfo': ['max-width', '100%'],
          '.Topstory-container, .Profile-main, .QuestionWaiting, .QuestionWaiting-mainColumn, .Question-main, .AuthorInfo-badgeText, .Search-container, .SearchMain':
            ['margin-left', '0', 'margin-right', '0', 'justify-content', 'center', 'width', 'auto'],
        },
        hides: [],
        removes: [
          '.Modal-wrapper',
          '.Question-mainColumnLogin',
          '.Question-sideColumn',
          '.Profile-sideColumn',
          '.Pc-word',
          '.Topstory-container > div:not(.Topstory-mainColumn)',
          '.QuestionWaiting > div:not(.QuestionWaiting-mainColumn)',
          '.TopstoryItem--advertCard',
          '.Search-container > div:not(.SearchMain)',
          '.AppHeader-Tabs',
        ],
        parents: ['.QuestionWaiting-typesContainer'],
      },
    },
    {
      match: 'https://developers.weixin.qq.com',
      runner() {
        $('a').each(function () {
          $(this).removeAttr('onclick');
          this.removeEventListener('click', wxEventHandler, options);
          this.addEventListener('click', wxEventHandler, options);
        });
      },
      selectors: {
        css: {},
        hides: [],
        removes: [],
        parents: [],
      },
    },
    {
      match: 'https://www.bilibili.com',
      onload() {
        setTimeout(() => {
          $('.bpx-player-ctrl-wide-enter, .toggle-btn, .bui-collapse-header, .tag-more').click();
        }, 3000);
      },
      selectors: {
        css: {
          '.video-data-list': ['margin', '0'],
          '.view-more': ['color', 'var(--text_link)'],
        },
        hides: [
          '.video-card-ad-small',
          '#slide_ad',
          '.act-end',
          '.fixed-nav',
          '.float-nav-exp > .nav-menu > *:not(.backup)',
          '.pop-live-small-mode',
          '.left-loc-entry',
          '.new-charge-btn',
          '.show-more',
          '.reply-decorate',
          '.login-tip',
          '.feed-card:has(.bili-video-card__info--ad)',
          '.bili-video-card:has(.bili-video-card__info--ad)',
          '.floor-card',
          '.palette-button-wrap > *:not(.top-btn)',
          '.bili-live-card',
          '.right-entry-item:has(.right-entry--vip)',
          '.right-entry-item:has(.header-upload-entry)',
          '.left-entry .v-popover-wrap:not(:first-child)',
          '.bpx-player-toast-wrap',
        ],
        removes: [],
        parents: ['.ad-floor-cover', '.download-entry'],
      },
    },
  ];

  class App {
    /** @type {Site | null} @private */
    selectors = null;

    /**
     *
     * @param {string} href
     * @returns
     */
    constructor(href) {
      const [valid, site] = this.validate(href);

      if (!valid || !site) return;

      this.selectors = site;
      this.listen();

      site.onload && window.addEventListener('load', site.onload);
    }

    /**
     * 检查是否在sites列表中
     * @param {string} url
     * @returns {[boolean, Site | null]}
     * @private
     */
    validate(url) {
      const site = sites.find(({ match }) => url.startsWith(match));

      return site ? [true, site] : [false, null];
    }

    /**
     * 移除节点
     * @param {Array<string>} selectors
     * @private
     */
    removes(selectors) {
      $(selectors.join(',')).remove();
    }

    /**
     * 移除父节点
     * @param {Array<string>} selectors
     * @private
     */
    removeParents(selectors) {
      $(selectors.join(',')).parent().remove();
    }

    /**
     * 隐藏节点
     * @param {Array<string>} selectors
     * @private
     */
    hides(selectors) {
      $(selectors.join(',')).hide();
    }

    /**
     * @param {{[K: string]: Array<string>}} selectors
     * @private
     */
    setCss(selectors) {
      Object.keys(selectors).forEach(key => {
        const el = $(key);
        const stylesheet = [...selectors[key]];

        while (stylesheet.length) {
          const [name, value] = stylesheet.splice(0, 2);

          el.css(name, value);
        }
      });
    }

    /**
     * 监听Dom树
     * @private
     */
    listen() {
      const onChange = () => {
        this.removes(this.selectors?.selectors?.removes ?? []);
        this.hides(this.selectors?.selectors?.hides ?? []);
        this.removeParents(this.selectors?.selectors?.parents ?? []);
        this.setCss(this.selectors?.selectors?.css ?? {});
        this.selectors?.runner?.();
      };

      onChange();

      new MutationObserver(onChange.bind(this)).observe(document.body, { subtree: true, childList: true });
    }
  }

  new App(window.location.origin);
})();
