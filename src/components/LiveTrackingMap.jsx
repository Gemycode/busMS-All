"use client"

import { useState, useEffect, useCallback } from "react"
import InteractiveMap from "./InteractiveMap"

const LiveTrackingMap = ({ routeId = null, busId = null, userRole = "parent" }) => {
  const [buses, setBuses] = useState([])
  const [routes, setRoutes] = useState([])
  const [stops, setStops] = useState([])
  const [selectedBus, setSelectedBus] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(3000)
  const [showTraffic, setShowTraffic] = useState(false)
  const [showWeather, setShowWeather] = useState(false)
  const [trackingHistory, setTrackingHistory] = useState([])
  const [alerts, setAlerts] = useState([])

  // Enhanced sample data with Riyadh coordinates
  const sampleBuses = [
    {
      id: 1,
      number: "BUS-001",
      route: "Route A - School Zone",
      driver: "Ahmed Al-Rashid",
      lat: 24.7136,
      lng: 46.6753,
      status: "on-time",
      passengers: 28,
      capacity: 72,
      speed: 25,
      heading: 45,
      nextStop: "King Fahd School",
      eta: "07:15 AM",
      isMoving: true,
      lastUpdate: new Date().toISOString(),
      fuelLevel: 85,
      temperature: 28,
      engineStatus: "normal",
      routeProgress: 65,
      estimatedArrival: "07:15 AM"
    },
    {
      id: 2,
      number: "BUS-002",
      route: "Route B - Residential Area",
      driver: "Fatima Al-Zahra",
      lat: 24.7236,
      lng: 46.6853,
      status: "delayed",
      passengers: 45,
      capacity: 72,
      speed: 15,
      heading: 180,
      nextStop: "Al Riyadh School",
      eta: "07:23 AM",
      isMoving: true,
      lastUpdate: new Date().toISOString(),
      fuelLevel: 72,
      temperature: 30,
      engineStatus: "warning",
      routeProgress: 45,
      estimatedArrival: "07:25 AM"
    },
    {
      id: 3,
      number: "BUS-003",
      route: "Route C - Express Line",
      driver: "Omar Al-Sayed",
      lat: 24.7036,
      lng: 46.6653,
      status: "stopped",
      passengers: 32,
      capacity: 72,
      speed: 0,
      heading: 90,
      nextStop: "International School",
      eta: "07:18 AM",
      isMoving: false,
      lastUpdate: new Date().toISOString(),
      fuelLevel: 95,
      temperature: 26,
      engineStatus: "normal",
      routeProgress: 80,
      estimatedArrival: "07:20 AM"
    }
  ];

  const sampleRoutes = [
    {
      id: 1,
      name: "Route A - School Zone",
      color: "#3B82F6",
      isActive: true,
      path: "M 24.7136,46.6753 Q 24.7236,46.6853 24.7336,46.6953",
      stops: [
        { name: "Al Olaya District", lat: 24.7136, lng: 46.6753 },
        { name: "King Fahd School", lat: 24.7236, lng: 46.6853 }
      ]
    },
    {
      id: 2,
      name: "Route B - Residential Area",
      color: "#EF4444",
      isActive: true,
      path: "M 24.7236,46.6853 Q 24.7336,46.6953 24.7436,46.7053",
      stops: [
        { name: "Al Malaz District", lat: 24.7236, lng: 46.6853 },
        { name: "Al Riyadh School", lat: 24.7336, lng: 46.6953 }
      ]
    },
    {
      id: 3,
      name: "Route C - Express Line",
      color: "#10B981",
      isActive: true,
      path: "M 24.7036,46.6653 Q 24.7136,46.6753 24.7236,46.6853",
      stops: [
        { name: "King Fahd District", lat: 24.7036, lng: 46.6653 },
        { name: "International School", lat: 24.7136, lng: 46.6753 }
      ]
    }
  ];

  const sampleStops = [
    {
      id: 1,
      name: "King Fahd School",
      address: "King Fahd Road, Riyadh",
      lat: 24.7236,
      lng: 46.6853,
      type: "school",
      studentCount: 45,
      nextArrival: "07:15 AM",
      status: "active"
    },
    {
      id: 2,
      name: "Al Olaya District",
      address: "Al Olaya Street, Riyadh",
      lat: 24.7136,
      lng: 46.6753,
      type: "pickup",
      studentCount: 8,
      nextArrival: "07:12 AM",
      status: "active"
    },
    {
      id: 3,
      name: "Al Riyadh School",
      address: "Al Malaz District, Riyadh",
      lat: 24.7336,
      lng: 46.6953,
      type: "school",
      studentCount: 12,
      nextArrival: "07:23 AM",
      status: "active"
    }
  ];

  // Initialize data
  useEffect(() => {
    setTimeout(() => {
      setBuses(sampleBuses);
      setRoutes(sampleRoutes);
      setStops(sampleStops);
      setIsLoading(false);

      // Filter data if specific bus or route is requested
      if (busId) {
        setBuses(sampleBuses.filter((bus) => bus.id === Number.parseInt(busId)));
      }
      if (routeId) {
        const routeBuses = sampleBuses.filter((bus) => bus.route.includes(`Route ${routeId}`));
        setBuses(routeBuses);
      }
    }, 1000);
  }, [routeId, busId]);

  // Enhanced real-time updates with tracking history
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setBuses((prevBuses) => {
        const updatedBuses = prevBuses.map((bus) => {
          const newLat = bus.lat + (Math.random() - 0.5) * 0.001;
          const newLng = bus.lng + (Math.random() - 0.5) * 0.001;
          const newSpeed = Math.max(0, bus.speed + (Math.random() - 0.5) * 3);
          
          // Update route progress based on movement
          const newProgress = Math.min(100, bus.routeProgress + (newSpeed > 0 ? 1 : 0));
          
          return {
            ...bus,
            lat: newLat,
            lng: newLng,
            speed: newSpeed,
            routeProgress: newProgress,
            lastUpdate: new Date().toISOString(),
            isMoving: newSpeed > 0,
            // Simulate fuel consumption
            fuelLevel: Math.max(0, bus.fuelLevel - (newSpeed > 0 ? 0.1 : 0)),
            // Simulate temperature changes
            temperature: bus.temperature + (Math.random() - 0.5) * 2
          };
        });

        // Add to tracking history
        setTrackingHistory(prev => [...prev.slice(-50), {
          timestamp: new Date().toISOString(),
          buses: updatedBuses.map(bus => ({
            id: bus.id,
            lat: bus.lat,
            lng: bus.lng,
            speed: bus.speed,
            status: bus.status
          }))
        }]);

        return updatedBuses;
      });

      // Generate alerts based on conditions
      setAlerts(prev => {
        const newAlerts = [];
        buses.forEach(bus => {
          if (bus.fuelLevel < 20) {
            newAlerts.push({
              id: Date.now(),
              type: 'fuel',
              message: `Bus ${bus.number} fuel level low: ${bus.fuelLevel}%`,
              severity: 'warning'
            });
          }
          if (bus.temperature > 35) {
            newAlerts.push({
              id: Date.now() + 1,
              type: 'temperature',
              message: `Bus ${bus.number} temperature high: ${bus.temperature}°C`,
              severity: 'warning'
            });
          }
          if (bus.status === 'delayed') {
            newAlerts.push({
              id: Date.now() + 2,
              type: 'delay',
              message: `Bus ${bus.number} is delayed`,
              severity: 'info'
            });
          }
        });
        return [...prev.slice(-10), ...newAlerts];
      });
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, buses]);

  const handleBusClick = useCallback((bus) => {
    setSelectedBus(bus);
  }, []);

  const handleStopClick = useCallback((stop) => {
    console.log("Stop clicked:", stop);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-time': return 'text-green-600';
      case 'delayed': return 'text-red-600';
      case 'stopped': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case 'on-time': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'stopped': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'on-time': return 'fas fa-check-circle';
      case 'delayed': return 'fas fa-exclamation-triangle';
      case 'stopped': return 'fas fa-pause-circle';
      default: return 'fas fa-question-circle';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-medium-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading live tracking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Map Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-xl font-bold text-brand-dark-blue">Live Bus Tracking</h3>
            <p className="text-sm text-gray-600">
              Real-time GPS tracking • Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center space-x-2">
            {/* Auto-refresh toggle */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Auto-refresh</span>
            </label>

            {/* Refresh interval selector */}
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              <option value={1000}>1s</option>
              <option value={3000}>3s</option>
              <option value={5000}>5s</option>
              <option value={10000}>10s</option>
            </select>

            {/* Layer toggles */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showTraffic}
                onChange={(e) => setShowTraffic(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Traffic</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showWeather}
                onChange={(e) => setShowWeather(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Weather</span>
            </label>

            <button className="px-3 py-1 bg-brand-medium-blue text-white rounded-md text-sm hover:bg-opacity-90">
              <i className="fas fa-expand mr-1"></i>Fullscreen
            </button>
          </div>
        </div>
      </div>

      {/* Alerts Panel */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h4 className="text-lg font-bold text-brand-dark-blue mb-3">Live Alerts</h4>
          <div className="space-y-2">
            {alerts.slice(-5).map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center p-3 rounded-lg ${
                  alert.severity === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  alert.severity === 'error' ? 'bg-red-50 border border-red-200' :
                  'bg-blue-50 border border-blue-200'
                }`}
              >
                <i className={`fas fa-exclamation-triangle mr-3 ${
                  alert.severity === 'warning' ? 'text-yellow-600' :
                  alert.severity === 'error' ? 'text-red-600' :
                  'text-blue-600'
                }`}></i>
                <span className="text-sm">{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Map */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <InteractiveMap
          height="600px"
          buses={buses}
          routes={routes}
          stops={stops}
          center={{ lat: 24.7136, lng: 46.6753 }}
          zoom={13}
          showControls={true}
          onBusClick={handleBusClick}
          onStopClick={handleStopClick}
          userRole={userRole}
          showTraffic={showTraffic}
          showWeather={showWeather}
        />
      </div>

      {/* Enhanced Bus Status Panel */}
      {selectedBus && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="text-xl font-bold text-brand-dark-blue">Bus #{selectedBus.number}</h4>
              <p className="text-gray-600">{selectedBus.route}</p>
              <p className="text-sm text-gray-500">Driver: {selectedBus.driver}</p>
            </div>
            <button 
              onClick={() => setSelectedBus(null)} 
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Status Overview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 mb-3">Current Status</h5>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className={`text-sm font-medium flex items-center ${getStatusBackgroundColor(selectedBus.status)}`}>
                    <i className={`${getStatusIcon(selectedBus.status)} mr-1`}></i>
                    {selectedBus.status.replace("-", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Speed:</span>
                  <span className="text-sm font-medium">{Math.round(selectedBus.speed)} km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Passengers:</span>
                  <span className="text-sm font-medium">
                    {selectedBus.passengers}/{selectedBus.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-brand-medium-blue h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(selectedBus.passengers / selectedBus.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Location & Technical */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 mb-3">Location & Technical</h5>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Latitude:</span>
                  <span className="text-sm font-medium">{selectedBus.lat.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Longitude:</span>
                  <span className="text-sm font-medium">{selectedBus.lng.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fuel Level:</span>
                  <span className={`text-sm font-medium ${
                    selectedBus.fuelLevel < 20 ? 'text-red-600' : 
                    selectedBus.fuelLevel < 50 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {selectedBus.fuelLevel}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Temperature:</span>
                  <span className="text-sm font-medium">{selectedBus.temperature.toFixed(1)}°C</span>
                </div>
              </div>
            </div>

            {/* Route Progress */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 mb-3">Route Progress</h5>
              <div className="space-y-3">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${selectedBus.routeProgress}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <span className="text-lg font-bold text-gray-900">{selectedBus.routeProgress}%</span>
                  <p className="text-xs text-gray-500">Complete</p>
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-900">{selectedBus.estimatedArrival}</span>
                  <p className="text-xs text-gray-500">Estimated Arrival</p>
                </div>
              </div>
            </div>

            {/* Next Stop */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="text-sm font-medium text-gray-500 mb-3">Next Stop</h5>
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-900">{selectedBus.nextStop}</div>
                <div className="text-sm text-gray-600">ETA: {selectedBus.eta}</div>
                <button className="w-full px-3 py-2 bg-brand-medium-blue text-white rounded text-sm hover:bg-opacity-90 transition-colors">
                  <i className="fas fa-directions mr-1"></i>
                  Get Directions
                </button>
                <button className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 transition-colors">
                  <i className="fas fa-phone mr-1"></i>
                  Contact Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Live Data Feed */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-bold text-brand-dark-blue">Live Data Feed</h4>
          <span className="text-sm text-gray-500">
            {buses.filter(bus => bus.isMoving).length} buses moving
          </span>
        </div>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {buses.map((bus) => (
            <div 
              key={bus.id} 
              className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedBus?.id === bus.id 
                  ? 'bg-brand-medium-blue text-white' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => handleBusClick(bus)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  bus.status === 'on-time' ? 'bg-green-500' :
                  bus.status === 'delayed' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`}></div>
                <span className={`font-medium ${
                  selectedBus?.id === bus.id ? 'text-white' : 'text-gray-900'
                }`}>
                  Bus #{bus.number}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className={selectedBus?.id === bus.id ? 'text-white' : 'text-gray-600'}>
                  {Math.round(bus.speed)} km/h
                </span>
                <span className={selectedBus?.id === bus.id ? 'text-white' : 'text-gray-600'}>
                  {bus.passengers}/{bus.capacity}
                </span>
                <span className={`font-medium ${
                  selectedBus?.id === bus.id ? 'text-white' : getStatusBackgroundColor(bus.status)
                }`}>
                  {bus.status.replace("-", " ")}
                </span>
                <span className={`text-xs ${selectedBus?.id === bus.id ? 'text-white opacity-75' : 'text-gray-400'}`}>
                  {new Date(bus.lastUpdate).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingMap;
