"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

export default function TagsInput() {
  const [tags, setTags] = useState(["Access Control", "Security Training", "Workforce Mgmt"]);

  const [input, setInput] = useState("");

  const addTag = () => {
    if (!input.trim()) {
      return;
    }
    setTags([...tags, input]);
    setInput("");
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <p className="text-sm mb-2">Related Topics</p>

      <div className="flex flex-wrap gap-2">
        {/* Existing tags */}
        {tags.map((tag, i) => (
          <div
            key={i}
            className="flex items-center gap-1 px-3 py-1 rounded-full 
            bg-purple-100 text-purple-700 text-xs"
          >
            {tag}
            <X size={12} className="cursor-pointer" onClick={() => removeTag(i)} />
          </div>
        ))}

        {/* Add tag */}
        <div className="flex items-center gap-1 px-2 py-1 border rounded-full text-xs">
          <Plus size={12} />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            placeholder="Add Tag"
            className="outline-none bg-transparent text-xs w-16"
          />
        </div>
      </div>
    </div>
  );
}
