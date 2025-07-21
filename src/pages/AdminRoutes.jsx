import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoutes, createRoute, updateRoute, deleteRoute } from "../redux/routeSlice";
import DynamicModal from "../components/DynamicModal";
import Toast from "../components/Toast";
import { FaRoad, FaPlus, FaEdit, FaTrash, FaSearch, FaInfoCircle } from "react-icons/fa";

const AdminRoutes = () => {
  const dispatch = useDispatch();
  const routes = useSelector((state) => state.routes.routes);
  console.log("routes from redux:", routes);
  const loading = useSelector((state) => state.routes.loading);
  const [search, setSearch] = useState("");
  const [editingRoute, setEditingRoute] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });
  const buses = useSelector((state) => state.buses.buses);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsRoute, setDetailsRoute] = useState(null);

  useEffect(() => {
    dispatch(fetchRoutes());
  }, [dispatch]);

  const filteredRoutes = useMemo(() => {
    return (routes || []).filter(route =>
      (route.name + " " + (route.start_point || "") + " " + (route.end_point || "")).toLowerCase().includes(search.toLowerCase())
    );
  }, [routes, search]);

  const routeSchema = useMemo(() => ({
    name: { type: "text", label: "Route Name", required: true },
    start_point: { type: "text", label: "Start Point", required: true },
    end_point: { type: "text", label: "End Point", required: true },
  }), []);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "success", message: "" }), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10 mx-2 md:mx-8 lg:mx-20 pt-24">
      <div className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-10 px-4 md:px-10 rounded-b-3xl shadow-lg mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <FaRoad className="text-4xl text-brand-beige bg-white rounded-full p-2 shadow" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-dark-blue mb-1">Route Management</h1>
              <p className="text-brand-beige text-sm md:text-base">Manage all routes, search, edit, and more</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2 bg-brand-beige text-brand-dark-blue font-bold rounded-lg shadow hover:bg-opacity-90 transition-all text-base"
          >
            <FaPlus /> Add New Route
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2 mb-6 px-4 md:px-10">
        <div className="relative w-full md:w-1/2">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, start or end point..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-brand-dark-blue"
          />
        </div>
      </div>
      <div className="overflow-x-auto px-2 md:px-0">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
          {loading ? (
            <div className="p-6">Loading...</div>
          ) : filteredRoutes.length === 0 ? (
            <div className="p-6">No routes found.</div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-white text-brand-dark-blue border-b border-brand-light-blue">
                <tr>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Route Name</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Start Point</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">End Point</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider"># Stops</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Stops</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Estimated Time</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Buses</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Created At</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((route, idx) => {
                  const relatedBuses = buses.filter(bus => bus.route_id === route._id);
                  return (
                    <tr
                      key={route._id}
                      className={`transition-all duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-brand-light-blue/40'} hover:bg-blue-100 group rounded-xl`}
                      style={{ borderRadius: '1rem' }}
                    >
                      <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-semibold text-gray-800">{route.name}</td>
                      <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium text-gray-700">{route.start_point?.name || '-'}</td>
                      <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium text-gray-700">{route.end_point?.name || '-'}</td>
                      <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium text-gray-700">{route.stops?.length || 0}</td>
                      <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium text-gray-700">
                        {Array.isArray(route.stops)
                          ? route.stops.map((stop, idx) =>
                              stop && typeof stop === 'object' && stop.name
                                ? stop.name
                                : typeof stop === 'string'
                                  ? stop
                                  : '[غير معروف]'
                            ).join(', ')
                          : '-'}
                      </td>
                      <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium text-gray-700">{route.estimated_time || '-'}</td>
                      <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium text-gray-700">
                        {relatedBuses.length > 0 ? relatedBuses.map(bus => bus.BusNumber).join(', ') : '-'}
                      </td>
                      <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium text-gray-700">{route.createdAt ? new Date(route.createdAt).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center flex items-center justify-center gap-2">
                        <button
                          className="p-2 rounded-full hover:bg-blue-200 text-blue-700 transition-all"
                          title="Details"
                          onClick={() => { setDetailsRoute(route); setShowDetailsModal(true); }}
                        >
                          <FaInfoCircle />
                        </button>
                        <button
                          className="p-2 rounded-full hover:bg-brand-light-blue text-brand-dark-blue transition-all"
                          title="Edit"
                          onClick={() => { setEditingRoute(route); setShowEditModal(true); }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="p-2 rounded-full hover:bg-gray-200 text-red-600 transition-all"
                          title="Delete"
                          onClick={async () => {
                            if(window.confirm('Are you sure you want to delete this route?')) {
                              await dispatch(deleteRoute(route._id));
                              dispatch(fetchRoutes());
                              showToast("success", "Route deleted successfully");
                            }
                          }}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <DynamicModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={async (data) => {
          const res = await dispatch(createRoute(data));
          console.log("createRoute result:", res);
          if (res.error) {
            showToast("error", res.payload || "حدث خطأ أثناء إضافة الطريق");
          } else {
            setShowAddModal(false);
            dispatch(fetchRoutes());
            showToast("success", "Route added successfully");
          }
        }}
        schema={routeSchema}
        title="Add New Route"
      />
      <DynamicModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingRoute(null); }}
        onSubmit={async (data) => {
          try {
            await dispatch(updateRoute({ id: editingRoute._id, routeData: data }));
            setShowEditModal(false);
            setEditingRoute(null);
            dispatch(fetchRoutes());
            showToast("success", "Route updated successfully");
          } catch (err) {
            showToast("error", "حدث خطأ أثناء تعديل الطريق");
          }
        }}
        schema={routeSchema}
        title="Edit Route"
        initialData={editingRoute}
      />
      {showDetailsModal && detailsRoute && (
        <DynamicModal
          isOpen={showDetailsModal}
          onClose={() => { setShowDetailsModal(false); setDetailsRoute(null); }}
          title={`Route Details: ${detailsRoute.name}`}
          schema={{}}
          readOnly
          initialData={{}}
        >
          <div className="space-y-2">
            <div><b>Route Name:</b> {detailsRoute.name}</div>
            <div><b>Start Point:</b> {detailsRoute.start_point?.name} ({detailsRoute.start_point?.lat}, {detailsRoute.start_point?.long})</div>
            <div><b>End Point:</b> {detailsRoute.end_point?.name} ({detailsRoute.end_point?.lat}, {detailsRoute.end_point?.long})</div>
            <div><b>Stops:</b>
              {Array.isArray(detailsRoute.stops)
                ? detailsRoute.stops.map((stop, idx) =>
                    stop && typeof stop === 'object' && stop.name
                      ? `${stop.name} (${stop.lat}, ${stop.long})`
                      : typeof stop === 'string'
                        ? stop
                        : '[غير معروف]'
                  ).join(', ')
                : '-'}
            </div>
            <div><b>Estimated Time:</b> {detailsRoute.estimated_time || '-'}</div>
            <div><b>Buses:</b> {buses.filter(bus => bus.route_id === detailsRoute._id).map(bus => bus.BusNumber).join(', ') || '-'}</div>
            <div><b>Created At:</b> {detailsRoute.createdAt ? new Date(detailsRoute.createdAt).toLocaleString() : '-'}</div>
          </div>
        </DynamicModal>
      )}
      <Toast {...toast} />
    </div>
  );
};

export default AdminRoutes; 