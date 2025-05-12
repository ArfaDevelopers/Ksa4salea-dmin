"use client";

import React, { useEffect, useState } from "react";

import { db } from "../Firebase/FirebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

// For date picker
import DatePicker, { registerLocale } from "react-datepicker";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { format } from "date-fns";

interface AboutUsItem {
  id: string;
  content: string;
  createdAt: Timestamp | Date;
}

const AboutUs: React.FC = () => {
  const MySwal = withReactContent(Swal);

  const [input, setInput] = useState<string>("");
  const [aboutList, setAboutList] = useState<AboutUsItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch data
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "AboutUs"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AboutUsItem[];
      setAboutList(data);
    } catch (error) {
      console.error("Error fetching About Us data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) {
      MySwal.fire("Warning", "Please enter About Us content", "warning");
      return;
    }

    try {
      if (editId) {
        await updateDoc(doc(db, "AboutUs", editId), {
          content: input,
        });
        MySwal.fire("Updated", "Content updated successfully", "success");
      } else {
        await addDoc(collection(db, "AboutUs"), {
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

  // Edit handler
  const handleEdit = (item: AboutUsItem) => {
    setInput(item.content);
    setEditId(item.id);
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the item.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(db, "AboutUs", id));
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
        <textarea
          rows={4}
          className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
          placeholder="Enter About Us content..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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
              <p className="text-gray-800">{item.content}</p>
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

export default AboutUs;
