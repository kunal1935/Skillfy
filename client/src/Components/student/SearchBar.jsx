import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate("/courses-list/" + input);
  };
  return (
    <form
      onSubmit={onSearchHandler}
      className="max-w-xl w-full md:h-14 h-12 flex items-center
    bg-white border border-gray-500/20 rounded"
    >
      <img
        src="/src/assets/search_icon.svg"
        alt="Search_icon"
        className="md:wd-auto w-10 px-3"
      />
      <input
        onChange={(e) => setInput(e.target.value)}
        value={input}
        type="text"
        placeholder="Search courses"
        className="w-full h-full outline-none text-gray-500/80"
      />
      <button
        type="submit"
        className="bg-blue-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1"
      >
        Search
      </button>
    </form>
  );
};
