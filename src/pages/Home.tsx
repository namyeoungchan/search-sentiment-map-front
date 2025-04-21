import React from 'react';
import SearchBox from '../components/SearchBox';
import SentimentResults from '../components/SentimentResults';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <header className="app-header">
        <h1>검색 감성 지도</h1>
        <p className="app-description">
          검색어의 감성 분석을 통한 지도 시각화 프로젝트
        </p>
      </header>
      
      <main className="main-content">
        <section className="search-section">
          <SearchBox />
        </section>
        
        <section className="results-section">
          <SentimentResults />
        </section>
      </main>
    </div>
  );
};

export default Home;
