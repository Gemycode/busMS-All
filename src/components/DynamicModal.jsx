import React from "react";

const FIELD_TYPES = {
  String: "text",
  Number: "number",
  Password: "password",
  Email: "email",
};

const DynamicModal = ({ isOpen, onClose, onSubmit, schema, title, initialData, children }) => {
  const [form, setForm] = React.useState({});
  const [filePreviews, setFilePreviews] = React.useState({});

  React.useEffect(() => {
    if (isOpen) {
      const initial = {};
      Object.keys(schema).forEach((key) => {
        if (initialData && initialData[key] !== undefined) {
          if (Array.isArray(initialData[key])) {
            initial[key] = initialData[key].join(", ");
          } else {
            initial[key] = initialData[key];
          }
        } else {
          initial[key] = "";
        }
      });
      setForm(initial);
      setFilePreviews({});
    }
  }, [isOpen, schema, initialData]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      if (files[0]) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setFilePreviews((prev) => ({ ...prev, [name]: ev.target.result }));
        };
        reader.readAsDataURL(files[0]);
      } else {
        setFilePreviews((prev) => ({ ...prev, [name]: undefined }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-brand-dark-blue">{title}</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[60vh] overflow-y-auto pr-2"
        >
          {Object.entries(schema).map(([key, field]) => {
            if (field.type === "hidden") return null;
            if (field.type === "select") {
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label || key}</label>
                  <select
                    name={key}
                    value={form[key] || ""}
                    onChange={handleChange}
                    required={field.required}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select...</option>
                    {field.options.map((option) =>
                      typeof option === "object"
                        ? (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          )
                        : (
                      <option key={option} value={option}>{option}</option>
                          )
                    )}
                  </select>
                </div>
              );
            }
            if (field.type === "file") {
              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label || key}</label>
                  <input
                    type="file"
                    name={key}
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  {filePreviews[key] && (
                    <img
                      src={filePreviews[key]}
                      alt="Preview"
                      className="mt-2 h-20 rounded shadow border"
                    />
                  )}
                </div>
              );
            }
            return (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label || key}</label>
                <input
                  type={field.type}
                  name={key}
                  value={form[key] || ""}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            );
          })}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-brand-dark-blue text-white px-4 py-2 rounded hover:bg-brand-medium-blue"
            >
              Save
            </button>
          </div>
        </form>
        {children}
      </div>
    </div>
  );
};

export default DynamicModal; 