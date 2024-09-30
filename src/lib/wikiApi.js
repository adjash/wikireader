import { supabase } from "./supabaseClient";

// Function to handle adding/removing favorites in Supabase
export const handleFavorite = async (article, user, setArticles) => {
  if (!user || !article.pageId) {
    console.error("Missing user or article pageId");
    return;
  }

  try {
    // Check if the article is already favorited
    const { data: existingFavorite, error: selectError } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .eq("article_id", article.pageId)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      console.error("Error selecting favorite:", selectError);
      return;
    }

    if (existingFavorite) {
      // If the article is already favorited, remove it
      const { error: deleteError } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("article_id", article.pageId);

      if (deleteError) {
        console.error("Error deleting favorite:", deleteError);
        return;
      }

      // Update the article state to reflect the removal
      setArticles((prevArticles) =>
        prevArticles.map((a) =>
          a.pageId === article.pageId ? { ...a, isFavorited: false } : a
        )
      );
    } else {
      // If the article is not yet favorited, add it to the favorites
      const { error: insertError } = await supabase.from("favorites").insert({
        user_id: user.id,
        article_id: article.pageId,
        article_title: article.title,
        article_url: `https://en.wikipedia.org/?curid=${article.pageId}`,
        article_thumbnail: article.thumbnailUrl || "",
      });

      if (insertError) {
        console.error("Error inserting favorite:", insertError);
        return;
      }

      // Update the article state to reflect the addition
      setArticles((prevArticles) =>
        prevArticles.map((a) =>
          a.pageId === article.pageId ? { ...a, isFavorited: true } : a
        )
      );
    }
  } catch (error) {
    console.error("Error handling favorite:", error);
  }
};
export const fetchArticleContent = async (articleTitle) => {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
        articleTitle
      )}`
    );
    const articleContent = await response.text(); // The content is returned in HTML format
    return articleContent;
  } catch (error) {
    console.error("Error fetching article content:", error);
  }
};

// Function to fetch articles from Wikipedia
export const fetchArticles = async (
  searchTerm,
  newPage,
  ARTICLES_PER_PAGE,
  setLoading,
  setArticles,
  setHasMore
) => {
  setLoading(true);
  try {
    // Step 1: Fetch search results using the Opensearch API
    const searchResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchTerm}&limit=${
        newPage * ARTICLES_PER_PAGE
      }&format=json&origin=*`
    );
    const searchData = await searchResponse.json();

    // The titles and descriptions are in searchData[1] and searchData[2]
    const searchResults = searchData[1].map((title, index) => ({
      title,
      description: searchData[2][index],
      link: searchData[3][index],
    }));

    // Step 2: For each article, fetch its summary (which includes the thumbnail and pageId)
    const enrichedResults = await Promise.all(
      searchResults.map(async (article) => {
        const summaryResponse = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            article.title
          )}`
        );
        const summaryData = await summaryResponse.json();
        return {
          ...article,
          thumbnailUrl: summaryData.thumbnail?.source || "", // Add the thumbnail image if available
          pageId: summaryData.pageid, // Add the correct pageId
        };
      })
    );

    setHasMore(searchResults.length === newPage * ARTICLES_PER_PAGE);
    setArticles(enrichedResults);
  } catch (error) {
    console.error("Error fetching Wikipedia articles:", error);
  } finally {
    setLoading(false);
  }
};
