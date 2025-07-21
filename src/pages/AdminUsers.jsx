import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, updateUser, deleteUser, registerUser } from "../redux/userSlice";
import DynamicModal from "../components/DynamicModal";
import { userSchema } from "../components/schemas";
import Toast from "../components/Toast";
import { FaUserPlus, FaSearch, FaFilter, FaUser, FaUserTie, FaBus, FaUserFriends, FaUserGraduate, FaUserCog, FaEdit, FaTrash } from "react-icons/fa";

const roleIcons = {
  admin: <FaUserTie className="inline text-brand-dark-blue mr-1" />, // أدمن
  driver: <FaBus className="inline text-green-700 mr-1" />, // سائق
  parent: <FaUserFriends className="inline text-purple-700 mr-1" />, // ولي أمر
  student: <FaUserGraduate className="inline text-yellow-600 mr-1" />, // طالب
  employee: <FaUserCog className="inline text-pink-700 mr-1" />, // موظف
  manager: <FaUser className="inline text-blue-700 mr-1" />, // مدير
};

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { allUsers, loading, user } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // فلترة وبحث
  const filteredUsers = allUsers
    .filter((user) =>
      (user.firstName + " " + user.lastName + " " + user.email)
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((user) => (roleFilter ? user.role === roleFilter : true));

  const roles = [
    "admin",
    "driver",
    "parent",
    "student",
    "employee",
    "manager",
  ];

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
            <FaUser className="text-4xl text-brand-beige bg-white rounded-full p-2 shadow" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-dark-blue mb-1">User Management</h1>
              <p className="text-brand-beige text-sm md:text-base">Manage all users, search, filter, edit, and more</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2 bg-brand-beige text-brand-dark-blue font-bold rounded-lg shadow hover:bg-opacity-90 transition-all text-base"
          >
            <FaUserPlus /> Add New User
          </button>
        </div>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2 mb-6 px-4 md:px-10">
        <div className="relative w-full md:w-1/2">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-brand-dark-blue"
          />
        </div>
        <div className="relative w-full md:w-48">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-brand-dark-blue"
          >
            <option value="">All Roles</option>
            {roles
              .filter(role => !(user?.role === "manager" && role === "admin"))
              .map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
          </select>
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto px-2 md:px-0">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full">
          {loading ? (
            <div className="p-6">Loading...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-6">No users found.</div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-white text-brand-dark-blue border-b border-brand-light-blue">
                <tr>
                  <th className="px-4 py-3 text-left md:text-left text-center text-sm font-extrabold uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Last Update</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <tr
                    key={user._id}
                    className={`transition-all duration-150 ${idx % 2 === 0 ? 'bg-white' : 'bg-brand-light-blue/40'} hover:bg-blue-100 group rounded-xl`}
                    style={{ borderRadius: '1rem' }}
                  >
                    <td className="px-4 py-2 md:py-3 whitespace-nowrap text-left md:text-left text-center flex items-center gap-3 font-semibold text-gray-800">
                      {/* Avatar */}
                      {user.profileImage ? (
                        <img src={user.profileImage} alt="avatar" className="h-9 w-9 rounded-full object-cover border border-gray-200 shadow-sm" />
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-brand-light-blue flex items-center justify-center text-brand-dark-blue font-bold text-base shadow-sm">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                      )}
                      <span>{user.firstName} {user.lastName}</span>
                    </td>
                    <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium text-gray-700">{user.email}</td>
                    <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium capitalize text-gray-700 flex items-center justify-center gap-1">{roleIcons[user.role] || <FaUser className="inline text-gray-400 mr-1" />} {user.role}</td>
                    <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium text-gray-700">{user.phone || '-'}</td>
                    <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium">
                      <span className="px-2 py-1 bg-gray-100 text-brand-dark-blue rounded-full text-xs font-medium">Active</span>
                    </td>
                    <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center font-medium text-gray-500">{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-2 md:py-3 whitespace-nowrap text-center flex items-center justify-center gap-2">
                      <div className="relative group">
                        <button
                          className="p-2 rounded-full hover:bg-brand-light-blue text-brand-dark-blue transition-all"
                          title="Edit"
                          onClick={() => { setEditingUser(user); setShowEditModal(true); }}
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
                            if(window.confirm('هل أنت متأكد أنك تريد حذف هذا المستخدم؟')) {
                              await dispatch(deleteUser(user._id));
                              dispatch(fetchAllUsers());
                              showToast("success", "User deleted successfully");
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

      {/* مودال إضافة مستخدم */}
      <DynamicModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={async (data) => {
          try {
            await dispatch(registerUser(data));
            setShowAddModal(false);
            dispatch(fetchAllUsers());
            showToast("success", "User added successfully");
          } catch (err) {
            showToast("error", "حدث خطأ أثناء إضافة المستخدم");
          }
        }}
        schema={userSchema}
        title="Add New User"
      />
      {/* مودال تعديل مستخدم */}
      <DynamicModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingUser(null); }}
        onSubmit={async (data) => {
          try {
            await dispatch(updateUser({ id: editingUser._id, userData: data }));
            setShowEditModal(false);
            setEditingUser(null);
            dispatch(fetchAllUsers());
            showToast("success", "User updated successfully");
          } catch (err) {
            showToast("error", "حدث خطأ أثناء تعديل المستخدم");
          }
        }}
        schema={userSchema}
        title="Edit User"
        initialData={editingUser}
      />
      {/* Toast */}
      {toast.show && <Toast type={toast.type} message={toast.message} />}
    </div>
  );
};

export default AdminUsers; 