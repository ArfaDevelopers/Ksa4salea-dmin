"use client";

import { useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importing icons
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Sidebar from "@/components/Sidebar";
import Addblog from "../Addblog/page";

const Blogs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const dummyCategories = [
    {
      id: 1,
      name: "Tech News",
      language: "English",
      date: "2025-01-09",
      image: "https://via.placeholder.com/150", // Placeholder image
    },
    {
      id: 2,
      name: "Fashion Trends",
      language: "Spanish",
      date: "2025-01-08",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Health & Fitness",
      language: "English",
      date: "2025-01-07",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Travel Diaries",
      language: "French",
      date: "2025-01-06",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 5,
      name: "Food Recipes",
      language: "English",
      date: "2025-01-05",
      image: "https://via.placeholder.com/150",
    },
  ];

  const formatDate = (date: string | Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    };
    return new Date(date).toLocaleDateString("en-GB", options).replace(",", "");
  };

  return (
    <DefaultLayout>
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className=" p-5 w-[calc(100%-10rem)]">
          <Breadcrumb pageName="Blog Categories" />
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex justify-between items-center">
              <h3 className="font-medium text-gray-700 dark:text-gray-300">
                Blog Categories
              </h3>
              <button
                onClick={openModal}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Add New
              </button>
            </div>
            {isModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 "
                style={{ overflow: "scroll" }}
              >
                <div
                  className="bg-white rounded-lg shadow-lg p-6 mt-17  w-[65%]"
                  // style={{ overflow: "scroll" }}
                >
                  {/* Modal Header */}
                  <div className="flex justify-between items-center border-b pb-4">
                    <h3 className="text-lg font-bold">Add New Blog</h3>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-gray-800"
                    >
                      ✖
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="mt-4 " style={{ overflow: "scroll" }}>
                    <Addblog closeModal={closeModal} />
                  </div>
                </div>
              </div>
            )}
            <div className="overflow-x-auto p-6.5">
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="py-3 px-5 text-left text-gray-600 dark:text-gray-400">
                      #
                    </th>
                    <th className="py-3 px-5 text-left text-gray-600 dark:text-gray-400">
                      Image
                    </th>
                    <th className="py-3 px-5 text-left text-gray-600 dark:text-gray-400">
                      Name
                    </th>
                    <th className="py-3 px-5 text-left text-gray-600 dark:text-gray-400">
                      Language
                    </th>
                    <th className="py-3 px-5 text-left text-gray-600 dark:text-gray-400">
                      Date
                    </th>
                    <th className="py-3 px-5 text-left text-gray-600 dark:text-gray-400">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dummyCategories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b border-stroke dark:border-strokedark"
                    >
                      <td className="py-3 px-5 text-gray-600 dark:text-gray-400">
                        {category.id}
                      </td>
                      <td className="py-3 px-5">
                        <img
                          src={category.image}
                          alt="Placeholder"
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      </td>
                      <td className="py-3 px-5 text-gray-600 dark:text-gray-400">
                        {category.name}
                      </td>
                      <td className="py-3 px-5 text-gray-600 dark:text-gray-400">
                        {category.language}
                      </td>
                      <td className="py-3 px-5 text-gray-600 dark:text-gray-400">
                        {formatDate(category.date)}
                      </td>
                      <td className="py-3 px-5">
                        <button className="text-primary hover:underline">
                          <FaEdit className="inline-block mr-2" />{" "}
                          {/* Edit Icon */}
                        </button>
                        <button className="ml-4 text-red-500 hover:underline">
                          <FaTrashAlt className="inline-block mr-2" />{" "}
                          {/* Delete Icon */}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Blogs;
