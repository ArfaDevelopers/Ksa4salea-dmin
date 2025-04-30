"use client";

import { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {
  FiMenu,
  FiGrid,
  FiSettings,
  FiFilter,
  FiArrowDown,
  FiPlus,
  FiX,
} from "react-icons/fi"; // FiX is for the cancel icon

const SubCategories = () => {
  const [activeTab, setActiveTab] = useState("All Listings");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
  const [formData, setFormData] = useState({
    name: "Sample Listing",
    email: "sample@example.com",
    image: null,
    category: "Category 1",
    date: "2025-01-01",
    status: "Pending",
  });

  const tabs = [
    { id: "Name", label: "Name" },
    { id: "Email", label: "Email" },
    { id: "Category", label: "Category" },
    { id: "Date", label: "Date" },
    { id: "Status", label: "Status" },
  ];

  const tabContent = {
    Name: formData.name,
    Email: formData.email,
    Category: formData.category,
    Date: formData.date,
    Status: formData.status,
  };

  // Handle input changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file change (image upload)
  const handleFileChange = (e: any) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  // Handle form submit
  const handleSubmit = () => {
    console.log(formData);
    setIsModalOpen(false); // Close the modal after submission
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-[100%] max-w-7xl ">
        {/* Breadcrumb and Toolbar with margin top */}
        <div className="flex items-center justify-between mb-6">
          {/* Left Side */}
          <h1 style={{ fontWeight: "bold", color: "black", fontSize: "18px" }}>
            Sub Categories
          </h1>

          {/* Right Side */}
          <div className="flex items-center bg-white p-4 rounded-lg shadow-md">
            {/* Buttons Group */}
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                <FiMenu size={18} />
              </button>
              <button className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
                <FiGrid size={18} />
              </button>
              <button className="p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
                <FiSettings size={18} />
              </button>
            </div>

            {/* Middle Group */}
            <div className="flex items-center space-x-4 ml-4">
              <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
                <FiFilter size={18} className="mr-2" />
                Filter
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
                <FiArrowDown size={18} className="mr-2" />
                Sort by A - Z
              </button>
            </div>

            {/* Add Listing Button */}
            <button
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-4"
              onClick={() => setIsModalOpen(true)} // Open modal
            >
              <FiPlus size={18} className="mr-2" />
              Sub Categories
            </button>
          </div>
        </div>

        <div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="flex items-center justify-between flex-col md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white dark:bg-gray-900">
              <div>
                <button
                  id="dropdownActionButton"
                  data-dropdown-toggle="dropdownAction"
                  className="inline-flex items-center text-gray-500 bg-white border ml-4 border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  type="button"
                >
                  <span className="sr-only ">Action button</span>
                  Action
                  <svg
                    className="w-2.5 h-2.5 ms-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                {/* Dropdown menu */}
                <div
                  id="dropdownAction"
                  className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                >
                  <ul
                    className="py-1 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownActionButton"
                  >
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Reward
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Promote
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Activate account
                      </a>
                    </li>
                  </ul>
                  <div className="py-1">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Delete User
                    </a>
                  </div>
                </div>
              </div>
              <label htmlFor="table-search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="table-search-users"
                  className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search..."
                />
              </div>
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all-search"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="checkbox-all-search" className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Sub Category Slug
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Sub Category Slug
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Others",
                    position: "Computer",
                    subCategory: "Web",
                    amount: "$500",
                    date: "2024-01-09",
                    status: true, // true for online, false for offline
                  },
                  {
                    name: "Others	",
                    position: "Automobile	",
                    subCategory: "Design",
                    amount: "$350",
                    date: "2024-01-10",
                    status: false,
                  },
                ].map((user, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-table-search-${index + 1}`}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor={`checkbox-table-search-${index + 1}`}
                          className="sr-only"
                        >
                          checkbox
                        </label>
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <img
                        className="w-10 h-10 rounded-full"
                        src="https://www.english-heritage.org.uk/siteassets/home/visit/inspire-me/the-history-of-football-in-england/2xgajj3.jpg"
                        alt="User Image"
                      />
                      <div className="ps-3">
                        <div className="font-normal text-gray-500">
                          {user.name}
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-4">{user.position}</td>
                    <td className="px-6 py-4">{user.subCategory}</td>
                    <td className="px-6 py-4">{user.date}</td>

                    <td className="px-6 py-4">
                      <a
                        href="#"
                        type="button"
                        data-modal-target="editUserModal"
                        data-modal-show="editUserModal"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit user
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Add Listing */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            {/* Close Icon */}
            <div className="absolute top-2 right-2">
              <button
                className="text-gray-600 hover:text-gray-900"
                onClick={handleCloseModal}
              >
                <FiX size={24} />
              </button>
            </div>

            <h2 className="text-lg font-semibold mb-4">Add Category</h2>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  placeholder="Enter listing name"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  placeholder="Enter email"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  placeholder="Enter category"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Featured
                </label>
                <input
                  type="text"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md mt-1"
                  placeholder="Enter status"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SubCategories;
