import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const RelatedArticles = ({ articleId }) => {
  const [groupName, setGroupName] = useState("");
  const [relatedGroups, setRelatedGroups] = useState([]);

  const handleGroupCreate = async () => {
    const { data, error } = await supabase
      .from("groups")
      .insert({ group_name: groupName, articles: [articleId] });

    if (!error) {
      setRelatedGroups([...relatedGroups, data[0]]);
      setGroupName("");
    }
  };

  return (
    <div className="related-articles">
      <input
        type="text"
        placeholder="Create new group"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <button onClick={handleGroupCreate}>Create Group</button>

      <ul>
        {relatedGroups.map((group) => (
          <li key={group.id}>{group.group_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedArticles;
