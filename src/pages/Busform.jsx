// src/components/BusForm.jsx
// import { useForm } from "react-hook-form"
// import { useDispatch } from "react-redux"
// import { addBus, updateBus } from "../redux/busSlice"

const BusForm = ({ closeForm, isEdit = false, defaultValues = {} }) => {
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      number: defaultValues.number || "",
      route: defaultValues.route || "",
      status: defaultValues.status || "Active",
    },
  })

  const onSubmit = (data) => {
    if (isEdit) {
      dispatch(updateBus({ id: defaultValues.id, data }))
    } else {
      dispatch(addBus(data))
    }
    closeForm()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-100 p-4 rounded shadow space-y-4 mb-6">
      <input
        {...register("number", { required: "Bus number is required" })}
        placeholder="Bus Number"
        className="w-full p-2 border rounded"
      />
      {errors.number && <p className="text-red-600 text-sm">{errors.number.message}</p>}

      <input
        {...register("route", { required: "Route is required" })}
        placeholder="Route"
        className="w-full p-2 border rounded"
      />
      {errors.route && <p className="text-red-600 text-sm">{errors.route.message}</p>}

      <select {...register("status")} className="w-full p-2 border rounded">
        <option>Active</option>
        <option>Inactive</option>
      </select>

      <div className="flex space-x-3">
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
          {isEdit ? "Update" : "Add"}
        </button>
        <button type="button" onClick={closeForm} className="px-4 py-2 bg-gray-300 rounded">
          Cancel
        </button>
      </div>
    </form>
  )
}

export default BusForm
