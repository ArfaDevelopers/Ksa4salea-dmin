"use client";
import React, { useEffect, useState } from "react";
import { db } from "../Firebase/FirebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

// For date picker
import DatePicker, { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale"; // Import English locale
import "react-datepicker/dist/react-datepicker.css";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { MdRemoveRedEye } from "react-icons/md";
import { DocumentData } from "firebase/firestore";
// Cloudinary upload
import axios from "axios";

// Register the English locale
registerLocale("en-US", enUS);
type Ad = {
  id: any; // Change from string to number
  link: string;
  timeAgo: string;
  isActive: boolean;
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
  whatsapp: string;
  AdType: any;
  FuelType: any;
  galleryImages: any;
  reportTypes: any;
};
const JOBBOARDPageReported = () => {
  const MySwal = withReactContent(Swal);

  const [name, setName] = useState("");
  const [imageUrls, setImageUrls] = useState(Array(6).fill("")); // Array to hold image URLs
  const [location, setLocation] = useState("");
  const [SalaryRange, setSalaryRange] = useState("");
  const [ManufactureYear, setManufactureYear] = useState("");
  const [SallaryFromRange, setSallaryFromRange] = useState("");
  const [SallaryToRange, serSallaryToRange] = useState("");

  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [timeAgo, setTimeAgo] = useState<Date | null>(new Date());
  const [imageFiles, setImageFiles] = useState(Array(6).fill(null)); // Array to hold selected image files
  const [assembly, setAssembly] = useState("Imported");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [jobdescription, setJobDescription] = useState("");

  const [model, setModel] = useState("2022");

  const [whatsapp, setWhatsapp] = useState("03189391781");
  const [Type, setType] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [Registeredin, setRegisteredin] = useState("");
  const [OperatingSystem, setOperatingSystem] = useState("");
  const [MeasurementRange, setMeasurementRange] = useState("");
  const [Features, setFeatures] = useState("");
  const [Accuracy, setAccuracy] = useState("");
  const [CuffSize, setCuffSize] = useState("");
  const [DisplayType, setDisplayType] = useState("");
  const [BatteryType, setBatteryType] = useState("");
  const [Compatibility, setCompatibility] = useState("");
  const [StorageCapacity, setStorageCapacity] = useState("");
  const [MeasurementUnits, setMeasurementUnits] = useState("");
  const [SpeedofMeasurement, setSpeedofMeasurement] = useState("");
  const [SellerType, setSellerType] = useState("");
  const [JobTitle, setJobTitle] = useState("");

  const [ScreenSize, setScreenSize] = useState("");

  const [Processor, setProcessor] = useState("");
  const [RAM, setRAM] = useState("");
  const [StorageType, setStorageType] = useState("");
  const [Storagecapacity, setStoragecapacity] = useState("");
  const [GraphicsCard, setGraphicsCard] = useState("");
  const [BatteryLife, setBatteryLife] = useState("");
  const [DisplayQuality, setDisplayQuality] = useState("");
  const [Connectivity, setConnectivity] = useState("");
  const [SpecialFeatures, setSpecialFeatures] = useState("");

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
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null); // Holds the selected ad
  const [refresh, setRefresh] = useState(false);

  console.log(OperatingSystem, "OperatingSystem_______"); // Log selected ad type to the console
  const [isOpen, setIsOpen] = useState(false);

  const [selectedPictureAvailability, setSelectedPictureAvailability] =
    useState("");
  const [selectedVideoAvailability, setSelectedVideoAvailability] =
    useState("");
  const [selectedAdType, setSelectedAdType] = useState("");
  const [ads, setAds] = useState<Ad[]>([]); // Define the type here as an array of 'Ad' objects
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<DocumentData | null>(null);
  const [selectedOption, setSelectedOption] = useState("All");
  const [activeCheckboxes, setActiveCheckboxes] = useState<{
    [key: number]: boolean;
  }>({});

  const handleToggle = (id: number) => {
    setActiveCheckboxes((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      if (newState[id]) {
        console.log("Checked Ad ID:", id);
      }
      return newState;
    });
  };
  const handleFirebaseToggle = async (id: string, currentState: boolean) => {
    const docRef = doc(db, "JOBBOARD", id);
    try {
      await updateDoc(docRef, {
        isActive: !currentState,
      });
      MySwal.fire({
        title: "Status Changed!",
        text: `Status updated to: ${
          !currentState === true ? "Banned" : "Activated"
        }`,
        icon: "success",
        timer: 1000,
      });
      setRefresh(!refresh);
      console.log(`isActive updated to: ${!currentState}`);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };
  const handleCheckboxChange = (option: string) => {
    if (option === "Paid") {
      setSelectedOption("Featured Ads");
      console.log("Filtering: Featured Ads");
    } else if (option === "Unpaid") {
      setSelectedOption("Not Featured Ads");
      console.log("Filtering: Not Featured Ads");
    } else {
      setSelectedOption("All");
      console.log("Filtering: All Ads");
    }
  };
  const handleRevertClick = async (id: string) => {
    try {
      const adsCollection = collection(db, "JOBBOARD");
      const docRef = doc(adsCollection, id); // Fetching ad by ID

      // Fetch existing document
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setModalData(docSnapshot.data() as DocumentData); // Explicitly define the type
        setModalOpen(true); // Open modal
      } else {
        console.log("Document does not exist.");
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setModalData(null);
  };
  const resetForm = () => {
    setDescription("");
    setLink("");
    setManufactureYear("");
    setAssembly("");
    setTimeAgo(new Date());

    setModel("");
    setPhoneNumber("");
    setType("");
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
  };
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsCollection = collection(db, "JOBBOARD"); // Get reference to the 'Cars' collection
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
            whatsapp: data.whatsapp || "",
            AdType: data.AdType || "",
            FuelType: data.FuelType || "",
            galleryImages: data.galleryImages || "",
            reportTypes: data.reportTypes || "",
            isActive: data.isActive || "",
          };
        });
        const filteredAds = adsList.filter((ad) => {
          // Ensure reportTypes is an array
          const reportTypes = Array.isArray(ad.reportTypes)
            ? ad.reportTypes
            : ad.reportTypes
            ? [ad.reportTypes]
            : [];

          return reportTypes.some((type) =>
            ["Sexual", "Illegal", "Abusive", "Harassment", "Fraud", "Spam"]
              .map((type) => type.trim().toLowerCase()) // Normalize types to lowercase and trim
              .includes(type.trim().toLowerCase())
          );
        });

        console.log(adsList, "adsList___________adsList");

        setAds(filteredAds); // Set the state with the ads data
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
        const carsCollectionRef = collection(db, "JOBBOARD");
        const querySnapshot = await getDocs(carsCollectionRef);
        const carsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(carsData, "carsData_________JOBBOARD");
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
          await deleteDoc(doc(db, "JOBBOARD", ad.id)); // Delete document by id
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
      const adDoc = await getDoc(doc(db, "JOBBOARD", id));
      if (adDoc.exists()) {
        const adData = adDoc.data();
        setDescription(adData.description);
        setTimeAgo(adData.timeAgo);
        setLocation(adData.location);

        // Ensure all required fields are present or provide defaults
        const selectedAd: Ad = {
          id,
          link: adData.link || "",
          timeAgo: adData.timeAgo || new Date().toISOString(),
          title: adData.title || "Untitled",
          description: adData.description || "No description",
          location: adData.location || "Unknown",
          img: adData.img || "",
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
          galleryImages: adData.FuelType || "galleryImages",
          reportTypes: adData.reportTypes || "reportTypes",
          isActive: adData.isActive || "isActive",

          Price: "",
          DrivenKm: undefined,
        };
        setDescription(selectedAd.description);
        setLink(selectedAd.link);
        setManufactureYear(selectedAd.ManufactureYear);
        // setCondition(selectedAd.condition);
        setAssembly(selectedAd.assembly);
        // setRegisteredCity(selectedAd.registeredCity);

        // setDrivenKm(selectedAd.DrivenKm);
        setModel(selectedAd.model);
        setPhoneNumber(selectedAd.PhoneNumber);
        // setPurpose(selectedAd.purpose);
        setType(selectedAd.type);

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
        // setSelectedFuelType(selectedAd.FuelType);

        // Pass a valid Ad object to setSelectedAd
        setIsOpen(true);
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error fetching ad by ID:", error);
    }
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
  const [Protective, setProtective] = useState("");
  const [Vaccinated, setVaccinated] = useState("");

  const handleLocationChange = (event: any) => {
    const location = event.target.value;
    setSelectedStates(location);
    console.log(location); // Log selected location to the console
  };
  const [selectedCarBrand, setSelectedCarBrand] = useState("");
  const [JobType, setJobType] = useState("");
  const [Company, setCompany] = useState("");
  const [EmploymentType, setEmploymentType] = useState("");
  const [ExperienceLevel, setExperienceLevel] = useState("");
  const [Industry, setIndustry] = useState("");
  const [RequiredSkills, setRequiredSkills] = useState("");
  const closeModal = () => setIsOpen(false);

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

  // Function to add a new car to Firestore
  const handleAddCar = async (e: any) => {
    e.preventDefault();

    // if (imageUrls.some((url) => !url)) {
    //   alert("Please upload all images before submitting.");
    //   return;
    // }

    try {
      // Get a reference to the 'carData' collection
      const carsCollection = collection(db, "JOBBOARD");

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
        SalaryRange: SalaryRange,
        SallaryFromRange: SallaryFromRange,
        SallaryToRange: SallaryToRange,
        JobType: JobType,
        JobTitle: JobTitle,
        Industry: Industry,
        Brand: selectedCarBrand,
        jobdescription: jobdescription,
        Vaccinated: Vaccinated,
        Accuracy: Accuracy,
        EmploymentType: EmploymentType,
        StorageCapacity: StorageCapacity,
        SpeedofMeasurement: SpeedofMeasurement,
        Features: Features,
        CuffSize: CuffSize,
        MeasurementRange: MeasurementRange,
        BatteryLife: BatteryLife,
        Protective: Protective,
        RequiredSkills: RequiredSkills,
        StorageType: StorageType,
        Company: Company,
        ExperienceLevel: ExperienceLevel,
        Storagecapacity: Storagecapacity,
        GraphicsCard: GraphicsCard,
        DisplayQuality: DisplayQuality,
        Connectivity: Connectivity,
        SpecialFeatures: SpecialFeatures,
        BatteryType: BatteryType,
        DisplayType: DisplayType,
        MeasurementUnits: MeasurementUnits,
        Compatibility: Compatibility,
        SellerType: SellerType,
        link: link,
        timeAgo: (timeAgo ?? new Date()).toISOString(), // Use the current date if timeAgo is null
        States: selectedStates,
        description: description,
        sellerType: selectedSellerType,
        engineCapacity: selectedEngineCapacity,
        bodyType: selectedBodyType,
        lastUpdated: lastUpdated.toISOString(),
        model: model,
        whatsapp: whatsapp,
        Type: Type,
        AdType: selectedAdType,
        BodyType: selectedBodyType,
        City: selectedCity,
        PhoneNumber: PhoneNumber,

        ManufactureYear: ManufactureYear,
      });

      alert("Car added successfully!");
      // Reset all fields
      // setName("");
      // setImageUrls(Array(6).fill("")); // Reset all image URLs
      // setImageFiles(Array(6).fill(null)); // Reset all image files
      // setLocation("");
      // setSalaryRange("");
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

  return (
    <>
      {/* <button
        onClick={() => {
          setIsOpen(true);
          setSelectedAd(null);

          resetForm();
        }}
        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 mb-6"
      >
        Add New
      </button> */}
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
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredAds.length > 0 ? (
              filteredAds.map((ad) => (
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
                      <div className="text-base font-semibold">{ad.title}</div>
                      <div className="font-normal text-gray-500"></div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{ad.description}</td>
                  <td className="px-6 py-4">
                    {" "}
                    <input
                      type="checkbox"
                      checked={ad.isActive}
                      onChange={() => {
                        handleToggle(ad.id); // Toggle UI state
                        handleFirebaseToggle(ad.id, !!activeCheckboxes[ad.id]); // Update Firestore
                      }}
                    />
                  </td>{" "}
                  <td className="px-6 py-4">{ad.Price}</td>
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
                      onClick={() => handleEditClick(ad.id)}
                      className="text-blue-600 dark:text-blue-500 hover:text-blue-700 ml-3"
                      title="Edit"
                    >
                      <MdEdit size={20} style={{ color: "green" }} />
                    </button>
                    <button
                      onClick={() => handleRevertClick(ad.id)}
                      className="text-blue-600 dark:text-blue-500 hover:text-blue-700 ml-3"
                      title="View and Revert"
                    >
                      <MdRemoveRedEye size={20} style={{ color: "green" }} />
                    </button>
                    {modalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white p-5 rounded-lg shadow-lg w-96">
                          <h2 className="text-lg font-semibold mb-3">
                            Ad Details
                          </h2>

                          {/* Display Data */}
                          {modalData ? (
                            <div>
                              <p>
                                <strong>Id:</strong> {modalData.userId || "N/A"}
                              </p>

                              {/* Display Report Types */}
                              {modalData.reportTypes &&
                              modalData.reportTypes.length > 0 ? (
                                <div>
                                  <strong>Report Types:</strong>
                                  <ul className="list-disc ml-4">
                                    {modalData.reportTypes.map(
                                      (report: string, index: number) => (
                                        <li key={index}>{report}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              ) : (
                                <p>
                                  <strong>Report Types:</strong> N/A
                                </p>
                              )}
                            </div>
                          ) : (
                            <p>Loading...</p>
                          )}

                          {/* Bottom Button */}
                          <button
                            onClick={handleClose}
                            className="bg-red-500 text-white px-4 py-2 mt-4 w-full rounded hover:bg-red-600"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No reported data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
                {selectedAd ? "Update a Jobboard" : "Add a Jobboard"}
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
                    onChange={(e) => setSelectedStates(e.target.value)}
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
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Protective
                  </label>
                  <select
                    onChange={(e) => setProtective(e.target.value)}
                    value={Protective}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select Protective</option>
                    <option value="Protective">Protective</option>
                    <option value="Not Protective">Not Protective</option>
                    <option value="Newyork">Newyork</option>
                    <option value="Florida">Florida</option>
                    <option value="Illinois">Illinois</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Vaccinated
                  </label>
                  <select
                    onChange={(e) => setVaccinated(e.target.value)}
                    value={Vaccinated}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select Vaccinated</option>
                    <option value="Vaccinated">Vaccinated</option>
                    <option value="Not Vaccinated">Not Vaccinated</option>
                  </select>
                </div>

                {/* Car Brand Selection */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Job Title
                  </label>
                  <select
                    onChange={(e) => setJobTitle(e.target.value)}
                    value={JobTitle}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option disabled value="">
                      Job Title
                    </option>
                    <option value="Full Stack ">Full Stack</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Front-end Developer">
                      Front-end Developer
                    </option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                  </select>
                </div>

                {/* SalaryRange */}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="formSalaryRange"
                  >
                    Expected Salary Range
                  </label>
                  <input
                    type="number"
                    placeholder="Enter SalaryRange"
                    value={SalaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="formSalaryRange"
                  >
                    Sallary From Range
                  </label>
                  <input
                    type="number"
                    placeholder="Enter SalaryRange"
                    value={SallaryFromRange}
                    onChange={(e) => setSallaryFromRange(e.target.value)}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="formSalaryRange"
                  >
                    Sallary To Range
                  </label>
                  <input
                    type="number"
                    placeholder="Enter SalaryRange"
                    value={SallaryToRange}
                    onChange={(e) => serSallaryToRange(e.target.value)}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Job Type
                  </label>
                  <select
                    onChange={(e) => setJobType(e.target.value)}
                    value={JobType}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option disabled value="">
                      Select Job Type
                    </option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Company
                  </label>
                  <select
                    onChange={(e) => setCompany(e.target.value)}
                    value={Company}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option disabled value="">
                      Select Company
                    </option>
                    <option value="Google">Google</option>
                    <option value="Microsoft">Microsoft</option>
                    <option value="Apple">Apple</option>

                    <option value="Amazon">Amazon</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Employment Type
                  </label>
                  <select
                    onChange={(e) => setEmploymentType(e.target.value)}
                    value={EmploymentType}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option disabled value="">
                      Employment Type
                    </option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Temporary">Temporary</option>

                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Experience Level
                  </label>

                  <select
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    value={ExperienceLevel}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option disabled value="">
                      Experience Level
                    </option>
                    <option value="Entry-level">Entry-level</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior-level">Senior-level</option>

                    <option value="Executive">Executive</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Industry
                  </label>

                  <select
                    onChange={(e) => setIndustry(e.target.value)}
                    value={Industry}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option disabled value="">
                      Industry
                    </option>
                    <option value="Finance">Finance</option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="Education">Education</option>

                    <option value="Consulting">Consulting</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Required Skills
                  </label>

                  <select
                    onChange={(e) => setRequiredSkills(e.target.value)}
                    value={RequiredSkills}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option disabled value="">
                      Required Skills
                    </option>
                    <option value="Programming Languages">
                      Programming Languages
                    </option>
                    <option value="Frameworks/Tools">Frameworks/Tools</option>
                    <option value="Databases">Databases</option>

                    <option value="Soft Skills">Soft Skills</option>
                  </select>
                </div>
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

                {/* Time Ago */}
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Time Ago (Date Posted)
                  </label>
                  <DatePicker
                    selected={timeAgo} // Pass the state as the selected value.
                    onChange={(date: Date | null) => setTimeAgo(date)} // Update state when a new date is selected.
                    dateFormat="MMMM d, yyyy"
                    showYearDropdown
                    scrollableYearDropdown
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
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
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Job Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter description"
                    value={jobdescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
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
      )}
    </>
  );
};

export default JOBBOARDPageReported;
