import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './KoreaMap.css';
import { GeoJsonObject } from 'geojson';
import koreaProvinces from '../data/korea-provinces.json';
import { useAppSelector } from '../redux/hooks/reduxHooks';

// Leaflet 기본 아이콘 관련 문제 해결
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface ProvinceStyle {
  fillColor: string;
  weight: number;
  opacity: number;
  color: string;
  dashArray: string;
  fillOpacity: number;
}

// 맵 자동 리사이즈 컴포넌트
const MapResizer = () => {
  const map = useMap();
  
  useEffect(() => {
    // 맵 렌더링 후 리사이즈 이벤트 핸들러
    const handleResize = () => {
      if (map) {
        setTimeout(() => {
          map.invalidateSize(true);
        }, 100);
      }
    };

    // 초기 로드와 창 크기 변경 시 맵 크기 업데이트
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    // 모바일에서 특히 중요한 추가 리사이징 처리
    const additionalResizes = [300, 600, 1000, 2000];
    additionalResizes.forEach(ms => {
      setTimeout(() => {
        if (map) map.invalidateSize(true);
      }, ms);
    });
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  return null;
};

const KoreaMap: React.FC = () => {
  const [map, setMap] = useState<L.Map | null>(null);
  const sentimentData = useAppSelector((state) => state.sentiment.data);

  // 감성 데이터를 Map 구조로 변환하여 빠르게 찾도록 함
  const sentimentMap = useMemo(() => {
    const map = new Map<string, typeof sentimentData[0]>();
    sentimentData.forEach((item) => map.set(item.location, item));
    return map;
  }, [sentimentData]);

  // GeoJSON 스타일 함수
  const getProvinceStyle = (feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties> | undefined) => {
    const defaultStyle: ProvinceStyle = {
      fillColor: '#d6e9c6',
      weight: 2,
      opacity: 1,
      color: '#333',
      dashArray: '',
      fillOpacity: 0.6,
    };

    if (!feature || !feature.properties) return defaultStyle;

    const provinceData = sentimentMap.get(feature.properties.name);

    if (provinceData) {
      if (provinceData.sentiment === 'positive') {
        return { ...defaultStyle, fillColor: '#5cb85c', fillOpacity: 0.7 }; // 긍정
      } else if (provinceData.sentiment === 'negative') {
        return { ...defaultStyle, fillColor: '#d9534f', fillOpacity: 0.7 }; // 부정
      } else {
        return { ...defaultStyle, fillColor: '#f0ad4e', fillOpacity: 0.7 }; // 중립
      }
    }

    return defaultStyle;
  };

  // 마우스 오버 시 강조 효과
  const highlightFeature = (e: L.LeafletEvent) => {
    const layer = e.target;
    layer.setStyle({
      weight: 4,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.8,
    });
    layer.bringToFront();
  };

  // 마우스 아웃 시 스타일 복원
  const resetHighlight = (e: L.LeafletEvent) => {
    if (map) {
      const geoJsonLayer = e.target;
      geoJsonLayer.setStyle(getProvinceStyle(geoJsonLayer.feature));
    }
  };

  // 각 지역에 이벤트 리스너 및 툴팁 설정
  const onEachFeature = (feature: GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>, layer: L.Layer) => {
    if (!feature.properties) return;

    const province = feature.properties;
    const provinceData = sentimentMap.get(province.name);

    let tooltipContent = `<strong>${province.name}</strong>`;

    if (provinceData) {
      const sentimentText =
          provinceData.sentiment === 'positive'
              ? '긍정적'
              : provinceData.sentiment === 'negative'
                  ? '부정적'
                  : '중립적';

      tooltipContent += `<br/>검색어: ${provinceData.query}<br/>감정: ${sentimentText} (${provinceData.score.toFixed(2)})`;

      if (provinceData.keywords && provinceData.keywords.length > 0) {
        tooltipContent += `<br/>키워드: ${provinceData.keywords.join(', ')}`;
      }
    } else {
      tooltipContent += '<br/>데이터 없음';
    }

    const pathLayer = layer as L.Path;
    pathLayer.bindTooltip(tooltipContent, {
      sticky: true,
      direction: 'auto',
    });

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: () => {
        console.log(`Clicked on: ${province.name}`);
      },
    });
  };

  // 화면 크기에 따라 줌 레벨 조정
  const getZoomLevel = () => {
    const width = window.innerWidth;
    if (width < 480) return 5;
    if (width < 768) return 5.5;
    return 6;
  };
  
  // 초기 맵 로드 및 리사이즈 처리
  useEffect(() => {
    if (map) {
      const resizeMap = () => {
        map.invalidateSize(true);
      };
      
      // 여러 번 리사이즈를 시도하여 모바일에서의 렌더링 문제 해결
      resizeMap();
      setTimeout(resizeMap, 100);
      setTimeout(resizeMap, 500);
      setTimeout(resizeMap, 1000);
    }
  }, [map]);

  return (
    <div className="korea-map-container">
      <MapContainer
        center={[36.0, 127.5]}
        zoom={getZoomLevel()}
        style={{ height: '100%', width: '100%' }}
        ref={setMap}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={true}
        dragging={true}
        fadeAnimation={false}
        markerZoomAnimation={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON
          data={koreaProvinces as GeoJsonObject}
          style={getProvinceStyle}
          onEachFeature={onEachFeature}
        />
        <MapResizer />
      </MapContainer>
    </div>
  );
};

export default KoreaMap;