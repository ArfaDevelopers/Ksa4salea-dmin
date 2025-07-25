"use client";
import React, { useEffect, useState } from "react";
import { db } from "./../Firebase/FirebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  FiX,
  FiUser,
  FiPhone,
  FiUpload,
  FiCheck,
  FiImage,
} from "react-icons/fi";
import { FaCar, FaCarSide } from "react-icons/fa";
// For date picker
import DatePicker, { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale"; // Import English locale
import "react-datepicker/dist/react-datepicker.css";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
// Cloudinary upload
import axios from "axios";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";

// Register the English locale
registerLocale("en-US", enUS);
type Ad = {
  id: any; // Change from string to number
  link: string;
  timeAgo: string;
  title: string;
  description: string;
  location: string;
  img: string;
  Price: string;
  DrivenKm: any;
  Assembly: any;
  EngineCapacity: any;
  Color: string;
  City: string;
  PictureAvailability: any;
  EngineType: string;
  ManufactureYear: string;
  ModalCategory: string;
  CoNumberOfDoorsor: string; // Possible typo: Should this be 'NumberOfDoors'?
  PhoneNumber: string;
  Registeredin: string;
  SeatingCapacity: string;
  SellerType: string;
  Transmission: string;
  TrustedCars: string;
  VideoAvailability: string;
  assembly: string;
  bodyType: string;
  condition: string;
  engineCapacity: string;
  isFeatured: string;
  model: string;
  purpose: string;
  registeredCity: string;
  sellerType: string;
  type: string;
  phone: string;
  AdType: any;
  FuelType: any;
  galleryImages: any;
  image: any;
  Title: any;
};

const CommercialAdscom = () => {
  const MySwal = withReactContent(Swal);

  const [name, setName] = useState("");
  const [imageUrls, setImageUrls] = useState(Array(6).fill("")); // Array to hold image URLs
  const [location, setLocation] = useState("");
  const [ManufactureYear, setManufactureYear] = useState("");

  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [timeAgo, setTimeAgo] = useState<Date | null>(new Date());
  const [imageFiles, setImageFiles] = useState(Array(6).fill(null)); // Array to hold selected image files
  const [registeredCity, setRegisteredCity] = useState("Un-Registered");
  const [assembly, setAssembly] = useState("Imported");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [condition, setCondition] = useState("Used");
  const [purpose, setPurpose] = useState("Sell");
  const [PhoneNumber, setPhoneNumber] = useState("");

  const [model, setModel] = useState("2022");
  const [DrivenKm, setDrivenKm] = useState("");

  const [phone, setphone] = useState("03189391781");
  const [type, setType] = useState("Sale");
  const [selectedCity, setSelectedCity] = useState("");
  const [Registeredin, setRegisteredin] = useState("");
  const [TrustedCars, setTrustedCars] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedEngineType, setSelectedEngineType] = useState("");
  const [selectedEngineCapacity, setSelectedEngineCapacity] = useState("");
  const [selectedAssembly, setSelectedAssembly] = useState("");
  const [selectedBodyType, setSelectedBodyType] = useState("");
  const [selectedNumberOfDoors, setSelectedNumberOfDoors] = useState("");
  const [selectedSeatingCapacity, setSelectedSeatingCapacity] = useState("");
  const [selectedModalCategory, setSelectedModalCategory] = useState("");
  const [selectedSellerType, setSelectedSellerType] = useState("");
  const [selectedPictureAvailability, setSelectedPictureAvailability] =
    useState("");
  const [selectedVideoAvailability, setSelectedVideoAvailability] =
    useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [selectedAdType, setSelectedAdType] = useState("");
  const [ads, setAds] = useState<Ad[]>([]); // Define the type here as an array of 'Ad' objects
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [isOpen, setIsOpen] = useState(false);
  const [image, setimage] = useState<string | null>(null);
  console.log(image, "image____________");
  const closeModal = () => setIsOpen(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null); // Holds the selected ad
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsCollection = collection(db, "CommercialAdscom"); // Get reference to the 'Cars' collection
        const adsSnapshot = await getDocs(adsCollection); // Fetch the data

        const adsList: Ad[] = adsSnapshot.docs.map((doc) => {
          const data = doc.data() || {}; // Ensure data exists

          return {
            id: doc.id,
            link: data.link || "",
            timeAgo: data.timeAgo || "",
            title: data.title || "",
            description: data.description || "",
            location: data.location || "",
            img: data.img || "",
            Price: data.Price || "",
            Assembly: data.Assembly || "",
            BodyType: data.BodyType || "", // Fixed typo here
            Color: data.Color || "",
            DrivenKm: data.DrivenKm || "",
            EngineCapacity: data.EngineCapacity || "",
            City: data.City || "",
            PictureAvailability: data.PictureAvailability || "",
            EngineType: data.EngineType || "",
            ManufactureYear: data.ManufactureYear || "",
            ModalCategory: data.ModalCategory || "",
            CoNumberOfDoorsor: data.NumberOfDoors || "", // Ensure correct property name
            PhoneNumber: data.PhoneNumber || "",
            Registeredin: data.Registeredin || "",
            SeatingCapacity: data.SeatingCapacity || "",
            SellerType: data.SellerType || "",
            Transmission: data.Transmission || "",
            TrustedCars: data.TrustedCars || "",
            VideoAvailability: data.VideoAvailability || "",
            assembly: data.assembly || "",
            bodyType: data.bodyType || "",
            condition: data.condition || "",
            engineCapacity: data.engineCapacity || "",
            isFeatured: data.isFeatured || "",
            model: data.model || "",
            purpose: data.purpose || "",
            registeredCity: data.registeredCity || "",
            sellerType: data.sellerType || "",
            type: data.type || "",
            phone: data.phone || "",
            AdType: data.AdType || "",
            FuelType: data.FuelType || "",
            galleryImages: data.galleryImages || {},
            image: data.image || "",
            Title: data.Title || "",
          };
        });

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
          await deleteDoc(doc(db, "CommercialAdscom", ad.id)); // Delete document by id
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
  const handleEditClick = async (id: any) => {
    console.log(id, "WhatWhat");
    try {
      const adDoc = await getDoc(doc(db, "CommercialAdscom", id));
      if (adDoc.exists()) {
        const adData = adDoc.data();
        setDescription(adData.description);
        setTimeAgo(adData.timeAgo);
        setLocation(adData.location);
        setphone(adData.Price);

        // Ensure all required fields are present or provide defaults
        const selectedAd: Ad = {
          id,
          link: adData.link || "",
          timeAgo: adData.timeAgo || new Date().toISOString(),
          title: adData.title || "Untitled",
          description: adData.description || "No description",
          location: adData.location || "Unknown",
          img: adData.img || "",
          Price: adData.Price || "0",
          DrivenKm: adData.DrivenKm || "AdType",
          Assembly: adData.Assembly || "Assembly",
          City: adData.City || "City",
          Color: adData.Color || "Color",
          EngineCapacity: adData.EngineCapacity || "EngineCapacity",
          EngineType: adData.EngineType || "EngineType",
          ManufactureYear: adData.ManufactureYear || "ManufactureYear",
          ModalCategory: adData.ModalCategory || "ModalCategory",
          CoNumberOfDoorsor: adData.NumberOfDoors || "NumberOfDoors",
          PhoneNumber: adData.PhoneNumber || "PhoneNumber",
          PictureAvailability:
            adData.PictureAvailability || "PictureAvailability",
          Registeredin: adData.Registeredin || "Registeredin",
          SeatingCapacity: adData.SeatingCapacity || "SeatingCapacity",
          SellerType: adData.SellerType || "SellerType",
          Transmission: adData.Transmission || "Transmission",
          TrustedCars: adData.TrustedCars || "TrustedCars",
          VideoAvailability: adData.VideoAvailability || "VideoAvailability",
          assembly: adData.assembly || "assembly",
          bodyType: adData.bodyType || "bodyType",
          condition: adData.condition || "condition",
          engineCapacity: adData.engineCapacity || "engineCapacity",
          isFeatured: adData.isFeatured || "isFeatured",
          model: adData.model || "engineCapacity",
          purpose: adData.purpose || "purpose",
          registeredCity: adData.registeredCity || "registeredCity",
          sellerType: adData.sellerType || "sellerType",
          type: adData.type || "type",
          phone: adData.phone || "phone",
          AdType: adData.AdType || "AdType",
          FuelType: adData.FuelType || "FuelType",
          galleryImages: adData.galleryImages || "galleryImages",
          image: adData.image || "image",
          Title: adData.Title || "Title",
        };
        setDescription(selectedAd.description);
        setLink(selectedAd.link);
        setManufactureYear(selectedAd.ManufactureYear);
        setCondition(selectedAd.condition);
        setAssembly(selectedAd.assembly);
        setRegisteredCity(selectedAd.registeredCity);

        setDrivenKm(selectedAd.DrivenKm);
        setModel(selectedAd.model);
        setPhoneNumber(selectedAd.PhoneNumber);
        setPurpose(selectedAd.purpose);
        setType(selectedAd.type);

        setphone(selectedAd.Price);
        setLocation(selectedAd.location);
        setName(selectedAd.title);
        setSelectedAd(selectedAd.AdType);
        setTrustedCars(selectedAd.TrustedCars); // Pass a valid Ad object to setSelectedAd
        setSelectedCity(selectedAd.City); // Pass a valid Ad object to setSelectedAd
        setSelectedEngineType(selectedAd.EngineType); // Pass a valid Ad object to setSelectedAd
        setSelectedColor(selectedAd.Color); // Pass a valid Ad object to setSelectedAd
        setSelectedTransmission(selectedAd.Transmission); // Pass a valid Ad object to setSelectedAd

        setSelectedVideoAvailability(selectedAd.VideoAvailability); // Pass a valid Ad object to setSelectedAd
        setSelectedPictureAvailability(selectedAd.PictureAvailability); // Pass a valid Ad object to setSelectedAd
        setSelectedSellerType(selectedAd.sellerType); // Pass a valid Ad object to setSelectedAd
        setSelectedModalCategory(selectedAd.ModalCategory); // Pass a valid Ad object to setSelectedAd
        setSelectedSeatingCapacity(selectedAd.SeatingCapacity); // Pass a valid Ad object to setSelectedAd
        setSelectedNumberOfDoors(selectedAd.CoNumberOfDoorsor); // Pass a valid Ad object to setSelectedAd
        setSelectedBodyType(selectedAd.bodyType);
        setSelectedAssembly(selectedAd.assembly);
        setSelectedFuelType(selectedAd.FuelType);

        // Pass a valid Ad object to setSelectedAd
        setIsOpen(true);
      } else {
        console.error("No such document!");
      }
      setphone;
    } catch (error) {
      console.error("Error fetching ad by ID:", error);
    }
  };
  // const resetForm = () => {
  //   setLocation("");
  //   ("");
  //   setLink("");
  //   setDescription("");

  //   // setIsOpen(false);
  // };
  const resetForm = () => {
    setDescription("");
    setLink("");
    setManufactureYear("");
    setCondition("");
    setAssembly("");
    setTimeAgo(new Date());

    setRegisteredCity("");
    setDrivenKm("");
    setModel("");
    setPhoneNumber("");
    setPurpose("");
    setType("");
    setphone("");
    setLocation("");
    setName("");
    setSelectedAd(null); // Assuming it's an object or string
    setTrustedCars("");
    setSelectedCity("");
    setSelectedEngineType("");
    setSelectedColor("");
    setSelectedTransmission("");
    setSelectedVideoAvailability("");
    setSelectedPictureAvailability("");
    setSelectedSellerType("");
    setSelectedModalCategory("");
    setSelectedSeatingCapacity("");
    setSelectedNumberOfDoors("");
    setSelectedBodyType("");
    setSelectedAssembly("");
    setSelectedFuelType("");
  };

  // Call `resetForm` when you need to reset all fields

  const handleFuelTypeChange = (event: any) => {
    const fuelType = event.target.value;
    setSelectedFuelType(fuelType);
    console.log(fuelType); // Log selected fuel type to the console
  };
  const handleAdTypeChange = (event: any) => {
    const adType = event.target.value;
    setSelectedAdType(adType);
    console.log(adType); // Log selected ad type to the console
  };
  const handleVideoAvailabilityChange = (event: any) => {
    const videoAvailability = event.target.value;
    setSelectedVideoAvailability(videoAvailability);
    console.log(videoAvailability); // Log selected video availability to the console
  };
  const handlePictureAvailabilityChange = (event: any) => {
    const pictureAvailability = event.target.value;
    setSelectedPictureAvailability(pictureAvailability);
    console.log(pictureAvailability); // Log selected picture availability to the console
  };
  const handleSellerTypeChange = (event: any) => {
    const sellerType = event.target.value;
    setSelectedSellerType(sellerType);
    console.log(sellerType); // Log selected seller type to the console
  };

  const handleModalCategoryChange = (event: any) => {
    const modalCategory = event.target.value;
    setSelectedModalCategory(modalCategory);
    console.log(modalCategory); // Log selected modal category to the console
  };
  const handleSeatingCapacityChange = (event: any) => {
    const seatingCapacity = event.target.value;
    setSelectedSeatingCapacity(seatingCapacity);
    console.log(seatingCapacity); // Log selected seating capacity to the console
  };
  const handleNumberOfDoorsChange = (event: any) => {
    const numberOfDoors = event.target.value;
    setSelectedNumberOfDoors(numberOfDoors);
    console.log(numberOfDoors); // Log selected number of doors to the console
  };
  const handleBodyTypeChange = (event: any) => {
    const bodyType = event.target.value;
    setSelectedBodyType(bodyType);
    console.log(bodyType); // Log selected body type to the console
  };
  const handleAssemblyChange = (event: any) => {
    const assemblyType = event.target.value;
    setSelectedAssembly(assemblyType);
    console.log(assemblyType); // Log selected assembly type to the console
  };
  const handleEngineCapacityChange = (event: any) => {
    const engineCapacity = event.target.value;
    setSelectedEngineCapacity(engineCapacity);
    console.log(engineCapacity); // Log selected engine capacity to the console
  };
  const handleColorChange = (event: any) => {
    const color = event.target.value;
    setSelectedColor(color);
    console.log(color); // Log selected color to the console
  };

  const handleEngineTypeChange = (event: any) => {
    const engineType = event.target.value;
    setSelectedEngineType(engineType);
    console.log(engineType); // Log selected engine type to the console
  };
  const handleTransmissionChange = (event: any) => {
    const transmission = event.target.value;
    setSelectedTransmission(transmission);
    console.log(transmission); // Log selected transmission to the console
  };
  const handleTrustedCarChange = (event: any) => {
    const TrustedCars = event.target.value;
    setTrustedCars(TrustedCars);
    console.log(TrustedCars); // Log selected car brand to the console
  };
  const handleRegisteredinChange = (event: any) => {
    const setRegisteredinCity = event.target.value;
    setRegisteredin(setRegisteredinCity);
    console.log(setRegisteredinCity, "setRegisteredinCity"); // Log selected city to the console
  };
  const handleCityChange = (event: any) => {
    const city = event.target.value;
    setSelectedCity(city);
    console.log(city, "city___________"); // Log selected city to the console
  };
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleLocationChange = (event: any) => {
    const location = event.target.value;
    setSelectedLocation(location);
    console.log(location); // Log selected location to the console
  };
  const [selectedCarBrand, setSelectedCarBrand] = useState("");

  const handleCarBrandChange = (event: any) => {
    const carBrand = event.target.value;
    setSelectedCarBrand(carBrand);
    console.log(carBrand); // Log selected car brand to the console
  };
  // Handle image upload to Cloudinary
  const handleImageUpload = async (file: any, index: any) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");
    formData.append("cloud_name", "dv26wjoay");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dv26wjoay/image/upload",
        formData
      );
      const newImageUrls = [...imageUrls];
      newImageUrls[index] = response.data.secure_url; // Save the image URL from Cloudinary
      setImageUrls(newImageUrls);
      console.log("Image uploaded successfully:", response.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image.");
    }
  };

  // Handle file selection for images
  const handleFileChange = (index: any) => (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const newImageFiles = [...imageFiles];
      newImageFiles[index] = file;
      setImageFiles(newImageFiles);
      handleImageUpload(file, index); // Upload the selected file
    }
  };
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true); // Show spinner
        const carsCollectionRef = collection(db, "CommercialAdscom");
        const querySnapshot = await getDocs(carsCollectionRef);
        const carsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(carsData, "carsData_________");
      } catch (error) {
        console.error("Error getting cars:", error);
      }
    };

    fetchCars();
  }, []);

  const filteredAds = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by title
      ad.description.toLowerCase().includes(searchTerm.toLowerCase()) // Search by description
  );
  // Function to add a new car to Firestore
  const handleAddCar = async (e: any) => {
    e.preventDefault();

    if (!image) {
      alert("Please upload image before submitting.");
      return;
    }

    try {
      // Get a reference to the 'carData' collection
      const carsCollection = collection(db, "CommercialAdscom");

      // Add a new document to the 'carData' collection
      const docRef = await addDoc(carsCollection, {
        Title: name,
        Location: location,
        phone: phone,
        Link: link,
        timeAgo: (timeAgo ?? new Date()).toISOString(), // Use the current date if timeAgo is null
        image: image,
        ManufactureYear: ManufactureYear,
      });

      alert("Ads added successfully!");
      setIsOpen(false);
      setRefresh(!refresh);
      // Reset all fields
      // setName("");
      // setImageUrls(Array(6).fill("")); // Reset all image URLs
      // setImageFiles(Array(6).fill(null)); // Reset all image files
      // setLocation("");
      // setPhone("");
      // setLink("");
      // setDescription("");
      setTimeAgo(new Date()); // Reset time to current date
      //   setRegisteredCity("Un-Registered");
      //   setAssembly("");
      //   setCondition("");
      //   setPurpose("");
      //   setModel("");
      //   setphone("");
      //   setType("Sale");
    } catch (error) {
      console.error("Error adding car: ", error);
      alert("Error adding car.");
    }
  };

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [existingImageId, setExistingImageId] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleUpload = async () => {
    if (!selectedImage) {
      MySwal.fire({
        title: "Error!",
        text: "Please select an image first.",
        icon: "error",
        timer: 2000,
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("upload_preset", "ml_default"); // Replace with your actual preset
    formData.append("cloud_name", "dv26wjoay"); // Replace with your actual cloud name

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dv26wjoay/image/upload", // Your Cloudinary URL
        formData
      );
      const imageUrl = response.data.secure_url;
      console.log("Uploaded Image URL:", imageUrl);
      setimage(imageUrl);
      // Save or update image URL in Firestore
      const bannerImgRef = doc(
        db,
        "Bannermainimg",
        existingImageId || "defaultBannerImg"
      );
      //   await setDoc(bannerImgRef, { imageUrl, createdAt: new Date() });
      //   setExistingImageId("defaultBannerImg");

      MySwal.fire({
        title: "Added!",
        text: "Your listing has been added.",
        icon: "success",
        timer: 1000,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      MySwal.fire({
        title: "Error!",
        text: "Failed to upload image.",
        icon: "success",
        timer: 1000,
      });
    } finally {
      setUploading(false);
    }
  };
  return (
    <>
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
                phone
              </th>
              <th scope="col" className="px-6 py-3">
                Title
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
                    src={ad.image}
                    alt={ad.Title}
                  />
                  <div className="ps-3">
                    <div className="text-base font-semibold">{ad.Title}</div>
                    <div className="font-normal text-gray-500"></div>
                  </div>
                </th>
                <td className="px-6 py-4">{ad.phone}</td>
                <td className="px-6 py-4">{ad.Title}</td>
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

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="flex justify-center items-center min-h-screen py-8 px-4">
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mt-20 -mr-20 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -mb-10 -ml-10 blur-xl"></div>

                <button
                  onClick={closeModal}
                  className="absolute  top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 cursor-pointer transition-colors z-10"
                  aria-label="Close"
                >
                  <FiX className="mt-12 text-white w-5 h-5" />
                </button>

                <div className="flex items-center mb-2">
                  <div className="flex space-x-2 mr-3">
                    <FaCar className="text-white/90 h-6 w-6" />
                    <FaCarSide className="text-white/90 h-6 w-6" />
                  </div>
                  <h3 className="text-white text-2xl font-bold relative z-10">
                    Add a New Car Listing
                  </h3>
                </div>
                <p className="text-white/80 mt-1 relative z-10">
                  Fill in the details below to create your car listing
                </p>
              </div>

              {/* Form */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800">
                <form onSubmit={handleAddCar} className="space-y-6">
                  {/* Basic Information Section */}
                  <div className="bg-white dark:bg-gray-750 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                        <FiUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      Basic Information
                    </h4>

                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          <div className="flex items-center">
                            <FiUser className="mr-2 h-4 w-4 text-blue-500" />
                            Name
                          </div>
                        </label>
                        <input
                          type="text"
                          placeholder="Enter name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          <div className="flex items-center">
                            <FiPhone className="mr-2 h-4 w-4 text-blue-500" />
                            Phone
                          </div>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiPhone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="number"
                            placeholder="Enter Phone"
                            value={phone}
                            onChange={(e) => setphone(e.target.value)}
                            required
                            className="w-full pl-10 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="bg-white dark:bg-gray-750 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                        <FiImage className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      Upload Banner Image
                    </h4>

                    <div className="flex flex-col items-center">
                      {preview ? (
                        <div className="mb-4 w-full">
                          <div className="relative group">
                            <img
                              src={preview || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <label
                                htmlFor="banner-upload"
                                className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <FiUpload className="h-5 w-5 text-blue-600" />
                              </label>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="banner-upload"
                          className="flex flex-col items-center justify-center w-full h-48 cursor-pointer bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FiUpload className="h-10 w-10 text-gray-400 mb-3" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PNG, JPG or JPEG (MAX. 2MB)
                            </p>
                          </div>
                        </label>
                      )}

                      <input
                        id="banner-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading || !preview}
                        className={`mt-4 px-4 py-2.5 rounded-lg flex items-center justify-center transition-colors ${
                          uploading || !preview
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {uploading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <FiUpload className="mr-2 h-4 w-4" />
                            Upload Image
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-xl shadow-md hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
                  >
                    <FiCheck className="mr-2 h-5 w-5" />
                    Add Car Listing
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommercialAdscom;
