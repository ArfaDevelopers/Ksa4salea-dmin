"use client";
import React, { useState } from "react";
import { db } from "./../Firebase/FirebaseConfig";

import { addDoc, collection } from "firebase/firestore";
import axios from "axios";

// For date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Electronic = () => {
  const [imgSrc, setImgSrc] = useState(""); // For storing image URL from Cloudinary
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");
  const [timeAgo, setTimeAgo] = useState<Date | null>(new Date());
  const [imageFile, setImageFile] = useState(null); // For storing the selected image file
  const [electronicType, setElectronicType] = useState(""); // For storing selected property type
  const handlePropertyTypeChange = (e: any) => {
    const selectedType = e.target.value;
    setElectronicType(selectedType);
    console.log("Selected Property Type:", selectedType); // Log the selected property type
  };

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
      setImgSrc(response.data.secure_url); // Save the image URL from Cloudinary
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

  // Function to add a new listing to Firestore
  const handleAddListing = async (e: any) => {
    e.preventDefault();

    if (!imgSrc) {
      alert("Please upload an image before submitting.");
      return;
    }

    try {
      // Get a reference to the 'listings' collection
      const listingsCollection = collection(db, "Electronic");

      // Add a new document to the 'listings' collection
      const docRef = await addDoc(listingsCollection, {
        img: imgSrc,
        title: title,
        description: description,
        location: location,
        price: price,
        Type: electronicType,
        link: link,
        timeAgo: timeAgo ? timeAgo.toISOString() : new Date().toISOString(),
      });

      alert("Listing added successfully!");
      setTitle("");
      setImgSrc("");
      setLocation("");
      setPrice("");
      setLink("");
      setDescription("");
      setTimeAgo(new Date()); // Reset time to current date
    } catch (error) {
      console.error("Error adding listing: ", error);
      alert("Error adding listing.");
    }
  };

  return (
    <div className="my-10 mx-auto max-w-3xl p-5">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="text-center py-4 bg-blue-500 text-white rounded-t-lg">
          <h3 className="text-2xl font-semibold">Add a New Electronic</h3>
        </div>
        <div className="p-5">
          <form onSubmit={handleAddListing}>
            {/* Title */}
            <div className="mb-4">
              <label
                htmlFor="formTitle"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="formTitle"
                placeholder="Enter listing title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label
                htmlFor="formImage"
                className="block text-sm font-medium text-gray-700"
              >
                Image Upload
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md"
                required
              />
            </div>

            {/* Electronic Type */}
            <div className="mb-4">
              <label
                htmlFor="formPropertyType"
                className="block text-sm font-medium text-gray-700"
              >
                Electronic Type
              </label>
              <select
                id="formPropertyType"
                value={electronicType}
                onChange={handlePropertyTypeChange}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Property Type</option>
                <option value="Charger">Charger</option>
                <option value="Head Phones">Head Phones</option>
                <option value="Speaker">Speaker</option>
                <option value="Mobile">Mobile</option>
                <option value="Processor">Processor</option>
              </select>
            </div>

            {/* Location */}
            <div className="mb-4">
              <label
                htmlFor="formLocation"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                type="text"
                id="formLocation"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Price */}
            <div className="mb-4">
              <label
                htmlFor="formPrice"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="formPrice"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Link */}
            <div className="mb-4">
              <label
                htmlFor="formLink"
                className="block text-sm font-medium text-gray-700"
              >
                Link
              </label>
              <input
                type="url"
                id="formLink"
                placeholder="Enter link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label
                htmlFor="formDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="formDescription"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Time Ago */}
            <div className="mb-4">
              <label
                htmlFor="formTimeAgo"
                className="block text-sm font-medium text-gray-700"
              >
                Time Ago (Date Posted)
              </label>
              <DatePicker
                selected={timeAgo}
                onChange={(date) => setTimeAgo(date)} // Update the date state
                dateFormat="MMMM d, yyyy"
                showYearDropdown
                scrollableYearDropdown
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
              >
                Add Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Electronic;
