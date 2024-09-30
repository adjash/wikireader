import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  parseArticleContent,
  generateTableOfContents,
} from "../lib/articleUtils"; // Utility functions
import { fetchArticleContent } from "../lib/wikiApi";

const ArticlePage = () => {
  const { articleTitle } = useParams();
  const [articleContent, setArticleContent] = useState("");
  const [tableOfContents, setTableOfContents] = useState([]);
  const [activeSection, setActiveSection] = useState("");
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [preview, setPreview] = useState(null); // For article link previews
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const fetchArticle = async () => {
      const content = await fetchArticleContent(articleTitle);
      const { mainContent } = parseArticleContent(content);
      const { toc, updatedContent } = generateTableOfContents(mainContent);

      setArticleContent(updatedContent);
      setTableOfContents(toc);
    };

    fetchArticle();
  }, [articleTitle]);

  // Highlight the active section as the user scrolls
  useEffect(() => {
    const handleScroll = () => {
      let currentSection = "";
      tableOfContents.forEach((section) => {
        const element = document.getElementById(section.id);
        const offset = element.getBoundingClientRect().top;
        if (offset < window.innerHeight / 2) {
          currentSection = section.id;
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [tableOfContents]);

  // Prevent image file links from navigating
  useEffect(() => {
    const articleElement = document.getElementById("article-content");
    if (articleElement) {
      // Add hover event listener for article links
      articleElement.addEventListener("mouseover", async (event) => {
        const target = event.target.closest("a");
        if (target && target.href.includes("/wiki/")) {
          const title = target.href.split("/wiki/")[1];
          setPopupPosition({ top: event.pageY, left: event.pageX });
          const previewData = await fetchArticlePreview(title);
          setPreview(previewData);
        }
      });

      // Remove preview when mouse leaves link
      articleElement.addEventListener("mouseout", () => {
        setPreview(null);
      });
    }
  }, [articleContent]);

  // Fetch preview for linked article
  const fetchArticlePreview = async (title) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          title
        )}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching article preview:", error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto flex">
        {/* Table of Contents (TOC) */}
        {tableOfContents.length > 0 && (
          <aside className="w-1/4 pr-8 sticky top-20 h-screen">
            <div
              className="bg-white p-4 rounded-lg shadow-md"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              <h3 className="text-xl font-semibold mb-4">Table of Contents</h3>
              <ul className="space-y-2">
                {tableOfContents.map((item) => (
                  <li
                    key={item.id}
                    className={`pl-${item.level === "h3" ? 4 : 0}`}
                  >
                    <a
                      href={`#${item.id}`}
                      className={`block ${
                        activeSection === item.id
                          ? "text-blue-600 font-semibold"
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        {/* Main Article Content */}
        <main
          className="w-3/4 bg-white p-8 rounded-lg shadow-md ml-8"
          style={{ fontSize: `${fontSize}px`, fontFamily }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {decodeURIComponent(articleTitle)}
            </h1>

            {/* Customization Controls */}
            <div className="flex space-x-4 items-center">
              <label className="flex items-center space-x-2">
                <span>Text Size:</span>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="ml-2"
                />
              </label>

              <label className="flex items-center space-x-2">
                <span>Font Family:</span>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="ml-2"
                >
                  <option value="sans-serif">Sans Serif</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                </select>
              </label>
            </div>
          </div>

          {/* Render Article Content */}
          <div
            id="article-content"
            dangerouslySetInnerHTML={{ __html: articleContent }}
            className="prose max-w-none"
          />

          {/* Preview Popup */}
          {preview && (
            <div
              className="absolute bg-white shadow-lg p-4 rounded-lg border border-gray-300 z-50"
              style={{
                top: popupPosition.top + 10,
                left: popupPosition.left + 10,
              }}
            >
              <h4 className="text-lg font-bold">{preview.title}</h4>
              <p className="text-sm text-gray-600">{preview.extract}</p>
              {preview.thumbnail && (
                <img
                  src={preview.thumbnail.source}
                  alt={preview.title}
                  className="mt-2 w-24 h-24 object-cover"
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ArticlePage;
