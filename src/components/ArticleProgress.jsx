import { supabase } from "../lib/supabaseClient";
import { useState, useEffect } from "react";

const ArticleProgress = ({ articleId }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data } = await supabase
        .from("progress")
        .select("progress")
        .eq("article_id", articleId);

      if (data && data.length > 0) {
        setProgress(data[0].progress);
      }
    };

    fetchProgress();
  }, [articleId]);

  const handleProgressUpdate = async (newProgress) => {
    await supabase
      .from("progress")
      .upsert({ article_id: articleId, progress: newProgress });

    setProgress(newProgress);
  };

  return (
    <div className="article-progress">
      <p>Reading Progress: {progress}%</p>
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={(e) => handleProgressUpdate(e.target.value)}
      />
    </div>
  );
};

export default ArticleProgress;
