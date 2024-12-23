import { MapContainer, TileLayer } from "react-leaflet";
import Pin from "../pin/Pin";
import { memo, useMemo, Suspense } from 'react';
import { useInView } from 'react-intersection-observer';

const SingleMap = memo(({ item }) => {
  // Intersection Observerの設定
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // メモ化された位置情報
  const position = useMemo(() => {
    return item?.location?.latitude && item?.location?.longitude
      ? [item.location.latitude, item.location.longitude]
      : [24.8055, 125.2811];
  }, [item?.location?.latitude, item?.location?.longitude]);

  // マップオプションのメモ化
  const mapOptions = useMemo(() => ({
    preferCanvas: true,    // キャンバスレンダリングを使用
    minZoom: 5,           // 最小ズームレベルを制限
    maxZoom: 18,          // 最大ズームレベルを制限
    wheelPxPerZoomLevel: 100,  // ズーム感度を調整
    zoomControl: true,    // ズームコントロールを表示
  }), []);

  return (
    <div
      ref={ref}
      className="relative h-[calc(100vh-2rem)] w-full border rounded-lg shadow-lg overflow-hidden"
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
            <Pin item={item} />
          </MapContainer>
        </Suspense>
      )}
    </div>
  );
});

SingleMap.displayName = 'SingleMap';

export default SingleMap;