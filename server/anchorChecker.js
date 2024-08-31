const cheerio = require("cheerio");

const extractHTMLTitles = (htmlContent) => {
  const $ = cheerio.load(htmlContent);
  return $("h1,h2,h3,h4,h5,h6")
    .map((i, el) => {
      const $el = $(el);
      const text = $el.text();
      const object = {
        title: text,
        id: ($el.attr("id") || "").toLowerCase(),
        name: $el.attr("name"),
        markdownId: text
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      };

      if (!object.id && !object.name) {
        const $prev = $el.prev();
        const html = $prev.html();
        const nameOrId = $prev.attr("id") || $prev.attr("name") || (html && (html.match(/<.+?\s+id="([^"]+)"/) || html.match(/<.+?\s+name="([^"]+)"/)))?.[1];

        if ($prev.length && nameOrId) {
          object.id = nameOrId;
        }
      }

      return object;
    })
    .get();
};

const extractMarkdownAnchors = (markdownContent) => {
  const regex = /\[.*?\]\((#.*?)\)/g;
  return Array.from(markdownContent.matchAll(regex), (m) => m[1]);
};

const fixAnchors = (htmlContent, markdownContent) => {
  const htmlTitles = extractHTMLTitles(htmlContent);
  const htmlAnchorsMap = new Map(htmlTitles.map((title) => [title.id || title.name || title.markdownId, title]));
  const markdownAnchors = new Set(extractMarkdownAnchors(markdownContent));

  return Array.from(markdownAnchors).reduce((content, anchor) => {
    const cleanedAnchor = anchor.slice(1).toLowerCase();
    const htmlTitle = htmlAnchorsMap.get(cleanedAnchor);

    if (htmlTitle) {
      console.log(`* replaced "${cleanedAnchor}" with "${htmlTitle.markdownId}"`);
      return content.replace(new RegExp(anchor, "g"), "#" + htmlTitle.markdownId);
    } else {
      console.log("* anchor not found", cleanedAnchor);
      for (const [, title] of htmlAnchorsMap) {
        if (title.markdownId.includes(cleanedAnchor)) {
          console.log("found", title.title, "with", title.markdownId);
          return content.replace(new RegExp(anchor, "g"), "#" + title.markdownId);
        }
      }
    }
    return content;
  }, markdownContent);
};

module.exports = { fixAnchors };
