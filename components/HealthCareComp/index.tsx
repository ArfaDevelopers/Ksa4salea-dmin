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

const HealthCareComp = () => {
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
      const carsCollection = collection(db, "HEALTHCARE");

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
        RAM: RAM,
        Brand:selectedCarBrand,
        Accuracy: Accuracy,
        StorageCapacity: StorageCapacity,
        SpeedofMeasurement: SpeedofMeasurement,
        Features: Features,
        CuffSize: CuffSize,
        MeasurementRange: MeasurementRange,
        BatteryLife: BatteryLife,
        StorageType: StorageType,
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
        isFeatured: selectedAdType,
        VideoAvailability: selectedVideoAvailability,
        PictureAvailability: selectedPictureAvailability,
        AdType: selectedAdType,
        Assembly: selectedAssembly,
        BodyType: selectedBodyType,
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
              Add a New health Care
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
                  <option value="Omron">Omron</option>
                  <option value="Withings">Withings</option>
                  <option value="Beurer">Beurer</option>
                  <option value="iHealth">iHealth</option>
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
                  Type
                </label>
                <select
                  onChange={(e) => setType(e.target.value)}
                  value={Type}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Type
                  </option>
                  <option value="Upper arm monitor">Upper arm monitor</option>
                  <option value="Wrist monitor">Wrist monitor</option>
                  <option value="Finger monitor">Finger monitor</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Measurement Range
                </label>
                <select
                  onChange={(e) => setMeasurementRange(e.target.value)}
                  value={MeasurementRange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Measurement Range
                  </option>
                  <option value="90-230 mmHg">90-230 mmHg</option>
                  <option value="60-180 mmHg">60-180 mmHg</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Accuracy
                </label>
                <select
                  onChange={(e) => setAccuracy(e.target.value)}
                  value={Accuracy}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Accuracy{" "}
                  </option>
                  <option value="±3 mmHg">±3 mmHg</option>
                  <option value="±5 mmHg">±5 mmHg</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Features
                </label>
                <select
                  onChange={(e) => setFeatures(e.target.value)}
                  value={Features}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Features{" "}
                  </option>
                  <option value="Automatic inflation">
                    Automatic inflation
                  </option>
                  <option value="Smart connectivity">Smart connectivity</option>
                  <option value="LCD Display">LCD Display</option>
                  <option value="Talking function">Talking function</option>
                  <option value="Irregular heartbeat">
                    Irregular heartbeat
                  </option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Cuff Size
                </label>
                <select
                  onChange={(e) => setCuffSize(e.target.value)}
                  value={CuffSize}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Cuff Size{" "}
                  </option>
                  <option value="Standard (22-42 cm)">
                    Standard (22-42 cm)
                  </option>
                  <option value="Large (32-50 cm)">Large (32-50 cm)</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Display Type
                </label>
                <select
                  onChange={(e) => setDisplayType(e.target.value)}
                  value={DisplayType}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Display Type{" "}
                  </option>
                  <option value="Digital">Digital</option>
                  <option value="Analog">Analog</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Battery Type
                </label>
                <select
                  onChange={(e) => setBatteryType(e.target.value)}
                  value={BatteryType}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Battery Type{" "}
                  </option>
                  <option value="AA batteries">AA batteries</option>
                  <option value="Rechargeable battery">
                    Rechargeable battery
                  </option>
                  <option value="USB charging">USB charging</option>
                  <option value="Disposable batteries">
                    Disposable batteries
                  </option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Compatibility
                </label>
                <select
                  onChange={(e) => setCompatibility(e.target.value)}
                  value={Compatibility}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Compatibility{" "}
                  </option>
                  <option value="Mobile app compatibility">
                    Mobile app compatibility
                  </option>
                  <option value="Non-app compatible">Non-app compatible</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Storage Capacity
                </label>
                <select
                  onChange={(e) => setStorageCapacity(e.target.value)}
                  value={StorageCapacity}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Storage Capacity{" "}
                  </option>
                  <option value="30 readings">30 readings</option>
                  <option value="50 readings">50 readings</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Measurement Units
                </label>
                <select
                  onChange={(e) => setMeasurementUnits(e.target.value)}
                  value={MeasurementUnits}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Measurement Units{" "}
                  </option>
                  <option value="mmHg">mmHg</option>
                  <option value="kPa">kPa</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Speed of Measurement
                </label>
                <select
                  onChange={(e) => setSpeedofMeasurement(e.target.value)}
                  value={SpeedofMeasurement}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Speed of Measurement{" "}
                  </option>
                  <option value="Quick">Quick</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Seller Type
                </label>
                <select
                  onChange={(e) => setSellerType(e.target.value)}
                  value={SellerType}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Seller Type{" "}
                  </option>
                  <option value="Brand Seller">Brand Seller</option>
                  <option value="Individuals">Individuals</option>
                  <option value="Retailer">Retailer</option>
                  <option value="Marketplace">Marketplace</option>
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

export default HealthCareComp;
