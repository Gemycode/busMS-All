import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const dummyDrivers = [
  { id: 1, name: 'Ahmed Hassan', trips: 42, onTime: 40, complaints: 1, bus: 'BUS001' },
  { id: 2, name: 'Sara Ali', trips: 38, onTime: 36, complaints: 0, bus: 'BUS002' },
  { id: 3, name: 'Mohamed Saleh', trips: 30, onTime: 25, complaints: 2, bus: 'BUS003' },
  { id: 4, name: 'John Smith', trips: 28, onTime: 28, complaints: 0, bus: 'BUS004' },
];

const DriverReports = () => {
  const [filter, setFilter] = useState('all');
  const [hoveredBar, setHoveredBar] = useState(null);

  // Calculate on-time rate
  const driversWithRate = dummyDrivers.map(d => ({ ...d, rate: d.trips ? Math.round((d.onTime / d.trips) * 100) : 0 }));
  const filteredDrivers = filter === 'all' ? driversWithRate : driversWithRate.filter(d => d.bus === filter);
  const buses = Array.from(new Set(dummyDrivers.map(d => d.bus)));

  // Top performer
  const maxRate = Math.max(...driversWithRate.map(d => d.rate));
  const minRate = Math.min(...driversWithRate.map(d => d.rate));
  const avgRate = Math.round(driversWithRate.reduce((acc, d) => acc + d.rate, 0) / driversWithRate.length);
  const topDriver = driversWithRate.find(d => d.rate === maxRate);

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      <main className="pt-20 pb-16">
        {/* Header */}
        <section className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-8 mb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-brand-dark-blue drop-shadow-sm">Driver Performance Reports</h1>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link
                  to="/admin/dashboard"
                  className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200 shadow"
                >
                  <i className="fas fa-arrow-left mr-2"></i>Back to Dashboard
                </Link>
                <button
                  className="px-4 py-2 bg-brand-medium-blue text-white font-medium rounded-md hover:bg-brand-dark-blue transition-all duration-200 shadow"
                  onClick={() => alert('Export feature coming soon!')}
                >
                  <i className="fas fa-file-export mr-2"></i>Export Report
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters & Top Driver Chart */}
        <section className="py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="flex gap-2 items-center">
                <label className="font-medium text-brand-dark-blue">Filter by Bus:</label>
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                >
                  <option value="all">All</option>
                  {buses.map(bus => <option key={bus} value={bus}>{bus}</option>)}
                </select>
              </div>
            </div>

            {/* Enhanced Top Driver Chart */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold text-brand-dark-blue">On-Time Performance by Driver</h2>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1"><span className="w-4 h-3 rounded bg-brand-dark-blue inline-block"></span><span className="text-xs text-gray-700">Top Driver</span></div>
                  <div className="flex items-center gap-1"><span className="w-4 h-3 rounded bg-brand-medium-blue inline-block"></span><span className="text-xs text-gray-700">Other Drivers</span></div>
                </div>
              </div>
              <div className="w-full h-64 flex items-end gap-6 relative">
                {filteredDrivers.map((d, i) => {
                  const isMax = d.rate === maxRate;
                  return (
                    <div key={d.id} className="flex flex-col items-center flex-1 relative group"
                      onMouseEnter={() => setHoveredBar(i)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Value above bar */}
                      <span className={`mb-1 text-sm font-bold ${isMax ? 'text-brand-dark-blue' : 'text-brand-medium-blue'}`}>{d.rate}%</span>
                      {/* Bar */}
                      <div
                        className={`w-12 rounded-t shadow-md transition-all duration-200 cursor-pointer ${isMax ? 'bg-brand-dark-blue' : 'bg-brand-medium-blue'} ${hoveredBar === i ? 'scale-105 ring-2 ring-brand-dark-blue' : ''}`}
                        style={{ height: `${d.rate * 2.2}px` }}
                        title={`${d.name}: ${d.rate}% on-time`}
                      ></div>
                      {/* Tooltip on hover */}
                      {hoveredBar === i && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-dark-blue text-white text-xs rounded px-3 py-2 shadow-lg z-10 whitespace-nowrap">
                          {d.name}: {d.rate}% on-time<br/>Trips: {d.trips}, Complaints: {d.complaints}
                        </div>
                      )}
                      <span className="text-xs mt-2 text-gray-700 font-medium text-center">{d.name.split(' ')[0]}</span>
                    </div>
                  );
                })}
                {/* Average/Max/Min lines */}
                <div className="absolute left-0 right-0" style={{ bottom: `${avgRate * 2.2}px` }}>
                  <div className="border-t-2 border-dashed border-brand-beige w-full"></div>
                  <span className="absolute left-0 -top-5 text-xs text-brand-beige font-bold">Avg: {avgRate}%</span>
                </div>
                <div className="absolute left-0 right-0" style={{ bottom: `${maxRate * 2.2}px` }}>
                  <div className="border-t-2 border-dotted border-brand-dark-blue w-full"></div>
                  <span className="absolute right-0 -top-5 text-xs text-brand-dark-blue font-bold">Max: {maxRate}%</span>
                </div>
                <div className="absolute left-0 right-0" style={{ bottom: `${minRate * 2.2}px` }}>
                  <div className="border-t-2 border-dotted border-brand-medium-blue w-full"></div>
                  <span className="absolute right-0 -top-5 text-xs text-brand-medium-blue font-bold">Min: {minRate}%</span>
                </div>
              </div>
              <div className="flex justify-between mt-4 text-xs text-gray-600">
                <div>Top driver: <span className="font-bold text-brand-dark-blue">{topDriver.name} ({topDriver.rate}%)</span></div>
                <div>Average on-time: <span className="font-bold text-brand-beige">{avgRate}%</span></div>
                <div>Min: <span className="font-bold text-brand-medium-blue">{minRate}%</span></div>
              </div>
            </div>

            {/* Drivers Table */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-brand-dark-blue mb-6">Driver Performance Table</h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-brand-dark-blue uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-brand-dark-blue uppercase tracking-wider">Bus</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-brand-dark-blue uppercase tracking-wider">Trips</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-brand-dark-blue uppercase tracking-wider">On-Time</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-brand-dark-blue uppercase tracking-wider">On-Time %</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-brand-dark-blue uppercase tracking-wider">Complaints</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDrivers.map((d) => (
                    <tr key={d.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{d.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{d.bus}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{d.trips}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{d.onTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold {d.id === topDriver.id ? 'text-brand-dark-blue' : 'text-brand-medium-blue'}">{d.rate}%</td>
                      <td className="px-6 py-4 whitespace-nowrap {d.complaints > 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}">{d.complaints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DriverReports; 