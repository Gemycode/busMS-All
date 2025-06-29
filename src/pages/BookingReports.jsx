import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// يمكنك استبدال هذا بمكتبة رسم بياني حقيقية لاحقًا
const dummyChartData = [
  { date: '2024-06-25', bookings: 8 },
  { date: '2024-06-26', bookings: 12 },
  { date: '2024-06-27', bookings: 10 },
  { date: '2024-06-28', bookings: 15 },
  { date: '2024-06-29', bookings: 7 },
  { date: '2024-06-30', bookings: 13 },
  { date: '2024-07-01', bookings: 18 },
];
const dummyPopularRoutes = [
  { route: 'Route A - Downtown', count: 32 },
  { route: 'Route B - Campus', count: 27 },
  { route: 'Route C - Mall', count: 19 },
];
const dummyStats = {
  total: 100,
  confirmed: 80,
  cancelled: 12,
  completed: 8,
};

const BookingReports = () => {
  const [filter, setFilter] = useState('week');
  const [hoveredBar, setHoveredBar] = useState(null);

  // حساب النسب
  const confirmedPercent = Math.round((dummyStats.confirmed / dummyStats.total) * 100);
  const cancelledPercent = Math.round((dummyStats.cancelled / dummyStats.total) * 100);
  const completedPercent = Math.round((dummyStats.completed / dummyStats.total) * 100);

  // تفاصيل إضافية للرسم البياني
  const maxBookings = Math.max(...dummyChartData.map(d => d.bookings));
  const minBookings = Math.min(...dummyChartData.map(d => d.bookings));
  const avgBookings = Math.round(dummyChartData.reduce((acc, d) => acc + d.bookings, 0) / dummyChartData.length);
  const maxDay = dummyChartData.find(d => d.bookings === maxBookings);

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      <main className="pt-20 pb-16">
        {/* Header */}
        <section className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-8 mb-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-brand-dark-blue drop-shadow-sm">Booking Reports & Analytics</h1>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link
                  to="/admin/bookings"
                  className="px-4 py-2 bg-brand-beige text-brand-dark-blue font-medium rounded-md hover:bg-opacity-90 transition-all duration-200 shadow"
                >
                  <i className="fas fa-arrow-left mr-2"></i>Back to Bookings
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

        {/* Filters & Chart */}
        <section className="py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* الفلاتر */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="flex gap-2 items-center">
                <label className="font-medium text-brand-dark-blue">Filter by:</label>
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-medium-blue"
                >
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                </select>
              </div>
            </div>

            {/* Enhanced Bookings Chart (English) */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-10">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-xl font-bold text-brand-dark-blue">Bookings per Day (Selected Period)</h2>
                  <p className="text-gray-600 text-sm">This chart shows the number of bookings made each day in the selected period. It helps you identify the busiest days.</p>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1"><span className="w-4 h-3 rounded bg-brand-dark-blue inline-block"></span><span className="text-xs text-gray-700">Peak Day</span></div>
                  <div className="flex items-center gap-1"><span className="w-4 h-3 rounded bg-brand-medium-blue inline-block"></span><span className="text-xs text-gray-700">Other Days</span></div>
                </div>
              </div>
              <div className="w-full h-64 flex items-end gap-4 relative">
                {dummyChartData.map((d, i) => {
                  const isMax = d.bookings === maxBookings;
                  return (
                    <div key={d.date} className="flex flex-col items-center flex-1 relative group"
                      onMouseEnter={() => setHoveredBar(i)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Value above bar */}
                      <span className={`mb-1 text-sm font-bold ${isMax ? 'text-brand-dark-blue' : 'text-brand-medium-blue'}`}>{d.bookings}</span>
                      {/* Bar */}
                      <div
                        className={`w-10 rounded-t shadow-md transition-all duration-200 cursor-pointer ${isMax ? 'bg-brand-dark-blue' : 'bg-brand-medium-blue'} ${hoveredBar === i ? 'scale-105 ring-2 ring-brand-dark-blue' : ''}`}
                        style={{ height: `${d.bookings * 8}px` }}
                        title={`${d.bookings} bookings`}
                      ></div>
                      {/* Tooltip on hover */}
                      {hoveredBar === i && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand-dark-blue text-white text-xs rounded px-3 py-2 shadow-lg z-10 whitespace-nowrap">
                          {d.date}: {d.bookings} bookings
                        </div>
                      )}
                      <span className="text-xs mt-2 text-gray-500 font-medium">{d.date.slice(5)}</span>
                    </div>
                  );
                })}
                {/* Average/Max/Min lines */}
                <div className="absolute left-0 right-0" style={{ bottom: `${avgBookings * 8}px` }}>
                  <div className="border-t-2 border-dashed border-brand-beige w-full"></div>
                  <span className="absolute left-0 -top-5 text-xs text-brand-beige font-bold">Avg: {avgBookings}</span>
                </div>
                <div className="absolute left-0 right-0" style={{ bottom: `${maxBookings * 8}px` }}>
                  <div className="border-t-2 border-dotted border-brand-dark-blue w-full"></div>
                  <span className="absolute right-0 -top-5 text-xs text-brand-dark-blue font-bold">Max: {maxBookings}</span>
                </div>
                <div className="absolute left-0 right-0" style={{ bottom: `${minBookings * 8}px` }}>
                  <div className="border-t-2 border-dotted border-brand-medium-blue w-full"></div>
                  <span className="absolute right-0 -top-5 text-xs text-brand-medium-blue font-bold">Min: {minBookings}</span>
                </div>
              </div>
              <div className="flex justify-between mt-4 text-xs text-gray-600">
                <div>Peak day: <span className="font-bold text-brand-dark-blue">{maxDay.date} ({maxDay.bookings})</span></div>
                <div>Average: <span className="font-bold text-brand-beige">{avgBookings}</span></div>
                <div>Min: <span className="font-bold text-brand-medium-blue">{minBookings}</span></div>
              </div>
            </div>

            {/* نسب الحجوزات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                <h3 className="text-lg font-bold text-brand-dark-blue mb-2">Confirmed</h3>
                <span className="text-3xl font-bold text-green-600 mb-1">{dummyStats.confirmed}</span>
                <span className="text-sm text-gray-500 mb-2">{confirmedPercent}% of total</span>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: `${confirmedPercent}%` }}></div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                <h3 className="text-lg font-bold text-brand-dark-blue mb-2">Cancelled</h3>
                <span className="text-3xl font-bold text-red-600 mb-1">{dummyStats.cancelled}</span>
                <span className="text-sm text-gray-500 mb-2">{cancelledPercent}% of total</span>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-red-500 rounded-full" style={{ width: `${cancelledPercent}%` }}></div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                <h3 className="text-lg font-bold text-brand-dark-blue mb-2">Completed</h3>
                <span className="text-3xl font-bold text-brand-dark-blue mb-1">{dummyStats.completed}</span>
                <span className="text-sm text-gray-500 mb-2">{completedPercent}% of total</span>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-brand-dark-blue rounded-full" style={{ width: `${completedPercent}%` }}></div>
                </div>
              </div>
            </div>

            {/* أكثر الرحلات استخدامًا */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-brand-dark-blue mb-6">Most Popular Routes</h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dummyPopularRoutes.map((r) => (
                    <tr key={r.route}>
                      <td className="px-6 py-4 whitespace-nowrap">{r.route}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{r.count}</td>
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

export default BookingReports; 