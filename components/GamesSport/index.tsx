"use client";
import React, { useState } from "react";
import { db } from "./../Firebase/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import axios from "axios";

// For date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const GamesSport = () => {
  const [img, setImg] = useState(""); // For storing image URL from Cloudinary
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");
  const [timeAgo, setTimeAgo] = useState<Date | null>(new Date());
  const [imageFile, setImageFile] = useState(null); // For storing the selected image file
  const [heathcaretype, setheathcaretype] = useState(""); // For storing selected property type
  const handlePropertyTypeChange = (e: any) => {
    const selectedType = e.target.value;
    setheathcaretype(selectedType);
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
      setImg(response.data.secure_url); // Save the image URL from Cloudinary
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

    if (!img) {
      alert("Please upload an image before submitting.");
      return;
    }

    try {
      // Get a reference to the 'GamesSport' collection
      const gamesSportCollection = collection(db, "GamesSport");

      // Add a new document to the 'GamesSport' collection
      const docRef = await addDoc(gamesSportCollection, {
        img: img,
        title: title,
        description: description,
        location: location,
        price: price,
        Type: heathcaretype,
        link: link,
        timeAgo: timeAgo ? timeAgo.toISOString() : new Date().toISOString(),
      });

      alert("Listing added successfully!");
      setTitle("");
      setImg("");
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
    <div className="container mx-auto my-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h3 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Add a New Game or Sport
        </h3>
        <form onSubmit={handleAddListing}>
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-lg text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label htmlFor="image" className="block text-lg text-gray-700 mb-2">
              Image Upload
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          {/* Sport & Games Type */}
          <div className="mb-6">
            <label
              htmlFor="heathcaretype"
              className="block text-lg text-gray-700 mb-2"
            >
              Sport & Games Type
            </label>
            <select
              id="heathcaretype"
              value={heathcaretype}
              onChange={handlePropertyTypeChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Sport Type</option>
              <option value="Football">Football</option>
              <option value="Cricket">Cricket</option>
              <option value="Gloves">Gloves</option>
              <option value="Stumps">Stumps</option>
            </select>
          </div>

          {/* Location */}
          <div className="mb-6">
            <label
              htmlFor="location"
              className="block text-lg text-gray-700 mb-2"
            >
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Price */}
          <div className="mb-6">
            <label htmlFor="price" className="block text-lg text-gray-700 mb-2">
              Price
            </label>
            <input
              id="price"
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Link */}
          <div className="mb-6">
            <label htmlFor="link" className="block text-lg text-gray-700 mb-2">
              Link
            </label>
            <input
              id="link"
              type="text"
              placeholder="Enter link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-lg text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
               placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Time Ago */}
          <div className="mb-6">
            <label
              htmlFor="timeAgo"
              className="block text-lg text-gray-700 mb-2"
            >
              Time Ago (Date Added)
            </label>
            <DatePicker
              selected={timeAgo}
              onChange={(date) => setTimeAgo(date)} // Update the date state
              dateFormat="MMMM d, yyyy"
              showYearDropdown
              scrollableYearDropdown
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Listing
          </button>
        </form>
      </div>
    </div>
  );
};

export default GamesSport;
