"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
import { db } from "../Firebase/FirebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { format } from "date-fns";
import {
  MdEdit,
  MdDelete,
  MdAdd,
  MdClose,
  MdSave,
  MdOutlineCopyright,
  MdSearch,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
  MdArrowBack,
  MdOutlineInfo,
  MdOutlineWarning,
} from "react-icons/md";
import { FiCheck, FiAlertCircle, FiClock } from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiOutlineDocumentText } from "react-icons/hi";

interface CopyRightsItem {
  id: string;
  content: string;
  createdAt: Timestamp | Date;
}

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning";
  isVisible: boolean;
}

const CopyRights: React.FC = () => {
  const editor = useRef(null);
  const [input, setInput] = useState<string>("");
  const [termsList, setTermsList] = useState<CopyRightsItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("view");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [toast, setToast] = useState<ToastProps>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (
    message: string,
    type: "success" | "error" | "warning"
  ) => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "CopyRights"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CopyRightsItem[];

      // Sort by newest first
      data.sort((a, b) => {
        const dateA =
          a.createdAt instanceof Timestamp
            ? a.createdAt.toDate()
            : new Date(a.createdAt);
        const dateB =
          b.createdAt instanceof Timestamp
            ? b.createdAt.toDate()
            : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      setTermsList(data);
    } catch (error) {
      console.error("Error fetching Copyright data:", error);
      showToast("Failed to load copyright data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      showToast("Please enter content", "warning");
      return;
    }

    try {
      setIsLoading(true);
      if (editId) {
        await updateDoc(doc(db, "CopyRights", editId), {
          content: input,
        });
        showToast("Content updated successfully", "success");
      } else {
        await addDoc(collection(db, "CopyRights"), {
          content: input,
          createdAt: Timestamp.now(),
        });
        showToast("Content added successfully", "success");
      }

      setInput("");
      setEditId(null);
      setIsEditing(false);
      setActiveTab("view");
      fetchData();
    } catch (error) {
      console.error("Error saving content:", error);
      showToast("Failed to save content", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: CopyRightsItem) => {
    setInput(item.content); // Set the input to the content of the item being edited
    setEditId(item.id);
    setIsEditing(true);
    setActiveTab("edit");
  };

  const handleCancelEdit = () => {
    setInput("");
    setEditId(null);
    setIsEditing(false);
    setActiveTab("view");
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      setIsLoading(true);
      await deleteDoc(doc(db, "CopyRights", itemToDelete));
      showToast("Content has been deleted", "success");
      fetchData();
    } catch (error) {
      console.error("Error deleting content:", error);
      showToast("Failed to delete content", "error");
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const formatDate = (timestamp: Timestamp | Date) => {
    const date =
      timestamp instanceof Timestamp ? timestamp.toDate() : new Date(timestamp);
    return format(date, "PPP p");
  };

  const toggleExpandItem = (id: string) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
  };

  const filteredCopyrights = termsList.filter((item) => {
    if (!searchTerm) return true;
    return item.content.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      {toast.isVisible && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 ${
            toast.type === "success"
              ? "bg-green-50 text-green-800 border-l-4 border-green-500"
              : toast.type === "error"
              ? "bg-red-50 text-red-800 border-l-4 border-red-500"
              : "bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500"
          }`}
        >
          <div className="mr-3">
            {toast.type === "success" ? (
              <FiCheck className="w-5 h-5 text-green-500" />
            ) : toast.type === "error" ? (
              <FiAlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <MdOutlineWarning className="w-5 h-5 text-yellow-500" />
            )}
          </div>
          <p className="font-medium">{toast.message}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <MdOutlineCopyright className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Copyright Management
                </h1>
                <p className="text-gray-500">
                  Create and manage your website's copyright notices
                </p>
              </div>
            </div>
            {activeTab === "view" && (
              <div className="flex space-x-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search copyrights..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm"
                  />
                </div>
                {/* <button
                  onClick={() => {
                    setInput("");
                    setEditId(null);
                    setIsEditing(false);
                    setActiveTab("edit");
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <MdAdd className="w-5 h-5 mr-1" />
                  New Copyright
                </button> */}
              </div>
            )}
            {activeTab === "edit" && (
              <button
                onClick={handleCancelEdit}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <MdArrowBack className="w-5 h-5 mr-1" />
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        {activeTab === "view" ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <BiLoaderAlt className="w-10 h-10 text-purple-600 animate-spin" />
                <span className="ml-3 text-lg text-gray-600">
                  Loading copyrights...
                </span>
              </div>
            ) : filteredCopyrights.length === 0 ? (
              <div className="text-center py-20 px-6">
                {searchTerm ? (
                  <>
                    <MdSearch className="w-16 h-16 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No matching copyrights found
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Try adjusting your search term or clear the search
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Clear Search
                    </button>
                  </>
                ) : (
                  <>
                    <HiOutlineDocumentText className="w-16 h-16 mx-auto text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No copyright notices yet
                    </h3>
                    <p className="mt-2 text-gray-500">
                      Get started by creating your first copyright notice
                    </p>
                    <button
                      onClick={() => {
                        setInput("");
                        setEditId(null);
                        setIsEditing(false);
                        setActiveTab("edit");
                      }}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <MdAdd className="w-5 h-5 mr-1" />
                      Create New Copyright
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredCopyrights.map((item) => (
                  <div
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => toggleExpandItem(item.id)}
                        >
                          <div className="flex-shrink-0 mr-4">
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <MdOutlineCopyright className="h-5 w-5 text-purple-600" />
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Copyright Notice
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <FiClock className="mr-1" />
                              Last updated: {formatDate(item.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleExpandItem(item.id)}
                            className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            {expandedItem === item.id ? (
                              <MdOutlineVisibilityOff className="h-5 w-5" />
                            ) : (
                              <MdOutlineVisibility className="h-5 w-5" />
                            )}
                          </button>
                          <div className="relative inline-block text-left">
                            <div>
                              <button
                                type="button"
                                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                id="menu-button"
                                aria-expanded="true"
                                aria-haspopup="true"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // This would typically open a dropdown menu
                                }}
                              >
                                <BsThreeDotsVertical className="h-5 w-5" />
                              </button>
                            </div>
                            {/* Dropdown menu would go here */}
                          </div>
                          <button
                            onClick={() => handleEdit(item)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                          >
                            <MdEdit className="w-4 h-4 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDelete(item.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <MdDelete className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                      {expandedItem === item.id && (
                        <div className="mt-4 border-t pt-4">
                          <div className="prose prose-sm max-w-none">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.content,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-medium text-gray-900">
                {isEditing
                  ? "Edit Copyright Notice"
                  : "Create New Copyright Notice"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {isEditing
                  ? "Make changes to your existing copyright notice"
                  : "Create a copyright notice to protect your intellectual property"}
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4">
                <div className="mb-4 bg-yellow-50 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <MdOutlineInfo className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Copyright Information
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          A proper copyright notice typically includes the
                          copyright symbol (©), the year of first publication,
                          and the name of the copyright owner. Example: © 2025
                          Your Ksa4Sale. All rights reserved.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border rounded-md">
                  // In your render method
                  <JoditEditor
                    ref={editor}
                    tabIndex={1}
                    value={input} // Use the input state as the value
                    onBlur={(newContent: string) => setInput(newContent)} // Update input on blur
                    config={{
                      readonly: false,
                      placeholder: "Enter the Privacy Policy content...",
                      height: 400,
                      buttons: [
                        "source",
                        "|",
                        "bold",
                        "italic",
                        "underline",
                        "strikethrough",
                        "|",
                        "ul",
                        "ol",
                        "|",
                        "font",
                        "fontsize",
                        "brush",
                        "paragraph",
                        "|",
                        "image",
                        "table",
                        "link",
                        "|",
                        "align",
                        "undo",
                        "redo",
                        "|",
                        "hr",
                        "eraser",
                        "copyformat",
                        "|",
                        "fullsize",
                      ],
                      uploader: {
                        insertImageAsBase64URI: true,
                      },
                    }}
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <MdClose className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 ${
                    isLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  }`}
                >
                  {isLoading ? (
                    <BiLoaderAlt className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <MdSave className="w-4 h-4 mr-2" />
                  )}
                  {isEditing ? "Update" : "Save"} Copyright
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={() => setDeleteDialogOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <MdDelete className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Copyright Notice
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this copyright notice?
                        This action cannot be undone and all associated data
                        will be permanently removed from our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                    isLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  }`}
                >
                  {isLoading ? (
                    <BiLoaderAlt className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteDialogOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CopyRights;
