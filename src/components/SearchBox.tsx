import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks/reduxHooks';
import { fetchSentimentData } from '../redux/slices/sentimentSlice';

const SearchBox: React.FC = () => {
  const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(fetchSentimentData(query));
    }
  };

  return (
    <div className="search-box">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
          className="search-input"
        />
        <button type="submit" className="search-button">검색</button>
      </form>
    </div>
  );
};

export default SearchBox;
