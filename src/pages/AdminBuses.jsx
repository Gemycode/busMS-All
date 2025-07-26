import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBuses, createBus, updateBus, deleteBus } from "../redux/busSlice";
import DynamicModal from "../components/DynamicModal";
import Toast from "../components/Toast";
import { FaBus, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa";
import api from "../redux/api";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "maintenance", label: "Maintenance" },
  { value: "inactive", label: "Inactive" },
];

const AdminBuses = () => {
  const dispatch = useDispatch();
  const buses = useSelector((state) => state.buses && state.buses.buses ? state.buses.buses : []);
  console.log("buses from redux:", buses);
  const loading = useSelector((state) => state.buses && state.buses.loading ? state.buses.loading : false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingBus, setEditingBus] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    dispatch(fetchBuses());
    // جلب كل المستخدمين ثم فلترة السائقين فقط
    api.get('/users/').then(res => {
      // جلب السائقين فقط من users
      setDrivers((res.data.data && Array.isArray(res.data.data.users)) ? res.data.data.users.filter(u => u.role === 'driver') : []);
    });
    // جلب الطرق
    api.get('/routes/').then(res => {
      console.log("routes:", res.data);
      setRoutes(res.data);
    });
  }, [dispatch]);

  const busSchema = useMemo(() => ({
    BusNumber: { type: "text", label: "Bus Number", required: true },
    capacity: { type: "number", label: "Capacity", required: true },
    status: {
      type: "select",
      label: "Status",
      required: true,
      options: ["active", "maintenance", "inactive"],
    },
    assigned_driver_id: {
      type: "select",
      label: "Driver",
      required: false,
      options: drivers.map(driver => ({
        value: driver._id,
        label: (driver.firstName || "") + " " + (driver.lastName || "")
      }))
    },
    route_id: {
      type: "select",
      label: "Route",
      required: false,
      options: routes.map(route => ({
        value: route._id,
        label: route.name || route._id
      }))
    }
  }), [drivers, routes]);

  // فلترة وبحث
  const filteredBuses = (buses || [])
    .filter((bus) =>
      (bus.BusNumber + " " + (bus.assigned_driver_id || ""))
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((bus) => (statusFilter ? bus.status === statusFilter : true));

  // Toast helper
  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "success", message: "" }), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10 mx-2 md:mx-8 lg:mx-20 pt-24">
      {/* هيدر الصفحة */}
      <div className="bg-gradient-to-r from-brand-dark-blue to-brand-medium-blue py-10 px-4 md:px-10 rounded-b-3xl shadow-lg mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <FaBus className="text-4xl text-brand-beige bg-white rounded-full p-2 shadow" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-dark-blue mb-1">Bus Management</h1>
              <p className="text-brand-beige text-sm md:text-base">Manage all buses, search, filter, edit, and more</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2 bg-brand-beige text-brand-dark-blue font-bold rounded-lg shadow hover:bg-opacity-90 transition-all text-base"
          >
            <FaPlus /> Add New Bus
          </button>
        </div>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2 mb-6 px-4 md:px-10">
        <div className="relative w-full md:w-1/2">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by bus number or driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-brand-dark-blue"
          />
        </div>
        <div className="relative w-full md:w-48">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-brand-dark-blue"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto px-2 md:px-0">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
          {loading ? (
            <div className="p-6">Loading...</div>
          ) : filteredBuses.length === 0 ? (
            <div className="p-6">No buses found.</div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-white text-brand-dark-blue border-b border-brand-light-blue">
                <tr>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Bus Number</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Capacity</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Driver ID</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Route ID</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuses.map((bus, idx) => (
                  <tr
                    key={bus._id}
                    className={`transition-all duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-brand-light-blue/40'} hover:bg-blue-100 group rounded-xl`}
                    style={{ borderRadius: '1rem' }}
                  >
                    <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-semibold text-gray-800">{bus.BusNumber}</td>
                    <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium text-gray-700">{bus.capacity}</td>
                    <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium capitalize text-gray-700">{bus.status}</td>
                    <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium text-gray-700">
<<<<<<< HEAD
                      {typeof bus.driverId === 'object' && bus.driverId !== null
                        ? `${bus.driverId.firstName} ${bus.driverId.lastName}`
                        : bus.driverId || '-'}
=======
                      {typeof bus.assigned_driver_id === 'object' && bus.assigned_driver_id !== null
                        ? `${bus.assigned_driver_id.firstName} ${bus.assigned_driver_id.lastName}`
                        : bus.assigned_driver_id || '-'}
>>>>>>> 4729efbc99067405f72840029fa89122382d305b
                    </td>
                    <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium text-gray-700">
                      {typeof bus.route_id === 'object' && bus.route_id !== null
                        ? bus.route_id.name
                        : bus.route_id || '-'}
                    </td>
                    <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center flex items-center justify-center gap-2">
                      <div className="relative group">
                        <button
                          className="p-2 rounded-full hover:bg-brand-light-blue text-brand-dark-blue transition-all"
                          title="Edit"
                          onClick={() => { setEditingBus(bus); setShowEditModal(true); }}
                        >
                          <FaEdit />
                        </button>
                        <span className="absolute left-1/2 -translate-x-1/2 top-10 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 pointer-events-none transition-all">Edit</span>
                      </div>
                      <div className="relative group">
                        <button
                          className="p-2 rounded-full hover:bg-gray-200 text-red-600 transition-all"
                          title="Delete"
                          onClick={async () => {
                            if(window.confirm('Are you sure you want to delete this bus?')) {
                              await dispatch(deleteBus(bus._id));
                              dispatch(fetchBuses());
                              showToast("success", "Bus deleted successfully");
                            }
                          }}
                        >
                          <FaTrash />
                        </button>
                        <span className="absolute left-1/2 -translate-x-1/2 top-10 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs rounded px-2 py-1 pointer-events-none transition-all">Delete</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* مودال إضافة حافلة */}
      <DynamicModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={async (data) => {
          try {
            const result = await dispatch(createBus(data));
            if (result.payload && result.type.endsWith('rejected')) {
              showToast("error", result.payload);
              return; // إبقاء المودال مفتوحًا عند الخطأ
            }
            setShowAddModal(false);
            dispatch(fetchBuses());
            showToast("success", "Bus added successfully");
          } catch (err) {
            showToast("error", "حدث خطأ أثناء إضافة الحافلة");
          }
        }}
        schema={busSchema}
        title="Add New Bus"
      />
      {/* مودال تعديل حافلة */}
      <DynamicModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingBus(null); }}
        onSubmit={async (data) => {
          try {
            const result = await dispatch(updateBus({ id: editingBus._id, busData: data }));
            if (result.payload && result.type.endsWith('rejected')) {
              showToast("error", result.payload);
              return; // إبقاء المودال مفتوحًا عند الخطأ
            }
            setShowEditModal(false);
            setEditingBus(null);
            dispatch(fetchBuses());
            showToast("success", "Bus updated successfully");
          } catch (err) {
            showToast("error", "حدث خطأ أثناء تعديل الحافلة");
          }
        }}
        schema={busSchema}
        title="Edit Bus"
        initialData={editingBus}
      />
      {/* Toast */}
      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
};

export default AdminBuses; 