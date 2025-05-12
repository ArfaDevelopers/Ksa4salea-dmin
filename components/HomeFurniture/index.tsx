"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { format } from "date-fns";

interface HomeFurnitureItem {
  id: string;
  content: string;
  createdAt: Timestamp | Date;
}

const HomeFurniture: React.FC = () => {
  const MySwal = withReactContent(Swal);
  const editor = useRef(null);

  const [input, setInput] = useState<string>("");
  const [itemsList, setItemsList] = useState<HomeFurnitureItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "HomeFurniture"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as HomeFurnitureItem[];
      setItemsList(data);
    } catch (error) {
      console.error("Error fetching Home & Furniture content:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      MySwal.fire("Warning", "Please enter content", "warning");
      return;
    }

    try {
      if (editId) {
        // Update existing entry
        await updateDoc(doc(db, "HomeFurniture", editId), {
          content: input,
        });
        MySwal.fire("Updated", "Content updated successfully", "success");
      } else {
        // Prevent adding more than one item
        if (itemsList.length >= 1) {
          MySwal.fire(
            "Warning",
            "Only one Terms and Conditions entry is allowed.",
            "warning"
          );
          return;
        }

        await addDoc(collection(db, "TermsConditions"), {
          content: input,
          createdAt: Timestamp.now(),
        });
        MySwal.fire("Added", "Content added successfully", "success");
      }

      setInput("");
      setEditId(null);
      fetchData();
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  // const handleEdit = (item: HomeFurnitureItem) => {
  //   setInput(item.content);
  //   setEditId(item.id);
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };
  const handleEdit = (item: HomeFurnitureItem) => {
    setInput(item.content); // Set the input to the content of the item being edited
    setEditId(item.id);
    // setIsEditing(true);
    // setActiveTab("edit");
  };

  const handleDelete = async (id: string) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete this content.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "HomeFurniture", id));
        MySwal.fire("Deleted", "Content has been deleted", "success");
        fetchData();
      } catch {
        MySwal.fire("Error", "Failed to delete content", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-50 via-white to-yellow-50 p-4 sm:p-8 md:p-12 max-w-5xl mx-auto flex flex-col">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide mb-2">
          Manage Home & Furniture Content
        </h1>
        <p className="text-md text-gray-600 max-w-lg mx-auto">
          Add, edit, or remove content for your Home & Furniture section below.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-12 w-full"
      >
        <label
          htmlFor="editor"
          className="block font-semibold text-gray-700 mb-3"
        >
          Content Editor
        </label>
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
        <button
          type="submit"
          disabled={!editId && itemsList.length >= 1}
          className={`mt-4 px-6 py-2 rounded-lg transition duration-200 focus:outline-none ${
            !editId && itemsList.length >= 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {editId ? "Update" : "Add"} Content
        </button>
      </form>

      <section className="w-full">
        {itemsList.length === 0 && (
          <p className="text-center text-gray-500 italic">
            No content available yet.
          </p>
        )}

        <div className="space-y-8">
          {itemsList.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start gap-4 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex-1 min-w-0">
                <div
                  className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-900"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
                {item.createdAt && (
                  <time
                    className="block mt-4 text-xs text-gray-500"
                    dateTime={
                      item.createdAt instanceof Timestamp
                        ? item.createdAt.toDate().toISOString()
                        : new Date(item.createdAt).toISOString()
                    }
                  >
                    Posted on:{" "}
                    {format(
                      item.createdAt instanceof Timestamp
                        ? item.createdAt.toDate()
                        : new Date(item.createdAt),
                      "MMMM dd, yyyy 'at' h:mm a"
                    )}
                  </time>
                )}
              </div>
              <div className="flex flex-shrink-0 items-center space-x-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-yellow-600 hover:text-yellow-800 transition-colors"
                  aria-label="Edit content"
                >
                  <MdEdit size={26} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  aria-label="Delete content"
                >
                  <RiDeleteBin5Line size={26} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeFurniture;
