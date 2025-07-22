import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import socketService from '../services/socketService';
import { useSelector, useDispatch } from 'react-redux';
import { fetchActiveBuses, updateBusLocation } from '../redux/trackingSlice';
import notificationSound from '../assets/notification.mp3';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import Toast from './Toast';
import { addNotification } from '../redux/notificationsSlice';

// إصلاح مشكلة أيقونات Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// إعدادات الزوم
const minZoom = 11;
const maxZoom = 18;
const defaultZoom = 13;

// مكون لتحديث الخريطة تلقائياً
function MapUpdater({ buses, selectedBusId, isTracking }) {
  const map = useMap();
  const prevBusCount = useRef(buses.length);
  
  useEffect(() => {
    // فلتر الباصات التي لديها lat/lng معرفين وصحيحين
    const validBuses = Array.isArray(buses)
      ? buses.filter(bus => bus.lat != null && bus.lng != null && !isNaN(bus.lat) && !isNaN(bus.lng))
      : [];
    if (isTracking && validBuses.length > 0 && validBuses.length !== prevBusCount.current) {
      const bounds = L.latLngBounds(validBuses.map(bus => [bus.lat, bus.lng]));
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
      prevBusCount.current = validBuses.length;
    }
  }, [buses, map, isTracking]);

  useEffect(() => {
    if (selectedBusId && isTracking) {
      const selectedBus = Array.isArray(buses)
        ? buses.find(bus => bus.id === selectedBusId && bus.lat != null && bus.lng != null && !isNaN(bus.lat) && !isNaN(bus.lng))
        : null;
      if (selectedBus) {
        map.setView([selectedBus.lat, selectedBus.lng], 16);
      }
    }
  }, [selectedBusId, buses, map, isTracking]);

  return null;
}

// مكون لعرض مسار الحافلة
function BusRoute({ bus, routePath }) {
  if (!routePath || routePath.length < 2) return null;
  
  return (
    <Polyline
      positions={routePath}
      color={bus.routeColor || '#3B82F6'}
      weight={3}
      opacity={0.7}
      dashArray="10, 10"
    />
  );
}

// مكون لعرض منطقة التغطية
function CoverageArea({ center, radius = 5000 }) {
  return (
    <Circle
      center={center}
      radius={radius}
      pathOptions={{
        color: '#3B82F6',
        fillColor: '#3B82F6',
        fillOpacity: 0.1,
        weight: 2
      }}
    />
  );
}

function SearchControl({ onResult }) {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: 'ابحث عن مكان...'
    });
    map.addControl(searchControl);
    map.on('geosearch/showlocation', (result) => {
      if (onResult) {
        onResult(result.location);
      }
    });
    return () => {
      map.removeControl(searchControl);
      map.off('geosearch/showlocation');
    };
  }, [map, onResult]);
  return null;
}

const AdvancedLeafletMap = ({ 
  height = "600px", 
  showControls = true, 
  showCoverage = false,
  showRoutes = true,
  showStops = true,
  autoCenter = true,
  selectedBusId = null,
  selectedRouteId = null,
  onBusClick = null,
  buses: propBuses = null,
  onMapClick = null,
  routes = [], // تأكد من وجود routes في props
  showLegend = true, // جديد: القيمة الافتراضية
  userRole = "parent", // أضف هذا البراميتر إذا لم يكن موجودًا
}) => {
  console.log('🚦 routes in AdvancedLeafletMap:', routes);
  const dispatch = useDispatch();
  const reduxBuses = useSelector(state => state.tracking?.buses);
  const buses = propBuses || reduxBuses || [];
  const socketConnected = useSelector(state => state.tracking?.socketConnected);
  const lastUpdate = useSelector(state => state.tracking?.lastUpdate);
  const [mapCenter, setMapCenter] = useState([24.0889, 32.8998]); // أسوان، مصر
  const [zoom, setZoom] = useState(12);
  const [mapType, setMapType] = useState('streets');
  const [isTracking, setIsTracking] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [availableBuses, setAvailableBuses] = useState([]);
  const mapRef = useRef(null);
  const [iconScale, setIconScale] = useState(1);
  // احذف audioRef وكل ما يتعلق بتشغيل الصوت
  const audioRef = useRef(null); // لإشعار الصوت
  const [toast, setToast] = useState(null); // لإظهار الإشعار
  const [notifiedStops, setNotifiedStops] = useState({}); // {busId_stopIdx: timestamp}

  // تكبير/تصغير الأيقونات مع الزوم (مقياس مضبوط)
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const handleZoom = () => {
      const zoom = map._zoom || map.getZoom();
      setIconScale(Math.max(0.8, Math.min(1.2, 0.8 + (zoom - defaultZoom) * 0.12)));
    };
    map.on('zoom', handleZoom);
    handleZoom();
    return () => map.off('zoom', handleZoom);
  }, []);

  // تحديث دالة إنشاء أيقونة الباص لتدعم التكبير
  const createBusIcon = (bus) => {
    const statusColor = bus.status === 'active' ? '#10B981' : bus.status === 'stopped' ? '#EF4444' : '#F59E0B';
    const size = 60 * iconScale;
    return L.divIcon({
      className: 'custom-bus-icon',
      html: `
        <div class="bus-marker-realistic ${bus.status}" style="background-color: ${statusColor}; width:${size}px; height:${size/2}px;">
          <div class="bus-body" style="width:${size-10}px; height:${size/3}px;"></div>
          <div class="bus-number-realistic">${bus.number}</div>
          <div class="bus-speed-realistic">${Math.round(bus.speed)} كم/س</div>
          <div class="bus-direction-realistic" style="transform: rotate(${bus.heading}deg)"><i class="fas fa-arrow-up"></i></div>
        </div>
      `,
      iconSize: [size, size/2],
      iconAnchor: [size/2, size/4]
    });
  };

  // تحسين popup الباص
  function BusPopup({ bus }) {
    return (
      <div className="bus-popup" style={{ minWidth: 220, direction: 'rtl' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 22, marginLeft: 8 }}>🚌</span>
          <span style={{ fontWeight: 'bold', fontSize: 16, color: '#2563EB' }}>{bus.number}</span>
        </div>
        <div style={{ fontSize: 13, marginBottom: 4 }}><b>المسار:</b> {bus.route}</div>
        <div style={{ fontSize: 13, marginBottom: 4 }}><b>السائق:</b> {bus.driver}</div>
        <div style={{ fontSize: 13, marginBottom: 4 }}><b>الحالة:</b> <span style={{ color: bus.status === 'active' ? '#10B981' : '#EF4444' }}>{bus.status === 'active' ? 'نشط' : 'متوقف'}</span></div>
        <div style={{ fontSize: 13, marginBottom: 4 }}><b>السرعة:</b> {Math.round(bus.speed)} كم/س</div>
        <div style={{ fontSize: 13, marginBottom: 4 }}><b>الركاب:</b> {bus.passengers}/{bus.capacity}</div>
        <div style={{ fontSize: 13, marginBottom: 4 }}><b>المحطة التالية:</b> {bus.nextStop}</div>
        <div style={{ fontSize: 13, marginBottom: 4 }}><b>وقت الوصول:</b> {bus.eta}</div>
        <div style={{ fontSize: 12, color: '#888' }}>آخر تحديث: {new Date(bus.lastUpdate).toLocaleTimeString('ar-EG')}</div>
      </div>
    );
  }

  // بدء التتبع
  const startTracking = () => {
    setIsTracking(true);
    setAvailableBuses(propBuses);
    // ربط WebSocket للباصات المتاحة
    propBuses.forEach(bus => {
      socketService.joinBusTracking(bus.id);
    });
  };

  // إيقاف التتبع
  const stopTracking = () => {
    setIsTracking(false);
    setAvailableBuses([]);
    socketService.leaveTracking();
  };

  // معالجة النقر على الحافلة
  const handleBusClick = (bus) => {
    setSelectedBus(bus);
    if (onBusClick) onBusClick(bus);
  };

  // تبديل نوع الخريطة
  const changeMapType = (type) => {
    setMapType(type);
  };

  // الحصول على عنوان الخريطة
  const getTileLayerUrl = () => {
    switch (mapType) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      case 'dark':
        return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  // محاكاة حركة الباصات كل ثانية
  useEffect(() => {
    if (!isTracking) return;
    
    const interval = setInterval(() => {
      setAvailableBuses(prevBuses => prevBuses.map(bus => {
        if (bus.status !== 'active' || !bus.isMoving) return bus;
        
        // استخدم المسارات المرسومة من props للحصول على المسار الحالي
        const currentRoute = propBuses.find(r => r.id === bus.routeId);
        if (!currentRoute || !currentRoute.path || currentRoute.path.length === 0) return bus;
        
        // حساب النقطة التالية في المسار
        const nextIndex = (bus.currentRouteIndex + 1) % currentRoute.path.length;
        const currentPoint = currentRoute.path[bus.currentRouteIndex];
        const nextPoint = currentRoute.path[nextIndex];
        
        if (!currentPoint || !nextPoint) return bus;
        
        // حساب المسافة والسرعة
        const latDiff = nextPoint[0] - currentPoint[0];
        const lngDiff = nextPoint[1] - currentPoint[1];
        const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
        
        // سرعة الباص بالدرجات (تحويل من كم/ساعة) - زيادة السرعة للحركة الواضحة
        const speedInDegrees = (bus.speed / 111000) * 2.0; // زيادة السرعة بشكل كبير للحركة الواضحة
        
        // حساب التقدم نحو النقطة التالية
        const progress = Math.min(speedInDegrees / Math.max(distance, 0.0001), 1);
        
        // حساب الموقع الجديد
        const newLat = currentPoint[0] + (latDiff * progress);
        const newLng = currentPoint[1] + (lngDiff * progress);
        
        // حساب الاتجاه
        const newHeading = Math.atan2(lngDiff, latDiff) * (180 / Math.PI);
        
        // تحديث مؤشر المسار إذا وصلنا للنقطة التالية
        const newRouteIndex = progress >= 0.9 ? nextIndex : bus.currentRouteIndex;
        
        // تحديث السرعة بشكل عشوائي قليلاً للواقعية
        const speedVariation = bus.speed + (Math.random() - 0.5) * 8;
        const newSpeed = Math.max(20, Math.min(50, speedVariation));
        
        // التحقق من الوصول لمحطة تجميع
        const isAtStop = checkIfAtStop(newLat, newLng, bus.routeId);
        const shouldStop = isAtStop && Math.random() < 0.3; // 30% احتمال التوقف في المحطة
        
        const updatedBus = {
          ...bus,
          lat: newLat,
          lng: newLng,
          heading: newHeading,
          speed: shouldStop ? 0 : newSpeed,
          currentRouteIndex: newRouteIndex,
          lastUpdate: new Date().toISOString(),
          nextStop: getNextStop(bus.routeId, newRouteIndex),
          eta: getNextETA(bus.routeId, newRouteIndex),
          isMoving: !shouldStop,
          status: shouldStop ? 'stopped' : 'active'
        };
        
        // إعادة تشغيل الباص بعد فترة توقف
        if (shouldStop) {
          setTimeout(() => {
            setAvailableBuses(prev => prev.map(b => 
              b.id === bus.id 
                ? { ...b, isMoving: true, status: 'active', speed: newSpeed }
                : b
            ));
          }, 3000 + Math.random() * 2000); // توقف بين 3-5 ثوان
        }
        
        return updatedBus;
      }));
      
      // تحديث وقت آخر تحديث في Redux
      dispatch({ type: 'SET_LAST_UPDATE', payload: new Date().toISOString() });
    }, 500); // تقليل الفاصل الزمني لجعل الحركة أكثر سلاسة
    
    return () => clearInterval(interval);
  }, [isTracking, propBuses, dispatch]);

  // دالة للتحقق من الوصول لمحطة تجميع
  const checkIfAtStop = (lat, lng, routeId) => {
    const currentRoute = propBuses.find(r => r.id === routeId);
    if (!currentRoute) return false;
    
    // التحقق من قرب الباص من أي محطة في المسار
    return currentRoute.stops.some(stop => {
      const distance = Math.sqrt(
        Math.pow(stop.lat - lat, 2) + 
        Math.pow(stop.lng - lng, 2)
      );
      return distance < 0.0005; // مسافة صغيرة للاعتبار في المحطة
    });
  };

  // دالة الحصول على المحطة التالية
  const getNextStop = (routeId, currentIndex) => {
    const currentRoute = propBuses.find(r => r.id === routeId);
    if (!currentRoute) return "غير محدد";
    
    const nextIndex = (currentIndex + 1) % currentRoute.path.length;
    const nextPoint = currentRoute.path[nextIndex];
    
    // البحث عن أقرب محطة للموقع التالي
    const nearestStop = currentRoute.stops.find(stop => {
      const distance = Math.sqrt(
        Math.pow(stop.lat - nextPoint[0], 2) + 
        Math.pow(stop.lng - nextPoint[1], 2)
      );
      return distance < 0.001; // مسافة صغيرة للاعتبار محطة
    });
    
    return nearestStop ? nearestStop.name : "محطة تالية";
  };

  // دالة الحصول على الوقت المتوقع للوصول
  const getNextETA = (routeId, currentIndex) => {
    const currentRoute = propBuses.find(r => r.id === routeId);
    if (!currentRoute) return "غير محدد";
    
    const remainingPoints = currentRoute.path.length - currentIndex;
    const estimatedMinutes = Math.ceil(remainingPoints * 0.5); // 30 ثانية لكل نقطة
    
    const now = new Date();
    const eta = new Date(now.getTime() + estimatedMinutes * 60 * 1000);
    
    return eta.toLocaleTimeString('ar-EG', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // تهيئة الباصات عند بدء التتبع
  useEffect(() => {
    if (isTracking && availableBuses.length === 0) {
      setAvailableBuses(propBuses);
    }
  }, [isTracking, availableBuses.length, propBuses]);

  // تحديث الباصات من Redux إذا كانت متوفرة
  useEffect(() => {
    if (propBuses && propBuses.length > 0) {
      const transformedBuses = propBuses
        .filter(bus => bus.location)
        .map(bus => ({
          id: bus.bus.id,
          number: bus.bus.number || `Bus ${bus.bus.id}`,
          route: `Route #${bus.bus.route_id || 'Unknown'}`,
          routeId: bus.bus.route_id || 1,
          driver: "Driver Name",
          lat: bus.location.latitude,
          lng: bus.location.longitude,
          status: bus.location.status || "active",
          passengers: 0,
          capacity: bus.bus.capacity || 50,
          speed: bus.location.speed || 30,
          heading: bus.location.heading || 0,
          nextStop: bus.location.next_station || "Unknown",
          eta: "Calculating...",
          isMoving: (bus.location.speed || 0) > 0,
          lastUpdate: bus.location.timestamp || new Date().toISOString(),
          batteryLevel: bus.location.battery_level || 100,
          signalStrength: bus.location.signal_strength || 100,
          currentRouteIndex: 0,
        }));
      
      if (transformedBuses.length > 0) {
        setAvailableBuses(transformedBuses);
      }
    }
  }, [propBuses]);

  // CSS للباص الواقعي
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-bus-icon {
        background: transparent !important;
        border: none !important;
      }

      .bus-marker-realistic {
        position: relative;
        width: 60px;
        height: 30px;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        animation: bus-bounce 2s infinite;
      }

      .bus-marker-realistic.active {
        background: linear-gradient(135deg, #10B981, #059669) !important;
        border: 2px solid #047857;
      }

      .bus-marker-realistic.stopped {
        background: linear-gradient(135deg, #EF4444, #DC2626) !important;
        border: 2px solid #B91C1C;
      }

      .bus-marker-realistic.maintenance {
        background: linear-gradient(135deg, #F59E0B, #D97706) !important;
        border: 2px solid #B45309;
      }

      .bus-body {
        width: 50px;
        height: 20px;
        background: #1F2937;
        border-radius: 6px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 4px;
      }

      .bus-windows {
        width: 30px;
        height: 12px;
        background: linear-gradient(90deg, #60A5FA, #3B82F6);
        border-radius: 3px;
        position: absolute;
        left: 8px;
        top: 2px;
        display: flex;
        gap: 2px;
      }

      .bus-windows::before,
      .bus-windows::after {
        content: '';
        width: 2px;
        height: 100%;
        background: #1F2937;
      }

      .bus-door {
        width: 8px;
        height: 16px;
        background: #6B7280;
        border-radius: 2px;
        position: absolute;
        right: 6px;
        top: 2px;
      }

      .bus-wheels {
        position: absolute;
        bottom: -4px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 4px;
      }

      .wheel {
        width: 6px;
        height: 6px;
        background: #374151;
        border-radius: 50%;
        border: 1px solid #1F2937;
      }

      .bus-number-realistic {
        font-size: 8px;
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        margin-top: 2px;
        white-space: nowrap;
      }

      .bus-speed-realistic {
        font-size: 6px;
        color: #E5E7EB;
        margin-top: 1px;
      }

      .bus-direction-realistic {
        position: absolute;
        top: -8px;
        color: white;
        font-size: 8px;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
      }

      @keyframes bus-bounce {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-2px); }
      }

      .bus-marker-realistic:hover {
        transform: scale(1.1);
        z-index: 1000 !important;
      }

      .route-line {
        stroke-width: 4;
        stroke-linecap: round;
        stroke-linejoin: round;
        opacity: 0.8;
        animation: route-pulse 3s infinite;
      }

      @keyframes route-pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }

      .stop-marker {
        background: #3B82F6;
        border: 3px solid white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        animation: stop-pulse 2s infinite;
      }

      @keyframes stop-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }

      .map-container {
        height: 100vh;
        width: 100%;
        position: relative;
      }

      .map-controls {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 1000;
        background: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        min-width: 300px;
      }

      .control-group {
        margin-bottom: 15px;
      }

      .control-group h3 {
        margin: 0 0 10px 0;
        color: #1F2937;
        font-size: 16px;
        font-weight: 600;
      }

      .bus-list {
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid #E5E7EB;
        border-radius: 8px;
        padding: 10px;
      }

      .bus-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        margin-bottom: 5px;
        background: #F9FAFB;
        border-radius: 6px;
        border-left: 4px solid #10B981;
      }

      .bus-info {
        flex: 1;
      }

      .bus-name {
        font-weight: 600;
        color: #1F2937;
        font-size: 14px;
      }

      .bus-details {
        font-size: 12px;
        color: #6B7280;
        margin-top: 2px;
      }

      .bus-status {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
      }

      .status-active {
        background: #D1FAE5;
        color: #065F46;
      }

      .status-stopped {
        background: #FEE2E2;
        color: #991B1B;
      }

      .status-maintenance {
        background: #FEF3C7;
        color: #92400E;
      }

      .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 14px;
      }

      .btn-primary {
        background: #3B82F6;
        color: white;
      }

      .btn-primary:hover {
        background: #2563EB;
      }

      .btn-success {
        background: #10B981;
        color: white;
      }

      .btn-success:hover {
        background: #059669;
      }

      .btn-danger {
        background: #EF4444;
        color: white;
      }

      .btn-danger:hover {
        background: #DC2626;
      }

      .btn-secondary {
        background: #6B7280;
        color: white;
      }

      .btn-secondary:hover {
        background: #4B5563;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-top: 10px;
      }

      .stat-item {
        background: #F3F4F6;
        padding: 8px;
        border-radius: 6px;
        text-align: center;
      }

      .stat-value {
        font-size: 18px;
        font-weight: bold;
        color: #1F2937;
      }

      .stat-label {
        font-size: 12px;
        color: #6B7280;
        margin-top: 2px;
      }

      .legend {
        position: absolute;
        bottom: 20px;
        left: 20px;
        background: white;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
      }

      .legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }

      .legend-color {
        width: 16px;
        height: 16px;
        border-radius: 4px;
        margin-right: 8px;
      }

      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255,255,255,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #E5E7EB;
        border-top: 4px solid #3B82F6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // تحسين زر التتبع ليكون احترافيًا
  const trackingBtnClass = isTracking ? 'btn btn-danger' : 'btn btn-success';
  const trackingBtnIcon = isTracking ? '⏹' : '🟢';
  const trackingBtnText = isTracking ? 'إيقاف التتبع' : 'بدء التتبع';

  // عدل createStopIcon ليغير اللون والأيقونة حسب النوع
  const createStopIcon = (stop) => {
    const size = 12 * iconScale; // صغر الحجم
    let color = '#3B82F6'; // gathering
    let icon = '👥';
    if (stop.type === 'pickup') {
      color = '#10B981';
      icon = '🟢';
    } else if (stop.type === 'dropoff') {
      color = '#F59E42';
      icon = '🟠';
    }
    return L.divIcon({
      className: 'custom-stop-icon',
      html: `<div class="stop-marker" style="background:${color};width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;font-size:12px;">${icon}</div>` +
        `<div style='font-size:9px;text-align:center;color:#222;margin-top:2px;'>${stop.name}</div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  };

  // عدل BusStops ليعرض popup يوضح نوع المحطة
  const BusStops = ({ stops }) => {
    return stops.map((stop, idx) => {
      // تأكد أن lng موجودة (ولو كانت long فقط)
      const lng = stop.lng !== undefined ? stop.lng : stop.long;
      return (
        <Marker
          key={stop.id || idx}
          position={[stop.lat, lng]}
          icon={createStopIcon(stop)}
        >
          <Popup>
            <div className="stop-popup">
              <h4>{stop.name}</h4>
              <p>النوع: {stop.type === 'gathering' ? 'مكان تجمع الطلاب' : stop.type === 'pickup' ? 'نقطة صعود' : stop.type === 'dropoff' ? 'نقطة نزول' : stop.type}</p>
            </div>
          </Popup>
        </Marker>
      );
    });
  };

  // أضف وسيلة إيضاح (Legend) في الخريطة
  // --- Only one definition of createStopIcon should exist, keep the one below with iconScale dependency ---
  // --- Only one definition of BusStops should exist, keep the one below ---

  // Play notification sound and show browser notification when buses appear after tracking starts
  useEffect(() => {
    if (isTracking && availableBuses.length > 0) {
      // Browser notification
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          try {
            new Notification('🚍 الباصات ظهرت على الخريطة!', {
              body: 'تم بدء التتبع وظهور الباصات.',
              icon: '/bus-icon.png'
            });
          } catch (e) {
            // Ignore notification errors
          }
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
      }
      // احذف كل useEffect أو كود يشغل audioRef.current.play()
    }
  }, [isTracking, availableBuses.length]);

  // منطق الإشعار عند اقتراب الباص من محطة
  useEffect(() => {
    if (!isTracking || !availableBuses.length || !propBuses.length) return;
    availableBuses.forEach(bus => {
      propBuses.forEach((route, routeIdx) => {
        if (route.stops) { // Check if route has stops
          route.stops.forEach((stop, stopIdx) => {
            const lng = stop.lng !== undefined ? stop.lng : stop.long;
            const distance = Math.sqrt(
              Math.pow(stop.lat - bus.lat, 2) +
              Math.pow(lng - bus.lng, 2)
            );
            // إذا اقترب الباص من المحطة (مسافة صغيرة)
            if (distance < 0.0007) {
              const key = `${bus.id}_${stopIdx}`;
              // لا تكرر الإشعار لنفس الباص-محطة خلال 3 دقائق
              if (!notifiedStops[key] || Date.now() - notifiedStops[key] > 180000) {
                // إشعار Toast
                setToast({
                  message: `🚌 الباص "${bus.number}" وصل إلى ${stop.type === 'gathering' ? 'مكان تجمع الطلاب' : stop.type === 'pickup' ? 'نقطة صعود' : stop.type === 'dropoff' ? 'نقطة نزول' : 'محطة'} "${stop.name}"`,
                  type: 'info',
                });
                // إشعار سجل الإشعارات
                dispatch(addNotification({
                  busId: bus.id,
                  busName: bus.number,
                  stopName: stop.name,
                  stopType: stop.type,
                  type: stop.type === 'gathering' ? 'gathering' : stop.type === 'pickup' ? 'arrival' : stop.type === 'dropoff' ? 'dropoff' : 'arrival',
                  title: `وصول الباص إلى المحطة`,
                  message: `الباص "${bus.number}" وصل إلى ${stop.type === 'gathering' ? 'مكان تجمع الطلاب' : stop.type === 'pickup' ? 'نقطة صعود' : stop.type === 'dropoff' ? 'نقطة نزول' : 'محطة'} "${stop.name}"`,
                  time: new Date().toLocaleTimeString('ar-EG'),
                  date: new Date().toISOString().split('T')[0],
                  isRead: false
                }));
                setNotifiedStops(prev => ({ ...prev, [key]: Date.now() }));
                if (audioRef.current) {
                  try { audioRef.current.play(); } catch (e) {}
                }
              }
            }
          });
        }
      });
    });
  }, [availableBuses, propBuses, isTracking, notifiedStops, dispatch]);

  // شغل صوت الإشعار عند بدء التتبع للـ parent فقط
  useEffect(() => {
    if (userRole === 'parent' && isTracking && audioRef.current) {
      try { audioRef.current.play(); } catch (e) {}
    }
  }, [isTracking, userRole]);

  useEffect(() => {
    if (autoCenter && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapCenter([pos.coords.latitude, pos.coords.longitude]);
          setZoom(15);
        },
        (err) => {
          // يمكن تجاهل الخطأ أو إظهار رسالة للمستخدم
        }
      );
    }
  }, []);

  // عند رسم المسارات:
  const renderPolylines = () => {
    if (!Array.isArray(routes)) return null;
    return routes.map((route, idx) => {
      const points = [];
      if (route.start_point && typeof route.start_point.lat === 'number' && typeof route.start_point.long === 'number')
        points.push([route.start_point.lat, route.start_point.long]);
      if (Array.isArray(route.stops)) {
        route.stops.forEach(stop => {
          if (typeof stop.lat === 'number' && (typeof stop.long === 'number' || typeof stop.lng === 'number'))
            points.push([stop.lat, stop.long ?? stop.lng]);
        });
      }
      if (route.end_point && typeof route.end_point.lat === 'number' && typeof route.end_point.long === 'number')
        points.push([route.end_point.lat, route.end_point.long]);
      if (points.length < 2) return null;
      return (
        <Polyline
          key={route._id || route.id || idx}
          positions={points}
          color={route.color || '#3B82F6'}
          weight={4}
          opacity={0.8}
        />
      );
    });
  };

  // عند رسم Marker للباصات:
  const renderBusMarkers = () => {
    if (!Array.isArray(propBuses)) return null;
    return propBuses.map((bus, idx) => {
      console.log('bus:', bus);
      console.log('bus.currentLocation:', bus.currentLocation);
      const lat = bus.currentLocation?.lat ?? bus.currentLocation?.latitude ?? bus.lat;
      const lng = bus.currentLocation?.lng ?? bus.currentLocation?.long ?? bus.currentLocation?.longitude ?? bus.lng ?? bus.long ?? bus.longitude;
      if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) return null;
      return (
        <Marker
          key={bus._id || bus.id || idx}
          position={[lat, lng]}
          icon={createBusIcon(bus)}
          eventHandlers={{ click: () => handleBusClick(bus) }}
        >
          <Popup>
            <BusPopup bus={bus} />
          </Popup>
        </Marker>
      );
    });
  };

  // محاكاة حركة الباصات على جميع المسارات
  const [busIndices, setBusIndices] = useState(() =>
    Array.isArray(routes) ? routes.map(() => 0) : []
  );

  useEffect(() => {
    if (!Array.isArray(routes) || routes.length === 0) return;
    const interval = setInterval(() => {
      setBusIndices(prev =>
        prev.map((idx, routeIdx) => {
          const route = routes[routeIdx];
          const points = [
            route.start_point && [route.start_point.lat, route.start_point.long],
            ...(Array.isArray(route.stops) ? route.stops.map(stop => [stop.lat, stop.long || stop.lng]) : []),
            route.end_point && [route.end_point.lat, route.end_point.long]
          ].filter(Boolean);
          if (points.length < 2) return 0;
          return (idx + 1) % points.length;
        })
      );
    }, 1200); // كل 1.2 ثانية ينتقل الباص لنقطة جديدة
    return () => clearInterval(interval);
  }, [routes]);

  // رسم المسارات والباصات المتحركة
  const renderSimulatedPolylinesAndBuses = () => {
    if (!Array.isArray(routes)) return null;
    return routes.map((route, routeIdx) => {
      const points = [
        route.start_point && [route.start_point.lat, route.start_point.long],
        ...(Array.isArray(route.stops) ? route.stops.map(stop => [stop.lat, stop.long || stop.lng]) : []),
        route.end_point && [route.end_point.lat, route.end_point.long]
      ].filter(pt => Array.isArray(pt) && pt.length === 2 && pt[0] != null && pt[1] != null && !isNaN(pt[0]) && !isNaN(pt[1]));
      if (points.length < 2) return null;
      const busPos = points[busIndices[routeIdx] || 0];
      if (!busPos || busPos[0] == null || busPos[1] == null || isNaN(busPos[0]) || isNaN(busPos[1])) return null;
      return (
        <>
          <Polyline
            key={route._id || route.id || routeIdx}
            positions={points}
            color={route.color || '#3B82F6'}
            weight={4}
            opacity={0.8}
          />
          <Marker
            key={"bus-" + (route._id || route.id || routeIdx)}
            position={busPos}
            icon={createBusIcon({ number: route.name || `Bus ${routeIdx+1}`, status: 'active', speed: 30, heading: 0 })}
          />
        </>
      );
    });
  };

  function getClosestPointOnRoute(busLat, busLng, routePoints) {
    let minDist = Infinity;
    let closest = routePoints[0];
    routePoints.forEach(pt => {
      if (!pt || pt.length !== 2) return;
      const dist = Math.sqrt(Math.pow(pt[0] - busLat, 2) + Math.pow(pt[1] - busLng, 2));
      if (dist < minDist) {
        minDist = dist;
        closest = pt;
      }
    });
    return closest;
  }

  useEffect(() => {
    if (!Array.isArray(propBuses) || !Array.isArray(routes)) return;
    propBuses.forEach(bus => {
      const lat = bus.currentLocation?.lat ?? bus.currentLocation?.latitude ?? bus.lat;
      const lng = bus.currentLocation?.lng ?? bus.currentLocation?.long ?? bus.currentLocation?.longitude ?? bus.lng ?? bus.long ?? bus.longitude;
      const hasValidCoords = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);
      const route = routes.find(r => String(r._id || r.id) === String(bus.route_id?._id || bus.route_id || bus.route));
      console.log("routes ids:", routes.map(r => r._id || r.id));
      console.log("bus.route_id:", bus.route_id);
      console.log('🔵 Bus:', bus.BusNumber || bus.number || bus._id, '| lat:', lat, '| lng:', lng, '| valid:', hasValidCoords, '| route found:', !!route);
      if (hasValidCoords && route) {
        // snap-to-route (فقط طباعة)
        const points = [
          route.start_point && [route.start_point.lat, route.start_point.long],
          ...(Array.isArray(route.stops) ? route.stops.map(stop => [stop.lat, stop.long || stop.lng]) : []),
          route.end_point && [route.end_point.lat, route.end_point.long]
        ].filter(pt => Array.isArray(pt) && pt.length === 2 && pt[0] != null && pt[1] != null && !isNaN(pt[0]) && !isNaN(pt[1]));
        const [snapLat, snapLng] = getClosestPointOnRoute(lat, lng, points);
        console.log('🟡 Snap-to-route:', { bus: bus.BusNumber || bus.number || bus._id, orig: [lat, lng], snapped: [snapLat, snapLng] });
      }
    });
  }, [propBuses, routes]);

  // دالة توليد نقاط بين نقطتين
  function interpolatePoints([lat1, lng1], [lat2, lng2], steps = 15) {
    const points = [];
    for (let i = 1; i < steps; i++) {
      const lat = lat1 + (lat2 - lat1) * (i / steps);
      const lng = lng1 + (lng2 - lng1) * (i / steps);
      points.push([lat, lng]);
    }
    return points;
  }

  // دالة بناء مصفوفة نقاط المسار بالكامل
  function buildSmoothRoutePoints(route, steps = 15) {
    const rawPoints = [
      route.start_point && [route.start_point.lat, route.start_point.long],
      ...(Array.isArray(route.stops) ? route.stops.map(stop => [stop.lat, stop.long || stop.lng]) : []),
      route.end_point && [route.end_point.lat, route.end_point.long]
    ].filter(pt => Array.isArray(pt) && pt.length === 2 && pt[0] != null && pt[1] != null && !isNaN(pt[0]) && !isNaN(pt[1]));

    let smoothPoints = [];
    for (let i = 0; i < rawPoints.length - 1; i++) {
      smoothPoints.push(rawPoints[i]);
      smoothPoints = smoothPoints.concat(interpolatePoints(rawPoints[i], rawPoints[i + 1], steps));
    }
    smoothPoints.push(rawPoints[rawPoints.length - 1]);
    return smoothPoints;
  }

  // عدل دالة محاكاة حركة الباصات الحقيقية على المسار لتعمل فقط عند isTracking
  useEffect(() => {
    if (!isTracking || !Array.isArray(propBuses) || !Array.isArray(routes) || propBuses.length === 0 || routes.length === 0) return;
    let indices = {};
    propBuses.forEach(bus => { indices[bus.id] = 0; });
    const interval = setInterval(() => {
      setAvailableBuses(prevBuses => prevBuses.map(bus => {
        const route = routes.find(r => String(r._id || r.id) === String(bus.route_id?._id || bus.route_id || bus.route));
        if (!route) return bus;
        const points = buildSmoothRoutePoints(route, 15);
        if (points.length < 2) return bus;
        const idx = (indices[bus.id] ?? 0) % points.length;
        const [newLat, newLng] = points[idx];
        indices[bus.id] = (idx + 1) % points.length;
        return {
          ...bus,
          lat: newLat,
          lng: newLng,
          lastUpdate: new Date().toISOString(),
        };
      }));
    }, 1200);
    return () => clearInterval(interval);
  }, [isTracking, propBuses, routes]);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} duration={4000} onClose={() => setToast(null)} />}
      <audio ref={audioRef} src={notificationSound} preload="auto" />
      <div className="relative" style={{ height }}>
        <MapContainer
          center={mapCenter}
          zoom={defaultZoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url={getTileLayerUrl()}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* دعم البحث الجغرافي */}
          <SearchControl onResult={({ x: lng, y: lat, label }) => {
            if (typeof onMapClick === 'function') {
              onMapClick({ lat, lng, label });
            }
          }} />
          {/* دعم النقر على الخريطة */}
          {typeof onMapClick === 'function' && <MapClickHandler onMapClick={onMapClick} />}
          {/* تحديث الخريطة تلقائياً */}
          <MapUpdater buses={availableBuses} selectedBusId={selectedBusId} isTracking={isTracking} />
          
          {/* رسم المسارات فقط عند بدء التتبع */}
          {isTracking && renderPolylines()}
          {/* رسم الباصات: متحركة عند التتبع، ثابتة عند عدم التتبع */}
          {isTracking ? renderSimulatedPolylinesAndBuses() : renderBusMarkers()}
          {/* عرض المحطات */}
          {showStops && isTracking && <BusStops stops={Array.isArray(routes) ? routes.flatMap(r => r.stops || []) : []} />}
          
          {/* عرض منطقة التغطية */}
          {showCoverage && <CoverageArea center={mapCenter} />}
        </MapContainer>

        {/* أدوات التحكم */}
        {showControls && (
          <div className="map-controls">
            <h4>خريطة أسوان - تتبع الحافلات</h4>
            
            {/* مؤشر الاتصال */}
            <div className={`status-indicator`}>
              <div className={`status-dot ${socketConnected ? 'connected' : 'disconnected'}`}></div>
              <span>{socketConnected ? 'متصل مباشر' : 'غير متصل'}</span>
            </div>
            
            {/* أزرار التتبع */}
            <div className="tracking-controls">
              <button 
                className={trackingBtnClass}
                onClick={isTracking ? stopTracking : startTracking}
              >
                {trackingBtnIcon} {trackingBtnText}
              </button>
            </div>
            
            {/* الباصات المتاحة */}
            {isTracking && (
              <div className="control-group">
                <label>الباصات المتاحة:</label>
                <div className="available-buses">
                  {availableBuses.map(bus => (
                    <div 
                      key={bus.id} 
                      className={`bus-item ${bus.status}`}
                      onClick={() => handleBusClick(bus)}
                    >
                      <div>
                        <strong>{bus.number}</strong>
                        <div style={{ fontSize: '10px', color: '#666' }}>{bus.route}</div>
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '10px' }}>{bus.status === 'active' ? 'نشط' : 'متوقف'}</div>
                        <div style={{ fontSize: '10px', color: '#666' }}>{Math.round(bus.speed)} كم/س</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* نوع الخريطة */}
            <div className="control-group">
              <label>نوع الخريطة:</label>
              <select 
                value={mapType} 
                onChange={(e) => changeMapType(e.target.value)}
                style={{ width: '100%', fontSize: '12px' }}
              >
                <option value="streets">شوارع</option>
                <option value="satellite">قمر صناعي</option>
                <option value="terrain">طبوغرافي</option>
                <option value="dark">داكن</option>
              </select>
            </div>
            
            {/* خيارات العرض */}
            <div className="control-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={showStops} 
                  onChange={(e) => setShowStops(e.target.checked)}
                />
                إظهار المحطات
              </label>
            </div>
            
            <div className="control-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={showCoverage} 
                  onChange={(e) => setShowCoverage(e.target.checked)}
                />
                إظهار منطقة التغطية
              </label>
            </div>
            
            {/* إحصائيات سريعة */}
            {isTracking && (
              <div className="control-group">
                <div style={{ fontSize: '11px', color: '#666', textAlign: 'center' }}>
                  <div>الباصات النشطة: {availableBuses.filter(b => b.status === 'active').length}</div>
                  <div>إجمالي الباصات: {availableBuses.length}</div>
                  {lastUpdate && (
                    <div>آخر تحديث: {new Date(lastUpdate).toLocaleTimeString('ar-EG')}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* وسيلة الإيضاح */}
    </>
  );
};

const MapClickHandler = ({ onMapClick }) => {
  useMapEvent('click', (e) => {
    if (onMapClick) {
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
};

export default AdvancedLeafletMap;