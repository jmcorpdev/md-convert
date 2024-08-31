function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

async function convertToMarkdown() {
  const htmlInput = document.getElementById("htmlInput").value;
  const markdownOutput = document.getElementById("markdownOutput");

  try {
    const response = await fetch("/convert", {
      method: "POST",
      headers: { "Content-Type": "text/html" },
      body: htmlInput,
    });

    markdownOutput.value = response.ok ? await response.text() : "Error during conversion. Please try again.";
  } catch (error) {
    console.error("Error:", error);
    markdownOutput.value = "An error occurred during conversion. Please try again.";
  }
}

const convert = debounce(convertToMarkdown, 300);

document.getElementById("htmlInput").addEventListener("input", convert);
