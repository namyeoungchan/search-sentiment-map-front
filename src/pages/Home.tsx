import React, { useEffect, useState } from 'react';
import SearchBox from '../components/SearchBox';
import SentimentResults from '../components/SentimentResults';
import KoreaMap from '../components/KoreaMap';
import MapLegend from '../components/MapLegend';
import './Home.css';

const Home: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 초기 로드 시 실행

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

        <section className="map-section">
          <div className="map-container">
            <KoreaMap />
            <MapLegend />
          </div>
        </section>

        {!isMobile ? (
          <section className="results-section">
            <SentimentResults />
          </section>
        ) : (
          <section className="results-section">
            <SentimentResults />
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;