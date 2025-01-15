"use client";
import React, { useState } from "react";
import { db } from "./../Firebase/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const Ads = () => {
  const [bookTitle, setBookTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [timeAgo, setTimeAgo] = useState<Date | null>(new Date());
  const [imageFile, setImageFile] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);

  const handleImageUpload = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "duvddbfbf");
    formData.append("cloud_name", "duvddbfbf");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/duvddbfbf/image/upload",
        formData
      );
      setImageUrl(response.data.secure_url);
      console.log("Image uploaded successfully:", response.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image.");
    }
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      handleImageUpload(file);
    }
  };

  const handleAddBook = async (e: any) => {
    e.preventDefault();

    if (!imageUrl) {
      alert("Please upload an image before submitting.");
      return;
    }

    try {
      const booksCollection = collection(db, "books");

      await addDoc(booksCollection, {
        title: bookTitle,
        img: imageUrl,
        location: location,
        price: price,
        isFeatured: isFeatured,
        timeAgo: timeAgo ? timeAgo.toISOString() : new Date().toISOString(),
      });

      alert("Book added successfully!");
      setBookTitle("");
      setImageUrl("");
      setLocation("");
      setPrice("");
      setTimeAgo(new Date());
      setIsFeatured(false);
    } catch (error) {
      console.error("Error adding book: ", error);
      alert("Error adding book.");
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6">Add a New Add</h3>
        <form onSubmit={handleAddBook} className="space-y-6">
          <div>
            <label
              htmlFor="bookTitle"
              className="block text-sm font-medium text-gray-700"
            >
              Book Title
            </label>
            <input
              id="bookTitle"
              type="text"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter book title"
            />
          </div>

          <div>
            <label
              htmlFor="imageUpload"
              className="block text-sm font-medium text-gray-700"
            >
              Image Upload
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter location"
            />
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter price"
            />
          </div>

          <div>
            <label
              htmlFor="timeAgo"
              className="block text-sm font-medium text-gray-700"
            >
              Time Ago (Date Posted)
            </label>
            <DatePicker
              id="timeAgo"
              selected={timeAgo}
              onChange={(date) => setTimeAgo(date)}
              dateFormat="MMMM d, yyyy"
              showYearDropdown
              scrollableYearDropdown
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="isFeatured"
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="isFeatured"
              className="ml-2 block text-sm text-gray-700"
            >
              Featured
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#37a584] via-[#95d1bc] to-[#314896] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Adds
          </button>
        </form>
      </div>
    </div>
  );
};

export default Ads;
