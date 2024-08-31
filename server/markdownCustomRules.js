const addCustomRules = (turndownService) => {
  turndownService.addRule("table", {
    filter: "table",
    replacement: (content, node) => {
      const rows = Array.from(node.rows);
      const processedRows = rows.map((row) => Array.from(row.cells).map((cell) => cell.textContent.trim()));

      const columnWidths = processedRows[0].map((_, i) => Math.max(...processedRows.map((row) => row[i].length)));

      const formatRow = (row) => `| ${row.map((cell, i) => cell.padEnd(columnWidths[i])).join(" | ")} |`;
      const separator = `|${columnWidths.map((w) => "-".repeat(w + 2)).join("|")}|`;

      return `\n${formatRow(processedRows[0])}\n${separator}\n${processedRows.slice(1).map(formatRow).join("\n")}\n\n`;
    },
  });

  turndownService.addRule("code", {
    filter: "code",
    replacement: (content, node) => {
      const isCodeBlock = node.parentNode.nodeName === "PRE";
      return isCodeBlock ? `\n\n\`\`\`${node.getAttribute("class") || ""}\n${content}\n\`\`\`\n\n` : `\`${content}\``;
    },
  });
};

module.exports = { addCustomRules };
