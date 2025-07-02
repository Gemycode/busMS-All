import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import socketService from '../services/socketService';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActiveBuses, updateBusLocation } from '../redux/trackingSlice';

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
    if (isTracking && buses.length > 0 && buses.length !== prevBusCount.current) {
      const bounds = L.latLngBounds(buses.map(bus => [bus.lat, bus.lng]));
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
      prevBusCount.current = buses.length;
    }
  }, [buses, map, isTracking]);

  useEffect(() => {
    if (selectedBusId && isTracking) {
      const selectedBus = buses.find(bus => bus.id === selectedBusId);
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

// مكون لعرض محطات التوقف
function BusStops({ stops }) {
  return stops.map(stop => (
    <Marker
      key={stop.id}
      position={[stop.lat, stop.lng]}
      icon={createStopIcon(stop)}
    >
      <Popup>
        <div className="stop-popup">
          <h4>{stop.name}</h4>
          <p>{stop.address}</p>
          <p>النوع: {stop.type === 'school' ? 'مدرسة' : stop.type === 'pickup' ? 'نقطة تجميع' : 'نقطة إنزال'}</p>
          <p>عدد الطلاب: {stop.studentCount}</p>
          <p>الوصول التالي: {stop.nextArrival}</p>
        </div>
      </Popup>
    </Marker>
  ));
}

// إنشاء أيقونة محطة
const createStopIcon = (stop) => {
  return L.divIcon({
    className: 'custom-stop-icon',
    html: `
      <div class="stop-marker ${stop.type}">
        <div class="stop-name">${stop.name}</div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const AdvancedLeafletMap = ({ 
  height = "600px", 
  showControls = true, 
  showCoverage = false,
  showRoutes = true,
  showStops = true,
  autoCenter = true,
  selectedBusId = null,
  onBusClick = null 
}) => {
  const dispatch = useDispatch();
  const { buses, socketConnected, lastUpdate } = useSelector(state => state.tracking);
  const [mapCenter, setMapCenter] = useState([24.0889, 32.8998]); // أسوان، مصر
  const [zoom, setZoom] = useState(12);
  const [mapType, setMapType] = useState('streets');
  const [isTracking, setIsTracking] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [availableBuses, setAvailableBuses] = useState([]);
  const mapRef = useRef(null);
  const [iconScale, setIconScale] = useState(1);

  // مسارات واقعية مستخرجة من OpenStreetMap - Polylines حقيقية
  const routes = [
    {
      id: 1,
      name: "كورنيش النيل (ميدان المحطة → جامعة أسوان الجديدة)",
      color: "#3B82F6",
      path: [
        [24.088269, 32.906964], [24.088306, 32.906848], [24.088371, 32.906617], [24.088638, 32.906688], [24.088696, 32.906705], [24.088903, 32.906773], [24.089015, 32.906807], [24.089988, 32.907142], [24.090102, 32.906801], [24.090341, 32.906086], [24.090686, 32.905052], [24.090733, 32.904912], [24.090791, 32.904738], [24.090858, 32.904535], [24.090875, 32.904483], [24.091094, 32.903807], [24.091201, 32.903478], [24.091329, 32.903052], [24.091342, 32.903003], [24.091353, 32.902951], [24.091363, 32.902899], [24.091381, 32.902784], [24.091444, 32.902319], [24.091486, 32.902074], [24.091514, 32.901965], [24.091564, 32.901799], [24.091658, 32.901504], [24.091704, 32.901368], [24.091801, 32.901308], [24.09182, 32.9013], [24.09184, 32.901296], [24.091861, 32.901295], [24.091881, 32.901298], [24.092, 32.901315], [24.09215, 32.901489], [24.09218, 32.901523], [24.092263, 32.90162], [24.092376, 32.901758], [24.092448, 32.901687], [24.092345, 32.901562], [24.092287, 32.901488], [24.09187, 32.901032], [24.091859, 32.900952], [24.09186, 32.900865], [24.091876, 32.900772], [24.091899, 32.90068], [24.091905, 32.900666], [24.092022, 32.90041], [24.092054, 32.900335], [24.092084, 32.900259], [24.092379, 32.899509], [24.092439, 32.899356], [24.092497, 32.899203], [24.092552, 32.899049], [24.092738, 32.898509], [24.092783, 32.89838], [24.092832, 32.898252], [24.092869, 32.898162], [24.092907, 32.898073], [24.093301, 32.897144], [24.093416, 32.897196], [24.09349, 32.897232], [24.093561, 32.897274], [24.09363, 32.897318], [24.09487, 32.898104], [24.095721, 32.898638], [24.095537, 32.898953], [24.095245, 32.899451]
      ]
    },
    {
      id: 2,
      name: "شارع المستشفى (ميدان المحطة → المستشفى العام)",
      color: "#10B981",
      path: [
        [24.088269, 32.906964], [24.088203, 32.907172], [24.088051, 32.907625], [24.087971, 32.907599], [24.087833, 32.908215], [24.088111, 32.908507], [24.088184, 32.908572], [24.088232, 32.908602], [24.088323, 32.908654], [24.088449, 32.908674], [24.088545, 32.908678], [24.08864, 32.908677], [24.088762, 32.908666], [24.088882, 32.908645], [24.089272, 32.908548], [24.089297, 32.90866], [24.089332, 32.908787], [24.089378, 32.908957], [24.089647, 32.908993], [24.089896, 32.909026], [24.090137, 32.909058], [24.090754, 32.909127], [24.090882, 32.909144], [24.091463, 32.909192], [24.092071, 32.909252]
      ]
    },
    // المسار الثالث: طريق الأستاد إلى المطار (مؤقتًا استخدم نقاط تقريبية، يمكن تحديثها لاحقًا)
    {
      id: 3,
      name: "طريق الأستاد الرياضي (الأستاد → مطار أسوان)",
      color: "#EF4444",
      path: [
        [24.095245, 32.899451], [24.095721, 32.898638], [24.0889, 32.9633] // نقطة بداية ونهاية تقريبية
      ]
    }
  ];

  // بيانات المحطات الواقعية - محدثة لتبدأ من نقاط صحيحة على المسارات
  const stops = [
    // كورنيش النيل - محطات محدثة بناءً على المسار الجديد
    { id: 1, name: "ميدان المحطة", lat: 24.088269, lng: 32.906964, type: "pickup" },
    { id: 2, name: "شارع كورنيش النيل", lat: 24.090686, lng: 32.905052, type: "pickup" },
    { id: 3, name: "فندق كتراكت", lat: 24.091094, lng: 32.903807, type: "pickup" },
    { id: 4, name: "نادي أسوان", lat: 24.092, lng: 32.901315, type: "pickup" },
    { id: 5, name: "حديقة النباتات", lat: 24.093301, lng: 32.897144, type: "pickup" },
    { id: 6, name: "جامعة أسوان الجديدة", lat: 24.095245, lng: 32.899451, type: "pickup" },
    
    // شارع المستشفى - محطات محدثة بناءً على المسار الجديد
    { id: 7, name: "ميدان المحطة (شارع المستشفى)", lat: 24.088269, lng: 32.906964, type: "pickup" },
    { id: 8, name: "شارع المحطة", lat: 24.088203, lng: 32.907172, type: "pickup" },
    { id: 9, name: "مدرسة أسوان الثانوية", lat: 24.089272, lng: 32.908548, type: "pickup" },
    { id: 10, name: "المستشفى العام", lat: 24.092071, lng: 32.909252, type: "pickup" },
    
    // طريق الأستاد الرياضي - محطات محدثة
    { id: 11, name: "الأستاد الرياضي", lat: 24.095245, lng: 32.899451, type: "pickup" },
    { id: 12, name: "طريق الأستاد", lat: 24.095721, lng: 32.898638, type: "pickup" },
    { id: 13, name: "مطار أسوان الدولي", lat: 24.0889, lng: 32.9633, type: "pickup" },
  ];

  // بيانات الباصات الواقعية - محدثة لتبدأ من نقاط صحيحة على المسارات
  const aswanBuses = [
    {
      id: "ASW001",
      number: "كورنيش النيل",
      route: "كورنيش النيل (ميدان المحطة → جامعة أسوان الجديدة)",
      routeId: 1,
      driver: "أحمد محمد",
      lat: 24.088269,
      lng: 32.906964,
      status: "active",
      passengers: 30,
      capacity: 50,
      speed: 30,
      heading: 45,
      nextStop: "شارع كورنيش النيل",
      eta: "7:15 ص",
      isMoving: true,
      lastUpdate: new Date().toISOString(),
      batteryLevel: 90,
      signalStrength: 95,
      currentRouteIndex: 0,
    },
    {
      id: "ASW002",
      number: "شارع المستشفى",
      route: "شارع المستشفى (ميدان المحطة → المستشفى العام)",
      routeId: 2,
      driver: "منى علي",
      lat: 24.088269,
      lng: 32.906964,
      status: "active",
      passengers: 20,
      capacity: 50,
      speed: 25,
      heading: 60,
      nextStop: "شارع المحطة",
      eta: "7:20 ص",
      isMoving: true,
      lastUpdate: new Date().toISOString(),
      batteryLevel: 85,
      signalStrength: 90,
      currentRouteIndex: 0,
    },
    {
      id: "ASW003",
      number: "طريق الأستاد",
      route: "طريق الأستاد الرياضي (الأستاد → مطار أسوان)",
      routeId: 3,
      driver: "خالد حسن",
      lat: 24.095245,
      lng: 32.899451,
      status: "active",
      passengers: 15,
      capacity: 50,
      speed: 40,
      heading: 90,
      nextStop: "طريق الأستاد",
      eta: "7:30 ص",
      isMoving: true,
      lastUpdate: new Date().toISOString(),
      batteryLevel: 80,
      signalStrength: 88,
      currentRouteIndex: 0,
    }
  ];

  // تكبير/تصغير الأيقونات مع الزوم (مقياس مضبوط)
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const handleZoom = () => {
      const zoom = map._zoom || map.getZoom();
      // مقياس الأيقونة مضبوط ليبقى واضحًا في كل الزوم
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

  // تحديث دالة إنشاء أيقونة المحطة لتدعم التكبير
  const createStopIcon = (stop) => {
    const size = 20 * iconScale;
    return L.divIcon({
      className: 'custom-stop-icon',
      html: `<div class="stop-marker ${stop.type}" style="width:${size}px; height:${size}px;"><div class="stop-name">${stop.name}</div></div>`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2]
    });
  };

  // تحسين popup الباص
  function BusPopup({ bus }) {
    return (
      <div className="bus-popup" style={{minWidth:220, direction:'rtl'}}>
        <div style={{display:'flex',alignItems:'center',marginBottom:8}}>
          <span style={{fontSize:22,marginLeft:8}}>🚌</span>
          <span style={{fontWeight:'bold',fontSize:16,color:'#2563EB'}}>{bus.number}</span>
        </div>
        <div style={{fontSize:13,marginBottom:4}}><b>المسار:</b> {bus.route}</div>
        <div style={{fontSize:13,marginBottom:4}}><b>السائق:</b> {bus.driver}</div>
        <div style={{fontSize:13,marginBottom:4}}><b>الحالة:</b> <span style={{color:bus.status==='active'?'#10B981':'#EF4444'}}>{bus.status==='active'?'نشط':'متوقف'}</span></div>
        <div style={{fontSize:13,marginBottom:4}}><b>السرعة:</b> {Math.round(bus.speed)} كم/س</div>
        <div style={{fontSize:13,marginBottom:4}}><b>الركاب:</b> {bus.passengers}/{bus.capacity}</div>
        <div style={{fontSize:13,marginBottom:4}}><b>المحطة التالية:</b> {bus.nextStop}</div>
        <div style={{fontSize:13,marginBottom:4}}><b>وقت الوصول:</b> {bus.eta}</div>
        <div style={{fontSize:12,color:'#888'}}>آخر تحديث: {new Date(bus.lastUpdate).toLocaleTimeString('ar-EG')}</div>
      </div>
    );
  }

  // بدء التتبع
  const startTracking = () => {
    setIsTracking(true);
    setAvailableBuses(aswanBuses);
    // ربط WebSocket للباصات المتاحة
    aswanBuses.forEach(bus => {
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
        
        const route = routes.find(r => r.id === bus.routeId);
        if (!route || !route.path || route.path.length === 0) return bus;
        
        // حساب النقطة التالية في المسار
        const nextIndex = (bus.currentRouteIndex + 1) % route.path.length;
        const currentPoint = route.path[bus.currentRouteIndex];
        const nextPoint = route.path[nextIndex];
        
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
  }, [isTracking, routes, dispatch]);

  // دالة للتحقق من الوصول لمحطة تجميع
  const checkIfAtStop = (lat, lng, routeId) => {
    const route = routes.find(r => r.id === routeId);
    if (!route) return false;
    
    // التحقق من قرب الباص من أي محطة في المسار
    return stops.some(stop => {
      const distance = Math.sqrt(
        Math.pow(stop.lat - lat, 2) + 
        Math.pow(stop.lng - lng, 2)
      );
      return distance < 0.0005; // مسافة صغيرة للاعتبار في المحطة
    });
  };

  // دالة الحصول على المحطة التالية
  const getNextStop = (routeId, currentIndex) => {
    const route = routes.find(r => r.id === routeId);
    if (!route) return "غير محدد";
    
    const nextIndex = (currentIndex + 1) % route.path.length;
    const nextPoint = route.path[nextIndex];
    
    // البحث عن أقرب محطة للموقع التالي
    const nearestStop = stops.find(stop => {
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
    const route = routes.find(r => r.id === routeId);
    if (!route) return "غير محدد";
    
    const remainingPoints = route.path.length - currentIndex;
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
      setAvailableBuses(aswanBuses);
    }
  }, [isTracking, availableBuses.length]);

  // تحديث الباصات من Redux إذا كانت متوفرة
  useEffect(() => {
    if (buses && buses.length > 0) {
      const transformedBuses = buses
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
  }, [buses]);

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
  const trackingBtnIcon = isTracking ? '⏹️' : '🟢';
  const trackingBtnText = isTracking ? 'إيقاف التتبع' : 'بدء التتبع';

  return (
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
        
        {/* تحديث الخريطة تلقائياً */}
        <MapUpdater buses={availableBuses} selectedBusId={selectedBusId} isTracking={isTracking} />
        
        {/* عرض الحافلات المتاحة */}
        {isTracking && availableBuses.map(bus => (
          <Marker
            key={bus.id}
            position={[bus.lat, bus.lng]}
            icon={createBusIcon(bus)}
            eventHandlers={{
              click: () => handleBusClick(bus)
            }}
          >
            <Popup>
              <BusPopup bus={bus} />
            </Popup>
          </Marker>
        ))}
        
        {/* عرض المحطات */}
        {showStops && <BusStops stops={stops} />}
        
        {/* عرض منطقة التغطية */}
        {showCoverage && <CoverageArea center={mapCenter} />}
      </MapContainer>

      {/* أدوات التحكم */}
      {showControls && (
        <div className="map-controls">
          <h4>خريطة أسوان - تتبع الحافلات</h4>
          
          {/* مؤشر الاتصال */}
          <div className="status-indicator">
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
  );
};

export default AdvancedLeafletMap; 