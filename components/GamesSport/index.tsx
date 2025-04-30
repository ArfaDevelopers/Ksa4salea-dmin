"use client";
import React, { useEffect, useState } from "react";
import { db } from "./../Firebase/FirebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import axios from "axios";
import { RiDeleteBin5Line } from "react-icons/ri";
import withReactContent from "sweetalert2-react-content";
import { MdEdit } from "react-icons/md";

import Swal from "sweetalert2";

// For date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiTrash } from "react-icons/fi";
type Ad = {
  id: any; // Change from string to number
  link: string;
  timeAgo: string;
  title: string;
  description: string;
  location: string;
  img: string;
  price: string;
};
const GamesSport = () => {
  const MySwal = withReactContent(Swal);

  const [img, setImg] = useState(""); // For storing image URL from Cloudinary
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");
  const [timeAgo, setTimeAgo] = useState<Date | null>(new Date());
  const [imageFile, setImageFile] = useState(null); // For storing the selected image file
  const [heathcaretype, setheathcaretype] = useState(""); // For storing selected property type
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);
  const [slidesToShow, setSlidesToShow] = useState(5);
  const [ads, setAds] = useState<Ad[]>([]); // Define the type here as an array of 'Ad' objects
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  const [selectedAd, setSelectedAd] = useState<Ad | null>(null); // Holds the selected ad
  const [refresh, setRefresh] = useState(false);
  console.log("Updating listing with img:", img);
  console.log("Updating listing with imageFile:", imageFile);

  const filteredAds = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by title
      ad.description.toLowerCase().includes(searchTerm.toLowerCase()) // Search by description
  );
  console.log(ads, "adsList___________selectedAd");
  const resetForm = () => {
    setTitle("");
    setImg("");
    setLocation("");
    setPrice("");
    setLink("");
    setDescription("");
    setTimeAgo(new Date());
    setImageFile(null);
    setheathcaretype("");
    // setIsOpen(false);
  };
  const handleUpdate = async (adId: any) => {
    try {
      console.log("Updating listing with ID:", adId);
      const adDocRef = doc(db, "GamesSport", adId);

      await updateDoc(adDocRef, {
        img: img,
        title: title,
        description: description,
        location: location,
        price: price,
        Type: heathcaretype,
        link: link,
        // timeAgo: timeAgo.toLocaleDateString(), // Store as string for consistency
      });

      // Update the local state
      setAds(
        ads.map((ad) =>
          ad.id === adId
            ? {
                ...ad,
                img,
                title,
                description,
                location,
                price,
                Type: heathcaretype,
                link,
                // timeAgo: timeAgo.toLocaleDateString(),
              }
            : ad
        )
      );
      MySwal.fire({
        title: "Added Item!",
        text: "Listing added successfully!",
        icon: "success",
        timer: 1000,
      });
      // alert("Listing updated successfully!");
    } catch (error) {
      console.error("Error updating listing:", error);
      alert("Error updating listing.");
    }
  };
  const handleAddListing = async (e: any) => {
    e.preventDefault();

    try {
      if (selectedAd) {
        await handleUpdate(selectedAd.id);
      } else if (selectedAd == null) {
        // Handle image upload logic (if applicable)
        const imageData = await handleImageUpload(imageFile); // Ensure handleImageUpload has a proper return type

        const newAd = {
          id: Date.now(),
          title,
          description,
          location,
          price,

          link,
          img: imageData.url || "", // Safely access 'url' here
          timeAgo: timeAgo ? timeAgo.toLocaleDateString() : "",
          heathcaretype,
        };
        setAds([...ads, newAd]);
        const adCollectionRef = collection(db, "GamesSport");
        await addDoc(adCollectionRef, {
          img: newAd.img,
          title: newAd.title,
          description: newAd.description,
          location: newAd.location,
          price: newAd.price,
          type: newAd.heathcaretype, // Correcting key naming
          link: newAd.link,
          timeAgo: newAd.timeAgo, // Store as a string
        });
        MySwal.fire({
          title: "Added Item!",
          text: "Listing added successfully!",
          icon: "success",
          timer: 1000,
        });
      }
      closeModal();
      setRefresh(!refresh);

      resetForm();
    } catch (error) {
      // console.error("Error adding/updating listing:", error.message);
      alert("Error adding/updating listing.");
    }
  };

  const handleEditClick = async (id: any) => {
    try {
      const adDoc = await getDoc(doc(db, "GamesSport", id));
      if (adDoc.exists()) {
        const adData = adDoc.data();
        setDescription(adData.description);
        setTimeAgo(adData.timeAgo);
        setLocation(adData.location);
        setPrice(adData.price);
        setTitle(adData.title);
        setLink(adData.link);
        setImg(adData.img);
        setheathcaretype(adData.Type);
        // Ensure all required fields are present or provide defaults
        const selectedAd: Ad = {
          id,
          link: adData.link || "",
          timeAgo: adData.timeAgo || new Date().toISOString(),
          title: adData.title || "Untitled",
          description: adData.description || "No description",
          location: adData.location || "Unknown",
          img: adData.img || "",
          price: adData.price || "0",
        };

        setSelectedAd(selectedAd); // Pass a valid Ad object to setSelectedAd
        setIsOpen(true);
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error fetching ad by ID:", error);
    }
  };
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsCollection = collection(db, "GamesSport"); // Get reference to the 'ads' collection
        const adsSnapshot = await getDocs(adsCollection); // Fetch the data
        const adsList = adsSnapshot.docs.map((doc) => ({
          id: doc.id,
          link: doc.data().link || "", // Provide fallback if data is missing
          timeAgo: doc.data().timeAgo || "", // Provide fallback if data is missing
          title: doc.data().title || "", // Provide fallback if data is missing
          description: doc.data().description || "", // Provide fallback if data is missing
          location: doc.data().location || "", // Provide fallback if data is missing
          img: doc.data().img || "", // Provide fallback if data is missing
          price: doc.data().price || "", // Provide fallback if data is missing
        }));
        console.log(adsList, "adsList___________adsList");

        setAds(adsList); // Set the state with the ads data
        setLoading(false); // Stop loading when data is fetched
      } catch (error) {
        console.error("Error fetching ads:", error);
        setLoading(false);
      }
    };

    fetchAds();
  }, [refresh]);
  const handlePropertyTypeChange = (e: any) => {
    const selectedType = e.target.value;
    setheathcaretype(selectedType);
    console.log("Selected Property Type:", selectedType); // Log the selected property type
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (file: any): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");
    formData.append("cloud_name", "dv26wjoay");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dv26wjoay/image/upload",
        formData
      );
      setImg(response.data.secure_url);
      console.log("Image uploaded successfully:", response.data.secure_url);
      return { url: response.data.secure_url }; // Return the URL wrapped in an object
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image.");
      return { url: "" }; // Return a default value in case of failure
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

  const handleDelete = async (ad: any) => {
    // Display confirmation dialog
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Proceed with deletion
        MySwal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
          timer: 1000,
        });

        // Delete the ad from Firestore (Firebase)
        try {
          // Delete the document from Firestore using the ad's id
          await deleteDoc(doc(db, "GamesSport", ad.id)); // Delete document by id
          console.log("Ad deleted from Firestore:", ad.id);
          setRefresh(!refresh);
          // Optionally, update the state or re-fetch the data after deletion
          // For example, you can call a function to refetch ads here
        } catch (error) {
          console.error("Error deleting ad from Firestore:", error);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        MySwal.fire({
          title: "Cancelled",
          text: "Your file is safe :)",
          icon: "error",
          timer: 1000,
        });
      }
    });
  };

  return (
    <div>
      {/* Add New Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setSelectedAd(null);

          resetForm();
        }}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 mb-6"
      >
        Add New
      </button>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
          <div>
            <button
              id="dropdownActionButton"
              data-dropdown-toggle="dropdownAction"
              className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button"
            >
              <span className="sr-only">Action button</span>
              Action
              <svg
                className="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {/* Dropdown menu */}
            <div
              id="dropdownAction"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
            >
              <ul
                className="py-1 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownActionButton"
              >
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Reward
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Promote
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Activate account
                  </a>
                </li>
              </ul>
              <div className="py-1">
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Delete User
                </a>
              </div>
            </div>
          </div>
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search-users"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
              value={searchTerm} // Bind input value to state
              onChange={(e) => setSearchTerm(e.target.value)} // Update state on input
            />
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="p-4">
                <div className="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="checkbox-all-search" className="sr-only">
                    checkbox
                  </label>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Location
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredAds.map((ad) => (
              <tr
                key={ad.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-search-${ad.id}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`checkbox-table-search-${ad.id}`}
                      className="sr-only"
                    >
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={ad.img}
                    alt={ad.title}
                  />
                  <div className="ps-3">
                    <div className="text-base font-semibold">{ad.title}</div>
                    <div className="font-normal text-gray-500"></div>
                  </div>
                </th>
                <td className="px-6 py-4">{ad.description}</td>
                <td className="px-6 py-4">{ad.location}</td>
                <td className="px-6 py-4">{ad.price}</td>
                <td className="px-6 py-4">
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(ad)}
                    className="text-red-600 dark:text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <RiDeleteBin5Line size={20} />
                  </button>
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditClick(ad.id)} // Fetch the ad by ID and open modal
                    className="text-blue-600 dark:text-blue-500 hover:text-blue-700 ml-3"
                    title="Edit"
                  >
                    <MdEdit size={20} style={{ color: "green" }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {isOpen && (
        <div
          className=" fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto mt-4"
          style={{ marginTop: "8%" }}
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              >
                &times;
              </button>
              <h3 className="text-3xl font-semibold text-center text-gray-800 mb-6">
                {selectedAd
                  ? "Update a New Game or Sport"
                  : "Add a New Game or Sport"}
              </h3>
              <form onSubmit={handleAddListing} className="w-[100%]">
                {/* Title */}
                <div className="mb-6">
                  <label
                    htmlFor="title"
                    className="block text-lg text-gray-700 mb-2"
                  >
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
                  <label
                    htmlFor="image"
                    className="block text-lg text-gray-700 mb-2"
                  >
                    Image Upload
                  </label>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                </div>
                {img && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
                    <img
                      src={img}
                      alt="Uploaded Preview"
                      className="w-full h-auto rounded-md border border-gray-300"
                    />
                  </div>
                )}
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
                  <label
                    htmlFor="price"
                    className="block text-lg text-gray-700 mb-2"
                  >
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
                  <label
                    htmlFor="link"
                    className="block text-lg text-gray-700 mb-2"
                  >
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
                  {selectedAd ? "Update Listing" : "Add Listing"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesSport;
