"use client";

import { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Sidebar from "@/components/Sidebar";

interface AddBlogFormProps {
  closeModal?: () => void;
}

const Addblog: React.FC<AddBlogFormProps> = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    language: "",
    slug: "",
    tags: "",
    heading: "",
    blogImage: null as File | null,
    status: "active",
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        blogImage: file,
      }));
    }
  };

  const handleStatusChange = (status: "active" | "inactive") => {
    setFormData((prevState) => ({
      ...prevState,
      status,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name", formData.name);
      formDataToSubmit.append("description", formData.description);
      formDataToSubmit.append("language", formData.language);
      formDataToSubmit.append("slug", formData.slug);
      formDataToSubmit.append("tags", formData.tags);
      formDataToSubmit.append("heading", formData.heading);
      if (formData.blogImage)
        formDataToSubmit.append("blogImage", formData.blogImage);
      formDataToSubmit.append("status", formData.status);

      const response = await fetch("http://localhost:5000/blogcategory", {
        method: "POST",
        body: formDataToSubmit,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create blog category");
      }

      const result = await response.json();
      console.log("Blog Category created:", result);

      // Reset form data
      setFormData({
        name: "",
        description: "",
        language: "",
        slug: "",
        tags: "",
        heading: "",
        blogImage: null,
        status: "active",
      });

      alert("Blog Category added successfully!");
    } catch (error: any) {
      console.error("Error creating blog category:", error);
      alert(error.message || "Failed to add blog category. Please try again.");
    }
  };

  return (
    <div className="flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="p-5 w-full">
        <Breadcrumb pageName="Add Blog" />
        <div className="rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Add New Blog
            </h3>
          </div>
          <form className="p-6" onSubmit={handleSubmit}>
            {/* Language Selection */}
            <div className="mb-4">
              <label className="mb-2 block text-black dark:text-white">
                Select Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full rounded ```tsx
                border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              >
                <option value="">Select Language</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                {/* Add more languages as needed */}
              </select>
            </div>

            {/* Category Name Input */}
            {formData.language && (
              <div className="mb-4">
                <label className="mb-2 block text-black dark:text-white">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:focus:border-primary"
                  required
                />
              </div>
            )}

            {/* Slug Input */}
            {formData.language && (
              <div className="mb-4">
                <label className="mb-2 block text-black dark:text-white">
                  Slug{" "}
                  <span className="text-xs text-gray-500">
                    (If you leave it empty, it will be generated automatically.)
                  </span>
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="Enter slug"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:focus:border-primary"
                  required
                />
              </div>
            )}

            {/* Description Input */}
            <div className="mb-4">
              <label className="mb-2 block text-black dark:text-white">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Enter description"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:focus:border-primary"
                required
              ></textarea>
            </div>

            {/* Tags Input */}
            <div className="mb-4">
              <label className="mb-2 block text-black dark:text-white">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Enter tags"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            {/* Heading Input */}
            <div className="mb-4">
              <label className="mb-2 block text-black dark:text-white">
                Heading
              </label>
              <input
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleInputChange}
                placeholder="Enter heading"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary dark:border-strokedark dark:bg-form-input dark:focus:border-primary"
              />
            </div>

            {/* Blog Image Upload */}
            <div className="mb-4">
              <label className="mb-2 block text-black dark:text-white">
                Blog Image
              </label>
              <div className="border-dashed border-2 p-4 text-center cursor-pointer">
                <label className="block text-blue-600" htmlFor="file-input">
                  Drag and Drop or Browse
                </label>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Status Selection */}
            <div className="mb-4 flex items-center gap-4">
              <span>Active</span>
              <div
                onClick={() => handleStatusChange("active")}
                className={`w-6 h-6 rounded-full cursor-pointer ${
                  formData.status === "active" ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <span>Inactive</span>
              <div
                onClick={() => handleStatusChange("inactive")}
                className={`w-6 h-6 rounded-full cursor-pointer ${
                  formData.status === "inactive" ? "bg-red-500" : "bg-gray-300"
                }`}
              ></div>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addblog;
