"use client";
import React, { useState } from "react";
import { db } from "./../Firebase/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";

// For date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Cloudinary upload
import axios from "axios";

const HealthCare = () => {
  const [image, setImage] = useState(""); // For storing image URL from Cloudinary
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");
  // const [postedAgo, setPostedAgo] = useState(new Date()); // Default to current date
  const [imageFile, setImageFile] = useState(null); // For storing the selected image file
  const [heathcaretype, setheathcaretype] = useState(""); // For storing selected property type
  const [postedAgo, setPostedAgo] = useState<Date | null>(new Date());

  const handlePropertyTypeChange = (e: any) => {
    const selectedType = e.target.value;
    setheathcaretype(selectedType);
    console.log("Selected Property Type:", selectedType); // Log the selected property type
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");
    formData.append("cloud_name", "dv26wjoay");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dv26wjoay/image/upload",
        formData
      );
      setImage(response.data.secure_url); // Save the image URL from Cloudinary
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

    if (!image) {
      alert("Please upload an image before submitting.");
      return;
    }

    try {
      // Get a reference to the 'listings' collection
      const listingsCollection = collection(db, "HealthCare");

      // Add a new document to the 'listings' collection
      const docRef = await addDoc(listingsCollection, {
        img: image,
        title: title,
        details: details,
        location: location,
        price: price,
        Type: heathcaretype,
        link: link,
        // timeAgo: postedAgo.toISOString(), // Convert to ISO string to store the date
        timeAgo: postedAgo ? postedAgo.toISOString() : new Date().toISOString(),
      });

      alert("Listing added successfully!");
      setTitle("");
      setImage("");
      setLocation("");
      setPrice("");
      setLink("");
      setDetails("");
      setPostedAgo(new Date()); // Reset time to current date
    } catch (error) {
      console.error("Error adding listing: ", error);
      alert("Error adding listing.");
    }
  };

  return (
    <div className="container my-8 px-4">
      <div className="flex justify-center">
        <div className="w-full md:w-2/3 lg:w-1/2">
          <div className="card shadow-xl rounded-lg overflow-hidden">
            <div className="card-header text-center bg-blue-500 text-white py-4">
              <h3 className="text-2xl font-semibold">Add a New HealthCare</h3>
            </div>
            <div className="card-body px-6 py-4">
              <form onSubmit={handleAddListing}>
                {/* Title */}
                <div className="mb-6">
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
                    className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div className="mb-6">
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
                    className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Health Care Type */}
                <div className="mb-6">
                  <label
                    htmlFor="formPropertyType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Health Care Type
                  </label>
                  <select
                    id="formPropertyType"
                    value={heathcaretype}
                    onChange={handlePropertyTypeChange}
                    className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Property Type</option>
                    <option value="Sugae Apparatus">Sugae Apparatus</option>
                    <option value="Bp Apparatus">Bp Apparatus</option>
                    <option value="Medicine">Medicine</option>
                  </select>
                </div>

                {/* Location */}
                <div className="mb-6">
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
                    className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Price */}
                <div className="mb-6">
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
                    className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Link */}
                <div className="mb-6">
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
                    className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Details */}
                <div className="mb-6">
                  <label
                    htmlFor="formDetails"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Details
                  </label>
                  <textarea
                    id="formDetails"
                    rows={4}
                    placeholder="Enter details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Posted Ago */}
                <div className="mb-6">
                  <label
                    htmlFor="formPostedAgo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Posted Ago (Date Posted)
                  </label>
                  <DatePicker
                    selected={postedAgo}
                    onChange={(date) => setPostedAgo(date)}
                    dateFormat="MMMM d, yyyy"
                    showYearDropdown
                    scrollableYearDropdown
                    className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  >
                    Add Listing
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCare;
