import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import Pin from "../pin/Pin";
import { memo, useMemo, Suspense } from 'react';
import { useInView } from 'react-intersection-observer';

// LocationMarkerコンポーネントをメモ化
const LocationMarker = memo(({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect({ latitude: lat, longitude: lng });
    },
  });

  return null;
});

LocationMarker.displayName = 'LocationMarker';

// ピンコンポーネントをメモ化してバッチ処理
const PinGroup = memo(({ items }) => {
  return items.map(item => 
    item?.location ? <Pin item={item} key={item.id} /> : null
  );
});

PinGroup.displayName = 'PinGroup';

const Map = ({ items = [], onLocationSelect, isSelectingLocation = false }) => {
  // Intersection Observerの設定
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const validItems = useMemo(() => {
    return Array.isArray(items) ? items : [];
  }, [items]);

  const position = useMemo(() => {
    return validItems.length > 0 && validItems[0]?.location?.latitude && validItems[0]?.location?.longitude
      ? [validItems[0].location.latitude, validItems[0].location.longitude]
      : [24.8055, 125.2811];
  }, [validItems]);

  const mapOptions = useMemo(() => ({
    preferCanvas: true, // キャンバスレンダリングを使用
    minZoom: 5,        // 最小ズームレベルを制限
    maxZoom: 18,       // 最大ズームレベルを制限
    wheelPxPerZoomLevel: 100, // ズーム感度を調整
  }), []);

  return (
    <div 
      ref={ref} 
      className="h-[calc(100vh-2rem)] w-full border rounded-lg shadow-lg overflow-hidden relative"
    >
      {/* ローディングプレースホルダー */}
      {!inView && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="text-gray-500">地図を読み込み中...</div>
        </div>
      )}

      {inView && (
        <Suspense fallback={
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        }>
          <MapContainer 
            center={position} 
            zoom={12.5} 
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            {...mapOptions}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={18}
              minZoom={5}
              tileSize={256}
              updateWhenIdle={true}      // アイドル時のみ更新
              updateWhenZooming={false}  // ズーム中は更新しない
            />
            <PinGroup items={validItems} />
            {isSelectingLocation && <LocationMarker onLocationSelect={onLocationSelect} />}
          </MapContainer>
        </Suspense>
      )}
    </div>
  );
};

// コンポーネント全体をメモ化
export default memo(Map);