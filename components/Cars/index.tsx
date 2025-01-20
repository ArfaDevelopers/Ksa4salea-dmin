"use client";
import React, { useState } from "react";
import { db } from "./../Firebase/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";

// For date picker
import DatePicker, { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale"; // Import English locale
import "react-datepicker/dist/react-datepicker.css";

// Cloudinary upload
import axios from "axios";

// Register the English locale
registerLocale("en-US", enUS);

const Cars = () => {
  const [name, setName] = useState("");
  const [imageUrls, setImageUrls] = useState(Array(6).fill("")); // Array to hold image URLs
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
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
  const [selectedSeatingCapacity, setSelectedSeatingCapacity] = useState("");
  const [selectedModalCategory, setSelectedModalCategory] = useState("");
  const [selectedSellerType, setSelectedSellerType] = useState("");
  const [selectedPictureAvailability, setSelectedPictureAvailability] =
    useState("");
  const [selectedVideoAvailability, setSelectedVideoAvailability] =
    useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [selectedAdType, setSelectedAdType] = useState("");

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
        timeAgo: (timeAgo ?? new Date()).toISOString(), // Use the current date if timeAgo is null

        description: description,
         sellerType: selectedSellerType,
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
        FuelType: selectedFuelType,
        AdType: selectedAdType,
        ModalCategory: selectedModalCategory,
        SellerType: selectedSellerType,
        NumberOfDoors: selectedNumberOfDoors,
        SeatingCapacity: selectedSeatingCapacity,
        Assembly: selectedAssembly,
        BodyType: selectedBodyType,
        Color: selectedColor,
        EngineType: selectedEngineType,
        EngineCapacity: selectedEngineCapacity,
        Transmission: selectedTransmission,
        TrustedCars: TrustedCars,
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
                  <option value="New York">New York</option>
                  <option value="Bogotá">Bogotá</option>
                  <option value="Dubai">Dubai</option>
                  <option value="Tokyo">Tokyo</option>
                  <option value="Paris">Paris</option>
                </select>
              </div>

              {/* Location Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Location
                </label>
                <select
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  value={selectedLocation}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select Location</option>
                  <option value="Dubai Marina">Dubai Marina</option>
                  <option value="Jumeirah">Jumeirah</option>
                  <option value="Deira">Deira</option>
                  <option value="Business Bay">Business Bay</option>
                </select>
              </div>

              {/* Car Brand Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Make
                </label>
                <select
                  onChange={(e) => setSelectedCarBrand(e.target.value)}
                  value={selectedCarBrand}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option disabled value="">
                    Select Make
                  </option>
                  <option value="Toyota">Toyota</option>
                  <option value="Mercedez-Benz">Mercedez-Benz</option>
                  <option value="Nissan">Nissan</option>
                  <option value="BMW">BMW</option>
                  <option value="Lamborghini">Lamborghini</option>
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
                  onChange={(e) => setManufactureYear(e.target.value)}
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
                  <option value="Downtown Dubai">Downtown Dubai</option>
                  <option value="Dubai Marina">Dubai Marina</option>
                  <option value="Jumeirah">Jumeirah</option>
                  <option value="Deira">Deira</option>
                  <option value="Business Bay">Business Bay</option>
                </select>
              </div>

              {/* Trusted Cars */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Trusted Cars
                </label>
                <select
                  onChange={(e) => setTrustedCars(e.target.value)}
                  value={TrustedCars}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Select Trusted Cars
                  </option>
                  <option value="Toyota">Toyota</option>
                  <option value="Mercedez-Benz">Mercedez-Benz</option>
                  <option value="Nissan">Nissan</option>
                  <option value="BMW">BMW</option>
                  <option value="Lamborghini">Lamborghini</option>
                </select>
              </div>

              {/* Transmission */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Transmission
                </label>
                <select
                  onChange={(e) => setSelectedTransmission(e.target.value)}
                  value={selectedTransmission}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Select Transmission
                  </option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
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
                  onChange={(e) => setSelectedEngineType(e.target.value)}
                  value={selectedEngineType}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Select Engine Type
                  </option>
                  <option value="Inline-4 (14) Engine">
                    Inline-4 (14) Engine
                  </option>
                  <option value="V6 Engine">V6 Engine</option>
                  <option value="V8 Engine">V8 Engine</option>
                  <option value="Inline-6 (16) Engine">
                    Inline-6 (16) Engine
                  </option>
                  <option value="V12 Engine">V12 Engine</option>
                  <option value="Inline-3 Engine">Inline-3 Engine</option>
                  <option value="V10 Engine">V10 Engine</option>
                  <option value="Flat-4 Engine">Flat-4 Engine</option>
                  <option value="Flat-6 Engine">Flat-6 Engine</option>
                  <option value="W12 Engine">W12 Engine</option>
                  <option value="W16 Engine">W16 Engine</option>
                  <option value="Electric Motor">Electric Motor</option>
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
                  <option value="Coupe">Coupe</option>
                  <option value="Sedan">Sedan (Saloon)</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Convertible">Convertible</option>
                  <option value="Crossover">Crossover</option>
                  <option value="Station Wagon">Station Wagon</option>
                  <option value="Minivan">Minivan</option>
                  <option value="Pickup Truck">Pickup Truck</option>
                  <option value="Roadster">Roadster</option>
                  <option value="MPV">MPV (Multi-Purpose Vehicle)</option>
                  <option value="Luxury Sedan">Luxury Sedan</option>
                  <option value="Limousine">Limousine</option>
                  <option value="Coupe SUV">Coupe SUV</option>
                </select>
              </div>

              {/* Number of Doors */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Number of Doors
                </label>
                <select
                  onChange={(e) => setSelectedNumberOfDoors(e.target.value)}
                  value={selectedNumberOfDoors}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Select Number of Doors
                  </option>
                  <option value="4">4 Doors</option>
                  <option value="5">5 Doors</option>
                  <option value="2">2 Doors</option>
                  <option value="3">3 Doors</option>
                  <option value="0">
                    No Doors (e.g., a truck or a specialized vehicle)
                  </option>
                </select>
              </div>

              {/* Seating Capacity */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Seating Capacity
                </label>
                <select
                  onChange={(e) => setSelectedSeatingCapacity(e.target.value)}
                  value={selectedSeatingCapacity}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Select Seating Capacity
                  </option>
                  <option value="4">4 Seats</option>
                  <option value="5">5 Seats</option>
                  <option value="2">2 Seats</option>
                  <option value="3">3 Seats</option>
                  <option value="0">
                    No Seats (e.g., for cargo or specialty vehicles)
                  </option>
                </select>
              </div>

              {/* Modal Category */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Modal Category
                </label>
                <select
                  onChange={(e) => setSelectedModalCategory(e.target.value)}
                  value={selectedModalCategory}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>
                    Select Modal Category
                  </option>
                  <option value="A-Class">A-Class (Compact)</option>
                  <option value="B-Class">B-Class (Compact MPV)</option>
                  <option value="C-Class">C-Class (Compact Exe)</option>
                  <option value="E-Class">E-Class (Executive)</option>
                  <option value="S-Class">S-Class (Luxury)</option>
                  <option value="CLA">CLA (Compact Coupe)</option>
                  <option value="CLS">CLS (Executive Coupe)</option>
                  <option value="GLA">GLA (Compact SUV)</option>
                  <option value="GLC">GLC (Luxury SUV)</option>
                  <option value="GLE">GLE (Luxury SUV)</option>
                  <option value="GLS">GLS (Full-Size SUV)</option>
                  <option value="G-Class">G-Class (Off-Road SUV)</option>
                  <option value="SLK">SLK (Compact Roadster)</option>
                  <option value="SLC">SLC (Compact Roadster)</option>
                  <option value="AMG GT">AMG GT (Performance)</option>
                  <option value="EQC">EQC (Electric SUV)</option>
                  <option value="EQS">EQS (Electric Luxury Sedan)</option>
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

              {/* Registered City */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Registered City
                </label>
                <input
                  type="text"
                  placeholder="Enter registered city"
                  value={registeredCity}
                  onChange={(e) => setRegisteredCity(e.target.value)}
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
  );
};

export default Cars;
