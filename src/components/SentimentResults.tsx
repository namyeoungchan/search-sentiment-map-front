import React from 'react';
import { useAppSelector } from '../redux/hooks/reduxHooks';

const SentimentResults: React.FC = () => {
  const { data, loading, error } = useAppSelector((state) => state.sentiment);

  if (loading) {
    return <div className="loading">데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="error">오류 발생: {error}</div>;
  }

  if (data.length === 0) {
    return <div className="no-data">검색 결과가 없습니다.</div>;
  }

  return (
    <div className="sentiment-results">
      <h2>감성 분석 결과</h2>
      <ul className="result-list">
        {data.map((item) => (
          <li key={item.id} className={`sentiment-item ${item.sentiment}`}>
            <div className="location">{item.location}</div>
            <div className="query">검색어: {item.query}</div>
            <div className="sentiment-info">
              <span className="label">감정: </span>
              <span className="value">
                {item.sentiment === 'positive' ? '긍정적' : 
                 item.sentiment === 'negative' ? '부정적' : '중립적'}
                ({item.score.toFixed(2)})
              </span>
            </div>
            {item.keywords && (
              <div className="keywords">
                <span className="label">주요 키워드: </span>
                <span className="value">{item.keywords.join(', ')}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SentimentResults;
