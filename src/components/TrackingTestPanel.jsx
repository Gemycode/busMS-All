import { useState } from 'react';
import api from '../redux/api';

const TrackingTestPanel = () => {
  const [formData, setFormData] = useState({
    bus_id: '',
    latitude: '',
    longitude: '',
    speed: 0,
    heading: 0,
    status: 'active'
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/trackingRoutes/create', {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        speed: parseFloat(formData.speed),
        heading: parseFloat(formData.heading)
      });
      
      setMessage(`Success: ${response.data.message}`);
      setFormData(prev => ({
        ...prev,
        latitude: '',
        longitude: '',
        speed: 0,
        heading: 0
      }));
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const generateRandomLocation = () => {
    // Generate random location around Aswan, Egypt
    const lat = 24.0889 + (Math.random() - 0.5) * 0.01; // أسوان، مصر
    const lng = 32.8998 + (Math.random() - 0.5) * 0.01;
    const speed = Math.floor(Math.random() * 60) + 20; // سرعة بين 20-80 كم/ساعة
    const heading = Math.floor(Math.random() * 360);
    
    setFormData(prev => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
      speed,
      heading
    }));
  };

  const testBusMovement = () => {
    console.log('🧪 اختبار حركة الباصات...');
    
    // إرسال بيانات تجريبية متعددة
    const testBuses = [
      { bus_id: 'DEMO001', lat: 24.088269, lng: 32.906964, speed: 35, heading: 45 },
      { bus_id: 'DEMO002', lat: 24.089272, lng: 32.908548, speed: 28, heading: 60 },
      { bus_id: 'DEMO003', lat: 24.095245, lng: 32.899451, speed: 42, heading: 90 }
    ];

    testBuses.forEach(async (bus, index) => {
      setTimeout(async () => {
        try {
          await api.post('/trackingRoutes/create', {
            bus_id: bus.bus_id,
            latitude: bus.lat,
            longitude: bus.lng,
            speed: bus.speed,
            heading: bus.heading,
            status: 'active'
          });
          console.log(`✅ تم إرسال بيانات باص ${bus.bus_id}`);
        } catch (error) {
          console.error(`❌ خطأ في إرسال بيانات باص ${bus.bus_id}:`, error);
        }
      }, index * 1000); // إرسال كل باص بعد ثانية
    });

    setMessage('تم إرسال بيانات تجريبية للباصات. تحقق من وحدة التحكم للتفاصيل.');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-brand-dark-blue mb-4">Test Tracking Data</h3>
      
      {message && (
        <div className={`p-3 rounded-md mb-4 ${
          message.startsWith('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={testBusMovement}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          🧪 اختبار حركة الباصات
        </button>
        <p className="text-sm text-gray-600 mt-2">
          هذا الزر سيرسل بيانات تجريبية لـ 3 باصات لاختبار الحركة
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bus ID
          </label>
          <input
            type="text"
            name="bus_id"
            value={formData.bus_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue"
            placeholder="Enter bus ID"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue"
              placeholder="24.0889"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue"
              placeholder="32.8998"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Speed (km/h)
            </label>
            <input
              type="number"
              name="speed"
              value={formData.speed}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue"
              min="0"
              max="120"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading (degrees)
            </label>
            <input
              type="number"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue"
              min="0"
              max="360"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-medium-blue focus:border-brand-medium-blue"
          >
            <option value="active">Active</option>
            <option value="stopped">Stopped</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="px-4 py-2 bg-brand-medium-blue text-white rounded-md hover:bg-opacity-90 transition-colors duration-200"
          >
            Send Tracking Data
          </button>
          
          <button
            type="button"
            onClick={generateRandomLocation}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Generate Random Location
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrackingTestPanel; 