"use client";

import React, { useEffect, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { db } from "../Firebase/FirebaseConfig";
import { addDoc, collection, deleteDoc, doc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { format } from "date-fns";

interface ContentItem { id: string; content: string; content_en?: string; content_ar?: string; createdAt: Timestamp | Date; }

const HomeFurnitureContent: React.FC = () => {
  const MySwal = withReactContent(Swal);
  const editorEn = useRef(null);
  const editorAr = useRef(null);
  const [inputEn, setInputEn] = useState<string>("");
  const [inputAr, setInputAr] = useState<string>("");
  const [aboutList, setAboutList] = useState<ContentItem[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"en" | "ar">("en");

  const COLLECTION_NAME = "HomeFurnitureContent";
  const PAGE_TITLE = "Home & Furniture";
  const joditConfigAr = { direction: "rtl" as const, language: "ar" };

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as ContentItem[];
      setAboutList(data);
    } catch (error) { console.error("Error fetching data:", error); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEn.trim() && !inputAr.trim()) { MySwal.fire("Warning", "Please enter content in at least one language", "warning"); return; }
    try {
      if (editId) {
        await updateDoc(doc(db, COLLECTION_NAME, editId), { content: inputEn, content_en: inputEn, content_ar: inputAr });
        MySwal.fire("Updated", "Content updated successfully", "success");
      } else {
        if (aboutList.length >= 1) { MySwal.fire("Warning", "Only one content entry is allowed.", "warning"); return; }
        await addDoc(collection(db, COLLECTION_NAME), { content: inputEn, content_en: inputEn, content_ar: inputAr, createdAt: Timestamp.now() });
        MySwal.fire("Added", "Content added successfully", "success");
      }
      setInputEn(""); setInputAr(""); setEditId(null); fetchData();
    } catch (error) { console.error("Error saving content:", error); }
  };

  const handleEdit = (item: ContentItem) => { setInputEn(item.content_en || item.content || ""); setInputAr(item.content_ar || ""); setEditId(item.id); };
  const handleDelete = async (id: string) => {
    const result = await MySwal.fire({ title: "Are you sure?", text: "This will permanently delete the item.", icon: "warning", showCancelButton: true, confirmButtonText: "Yes, delete it!" });
    if (result.isConfirmed) { await deleteDoc(doc(db, COLLECTION_NAME, id)); MySwal.fire("Deleted", "Content has been deleted", "success"); fetchData(); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center mb-6">Manage {PAGE_TITLE} Page Content</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex mb-4 border-b">
          <button type="button" onClick={() => setActiveTab("en")} className={`px-6 py-2 font-medium transition-colors ${activeTab === "en" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>🇬🇧 English</button>
          <button type="button" onClick={() => setActiveTab("ar")} className={`px-6 py-2 font-medium transition-colors ${activeTab === "ar" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}>🇸🇦 Arabic (العربية)</button>
        </div>
        <div className={activeTab === "en" ? "block" : "hidden"}><label className="block text-sm font-medium text-gray-700 mb-2">English Content</label><JoditEditor ref={editorEn} value={inputEn} tabIndex={1} onChange={(newContent) => setInputEn(newContent)} /></div>
        <div className={activeTab === "ar" ? "block" : "hidden"}><label className="block text-sm font-medium text-gray-700 mb-2">Arabic Content (المحتوى العربي)</label><JoditEditor ref={editorAr} value={inputAr} tabIndex={1} config={joditConfigAr} onChange={(newContent) => setInputAr(newContent)} /></div>
        <div className="flex gap-4 mt-4 text-sm"><span className={inputEn.trim() ? "text-green-600" : "text-gray-400"}>✓ English {inputEn.trim() ? "Added" : "Empty"}</span><span className={inputAr.trim() ? "text-green-600" : "text-gray-400"}>✓ Arabic {inputAr.trim() ? "Added" : "Empty"}</span></div>
        <button type="submit" disabled={!editId && aboutList.length >= 1} className={`mt-4 px-6 py-2 rounded-lg transition duration-200 focus:outline-none ${!editId && aboutList.length >= 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}>{editId ? "Update" : "Add"} Content</button>
      </form>
      <div className="space-y-4">
        {aboutList.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded shadow border">
            <div className="flex justify-between items-start mb-4"><h3 className="font-semibold text-lg">Content Preview</h3><div className="flex items-center gap-2"><button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800"><MdEdit size={20} /></button><button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800"><RiDeleteBin5Line size={20} /></button></div></div>
            <div className="mb-4"><h4 className="text-sm font-medium text-blue-600 mb-2">🇬🇧 English:</h4><div className="text-gray-800 border-l-4 border-blue-200 pl-4" dangerouslySetInnerHTML={{ __html: item.content_en || item.content || "<em>No English content</em>" }} /></div>
            <div className="mb-4"><h4 className="text-sm font-medium text-green-600 mb-2">🇸🇦 Arabic:</h4><div className="text-gray-800 border-r-4 border-green-200 pr-4" dir="rtl" dangerouslySetInnerHTML={{ __html: item.content_ar || "<em>لا يوجد محتوى عربي</em>" }} /></div>
            {item.createdAt && <p className="text-xs text-gray-500 mt-2">Created at: {format(item.createdAt instanceof Timestamp ? item.createdAt.toDate() : new Date(item.createdAt), "PPP p")}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeFurnitureContent;
