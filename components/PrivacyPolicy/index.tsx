"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import JoditEditor from "jodit-react";
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
  MdCalendarToday,
} from "react-icons/md";
import { RiErrorWarningLine } from "react-icons/ri";
import { FiCheck, FiAlertCircle } from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";
import { debounce } from "lodash";

interface PrivacyPolicyItem {
  id: string;
  content: string;
  createdAt: Timestamp | Date;
}

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning";
  isVisible: boolean;
}

const PrivacyPolicy: React.FC = () => {
  const editor = useRef(null);
  const [input, setInput] = useState<string>("");

  // Debounced change handler
  const debouncedOnChange = debounce((newContent) => {
    setInput(newContent);
  }, 300); // Waits for 300ms before updating state

  // const [input, setInput] = useState<string>("");
  const [termsList, setTermsList] = useState<PrivacyPolicyItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("view");
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
      const querySnapshot = await getDocs(collection(db, "PrivacyPolicy"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PrivacyPolicyItem[];

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
      console.error("Error fetching Privacy Policy data:", error);
      showToast("Failed to load privacy policy data", "error");
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
        await updateDoc(doc(db, "PrivacyPolicy", editId), {
          content: input,
        });
        showToast("Content updated successfully", "success");
      } else {
        await addDoc(collection(db, "PrivacyPolicy"), {
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

  const handleEdit = (item: PrivacyPolicyItem) => {
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
      await deleteDoc(doc(db, "PrivacyPolicy", itemToDelete));
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Toast Notification */}
      {toast.isVisible && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-0 ${
            toast.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : toast.type === "error"
              ? "bg-red-50 text-red-800 border border-red-200"
              : "bg-yellow-50 text-yellow-800 border border-yellow-200"
          }`}
        >
          <div className="mr-3">
            {toast.type === "success" ? (
              <FiCheck className="w-5 h-5 text-green-500" />
            ) : toast.type === "error" ? (
              <FiAlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <RiErrorWarningLine className="w-5 h-5 text-yellow-500" />
            )}
          </div>
          <p>{toast.message}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Privacy Policy Management
          </h1>
          <p className="text-gray-600 mt-2">
            Create, edit, and manage your privacy policy content
          </p>
        </div>

        {/* Tabs */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab("view")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "view"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                View Policies
              </button>
              {termsList.length > 0 ? (
                ""
              ) : (
                <button
                  onClick={() => {
                    if (!isEditing) {
                      setInput("");
                      setEditId(null);
                    }
                    setActiveTab("edit");
                  }}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === "edit"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {isEditing ? "Edit Policy" : "Add New Policy"}
                </button>
              )}
            </div>

            {!isEditing &&
              activeTab === "view" &&
              (termsList.length > 0 ? (
                ""
              ) : (
                <button
                  onClick={() => {
                    setInput("");
                    setEditId(null);
                    setIsEditing(false);
                    setActiveTab("edit");
                  }}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <MdAdd className="w-4 h-4 mr-2" />
                  Add New
                </button>
              ))}
          </div>

          {/* View Tab Content */}
          {activeTab === "view" && (
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="text-center">
                    <BiLoaderAlt className="w-8 h-8 mx-auto text-blue-600 animate-spin" />
                    <p className="mt-2 text-gray-600">Loading policies...</p>
                  </div>
                </div>
              ) : termsList.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-800">
                    No privacy policies found
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Create your first privacy policy by clicking the "Add New"
                    button
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {termsList.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                              <MdCalendarToday className="w-3 h-3 mr-1" />
                              {formatDate(item.createdAt)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <MdEdit className="w-4 h-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => confirmDelete(item.id)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              <MdDelete className="w-4 h-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="max-h-[400px] overflow-y-auto pr-2">
                          <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Edit Tab Content */}
          {activeTab === "edit" && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="px-4 py-3 border-b">
                {termsList.length > 0 ? (
                  ""
                ) : (
                  <h2 className="text-lg font-medium text-gray-800">
                    {isEditing
                      ? "Edit Privacy Policy"
                      : "Add New Privacy Policy"}
                  </h2>
                )}
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-4">
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
                <div className="px-4 py-3 bg-gray-50 border-t flex justify-between">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <MdClose className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md ${
                      isLoading
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                  >
                    {isLoading ? (
                      <BiLoaderAlt className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <MdSave className="w-4 h-4 mr-2" />
                    )}
                    {isEditing ? "Update" : "Save"} Policy
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
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
                      Confirm Deletion
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this privacy policy?
                        This action cannot be undone.
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
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default PrivacyPolicy;
