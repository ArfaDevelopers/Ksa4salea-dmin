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

interface BodyContentItem {
  id: string;
  content: string;
  createdAt: Timestamp | Date;
}

const BodyContent: React.FC = () => {
  const MySwal = withReactContent(Swal);
  const editor = useRef(null);

  const [input, setInput] = useState<string>("");
  const [aboutList, setAboutList] = useState<BodyContentItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "BodyContent"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BodyContentItem[];
      setAboutList(data);
    } catch (error) {
      console.error("Error fetching About Us data:", error);
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
        await updateDoc(doc(db, "BodyContent", editId), {
          content: input,
        });
        MySwal.fire("Updated", "Content updated successfully", "success");
      } else {
        // Prevent adding more than one item
        if (aboutList.length >= 1) {
          MySwal.fire(
            "Warning",
            "Only one Terms and Conditions entry is allowed.",
            "warning"
          );
          return;
        }

        await addDoc(collection(db, "BodyContent"), {
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

  const handleEdit = (item: BodyContentItem) => {
    setInput(item.content);
    setEditId(item.id);
  };

  const handleDelete = async (id: string) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the item.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "BodyContent", id));
      MySwal.fire("Deleted", "Content has been deleted", "success");
      fetchData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Manage About Us
      </h2>

      <form onSubmit={handleSubmit} className="mb-8">
        <JoditEditor
          ref={editor}
          value={input}
          tabIndex={1}
          onChange={(newContent) => setInput(newContent)}
        />
        <button
          type="submit"
          disabled={!editId && aboutList.length >= 1}
          className={`mt-4 px-6 py-2 rounded-lg transition duration-200 focus:outline-none ${
            !editId && aboutList.length >= 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {editId ? "Update" : "Add"} Content
        </button>
      </form>

      <div className="space-y-4">
        {aboutList.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded shadow flex justify-between items-start border"
          >
            <div className="flex-1">
              <div
                className="text-gray-800"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
              {item.createdAt && (
                <p className="text-xs text-gray-500 mt-1">
                  Created at:{" "}
                  {format(
                    item.createdAt instanceof Timestamp
                      ? item.createdAt.toDate()
                      : new Date(item.createdAt),
                    "PPP p"
                  )}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-600 hover:text-blue-800"
              >
                <MdEdit size={20} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                <RiDeleteBin5Line size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BodyContent;
