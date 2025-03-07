"use client";
import React, { useState } from "react";
import { db } from "./../Firebase/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const RealEstate = () => {
  const [imgSrc, setImgSrc] = useState(""); // For storing image URL from Cloudinary
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");
  const [timeAgo, setTimeAgo] = useState<Date | null>(new Date());
  const [imageFile, setImageFile] = useState(null); // For storing the selected image file
  const [propertyType, setPropertyType] = useState(""); // For storing selected property type

  // Handle image upload to Cloudinary
  const handleImageUpload = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "dlfdvlmse");
    formData.append("cloud_name", "dlfdvlmse");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dlfdvlmse/image/upload",
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

  // Handle property type change
  const handlePropertyTypeChange = (e: any) => {
    const selectedType = e.target.value;
    setPropertyType(selectedType);
    console.log("Selected Property Type:", selectedType); // Log the selected property type
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
      const listingsCollection = collection(db, "RealEstate");

      // Add a new document to the 'listings' collection
      const docRef = await addDoc(listingsCollection, {
        img: imgSrc,
        title: title,
        description: description,
        location: location,
        price: price,
        link: link,
        Type: propertyType,
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
    <div className="container mx-auto my-5">
      <div className="max-w-lg mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-center text-2xl mb-4">
          Add a New Real Estate Listing
        </h3>
        <form onSubmit={handleAddListing}>
          {/* Title */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter listing title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Image Upload
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Property Type */}
          <div className="mb-4">
            <label
              htmlFor="propertyType"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Property Type
            </label>
            <select
              id="propertyType"
              value={propertyType}
              onChange={handlePropertyTypeChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Property Type</option>
              <option value="Sale">Sale</option>
              <option value="Rent">Rent</option>
              <option value="Buy">Buy</option>
            </select>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Price
            </label>
            <input
              id="price"
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Link */}
          <div className="mb-4">
            <label
              htmlFor="link"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Link
            </label>
            <input
              id="link"
              type="url"
              placeholder="Enter link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Time Ago */}
          <div className="mb-4">
            <label
              htmlFor="timeAgo"
              className="block text-gray-700 text-sm font-bold mb-2"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
  );
};

export default RealEstate;
