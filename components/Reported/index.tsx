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
} from "firebase/firestore";
import { MdEdit } from "react-icons/md";

// For date picker
import DatePicker, { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale"; // Import English locale
import "react-datepicker/dist/react-datepicker.css";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { RiDeleteBin5Line } from "react-icons/ri";

// Cloudinary upload
import axios from "axios";
import SPORTSGAMESReported from "../SPORTSGAMESReported";

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
  price: string;
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
  whatsapp: string;
  AdType: any;
  FuelType: any;
  galleryImages: any;
};
const Reported = () => {
  const MySwal = withReactContent(Swal);

  const [name, setName] = useState("");
  const [imageUrls, setImageUrls] = useState(Array(6).fill("")); // Array to hold image URLs
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [ManufactureYear, setManufactureYear] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");

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

  const [whatsapp, setWhatsapp] = useState("03189391781");
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
  const [selectedModalCategory, setSelectedModalCategory] = useState("");
  const [selectedSellerType, setSelectedSellerType] = useState("");
  const [Mileage, setMileage] = useState("");

  const [selectedPictureAvailability, setSelectedPictureAvailability] =
    useState("");
  const [selectedVideoAvailability, setSelectedVideoAvailability] =
    useState("");
  const [ads, setAds] = useState<Ad[]>([]); // Define the type here as an array of 'Ad' objects
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null); // Holds the selected ad

  const closeModal = () => setIsOpen(false);
  const [selectedAdType, setSelectedAdType] = useState("");
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsCollection = collection(db, "Cars"); // Get reference to the 'Cars' collection
        const adsSnapshot = await getDocs(adsCollection); // Fetch the data

        const adsList = adsSnapshot.docs.map((doc) => {
          const data = doc.data() || {}; // Ensure data exists

          return {
            id: doc.id,
            link: data.link || "",
            timeAgo: data.timeAgo || "",
            title: data.title || "",
            description: data.description || "",
            location: data.location || "",
            img: data.img || "",
            price: data.price || "",
            Assembly: data.Assembly || "",
            BodyType: data.BodyType || "",
            Color: data.Color || "",
            DrivenKm: data.DrivenKm || "",
            EngineCapacity: data.EngineCapacity || "",
            City: data.City || "",
            PictureAvailability: data.PictureAvailability || "",
            EngineType: data.EngineType || "",
            ManufactureYear: data.ManufactureYear || "",
            ModalCategory: data.ModalCategory || "",
            CoNumberOfDoorsor: data.NumberOfDoors || "",
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
            whatsapp: data.whatsapp || "",
            AdType: data.AdType || "",
            FuelType: data.FuelType || "",
            galleryImages: data.galleryImages || "",

            reportTypes: data.reportTypes || [], // Ensure reportTypes is included
          };
        });

        // Filter ads based on reportTypes
        const filteredAds = adsList.filter(
          (ad) =>
            ad.reportTypes &&
            ad.reportTypes.some((type: any) =>
              [
                "Sexual",
                "Illegal",
                "Abusive",
                "Harassment",
                "Fraud",
                "Spam",
              ].includes(type)
            )
        );

        console.log(filteredAds, "filteredAds___________filteredAds");

        setAds(filteredAds); // Set the state with the filtered ads data
        setLoading(false); // Stop loading when data is fetched
      } catch (error) {
        console.error("Error fetching ads:", error);
        setLoading(false);
      }
    };

    fetchAds();
  }, [refresh]);
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true); // Show spinner
        const carsCollectionRef = collection(db, "Cars");
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
    setPrice("");
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
    setSelectedNumberOfDoors("");
    setSelectedBodyType("");
    setSelectedAssembly("");
    setSelectedFuelType("");
  };
  const filteredAds = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) || // Search by title
      ad.description.toLowerCase().includes(searchTerm.toLowerCase()) // Search by description
  );
  const handleEditClick = async (id: any) => {
    console.log(id, "WhatWhat");
    try {
      const adDoc = await getDoc(doc(db, "Cars", id));
      if (adDoc.exists()) {
        const adData = adDoc.data();
        setDescription(adData.description);
        setTimeAgo(adData.timeAgo);
        setLocation(adData.location);
        setPrice(adData.price);

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
          whatsapp: adData.whatsapp || "whatsapp",
          AdType: adData.AdType || "AdType",
          FuelType: adData.FuelType || "FuelType",
          galleryImages: adData.galleryImages || "galleryImages",
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

        setPrice(selectedAd.price);
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
        setSelectedNumberOfDoors(selectedAd.CoNumberOfDoorsor); // Pass a valid Ad object to setSelectedAd
        setSelectedBodyType(selectedAd.bodyType);
        setSelectedAssembly(selectedAd.assembly);
        setSelectedFuelType(selectedAd.FuelType);

        // Pass a valid Ad object to setSelectedAd
        setIsOpen(true);
      } else {
        console.error("No such document!");
      }
      setPrice;
    } catch (error) {
      console.error("Error fetching ad by ID:", error);
    }
  };
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
          await deleteDoc(doc(db, "Cars", ad.id)); // Delete document by id
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
  const [selectedStates, setSelectedStates] = useState("");

  const handleLocationChange = (event: any) => {
    const location = event.target.value;
    setSelectedStates(location);
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
    formData.append("upload_preset", "duvddbfbf");
    formData.append("cloud_name", "duvddbfbf");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/duvddbfbf/image/upload",
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

  // Function to add a new car to Firestore
  const handleAddCar = async (e: any) => {
    e.preventDefault();

    // if (imageUrls.some((url) => !url)) {
    //   alert("Please upload all images before submitting.");
    //   return;
    // }

    try {
      // Get a reference to the 'carData' collection
      const carsCollection = collection(db, "Cars");

      // Add a new document to the 'carData' collection
      const docRef = await addDoc(carsCollection, {
        title: name,
        img: imageUrls[0], // img1
        img2: imageUrls[1], // img2
        img3: imageUrls[2], // img3
        img4: imageUrls[3], // img4
        img5: imageUrls[4], // img5
        img6: imageUrls[5], // img6
        location: location,
        price: price,
        link: link,
        FuelType: selectedFuelType,
        make: selectedCarBrand,
        timeAgo: (timeAgo ?? new Date()).toISOString(), // Use the current date if timeAgo is null
        States: selectedStates,
        description: description,
        sellerType: selectedSellerType,
        mileage: Mileage,
        registeredCity: registeredCity,
        assembly: assembly,
        engineCapacity: selectedEngineCapacity,
        bodyType: selectedBodyType,
        lastUpdated: lastUpdated.toISOString(),
        condition: condition,
        purpose: purpose,
        model: model,
        whatsapp: whatsapp,
        type: type,
        isFeatured: selectedAdType,
        VideoAvailability: selectedVideoAvailability,
        PictureAvailability: selectedPictureAvailability,
        AdType: selectedAdType,
        ModalCategory: selectedModalCategory,
        SellerType: selectedSellerType,
        Assembly: selectedAssembly,
        BodyType: selectedBodyType,
        Color: selectedColor,
        EngineType: selectedEngineType,
        EngineCapacity: selectedEngineCapacity,
        Registeredin: Registeredin,
        City: selectedCity,
        DrivenKm: DrivenKm,
        PhoneNumber: PhoneNumber,

        ManufactureYear: ManufactureYear,
      });

      alert("Car added successfully!");
      // Reset all fields
      // setName("");
      // setImageUrls(Array(6).fill("")); // Reset all image URLs
      // setImageFiles(Array(6).fill(null)); // Reset all image files
      // setLocation("");
      // setPrice("");
      // setLink("");
      // setDescription("");
      setTimeAgo(new Date()); // Reset time to current date
      //   setRegisteredCity("Un-Registered");
      //   setAssembly("");
      //   setCondition("");
      //   setPurpose("");
      //   setModel("");
      //   setWhatsapp("");
      //   setType("Sale");
    } catch (error) {
      console.error("Error adding car: ", error);
      alert("Error adding car.");
    }
  };
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div>
        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          <li className="me-2">
            <button
              onClick={() => setActiveTab(0)}
              className={`inline-block px-4 py-3 rounded-lg ${
                activeTab === 0
                  ? "text-white bg-blue-600"
                  : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
            >
              Cars Reported{" "}
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab(1)}
              className={`inline-block px-4 py-3 rounded-lg ${
                activeTab === 1
                  ? "text-white bg-blue-600"
                  : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
            >
              Sports and Games{" "}
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab(2)}
              className={`inline-block px-4 py-3 rounded-lg ${
                activeTab === 2
                  ? "text-white bg-blue-600"
                  : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
            >
              Tab 3
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab(3)}
              className={`inline-block px-4 py-3 rounded-lg ${
                activeTab === 3
                  ? "text-white bg-blue-600"
                  : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
            >
              Tab 4
            </button>
          </li>
          <li className="me-2">
            <button
              onClick={() => setActiveTab(4)}
              className={`inline-block px-4 py-3 rounded-lg ${
                activeTab === 4
                  ? "text-white bg-blue-600"
                  : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
              }`}
            >
              Tab 5
            </button>
          </li>
        </ul>
        <div className="p-4 mt-2 border rounded-lg bg-gray-100 dark:bg-gray-800">
          {activeTab === 0 && (
            <>
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
                      placeholder="Search for users"
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
                          <label
                            htmlFor="checkbox-all-search"
                            className="sr-only"
                          >
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
                            src={ad.galleryImages[0]}
                            alt={ad.title}
                          />
                          <div className="ps-3">
                            <div className="text-base font-semibold">
                              {ad.title}
                            </div>
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
              {isOpen && (
                <div
                  className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto"
                  style={{ marginTop: "-2%" }}
                >
                  <div
                    className="flex justify-center items-center h-full"
                    style={{ marginTop: "75%" }}
                  >
                    <div
                      className="relative w-full max-w-lg"
                      style={{ marginTop: "50%" }}
                    >
                      <button
                        onClick={closeModal}
                        className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
                      >
                        &times;
                      </button>
                      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h3 className="text-center text-2xl font-bold mb-4">
                          Add a New Bike Listing
                        </h3>
                        <form onSubmit={handleAddCar}>
                          {/* Name */}
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor="formName"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              placeholder="Enter name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>

                          {/* City Selection */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              City
                            </label>
                            <select
                              onChange={(e) => setSelectedCity(e.target.value)}
                              value={selectedCity}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option disabled value="">
                                Select City
                              </option>
                              <option value="America">America</option>
                              <option value="Bogotá">Bogotá</option>
                              <option value="Dubai">Dubai</option>
                              <option value="Tokyo">Tokyo</option>
                              <option value="Paris">Paris</option>
                            </select>
                          </div>

                          {/* Location Selection */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              States
                            </label>
                            <select
                              onChange={(e) =>
                                setSelectedStates(e.target.value)
                              }
                              value={selectedStates}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="">Select State</option>
                              <option value="California">California</option>
                              <option value="Texas">Texas</option>
                              <option value="Newyork">Newyork</option>
                              <option value="Florida">Florida</option>
                              <option value="Illinois">Illinois</option>
                            </select>
                          </div>

                          {/* Car Brand Selection */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Make
                            </label>
                            <select
                              onChange={(e) =>
                                setSelectedCarBrand(e.target.value)
                              }
                              value={selectedCarBrand}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option disabled value="">
                                Select Make
                              </option>
                              <option value="Trek Bicycle Corporation">
                                Trek Bicycle Corporation
                              </option>
                              <option value="Specialized Bicycle">
                                Specialized Bicycle
                              </option>
                              <option value="Cannondale">Cannondale</option>
                              <option value="Santa Cruz">Santa Cruz</option>
                              <option value="Huffy Corporation">
                                Huffy Corporation
                              </option>
                            </select>
                          </div>

                          {/* Price */}
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor="formPrice"
                            >
                              Price
                            </label>
                            <input
                              type="number"
                              placeholder="Enter price"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              required
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>

                          {/* Manufacture Year */}
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor="formManufactureYear"
                            >
                              Manufacture Year
                            </label>
                            <input
                              type="text"
                              placeholder="Enter Manufacture Year"
                              value={ManufactureYear}
                              onChange={(e) =>
                                setManufactureYear(e.target.value)
                              }
                              required
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>
                          {/* Manufacture Year */}
                          <div className="mb-4">
                            <label
                              className="block text-gray-700 text-sm font-bold mb-2"
                              htmlFor="Mileage"
                            >
                              Mileage{" "}
                            </label>
                            <input
                              type="text"
                              placeholder="Enter Mileage"
                              value={Mileage}
                              onChange={(e) => setMileage(e.target.value)}
                              required
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>
                          {/* Registered In */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Registered in
                            </label>
                            <select
                              onChange={(e) => setRegisteredin(e.target.value)}
                              value={Registeredin}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="" disabled>
                                Select Registered In
                              </option>
                              <option value="California">California</option>
                              <option value="Texas">Texas</option>
                              <option value="Newyork">Newyork</option>
                              <option value="Florida">Florida</option>
                              <option value="Illinios">Illinios</option>
                            </select>
                          </div>

                          {/* Color */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Color
                            </label>
                            <select
                              onChange={(e) => setSelectedColor(e.target.value)}
                              value={selectedColor}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="" disabled>
                                Select Color
                              </option>
                              <option value="White">White</option>
                              <option value="Black">Black</option>
                              <option value="Grey">Grey</option>
                              <option value="Red">Red</option>
                              <option value="Yellow">Yellow</option>
                              <option value="Blue">Blue</option>
                              <option value="Green">Green</option>
                              <option value="Silver">Silver</option>
                              <option value="Orange">Orange</option>
                              <option value="Purple">Purple</option>
                              <option value="Brown">Brown</option>
                              <option value="Pink">Pink</option>
                              <option value="Beige">Beige</option>
                              <option value="Maroon">Maroon</option>
                              <option value="Turquoise">Turquoise</option>
                            </select>
                          </div>

                          {/* Engine Type */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Engine Type
                            </label>
                            <select
                              onChange={(e) =>
                                setSelectedEngineType(e.target.value)
                              }
                              value={selectedEngineType}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="" disabled>
                                Select Engine Type
                              </option>
                              <option value="Single-Cylinder Engine">
                                Single-Cylinder Engine{" "}
                              </option>
                              <option value="Parallel-Twin Engine">
                                Parallel-Twin Engine
                              </option>
                              <option value="V-Twin Engine">
                                V-Twin Engine
                              </option>
                              <option value="Inline-Four Engine">
                                Inline-Four Engine{" "}
                              </option>
                              <option value="Boxer Engine">Boxer Engine</option>
                            </select>
                          </div>

                          {/* Engine Capacity */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Engine Capacity (cc)
                            </label>
                            <input
                              type="text"
                              placeholder="Enter Engine Capacity (cc)"
                              value={selectedEngineCapacity}
                              onChange={(e) =>
                                setSelectedEngineCapacity(e.target.value)
                              }
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>

                          {/* Assembly */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Assembly
                            </label>
                            <select
                              onChange={(e) =>
                                setSelectedAssembly(e.target.value)
                              }
                              value={selectedAssembly}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="" disabled>
                                Select Assembly
                              </option>
                              <option value="Local">Local</option>
                              <option value="Imported">Imported</option>
                            </select>
                          </div>

                          {/* Body Type */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Body Type
                            </label>
                            <select
                              onChange={(e) =>
                                setSelectedBodyType(e.target.value)
                              }
                              value={selectedBodyType}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="" disabled>
                                Select Body Type
                              </option>
                              <option value="Cruiser">Cruiser</option>
                              <option value="Sport Bike">Sport Bike</option>
                              <option value="Touring Bike">Touring Bike</option>
                              <option value="Dirt Bike">Dirt Bike</option>
                              <option value="Standard (Naked Bike)">
                                Standard (Naked Bike)
                              </option>
                            </select>
                          </div>

                          {/* Modal Category */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Modal Category
                            </label>
                            <select
                              onChange={(e) =>
                                setSelectedModalCategory(e.target.value)
                              }
                              value={selectedModalCategory}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="" disabled>
                                Select Modal Category
                              </option>
                              <option value="A-Class">A-Class (Compact)</option>
                              <option value="B-Class">
                                B-Class (Compact MPV)
                              </option>
                              <option value="C-Class">
                                C-Class (Compact Exe)
                              </option>
                              <option value="E-Class">
                                E-Class (Executive)
                              </option>
                              <option value="S-Class">S-Class (Luxury)</option>
                              <option value="CLA">CLA (Compact Coupe)</option>
                              <option value="CLS">CLS (Executive Coupe)</option>
                              <option value="GLA">GLA (Compact SUV)</option>
                              <option value="GLC">GLC (Luxury SUV)</option>
                              <option value="GLE">GLE (Luxury SUV)</option>
                              <option value="GLS">GLS (Full-Size SUV)</option>
                              <option value="G-Class">
                                G-Class (Off-Road SUV)
                              </option>
                              <option value="SLK">
                                SLK (Compact Roadster)
                              </option>
                              <option value="SLC">
                                SLC (Compact Roadster)
                              </option>
                              <option value="AMG GT">
                                AMG GT (Performance)
                              </option>
                              <option value="EQC">EQC (Electric SUV)</option>
                              <option value="EQS">
                                EQS (Electric Luxury Sedan)
                              </option>
                            </select>
                          </div>

                          {/* Seller Type */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Seller Type
                            </label>
                            <select
                              onChange={(e) =>
                                setSelectedSellerType(e.target.value)
                              }
                              value={selectedSellerType}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="" disabled>
                                Select Seller Type
                              </option>
                              <option value="Dealers">Dealers</option>
                              <option value="Individuals">Individuals</option>
                            </select>
                          </div>

                          {/* Picture Availability */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Picture Availability
                            </label>
                            <select
                              onChange={(e) =>
                                setSelectedPictureAvailability(e.target.value)
                              }
                              value={selectedPictureAvailability}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="" disabled>
                                Select Picture Availability
                              </option>
                              <option value="With Pictures">
                                With Pictures
                              </option>
                              <option value="Without Pictures">
                                Without Pictures
                              </option>
                            </select>
                          </div>

                          {/* Video Availability */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Video Availability
                            </label>
                            <select
                              onChange={(e) =>
                                setSelectedVideoAvailability(e.target.value)
                              }
                              value={selectedVideoAvailability}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="" disabled>
                                Select Video Availability
                              </option>
                              <option value="With Video">With Video</option>
                              <option value="Without Video">
                                Without Video
                              </option>
                            </select>
                          </div>

                          {/* Ad Type */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Ad Type
                            </label>
                            <select
                              onChange={(e) =>
                                setSelectedAdType(e.target.value)
                              }
                              value={selectedAdType}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="" disabled>
                                Select Ad Type
                              </option>
                              <option value="Featured Ad">Featured Ad</option>
                            </select>
                          </div>

                          {/* Image Uploads */}
                          {[...Array(6)].map((_, index) => (
                            <div className="mb-4" key={index}>
                              <label className="block text-gray-700 text-sm font-bold mb-2">{`Image Upload ${
                                index + 1
                              }`}</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange(index)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              />
                            </div>
                          ))}

                          {/* Location */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Location
                            </label>
                            <input
                              type="text"
                              placeholder="Enter location"
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              required
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>

                          {/* Link */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Link
                            </label>
                            <input
                              type="text"
                              placeholder="Enter link"
                              value={link}
                              onChange={(e) => setLink(e.target.value)}
                              required
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>

                          {/* Description */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Description
                            </label>
                            <textarea
                              rows={3}
                              placeholder="Enter description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              required
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Fuel Type
                            </label>
                            <select
                              onChange={handleFuelTypeChange}
                              value={selectedFuelType}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="" disabled>
                                Select Fuel Type
                              </option>
                              <option value="Petroleum">Petroleum</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          {/* Time Ago */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Time Ago (Date Posted)
                            </label>
                            <DatePicker
                              selected={timeAgo}
                              onChange={(date) => setTimeAgo(date)} // Works because state allows null
                              dateFormat="MMMM d, yyyy"
                              showYearDropdown
                              scrollableYearDropdown
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              required
                            />
                          </div>

                          {/* Registered City */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Registered City
                            </label>
                            <input
                              type="text"
                              placeholder="Enter registered city"
                              value={registeredCity}
                              onChange={(e) =>
                                setRegisteredCity(e.target.value)
                              }
                              required
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>

                          {/* Assembly */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Assembly
                            </label>
                            <select
                              onChange={(e) => setAssembly(e.target.value)}
                              value={assembly}
                              required
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="Imported">Imported</option>
                              <option value="Local">Local</option>
                            </select>
                          </div>

                          {/* Condition */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Condition
                            </label>
                            <select
                              onChange={(e) => setCondition(e.target.value)}
                              value={condition}
                              required
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="New">New</option>
                              <option value="Used">Used</option>
                            </select>
                          </div>

                          {/* Purpose */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Purpose
                            </label>
                            <select
                              onChange={(e) => setPurpose(e.target.value)}
                              value={purpose}
                              required
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="Sell">Sell</option>
                              <option value="Rent">Rent</option>
                            </select>
                          </div>

                          {/* Phone */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Phone
                            </label>
                            <input
                              type="text"
                              placeholder="Enter Phone Number"
                              value={PhoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              required
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>

                          {/* WhatsApp */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              WhatsApp
                            </label>
                            <input
                              type="number"
                              placeholder="Enter WhatsApp number"
                              value={whatsapp}
                              onChange={(e) => setWhatsapp(e.target.value)}
                              required
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>

                          {/* Driven KM */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Driven KM
                            </label>
                            <input
                              type="text"
                              placeholder="Enter Driven KMS"
                              value={DrivenKm}
                              onChange={(e) => setDrivenKm(e.target.value)}
                              required
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                          </div>

                          {/* Type */}
                          <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                              Type
                            </label>
                            <select
                              onChange={(e) => setType(e.target.value)}
                              value={type}
                              required
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              <option value="Sale">Sale</option>
                              <option value="Lease">Lease</option>
                            </select>
                          </div>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                          >
                            Add Listing
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {activeTab === 1 && (
            <>
              <SPORTSGAMESReported />
            </>
          )}
          {activeTab === 2 && <p>Content for Tab 3</p>}
          {activeTab === 3 && <p>Content for Tab 4</p>}
          {activeTab === 4 && <p>Content for Tab 5</p>}
        </div>
      </div>
    </>
  );
};

export default Reported;
