import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedBus, setLastUpdate } from '../redux/trackingSlice';

// مكون تحديث الخريطة
function MapUpdater({ buses, selectedBusId, isTracking }) {
  const map = useMap();
  useEffect(() => {
    if (!isTracking || buses.length === 0) return;
    if (selectedBusId) {
      const selectedBus = buses.find(bus => bus.id === selectedBusId);
      if (selectedBus) {
        map.setView([selectedBus.lat, selectedBus.lng], 16);
      }
    } else {
      const bounds = L.latLngBounds(buses.map(bus => [bus.lat, bus.lng]));
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [buses, selectedBusId, isTracking, map]);
  return null;
}

// مكون منطقة التغطية
function AdvancedCoverageArea({ center, radius = 5000, busCount }) {
  return (
    <Circle
      center={center}
      radius={radius}
      pathOptions={{ color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 0.1, weight: 2 }}
    >
      <Popup>
        <div style={{ textAlign: 'center', direction: 'rtl' }}>
          <h4>منطقة التغطية</h4>
          <p>نصف القطر: {radius/1000} كم</p>
          <p>عدد الباصات: {busCount}</p>
        </div>
      </Popup>
    </Circle>
  );
}

// مكون الإحصائيات
function AdvancedStats({ buses, isTracking }) {
  const [stats, setStats] = useState({ totalBuses: 0, activeBuses: 0, avgSpeed: 0, totalPassengers: 0, avgBattery: 0, coverageArea: 0 });
  useEffect(() => {
    if (!isTracking || buses.length === 0) return;
    const activeBuses = buses.filter(bus => bus.status === 'active');
    const avgSpeed = activeBuses.reduce((sum, bus) => sum + bus.speed, 0) / activeBuses.length;
    const totalPassengers = activeBuses.reduce((sum, bus) => sum + bus.passengers, 0);
    const avgBattery = activeBuses.reduce((sum, bus) => sum + bus.batteryLevel, 0) / activeBuses.length;
    setStats({
      totalBuses: buses.length,
      activeBuses: activeBuses.length,
      avgSpeed: Math.round(avgSpeed),
      totalPassengers,
      avgBattery: Math.round(avgBattery),
      coverageArea: Math.round(activeBuses.length * 2.5)
    });
  }, [buses, isTracking]);
  return (
    <div className="advanced-stats">
      <h3>📊 إحصائيات متقدمة</h3>
      <div className="stats-grid">
        <div className="stat-item"><div className="stat-icon">🚌</div><div className="stat-value">{stats.totalBuses}</div><div className="stat-label">إجمالي الباصات</div></div>
        <div className="stat-item"><div className="stat-icon">🟢</div><div className="stat-value">{stats.activeBuses}</div><div className="stat-label">الباصات النشطة</div></div>
        <div className="stat-item"><div className="stat-icon">⚡</div><div className="stat-value">{stats.avgSpeed} كم/س</div><div className="stat-label">متوسط السرعة</div></div>
        <div className="stat-item"><div className="stat-icon">👥</div><div className="stat-value">{stats.totalPassengers}</div><div className="stat-label">إجمالي الركاب</div></div>
        <div className="stat-item"><div className="stat-icon">🔋</div><div className="stat-value">{stats.avgBattery}%</div><div className="stat-label">متوسط البطارية</div></div>
        <div className="stat-item"><div className="stat-icon">🗺️</div><div className="stat-value">{stats.coverageArea} كم²</div><div className="stat-label">منطقة التغطية</div></div>
      </div>
    </div>
  );
}

// مكون تحكم متقدم
function AdvancedControls({ isTracking, onStartTracking, onStopTracking, selectedBusId, onSelectBus, buses, onToggleCoverage, showCoverage, onToggleHeatmap, showHeatmap, onExport, onShowMyLocation, showMyLocation, onRecenterToMyLocation }) {
  return (
    <div className="advanced-controls">
      <h3>🎮 تحكم متقدم</h3>
      <div className="control-section">
        <button className={`tracking-btn ${isTracking ? 'stop' : 'start'}`} onClick={isTracking ? onStopTracking : onStartTracking}>
          {isTracking ? '⏹️ إيقاف التتبع' : '🟢 بدء التتبع'}
        </button>
      </div>
      <div className="control-section">
        <button className="tracking-btn location" onClick={onShowMyLocation} style={{background: showMyLocation ? '#EF4444' : '#10B981', color:'#fff'}}>
          {showMyLocation ? '❌ إخفاء موقعي' : '📍 عرض موقعي'}
        </button>
        {showMyLocation && (
          <button className="tracking-btn recenter" onClick={onRecenterToMyLocation} style={{background: '#8B5CF6', color:'#fff', marginTop: '8px'}}>
            🎯 إعادة تحريك إلى موقعي
          </button>
        )}
      </div>
      <div className="control-section">
        <button className="tracking-btn export" onClick={onExport} style={{background:'#2563EB',color:'#fff'}}>
          ⬇️ تصدير بيانات الحركة (CSV)
        </button>
      </div>
      <div className="control-section">
        <label>🎯 تتبع باص محدد:</label>
        <select value={selectedBusId || ''} onChange={(e) => onSelectBus(e.target.value)} className="bus-selector">
          <option value="">جميع الباصات</option>
          {buses.map(bus => (
            <option key={bus.id} value={bus.id}>{bus.number} - {bus.driver}</option>
          ))}
        </select>
      </div>
      <div className="control-section">
        <label><input type="checkbox" checked={showCoverage} onChange={onToggleCoverage}/> 🗺️ إظهار منطقة التغطية</label>
        <label><input type="checkbox" checked={showHeatmap} onChange={onToggleHeatmap}/> 🔥 إظهار خريطة الحرارة</label>
      </div>
      {isTracking && (
        <div className="quick-info">
          <div className="info-item"><span className="info-label">آخر تحديث:</span><span className="info-value">{new Date().toLocaleTimeString('ar-EG')}</span></div>
          <div className="info-item"><span className="info-label">الباصات النشطة:</span><span className="info-value">{buses.filter(b => b.status === 'active').length}</span></div>
        </div>
      )}
    </div>
  );
}

// مكون الباص المتقدم
function AdvancedBusMarker({ bus, onClick, isSelected }) {
  const createAdvancedBusIcon = (bus) => {
    const statusColor = bus.status === 'active' ? '#10B981' : bus.status === 'stopped' ? '#EF4444' : '#F59E0B';
    const size = isSelected ? 80 : 60;
    return L.divIcon({
      className: `advanced-bus-icon ${isSelected ? 'selected' : ''}`,
      html: `<div class="advanced-bus-marker ${bus.status}" style="background-color: ${statusColor}; width:${size}px; height:${size/2}px;"><div class="bus-header"><div class="bus-number">${bus.number}</div><div class="bus-status">${bus.status === 'active' ? '🟢' : '🔴'}</div></div><div class="bus-body"><div class="bus-speed">${Math.round(bus.speed)} كم/س</div><div class="bus-passengers">👥 ${bus.passengers}/${bus.capacity}</div></div><div class="bus-footer"><div class="bus-battery">🔋 ${bus.batteryLevel}%</div><div class="bus-signal">📶 ${bus.signalStrength}%</div></div><div class="bus-direction" style="transform: rotate(${bus.heading}deg)"><i class="fas fa-arrow-up"></i></div></div>`,
      iconSize: [size, size/2],
      iconAnchor: [size/2, size/4]
    });
  };
  return (
    <Marker position={[bus.lat, bus.lng]} icon={createAdvancedBusIcon(bus)} eventHandlers={{ click: () => onClick(bus) }}>
      <Popup>
        <div className="advanced-bus-popup">
          <div className="popup-header"><h4>🚌 {bus.number}</h4><span className={`status-badge ${bus.status}`}>{bus.status === 'active' ? 'نشط' : 'متوقف'}</span></div>
          <div className="popup-content">
            <div className="popup-row"><span className="label">المسار:</span><span className="value">{bus.route}</span></div>
            <div className="popup-row"><span className="label">السائق:</span><span className="value">{bus.driver}</span></div>
            <div className="popup-row"><span className="label">السرعة:</span><span className="value">{Math.round(bus.speed)} كم/س</span></div>
            <div className="popup-row"><span className="label">الركاب:</span><span className="value">{bus.passengers}/{bus.capacity}</span></div>
            <div className="popup-row"><span className="label">المحطة التالية:</span><span className="value">{bus.nextStop}</span></div>
            <div className="popup-row"><span className="label">وقت الوصول:</span><span className="value">{bus.eta}</span></div>
            <div className="popup-row"><span className="label">البطارية:</span><span className="value">{bus.batteryLevel}%</span></div>
            <div className="popup-row"><span className="label">قوة الإشارة:</span><span className="value">{bus.signalStrength}%</span></div>
          </div>
          <div className="popup-footer"><small>آخر تحديث: {new Date(bus.lastUpdate).toLocaleTimeString('ar-EG')}</small></div>
        </div>
      </Popup>
    </Marker>
  );
}

// المكون الرئيسي
const AdvancedLiveTracking = ({ height = "100vh", showControls = true, showStats = true, showCoverage = false, autoCenter = true }) => {
  const dispatch = useDispatch();
  const { buses, selectedBus, socketConnected, lastUpdate } = useSelector(state => state.tracking);
  const [isTracking, setIsTracking] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [showCoverageArea, setShowCoverageArea] = useState(showCoverage);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapType, setMapType] = useState('streets');
  const [animatedBuses, setAnimatedBuses] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showMyLocation, setShowMyLocation] = useState(false);
  const mapRef = useRef(null);

  // تحويل بيانات الباصات (نفس المنطق السابق)
  const transformBusesData = () => {
    if (!buses || buses.length === 0) {
      return [
        { id: "ASW001", number: "كورنيش النيل", route: "كورنيش النيل (ميدان المحطة → جامعة أسوان الجديدة)", routeId: 1, driver: "أحمد محمد", lat: 24.088269, lng: 32.906964, status: "active", passengers: 30, capacity: 50, speed: 30, heading: 45, nextStop: "شارع كورنيش النيل", eta: "7:15 ص", isMoving: true, lastUpdate: new Date().toISOString(), batteryLevel: 90, signalStrength: 95, currentRouteIndex: 0 },
        { id: "ASW002", number: "شارع المستشفى", route: "شارع المستشفى (ميدان المحطة → المستشفى العام)", routeId: 2, driver: "منى علي", lat: 24.088269, lng: 32.906964, status: "active", passengers: 20, capacity: 50, speed: 25, heading: 60, nextStop: "شارع المحطة", eta: "7:20 ص", isMoving: true, lastUpdate: new Date().toISOString(), batteryLevel: 85, signalStrength: 90, currentRouteIndex: 0 },
        { id: "ASW003", number: "طريق الأستاد", route: "طريق الأستاد الرياضي (الأستاد → مطار أسوان)", routeId: 3, driver: "خالد حسن", lat: 24.095245, lng: 32.899451, status: "active", passengers: 15, capacity: 50, speed: 40, heading: 90, nextStop: "طريق الأستاد", eta: "7:30 ص", isMoving: true, lastUpdate: new Date().toISOString(), batteryLevel: 80, signalStrength: 88, currentRouteIndex: 0 }
      ];
    }
    return buses.filter(bus => bus.location).map(bus => ({
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
  };

  // بدء التتبع
  const startTracking = () => {
    setIsTracking(true);
    setAnimatedBuses(transformBusesData());
    dispatch({ type: 'SET_LAST_UPDATE', payload: new Date().toISOString() });
  };
  const stopTracking = () => {
    setIsTracking(false);
    setSelectedBusId(null);
    setAnimatedBuses([]);
  };
  const handleSelectBus = (busId) => {
    setSelectedBusId(busId);
    if (busId) {
      const bus = animatedBuses.find(b => b.id === busId);
      if (bus) {
        dispatch(setSelectedBus(bus));
      }
    }
  };
  // زر الموقع الحالي
  const handleShowMyLocation = () => {
    if (showMyLocation) {
      setShowMyLocation(false);
      setCurrentLocation(null);
      return;
    }
    if (!navigator.geolocation) {
      alert('متصفحك لا يدعم تحديد الموقع الجغرافي');
      return;
    }
    setShowMyLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };
        setCurrentLocation(location);
        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 16);
        }
      },
      (error) => {
        alert('فشل في تحديد موقعك. تأكد من السماح بالوصول إلى الموقع الجغرافي.');
        setShowMyLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };
  // إعادة تحريك الخريطة إلى موقعي
  const handleRecenterToMyLocation = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.setView([currentLocation.lat, currentLocation.lng], 16);
    }
  };
  // تصدير البيانات
  const handleExport = () => { exportBusesToCSV(animatedBuses); };

  // CSS ديناميكي
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .my-location-marker { animation: location-pulse 2s infinite; }
      @keyframes location-pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.8; } 100% { transform: scale(1); opacity: 1; } }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div className="advanced-live-tracking" style={{ height }}>
      <MapContainer center={[24.0889, 32.8998]} zoom={13} style={{ height: '100%', width: '100%' }} ref={mapRef}>
        <TileLayer url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} attribution='&copy; OpenStreetMap contributors' />
        <MapUpdater buses={isTracking ? animatedBuses : []} selectedBusId={selectedBusId} isTracking={isTracking} />
        {isTracking && animatedBuses.map(bus => (
          <AdvancedBusMarker key={bus.id} bus={bus} onClick={(bus) => handleSelectBus(bus.id)} isSelected={selectedBusId === bus.id} />
        ))}
        {showMyLocation && currentLocation && (
          <Marker position={[currentLocation.lat, currentLocation.lng]} icon={L.divIcon({
            className: 'my-location-marker',
            html: `<div style="width: 20px; height: 20px; background: #3B82F6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3); position: relative;"><div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>`,
            iconSize: [20, 20], iconAnchor: [10, 10]
          })}>
            <Popup>
              <div style={{ textAlign: 'center', direction: 'rtl' }}>
                <h4>📍 موقعك الحالي</h4>
                <p>خط العرض: {currentLocation.lat.toFixed(6)}</p>
                <p>خط الطول: {currentLocation.lng.toFixed(6)}</p>
              </div>
            </Popup>
          </Marker>
        )}
        {showCoverageArea && (
          <AdvancedCoverageArea center={[24.0889, 32.8998]} radius={5000} busCount={animatedBuses.length} />
        )}
      </MapContainer>
      {showControls && (
        <AdvancedControls
          isTracking={isTracking}
          onStartTracking={startTracking}
          onStopTracking={stopTracking}
          selectedBusId={selectedBusId}
          onSelectBus={handleSelectBus}
          buses={animatedBuses}
          onToggleCoverage={() => setShowCoverageArea(!showCoverageArea)}
          showCoverage={showCoverageArea}
          onToggleHeatmap={() => setShowHeatmap(!setShowHeatmap)}
          showHeatmap={showHeatmap}
          onExport={handleExport}
          onShowMyLocation={handleShowMyLocation}
          showMyLocation={showMyLocation}
          onRecenterToMyLocation={handleRecenterToMyLocation}
        />
      )}
      {showStats && isTracking && (
        <AdvancedStats buses={animatedBuses} isTracking={isTracking} />
      )}
      <div className="map-type-selector">
        <select value={mapType} onChange={(e) => setMapType(e.target.value)}>
          <option value="streets">شوارع</option>
          <option value="satellite">قمر صناعي</option>
          <option value="terrain">طبوغرافي</option>
          <option value="dark">داكن</option>
        </select>
      </div>
    </div>
  );
};

function exportBusesToCSV(buses) {
  if (!buses || buses.length === 0) return;
  const header = ['id', 'number', 'route', 'driver', 'lat', 'lng', 'speed', 'heading', 'passengers', 'capacity', 'batteryLevel', 'signalStrength', 'status', 'lastUpdate', 'currentRouteIndex', 'nextStop', 'eta'];
  const rows = buses.map(bus => header.map(h => bus[h]));
  const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'bus_live_tracking.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default AdvancedLiveTracking; 