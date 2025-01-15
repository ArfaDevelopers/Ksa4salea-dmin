"use client";
import React, { useState } from "react";
import { db } from "./../Firebase/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";

// For date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Cloudinary upload
import axios from "axios";

const Automotive = () => {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [timeAgo, setTimeAgo] = useState<Date | null>(new Date());
  const [imageFile, setImageFile] = useState(null); // For storing the selected image file

  // Handle image upload to Cloudinary
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
      setImageUrl(response.data.secure_url); // Save the image URL from Cloudinary
      console.log("Image uploaded successfully:", response.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image.");
    }
  };

  // Handle file selection
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      handleImageUpload(file); // Upload the selected file
    }
  };

  // Function to add a new book to Firestore
  const handleAddBook = async (e: any) => {
    e.preventDefault();

    if (!imageUrl) {
      alert("Please upload an image before submitting.");
      return;
    }

    try {
      // Get a reference to the 'books' collection
      const booksCollection = collection(db, "carData");

      // Add a new document to the 'books' collection
      const docRef = await addDoc(booksCollection, {
        title: name,
        img: imageUrl,
        location: location,
        price: price,
        link: link,
        description: description,
        timeAgo: timeAgo ? timeAgo.toISOString() : new Date().toISOString(),
      });

      alert("Book added successfully!");
      setName("");
      setImageUrl("");
      setLocation("");
      setPrice("");
      setLink("");
      setDescription("");
      setTimeAgo(new Date()); // Reset time to current date
    } catch (error) {
      console.error("Error adding book: ", error);
      alert("Error adding book.");
    }
  };

  return (
    <div className="my-5">
      <div className="flex justify-center">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-center text-xl font-semibold mb-6">
              Add a New Automative
            </h3>
            <form onSubmit={handleAddBook}>
              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Upload
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Link */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link
                </label>
                <input
                  type="text"
                  placeholder="Enter link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Time Ago */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Ago (Date Posted)
                </label>
                <DatePicker
                  selected={timeAgo}
                  onChange={(date) => setTimeAgo(date)} // Update the date state
                  dateFormat="MMMM d, yyyy"
                  showYearDropdown
                  scrollableYearDropdown
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Automative
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automotive;
