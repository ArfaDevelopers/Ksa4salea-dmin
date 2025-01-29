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

const TRAVEL = () => {
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
  const [RoomType, setRoomType] = useState("");
  const [Amenities, setAmenities] = useState("");

  const [PropertyType, setPropertyType] = useState("");

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
  const [Checkin, setCheckin] = useState("");

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
      const carsCollection = collection(db, "TRAVEL");

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
        PropertyType: PropertyType,
        Brand: selectedCarBrand,
        Accuracy: Accuracy,
        StorageCapacity: StorageCapacity,
        SpeedofMeasurement: SpeedofMeasurement,
        Features: Features,
        CuffSize: CuffSize,
        RoomType: RoomType,
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
        Amenities: Amenities,
        Checkin: Checkin,
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
                  Check-in
                </label>
                <select
                  onChange={(e) => setCheckin(e.target.value)}
                  value={Checkin}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select Check-in</option>
                  <option value="Specific dates">Specific dates</option>
                  <option value="flexible date options">
                    flexible date options
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

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Room Type
                </label>
                <select
                  onChange={(e) => setRoomType(e.target.value)}
                  value={RoomType}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Room Type
                  </option>
                  <option value="Single">Single</option>
                  <option value="double">double</option>
                  <option value="Family room">Family room</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Amenities
                </label>
                <select
                  onChange={(e) => setAmenities(e.target.value)}
                  value={Amenities}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Amenities
                  </option>
                  <option value="Free Wi-Fi">Free Wi-Fi</option>
                  <option value="pool">pool</option>
                  <option value="gym">gym</option>
                  <option value="parking">parking</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Property Type
                </label>

                <select
                  onChange={(e) => setPropertyType(e.target.value)}
                  value={PropertyType}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Property Type{" "}
                  </option>
                  <option value="Hotel">Hotel</option>
                  <option value="Resort">Resort</option>
                  <option value="Villa">Villa</option>
                  <option value="Hostel">Hostel</option>
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

export default TRAVEL;
