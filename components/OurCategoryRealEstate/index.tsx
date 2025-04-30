"use client";
import React, { useEffect, useState } from "react";
import { db } from "../Firebase/FirebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

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
import Select from "react-select";

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
  phone: string;
  AdType: any;
  FuelType: any;
  galleryImages: any;
  image: any;
  Title: any;
};

const OurCategoryRealEstate = () => {
  const MySwal = withReactContent(Swal);

  const [name, setName] = useState("");
  const [_id, setId] = useState("");

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
  const options = [
    { label: "Automotive", value: "Automotive" },
    { label: "Electronics", value: "Electronics" },
    { label: "Fashion Style", value: "Fashion Style" },
    { label: "Health Care", value: "Health Care" },
    { label: "Job Board", value: "Job Board" },
    { label: "Education", value: "Education" },
    { label: "Real Estate", value: "Real Estate" },
    { label: "Travel", value: "Travel" },
    { label: "Sports & Game", value: "Sports & Game" },
    { label: "Magazines", value: "Magazines" },
    { label: "Pet & Animal", value: "Pet & Animal" },
    { label: "House Hold", value: "House Hold" },
  ];

  const handleChange = (selectedOption: any) => {
    setName(selectedOption?.value || "");
    console.log("Selected:", selectedOption?.value);
  };

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsCollection = collection(db, "OurCategoryRealEstateAutomative"); // Get reference to the 'Cars' collection
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
            price: data.price || "",
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
          await deleteDoc(doc(db, "OurCategoryRealEstateAutomative", ad.id)); // Delete document by id
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
  const handleAddCarUpdatedd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!_id) {
      alert("Please upload item before submitting.");
      return;
    }

    try {
      const carDocRef = doc(db, "OurCategoryRealEstateAutomative", _id); // _id is accessible from closure
      await updateDoc(carDocRef, {
        Title: name,
        Location: location,
        Link: link,
        timeAgo: (timeAgo instanceof Date ? timeAgo : new Date()).toISOString(),
        image: image,
        ManufactureYear: ManufactureYear,
      });
      setRefresh(!refresh);
      alert("Car updated successfully!");
    } catch (error) {
      console.error("Error updating car:", error);
      alert("Failed to update car.");
    }
  };

  const handleEditClick = async (ad: any) => {
    console.log(ad, "WhatWhat");
    setId(ad.id);

    try {
      const adDoc = await getDoc(
        doc(db, "OurCategoryRealEstateAutomative", ad.id)
      );
      if (adDoc.exists()) {
        const adData = adDoc.data();
        setDescription(adData.description);
        setTimeAgo(adData.timeAgo);
        setLocation(adData.location);
        setphone(adData.price);
        setPreview(ad.image);
        setimage(ad.image);

        setName(ad.Title);
        // Ensure all required fields are present or provide defaults
        const selectedAd: Ad = {
          id: ad.id,
          link: adData.link || "",
          timeAgo: adData.timeAgo || new Date().toISOString(),
          title: adData.title,
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

        setphone(selectedAd.price);
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
        const carsCollectionRef = collection(
          db,
          "OurCategoryRealEstateAutomative"
        );
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
      const carsCollection = collection(db, "OurCategoryRealEstateAutomative");

      // Add a new document to the 'carData' collection
      const docRef = await addDoc(carsCollection, {
        Title: name,
        Location: location,
        // phone: phone,
        Link: link,
        // timeAgo: (timeAgo ?? new Date()).toISOString(),
        timeAgo: (timeAgo instanceof Date ? timeAgo : new Date()).toISOString(),

        // Use the current date if timeAgo is null
        image: image,
        ManufactureYear: ManufactureYear,
      });

      alert("Ads added successfully!");
      setIsOpen(false);
      setRefresh(!refresh);

      setTimeAgo(new Date()); // Reset time to current date
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
        disabled={filteredAds.length > 0}
        onClick={() => {
          setIsOpen(true);
          setSelectedAd(null);
          setId("");
          setName("");
          setimage("");
          setPreview("");
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
              {/* <th scope="col" className="px-6 py-3">
                phone
              </th> */}
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
                {/* <td className="px-6 py-4">{ad.phone}</td> */}
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
                    onClick={() => handleEditClick(ad)} // Fetch the ad by ID and open modal
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto">
          <div
            className="flex justify-center items-center h-full"
            style={{ marginTop: "4%" }}
          >
            <div
              className="relative w-full max-w-lg"
              style={{ marginTop: "0%" }}
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              >
                &times;
              </button>
              <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h3 className="text-center text-2xl font-bold mb-4">
                  Add a Our Category Listing
                </h3>
                <form onSubmit={_id ? handleAddCarUpdatedd : handleAddCar}>
                  {/* Name */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="formName"
                    >
                      Our Category Title
                    </label>
                    <div className="w-full max-w-sm">
                      <input
                        type="text"
                        placeholder="Enter Our Category Title"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>

                  {/* Price */}
                  {/* <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="formPrice"
                    >
                      Phone
                    </label>
                    <input
                      type="number"
                      placeholder="Enter Phone"
                      value={phone}
                      onChange={(e) => setphone(e.target.value)}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div> */}

                  <div className="p-4 border rounded-lg shadow-md bg-white w-96 mx-auto text-center">
                    <h2 className="text-lg font-semibold mb-4">
                      Upload Our Category images for Home Screen
                    </h2>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mb-4"
                    />
                    {preview && (
                      <div className="mb-4">
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <button
                      onClick={handleUpload}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload Image"}
                    </button>
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
              {/* </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OurCategoryRealEstate;
