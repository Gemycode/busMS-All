// User schema for DynamicModal usage
export const userSchema = {
  firstName: { type: "text", label: "First Name", required: true },
  lastName: { type: "text", label: "Last Name", required: true },
  email: { type: "email", label: "Email", required: true },
  password: { type: "password", label: "Password", required: true },
  role: {
    type: "select",
    label: "Role",
    required: true,
    options: ["admin", "driver", "parent", "student", "employee", "manager"],
  },
  licenseNumber: { type: "text", label: "License Number" },
  phone: { type: "text", label: "Phone" },
  profileImage: { type: "file", label: "Profile Image" },
};

// Bus schema for DynamicModal usage
export const busSchema = {
  BusNumber: { type: "text", label: "Bus Number", required: true },
  capacity: { type: "number", label: "Capacity", required: true, min: 1 },
  status: {
    type: "select",
    label: "Status",
    required: true,
    options: ["active", "Maintenance", "inactive"],
    default: "active",
  },
  assigned_driver_id: { type: "text", label: "Assigned Driver ID" },
  route_id: { type: "text", label: "Route ID" },
};

// Route schema for DynamicModal usage
export const routeSchema = {
  name: { type: "text", label: "Route Name", required: true },
  start_point: { type: "text", label: "Start Point", required: true },
  end_point: { type: "text", label: "End Point", required: true },
  stops: { type: "text", label: "Stops (comma separated)", required: true },
  estimated_time: { type: "text", label: "Estimated Time", required: true },
}; 