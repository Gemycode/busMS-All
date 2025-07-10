import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchBuses, updateBus, deleteBus, createBus } from "../redux/BusSlice"
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const BusManagement = () => {
  const dispatch = useDispatch()
  const { buses } = useSelector((state) => state.buses)

  const [editBus, setEditBus] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    dispatch(fetchBuses())
  }, [dispatch])

  const handleUpdate = (data) => {
    dispatch(updateBus({ id: editBus._id, data }))
      .unwrap()
      .then(() => {
        toast.success("تم تحديث الحافلة بنجاح")
        setEditBus(null)
        reset()
      })
      .catch(() => {
        toast.error("فشل في تحديث الحافلة")
      })
  }

  const handleCreate = (data) => {
    dispatch(createBus(data))
      .unwrap()
      .then(() => {
        toast.success("تمت إضافة الحافلة بنجاح")
        setShowAddModal(false)
        reset()
      })
      .catch(() => {
        toast.error("فشل في إضافة الحافلة")
      })
  }

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الحافلة؟")) {
      dispatch(deleteBus(id))
        .unwrap()
        .then(() => {
          toast.success("تم حذف الحافلة بنجاح")
        })
        .catch(() => {
          toast.error("حدث خطأ أثناء الحذف")
        })
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-brand-dark-blue">إدارة الحافلات</h1>

      <button
        onClick={() => setShowAddModal(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        إضافة حافلة جديدة
      </button>

      <table className="w-full border-collapse border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">رقم الحافلة</th>
            <th className="border px-4 py-2">السائق</th>
            <th className="border px-4 py-2">السعة</th>
            <th className="border px-4 py-2">الخيارات</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus, index) => (
            <tr key={bus._id} className="text-center">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{bus.number}</td>
              <td className="border px-4 py-2">{bus.driver}</td>
              <td className="border px-4 py-2">{bus.capacity}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => {
                    setEditBus(bus)
                    reset(bus)
                  }}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(bus._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* تعديل بيانات الحافلة */}
      {editBus && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">تعديل بيانات الحافلة</h2>
            <form onSubmit={handleSubmit(handleUpdate)}>
              <div className="mb-3">
                <label className="block mb-1">رقم الحافلة</label>
                <input
                  type="text"
                  {...register("number", { required: true })}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.number && <p className="text-red-500 text-sm">مطلوب</p>}
              </div>
              <div className="mb-3">
                <label className="block mb-1">اسم السائق</label>
                <input
                  type="text"
                  {...register("driver", { required: true })}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.driver && <p className="text-red-500 text-sm">مطلوب</p>}
              </div>
              <div className="mb-3">
                <label className="block mb-1">السعة</label>
                <input
                  type="number"
                  {...register("capacity", { required: true })}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.capacity && <p className="text-red-500 text-sm">مطلوب</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditBus(null)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  تحديث
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* إضافة حافلة جديدة */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">إضافة حافلة جديدة</h2>
            <form onSubmit={handleSubmit(handleCreate)}>
              <div className="mb-3">
                <label className="block mb-1">رقم الحافلة</label>
                <input
                  type="text"
                  {...register("number", { required: true })}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.number && <p className="text-red-500 text-sm">مطلوب</p>}
              </div>
              <div className="mb-3">
                <label className="block mb-1">اسم السائق</label>
                <input
                  type="text"
                  {...register("driver", { required: true })}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.driver && <p className="text-red-500 text-sm">مطلوب</p>}
              </div>
              <div className="mb-3">
                <label className="block mb-1">السعة</label>
                <input
                  type="number"
                  {...register("capacity", { required: true })}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.capacity && <p className="text-red-500 text-sm">مطلوب</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    reset()
                  }}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default BusManagement
