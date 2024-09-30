// Parse the article's HTML to extract the main content and sidebar
export const parseArticleContent = (htmlContent) => {
  // Create a DOM parser to manipulate the HTML content
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");

  // Extract the main content and sidebar
  const mainContent = doc.querySelector(".mw-parser-output"); // Main article content
  const sidebar = doc.querySelector(".infobox") || ""; // Sidebar content

  return {
    mainContent: mainContent?.innerHTML || "",
    sidebar: sidebar?.innerHTML || "",
  };
};

// Generate the Table of Contents (TOC) by extracting headings from the article
export const generateTableOfContents = (mainContent) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(mainContent, "text/html");

  // Find all headings (h2, h3, etc.)
  const headings = doc.querySelectorAll("h2, h3");
  const toc = Array.from(headings).map((heading, index) => {
    const headingId = `section-${index}`;
    heading.id = headingId; // Assign unique IDs to each heading
    return {
      id: headingId,
      text: heading.innerText,
      level: heading.tagName.toLowerCase(), // Capture the heading level (h2, h3, etc.)
    };
  });

  return { toc, updatedContent: doc.body.innerHTML };
};
