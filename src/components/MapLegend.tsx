import React from 'react';

const MapLegend: React.FC = () => {
  return (
    <div className="map-legend">
      <h3>감성 지수 범례</h3>
      <div className="legend">
        <div className="legend-item">
          <div className="legend-color positive-color"></div>
          <div className="legend-text">긍정적 (Positive)</div>
        </div>
        <div className="legend-item">
          <div className="legend-color negative-color"></div>
          <div className="legend-text">부정적 (Negative)</div>
        </div>
        <div className="legend-item">
          <div className="legend-color neutral-color"></div>
          <div className="legend-text">중립적 (Neutral)</div>
        </div>
        <div className="legend-item">
          <div className="legend-color no-data-color"></div>
          <div className="legend-text">데이터 없음 (No Data)</div>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;