const TurndownService = require("turndown");
const { addCustomRules } = require("./markdownCustomRules");
const { fixAnchors } = require("./anchorChecker");

const turndownService = new TurndownService({
  bulletListMarker: "-",
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

addCustomRules(turndownService);

function convertToMarkdown(htmlContent) {
  let markdownContent = turndownService.turndown(htmlContent);
  return fixAnchors(htmlContent, markdownContent);
}

module.exports = {
  convertToMarkdown,
};
