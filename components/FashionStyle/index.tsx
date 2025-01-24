"use client";
import React, { useState } from "react";
import { db } from "../Firebase/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";

// For date picker
import DatePicker, { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale"; // Import English locale
import "react-datepicker/dist/react-datepicker.css";

// Cloudinary upload
import axios from "axios";

// Register the English locale
registerLocale("en-US", enUS);

const FashionStyle = () => {
  const [name, setName] = useState("");
  const [imageUrls, setImageUrls] = useState(Array(6).fill("")); // Array to hold image URLs
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [ManufactureYear, setManufactureYear] = useState("");

  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [timeAgo, setTimeAgo] = useState<Date | null>(new Date());
  const [imageFiles, setImageFiles] = useState(Array(6).fill(null)); // Array to hold selected image files
  const [assembly, setAssembly] = useState("Imported");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [PhoneNumber, setPhoneNumber] = useState("");

  const [model, setModel] = useState("2022");

  const [whatsapp, setWhatsapp] = useState("03189391781");
  const [type, setType] = useState("Sale");
  const [selectedCity, setSelectedCity] = useState("");
  const [Registeredin, setRegisteredin] = useState("");
  const [OperatingSystem, setOperatingSystem] = useState("");
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
  console.log(OperatingSystem, "OperatingSystem_______"); // Log selected ad type to the console

  const [selectedPictureAvailability, setSelectedPictureAvailability] =
    useState("");
  const [selectedVideoAvailability, setSelectedVideoAvailability] =
    useState("");
  const [selectedAdType, setSelectedAdType] = useState("");

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
      const carsCollection = collection(db, "ELECTRONICS");

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
        OperatingSystem: OperatingSystem,
        ScreenSize: ScreenSize,
        Processor: Processor,
        RAM: RAM,
        BatteryLife: BatteryLife,
        StorageType: StorageType,
        Storagecapacity: Storagecapacity,
        GraphicsCard: GraphicsCard,
        DisplayQuality: DisplayQuality,
        Connectivity: Connectivity,
        SpecialFeatures: SpecialFeatures,
        link: link,
        Brand: selectedCarBrand,
        timeAgo: (timeAgo ?? new Date()).toISOString(), // Use the current date if timeAgo is null
        States: selectedStates,
        description: description,
        sellerType: selectedSellerType,
        engineCapacity: selectedEngineCapacity,
        bodyType: selectedBodyType,
        lastUpdated: lastUpdated.toISOString(),
        model: model,
        whatsapp: whatsapp,
        type: type,
        isFeatured: selectedAdType,
        VideoAvailability: selectedVideoAvailability,
        PictureAvailability: selectedPictureAvailability,
        AdType: selectedAdType,
         SellerType: selectedSellerType,
        Assembly: selectedAssembly,
        BodyType: selectedBodyType,
        EngineType: selectedEngineType,
        EngineCapacity: selectedEngineCapacity,
        Registeredin: Registeredin,
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

  return (
    <div className="container mx-auto my-5">
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h3 className="text-center text-2xl font-bold mb-4">
              Add a New Car Listing
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

              {/* Car Brand Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Brand
                </label>
                <select
                  onChange={(e) => setSelectedCarBrand(e.target.value)}
                  value={selectedCarBrand}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option disabled value="">
                    Select Make
                  </option>
                  <option value="Dell">Dell</option>
                  <option value="HP">HP</option>
                  <option value="Apple">Apple</option>
                  <option value="Lenovo">Lenovo</option>
                  <option value="ASUS">ASUS</option>
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
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Operating System
                </label>
                <select
                  onChange={(e) => setOperatingSystem(e.target.value)}
                  value={OperatingSystem}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    OperatingSystem
                  </option>
                  <option value="Windows">Windows</option>
                  <option value="macOS">macOS</option>
                  <option value="Chrome">Chrome</option>
                  <option value="OS">OS</option>
                  <option value="Linus">Linus</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Screen Size{" "}
                </label>
                <select
                  onChange={(e) => setScreenSize(e.target.value)}
                  value={ScreenSize}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Screen Size
                  </option>
                  <option value="11-inch">11-inch</option>
                  <option value="13-inch">13-inch</option>
                  <option value="14-inch">14-inch</option>
                  <option value="15-inch">15-inch</option>
                  <option value="17-inch">17-inch</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Processor (CPU){" "}
                </label>
                <select
                  onChange={(e) => setProcessor(e.target.value)}
                  value={Processor}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Processor (CPU)
                  </option>
                  <option value="Intel Core i3, i5, i7, i9">
                    Intel Core i3, i5, i7, i9
                  </option>
                  <option value="AMD Ryzen 3, 5, 7, 9">
                    AMD Ryzen 3, 5, 7, 9
                  </option>
                  <option value="Apple M1">Apple M1</option>
                  <option value="Apple M2">Apple M2</option>
                  <option value="Apple M3">Apple M3</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  RAM{" "}
                </label>
                <select
                  onChange={(e) => setRAM(e.target.value)}
                  value={RAM}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    RAM
                  </option>
                  <option value="4GB">4GB</option>
                  <option value="8GB">8GB</option>
                  <option value="16GB">16GB</option>
                  <option value="32GB">32GB</option>
                  <option value="64GB">64GB</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Storage Type{" "}
                </label>
                <select
                  onChange={(e) => setStorageType(e.target.value)}
                  value={StorageType}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Storage Type
                  </option>
                  <option value="SSD (Solid State Drive)">
                    SSD (Solid State Drive)
                  </option>
                  <option value="HDD (Hard Disk Drive)">
                    HDD (Hard Disk Drive)
                  </option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Storage capacity{" "}
                </label>
                <select
                  onChange={(e) => setStoragecapacity(e.target.value)}
                  value={Storagecapacity}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Storage capacity
                  </option>
                  <option value="256GB">256GB</option>
                  <option value="512GB">512GB</option>
                  <option value="1TB">1TB</option>
                  <option value="2TB">2TB</option>
                  <option value="2TB">2TB</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Graphics Card{" "}
                </label>
                <select
                  onChange={(e) => setGraphicsCard(e.target.value)}
                  value={GraphicsCard}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Graphics Card
                  </option>
                  <option value="Intel">Intel</option>
                  <option value="UHD">UHD</option>
                  <option value="AMD Radeon">AMD Radeon</option>
                  <option value="NVIDIA GeForce GTX">NVIDIA GeForce GTX</option>
                  <option value="RTX">RTX</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Battery Life{" "}
                </label>
                <select
                  onChange={(e) => setBatteryLife(e.target.value)}
                  value={BatteryLife}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Battery Life
                  </option>
                  <option value="5 hours">5 hours</option>
                  <option value="5-8 hours">5-8 hours</option>
                  <option value="8-12 hours">8-12 hours</option>
                  <option value="12 hours">12 hours</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Connectivity{" "}
                </label>
                <select
                  onChange={(e) => setConnectivity(e.target.value)}
                  value={Connectivity}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Connectivity
                  </option>
                  <option value="Wi-Fi 5">Wi-Fi 5</option>
                  <option value="Wi-Fi 6">Wi-Fi 6</option>
                  <option value="Bluetooth 4.0">Bluetooth 4.0</option>
                  <option value="Bluetooth 5.0">Bluetooth 5.0</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Display Quality{" "}
                </label>
                <select
                  onChange={(e) => setDisplayQuality(e.target.value)}
                  value={DisplayQuality}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Display Quality
                  </option>
                  <option value="Full HD">Full HD</option>
                  <option value="Retina Display">Retina Display</option>
                  <option value="Touchscreen">Touchscreen</option>
                  <option value="OLED">OLED</option>
                  <option value="IPS">IPS</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Special Features{" "}
                </label>
                <select
                  onChange={(e) => setSpecialFeatures(e.target.value)}
                  value={SpecialFeatures}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Special Features
                  </option>
                  <option value="Convertible">Convertible</option>
                  <option value="Backlit keyboard">Backlit keyboard</option>
                  <option value="Fingerprint scanner">
                    Fingerprint scanner
                  </option>
                  <option value="Face recognition">Face recognition</option>
                </select>
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
                  onChange={(e) => setManufactureYear(e.target.value)}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Engine Type */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Engine Type
                </label>
                <select
                  onChange={(e) => setSelectedEngineType(e.target.value)}
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
                  <option value="V-Twin Engine">V-Twin Engine</option>
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
                  onChange={(e) => setSelectedEngineCapacity(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Assembly */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Assembly
                </label>
                <select
                  onChange={(e) => setSelectedAssembly(e.target.value)}
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
                  onChange={(e) => setSelectedBodyType(e.target.value)}
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

              

              {/* Seller Type */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Seller Type
                </label>
                <select
                  onChange={(e) => setSelectedSellerType(e.target.value)}
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
                  <option value="With Pictures">With Pictures</option>
                  <option value="Without Pictures">Without Pictures</option>
                </select>
              </div>

              {/* Video Availability */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Video Availability
                </label>
                <select
                  onChange={(e) => setSelectedVideoAvailability(e.target.value)}
                  value={selectedVideoAvailability}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Select Video Availability
                  </option>
                  <option value="With Video">With Video</option>
                  <option value="Without Video">Without Video</option>
                </select>
              </div>

              {/* Ad Type */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Ad Type
                </label>
                <select
                  onChange={(e) => setSelectedAdType(e.target.value)}
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
  );
};

export default FashionStyle;
