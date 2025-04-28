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
import Select from "react-select";
import { Country, State, City, ICity } from "country-state-city";

// For date picker
import DatePicker, { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale"; // Import English locale
import "react-datepicker/dist/react-datepicker.css";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
// Cloudinary upload
import axios from "axios";
type Ad = {
  id: any; // Change from string to number
  link: string;
  isActive: boolean;
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
  FeaturedAds: string;

  AdType: any;
  FuelType: any;
  galleryImages: any;
};
// Register the English locale
registerLocale("en-US", enUS);

const PETANIMALCOMP = () => {
  const MySwal = withReactContent(Swal);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    kmDriven: "",
    Transmission: "",
    Emirates: "",
    Registeredin: "",
    TrustedCars: "",
    EngineType: "",
    EngineCapacity: "",
    ManufactureYear: "",
    Assembly: "",
    BodyType: "",
    Type: "",
    BuildingType: "",
    Accessibility: "",
    Checkin: "",
    RoomType: "",
    ShoeCategory: "",
    Breed: "",
    NoiseLevel: "",
    Capacity: "",
    PowerSource: "",
    BagType: "",
    SubCategory: "",
    NestedSubCategory: "",

    Bedroom: "",

    Age: "",
    Temperament: "",
    HealthStatus: "",
    TrainingLevel: "",
    DietaryPreferences: "",
    MAGAZINESCategory: "",
    IssueType: "",
    AgeGroup: "",

    SubscriptionType: "",

    ColorOptions: "",

    Availability: "",

    NumberofDoors: "",
    SeatingCapacity: "",
    ModelCategory: "",
    MeasurementRange: "",
    BatteryType: "",
    Compatibility: "",
    StorageCapacity: "",
    MeasurementUnits: "",
    SpeedofMeasurement: "",
    JobTitle: "",
    JobType: "",
    Language: "",
    Duration: "",
    PropertyType: "",
    Amenities: "",
    PropertyFeatures: "",

    SkillLevel: "",
    ContentType: "",

    SubjectCategories: "",

    Company: "",
    JobDescription: "",

    RequiredSkills: "",

    EmploymentType: "",
    ExperienceLevel: "",

    Accuracy: "",
    Industry: "",

    CuffSize: "",
    DisplayType: "",

    SellerType: "",
    PictureAvailability: "",
    VideoAvailability: "",
    BatteryLife: "",
    DisplayQuality: "",
    Connectivity: "",
    SpecialFeatures: "",
    Features: "",
    Season: "",
    ExteriorColor: "",
    Purpose: "",
    Price: "",

    Gender: "",
    Size: "",
    Fit: "",
    Material: "",
    StyleDesign: "",
    ClosureType: "",
    CollarType: "",
    WashType: "",

    SleeveLength: "",

    FeaturedAds: "",
    States: "",
    District: "",
    ScreenSize: "",
    Color: "",
    OperatingSystem: "",
    Processor: "",
    RAM: "",
    StorageType: "",
    Storagecapacity: "",
    GraphicsCard: "",

    // Make: "",
    tagline: "",
    City: "",

    priceRange: "",
    priceFrom: "65",
    priceTo: "120",
    selectedFeature: "",
    location: "",
    address: "8697-8747 Stirling Rd, Florida",
    mapAddress: "8697-8747 Stirling Rd, Florida",
    latitude: "26.045197767574102",
    longitude: "-80.26095677163161",
    Email: "",
    Website: "",
    Phone: "",
    facebook: "http://facebook.com",
    twitter: "http://twitter.com",
    googlePlus: "http://google.com",
    instagram: "http://instagram.com",
  });
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
  const [Breed, setBreed] = useState("");
  const [Age, setAge] = useState("");
  const [Gender, setGender] = useState("");

  const [model, setModel] = useState("2022");

  const [whatsapp, setWhatsapp] = useState("03189391781");
  const [Type, setType] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [cities, setCities] = useState<ICity[]>([]); // IMPORTANT: Set type ICity[]

  useEffect(() => {
    const saudiCities = City.getCitiesOfCountry("SA") || []; // fallback to empty array
    setCities(saudiCities);
  }, []);
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
  const [Size, setSize] = useState("");
  const [Amenities, setAmenities] = useState("");
  const [PropertyFeatures, setPropertyFeatures] = useState("");
  const [BuildingType, setBuildingType] = useState("");
  const [Accessibility, setAccessibility] = useState("");
  const [Color, setColor] = useState("");
  const [Temperament, setTemperament] = useState("");
  const [HealthStatus, setHealthStatus] = useState("");
  const [TrainingLevel, setTrainingLevel] = useState("");
  const [DietaryPreferences, setDietaryPreferences] = useState("");

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
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState<Ad[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null); // Holds the selected ad
  const [selectedOption, setSelectedOption] = useState("All");
  console.log("isFeatured______", selectedOption);
  const [isActive, setisActive] = useState(false); // ✅ boolean, not string
  const [activeCheckboxes, setActiveCheckboxes] = useState<{
    [key: number]: boolean;
  }>({});
  const [subcategories, setSubcategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [Category, setCategory] = useState<{
    category: string;
    SubCategory: string;
  }>({
    category: "",
    SubCategory: "",
  });
  const [Category1, setCategory1] = useState(""); // Store a single URL, initially null
  const [nestedSubCategory, setNestedSubCategory] = useState<{
    NestedSubCategory?: string;
  }>({});

  const subcategoriesMapping = {
    categories: [
      {
        name: "Automotive",
        subcategories: [
          {
            name: "Cars For Sale",
            subcategories: [
              { name: "Sedan" },
              { name: "SUV" },
              { name: "Coupe" },
              { name: "Convertible" },
              { name: "Truck" },
              { name: "Electric" },
            ],
          },
          {
            name: "Car Rental",
            subcategories: [
              { name: "Sedan" },
              { name: "SUV" },
              { name: "Coupe" },
              { name: "Convertible" },
              { name: "Truck" },
              { name: "Electric" },
            ],
          },
          {
            name: "Plates Number",
            subcategories: [
              { name: "Sedan" },
              { name: "SUV" },
              { name: "Coupe" },
              { name: "Convertible" },
              { name: "Truck" },
              { name: "Electric" },
            ],
          },
          {
            name: "Wheels & Rims",
            subcategories: [
              { name: "Sedan" },
              { name: "SUV" },
              { name: "Coupe" },
              { name: "Convertible" },
              { name: "Truck" },
              { name: "Electric" },
            ],
          },
          {
            name: "Spare Parts",
            subcategories: [
              { name: "Sedan" },
              { name: "SUV" },
              { name: "Coupe" },
              { name: "Convertible" },
              { name: "Truck" },
              { name: "Electric" },
            ],
          },
          {
            name: "Motorcycles",
            subcategories: [
              { name: "Sport" },
              { name: "Cruiser" },
              { name: "Off-road" },
            ],
          },
          {
            name: "Trucks & Heavy Machinery",
            subcategories: [
              { name: "Sport" },
              { name: "Cruiser" },
              { name: "Off-road" },
            ],
          },

          {
            name: "Accessories",
            subcategories: [
              { name: "Engine Components" },
              { name: "Brakes" },
              { name: "Tires & Wheels" },
            ],
          },
          {
            name: "Tshaleeh",
            subcategories: [
              { name: "Engine Components" },
              { name: "Brakes" },
              { name: "Tires & Wheels" },
            ],
          },
          {
            name: "Boats & Jet Ski",
            subcategories: [
              { name: "Engine Components" },
              { name: "Brakes" },
              { name: "Tires & Wheels" },
            ],
          },
          {
            name: "Classic Cars",
            subcategories: [
              { name: "Engine Components" },
              { name: "Brakes" },
              { name: "Tires & Wheels" },
            ],
          },
          {
            name: "Salvage Cars",
            subcategories: [
              { name: "Engine Components" },
              { name: "Brakes" },
              { name: "Tires & Wheels" },
            ],
          },
          {
            name: "Mortgaged Cars",
            subcategories: [
              { name: "Engine Components" },
              { name: "Brakes" },
              { name: "Tires & Wheels" },
            ],
          },
          {
            name: "Recovery",
            subcategories: [
              { name: "Engine Components" },
              { name: "Brakes" },
              { name: "Tires & Wheels" },
            ],
          },
          {
            name: "Food Truck",
            subcategories: [
              { name: "Engine Components" },
              { name: "Brakes" },
              { name: "Tires & Wheels" },
            ],
          },
          {
            name: "Caravans",
            subcategories: [
              { name: "Engine Components" },
              { name: "Brakes" },
              { name: "Tires & Wheels" },
            ],
          },
          {
            name: "Reports",
            subcategories: [
              { name: "Engine Components" },
              { name: "Brakes" },
              { name: "Tires & Wheels" },
            ],
          },
          {
            name: "Car Cleaning",
            subcategories: [
              { name: "Engine Components" },
              { name: "Brakes" },
              { name: "Tires & Wheels" },
            ],
          },
        ],
      },
      {
        name: "Electronics",
        subcategories: [
          {
            name: "Mobile Phones",
            subcategories: [
              { name: "Smartphones" },
              { name: "Feature Phones" },
            ],
          },

          {
            name: "Tablet Devices",
            subcategories: [
              { name: "Laptops" },
              { name: "Desktops" },
              { name: "Accessories" },
            ],
          },

          {
            name: "Computers & Laptops",
            subcategories: [
              { name: "Televisions" },
              { name: "Speakers" },
              { name: "Home Theater" },
            ],
          },
          {
            name: "Video Games",
            subcategories: [
              { name: "Televisions" },
              { name: "Speakers" },
              { name: "Home Theater" },
            ],
          },
          {
            name: "Television & Audio System",
            subcategories: [
              { name: "Televisions" },
              { name: "Speakers" },
              { name: "Home Theater" },
            ],
          },
          {
            name: "Accounts & Subscriptions",
            subcategories: [
              { name: "Televisions" },
              { name: "Speakers" },
              { name: "Home Theater" },
            ],
          },
          {
            name: "Computers & Laptops",
            subcategories: [
              { name: "Televisions" },
              { name: "Speakers" },
              { name: "Home Theater" },
            ],
          },
          {
            name: "Special Number",
            subcategories: [
              { name: "Televisions" },
              { name: "Speakers" },
              { name: "Home Theater" },
            ],
          },
          {
            name: "Home & Kitchen Appliance",
            subcategories: [
              { name: "Televisions" },
              { name: "Speakers" },
              { name: "Home Theater" },
            ],
          },

          {
            name: "Motors & Generators",
            subcategories: [
              { name: "Televisions" },
              { name: "Speakers" },
              { name: "Home Theater" },
            ],
          },
          {
            name: "Cameras",
            subcategories: [
              { name: "Televisions" },
              { name: "Speakers" },
              { name: "Home Theater" },
            ],
          },
          {
            name: "Networking Devices",
            subcategories: [
              { name: "Televisions" },
              { name: "Speakers" },
              { name: "Home Theater" },
            ],
          },
          {
            name: "Screens & Projectors",
            subcategories: [
              { name: "Televisions" },
              { name: "Speakers" },
              { name: "Home Theater" },
            ],
          },
          {
            name: "Printer & Scanner",
            subcategories: [
              { name: "Televisions" },
              { name: "Speakers" },
              { name: "Home Theater" },
            ],
          },
          {
            name: "Computer Accessories",
            subcategories: [
              { name: "Televisions" },
              { name: "Speakers" },
              { name: "Home Theater" },
            ],
          },
        ],
      },
      {
        name: "Fashion Style",
        subcategories: [
          {
            name: "Watches",
            subcategories: [
              { name: "Houses" },
              { name: "Apartments" },
              { name: "Land" },
              { name: "Villas" },
            ],
          },
          {
            name: "Perfumes & Incense",
            subcategories: [
              { name: "Houses" },
              { name: "Apartments" },
              { name: "Commercial Spaces" },
            ],
          },
          {
            name: "Sports Equipment",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Men's Fashion",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Women's Fashion",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Children's Clothing & Accessories",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },

          {
            name: "Sleepwear",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Gifts",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Luggage",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Health & Beauty",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },

          {
            name: "Others",
            subcategories: [{ name: "Miscellaneous", subcategories: [] }],
          },
        ],
      },
      {
        name: "Home & Furnituer",
        subcategories: [
          {
            name: "Outdoor Furniture",
            subcategories: [
              { name: "Houses" },
              { name: "Apartments" },
              { name: "Land" },
              { name: "Villas" },
            ],
          },
          {
            name: "Majlis & Sofas",
            subcategories: [
              { name: "Houses" },
              { name: "Apartments" },
              { name: "Commercial Spaces" },
            ],
          },
          {
            name: "Cabinets & Wardrobes",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Beds & Mattresses",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Tables & Chairs",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Kitchens",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },

          {
            name: "Sleepwear",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Bathrooms",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Carpets",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Curtains",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },

          {
            name: "Decoration & Accessories",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Lighting",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Decoration & Accessories",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Lighting",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Household Items",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Garden - Plants",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Office Furniture",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Doors - Windows - Aluminium",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Tiles & Flooring",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Others",
            subcategories: [{ name: "Miscellaneous", subcategories: [] }],
          },
        ],
      },
      {
        name: "Job Board",
        subcategories: [
          {
            name: "Administrative Jobs",
            subcategories: [
              { name: "Houses" },
              { name: "Apartments" },
              { name: "Land" },
              { name: "Villas" },
            ],
          },
          {
            name: "Fashion & Beauty Jobs",
            subcategories: [
              { name: "Houses" },
              { name: "Apartments" },
              { name: "Commercial Spaces" },
            ],
          },
          {
            name: "Security & Safety Jobs",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Teaching Jobs",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "IT & Design Jobs",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Agriculture & Farming Jobs",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },

          {
            name: "Industrial Jobs",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Medical & Nursing Jobs",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Architecture & Construction Jobs",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Industrial Jobs",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },

          {
            name: "Housekeeping Jobs",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Restaurant Jobs",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },

          {
            name: "Others",
            subcategories: [{ name: "Miscellaneous", subcategories: [] }],
          },
        ],
      },
      {
        name: "Real Estate",
        subcategories: [
          {
            name: "Apartments for Rent",
            subcategories: [
              { name: "Houses" },
              { name: "Apartments" },
              { name: "Land" },
              { name: "Villas" },
            ],
          },
          {
            name: "Apartments for Sale",
            subcategories: [
              { name: "Houses" },
              { name: "Apartments" },
              { name: "Commercial Spaces" },
            ],
          },
          {
            name: "Building for Rent",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },

          {
            name: "Building for Sale",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Camps for Rent",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Chalets for Sale",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Chalets for Sale",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Commercial Lands for Sale",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Compound for Rent",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Compound for Sale",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Farm for Rent",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Farms for Sale",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Floor for Sale",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Floors for Rent",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Hall for Rent",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Houses for Rent",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Houses for Sale",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Offices for Rent",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Rest Houses for Rent",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Rooms for Rent",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Shops for Rent",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Shops for Transfer",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Warehouse for Rent",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Villas for Sale",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },
          {
            name: "Villas for Rent",
            subcategories: [
              { name: "Office Spaces" },
              { name: "Retail" },
              { name: "Industrial" },
            ],
          },

          {
            name: "Camping",
            subcategories: [
              {
                name: "Tents",
                subcategories: [],
              },
              {
                name: "Sleeping Bags",
                subcategories: [],
              },
              {
                name: "Outdoor Gear",
                subcategories: [
                  { name: "Backpacking" },
                  { name: "Family Camping" },
                ],
              },
            ],
          },

          {
            name: "Others",
            subcategories: [{ name: "Miscellaneous", subcategories: [] }],
          },
        ],
      },
      {
        name: "Services",
        subcategories: [
          {
            name: "Other Services",
            subcategories: [{ name: "Cleaning" }, { name: "Maintenance" }],
          },
          {
            name: "Contracting Services",
            subcategories: [{ name: "Repair" }, { name: "Detailing" }],
          },
          {
            name: "Government Paperwork Services",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Delivery Services",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Furniture Moving Services",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Cleaning Services",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "International Shopping Services",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Legal Services",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Accounting & Financial Services",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
        ],
      },
      {
        name: "Sports & Game",
        subcategories: [
          {
            name: "Gaming Consoles",
            subcategories: [
              { name: "Sports & Game" },
              { name: "Sports & Game" },
            ],
          },
          {
            name: "Video Games",
            subcategories: [
              { name: "Sports & Game" },
              { name: "Sports & Game" },
            ],
          },
          {
            name: "Controllers",
            subcategories: [
              { name: "Sports & Game" },
              { name: "Sports & Game" },
            ],
          },
          {
            name: "Gaming Accessories",
            subcategories: [
              { name: "Sports & Game" },
              { name: "Sports & Game" },
            ],
          },
          {
            name: "Gift Cards",
            subcategories: [
              { name: "Sports & Game" },
              { name: "Sports & Game" },
            ],
          },
          {
            name: "Accounts",
            subcategories: [
              { name: "Sports & Game" },
              { name: "Sports & Game" },
            ],
          },
          {
            name: "Toys",
            subcategories: [
              { name: "Sports & Game" },
              { name: "Sports & Game" },
            ],
          },
        ],
      },
      {
        name: "Pet & Animals",
        subcategories: [
          {
            name: "Sheep",
            subcategories: [
              { name: "Dogs" },
              { name: "Cats" },
              { name: "Birds" },
              { name: "Fish" },
            ],
          },
          {
            name: "Goats",
            subcategories: [
              { name: "Cattle" },
              { name: "Sheep" },
              { name: "Goats" },
            ],
          },
          {
            name: "Parrot",
            subcategories: [],
          },

          {
            name: "Dove/Pigeon",
            subcategories: [
              { name: "Cattle" },
              { name: "Sheep" },
              { name: "Goats" },
            ],
          },
          {
            name: "Cats",
            subcategories: [
              { name: "Cattle" },
              { name: "Sheep" },
              { name: "Goats" },
            ],
          },
          {
            name: "Chickens",
            subcategories: [
              { name: "Cattle" },
              { name: "Sheep" },
              { name: "Goats" },
            ],
          },
          {
            name: "Camels",
            subcategories: [
              { name: "Cattle" },
              { name: "Sheep" },
              { name: "Goats" },
            ],
          },
          {
            name: "Horses",
            subcategories: [
              { name: "Cattle" },
              { name: "Sheep" },
              { name: "Goats" },
            ],
          },
          {
            name: "Dogs",
            subcategories: [
              { name: "Cattle" },
              { name: "Sheep" },
              { name: "Goats" },
            ],
          },
          {
            name: "Cows",
            subcategories: [
              { name: "Cattle" },
              { name: "Sheep" },
              { name: "Goats" },
            ],
          },
          {
            name: "Fish & Turtles",
            subcategories: [
              { name: "Cattle" },
              { name: "Sheep" },
              { name: "Goats" },
            ],
          },
          {
            name: "Rabbits",
            subcategories: [
              { name: "Cattle" },
              { name: "Sheep" },
              { name: "Goats" },
            ],
          },
          {
            name: "Ducks",
            subcategories: [
              { name: "Cattle" },
              { name: "Sheep" },
              { name: "Goats" },
            ],
          },
          {
            name: "Squirrels",
            subcategories: [
              { name: "Cattle" },
              { name: "Sheep" },
              { name: "Goats" },
            ],
          },
          {
            name: "Hamsters",
            subcategories: [
              { name: "Cattle" },
              { name: "Sheep" },
              { name: "Goats" },
            ],
          },
          {
            name: "Fur",
            subcategories: [
              { name: "Cattle" },
              { name: "Sheep" },
              { name: "Goats" },
            ],
          },
        ],
      },
      {
        name: "Other",
        subcategories: [
          {
            name: "Hunting & Trips",
            subcategories: [{ name: "Cleaning" }, { name: "Maintenance" }],
          },
          {
            name: "Gardening & Agriculture",
            subcategories: [{ name: "Repair" }, { name: "Detailing" }],
          },
          {
            name: "Parties & Events",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Travel & Tourism",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Roommate",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Lost & Found",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Education & Training",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Sports Training",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Stock & Forex Education",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Driving Lessons",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Private Tutoring",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },

          {
            name: "Training Courses",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Antiques & Collectibles",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Projects & Investments",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Books & Arts",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Programming & Design",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },

          {
            name: "Food & Beverages",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Gardening & Agriculture",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
          {
            name: "Hunting & Trips",
            subcategories: [{ name: "Tutoring" }, { name: "Coaching" }],
          },
        ],
      },
    ],
  };

  const categoryOptions = subcategoriesMapping.categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));
  const handleCategoryChange = (selectedOption: any) => {
    const selectedValue = selectedOption?.value || "";

    // Update form data
    setFormData((prev) => ({
      ...prev,
      category: selectedValue,
      SubCategory: "", // Reset subcategory
    }));

    // Find the selected category from the mapping
    const selectedCategory = subcategoriesMapping.categories.find(
      (category) => category.name === selectedValue
    );

    if (selectedCategory && Array.isArray(selectedCategory.subcategories)) {
      const mappedSubcategories = selectedCategory.subcategories.map((sub) => ({
        value: sub.name,
        label: sub.name,
      }));
      setSubcategories(mappedSubcategories);
    } else {
      setSubcategories([]);
    }
  };

  const handleSubcategoryChange = (selectedOption: any) => {
    const selectedValue = selectedOption ? selectedOption.value : "";
    setFormData((prev) => ({ ...prev, SubCategory: selectedValue }));
    setCategory((prev) => ({ ...prev, SubCategory: selectedValue }));
  };
  const SparePartsChange = (selectedOption: any) => {
    setFormData((prevData) => ({
      ...prevData,
      NestedSubCategory: selectedOption.value,
    }));
    setNestedSubCategory((prevData) => ({
      ...prevData,
      NestedSubCategory: selectedOption.value,
    }));
  };

  const AccountsSubscriptions = [
    { value: "Skincare", label: "Skincare" },
    { value: "Hair Care", label: "Hair Care" },
    { value: "Makeup", label: "Makeup" },
    { value: "Other Beauty Products", label: "Other Beauty Products" },
  ];

  const HealthBeauty = [
    { value: "PUBG", label: "PUBG" },
    { value: "Fortnite", label: "Fortnite" },
    { value: "FIFA", label: "FIFA" },
    { value: "Clash of Clans", label: "Clash of Clans" },
    { value: "Clash Royale", label: "Clash Royale" },
    { value: "Instagram Accounts", label: "Instagram Accounts" },
    { value: "Twitter Accounts", label: "Twitter Accounts" },
    { value: "TikTok Accounts", label: "TikTok Accounts" },
    { value: "Snapchat Accounts", label: "Snapchat Accounts" },
    { value: "Facebook Accounts", label: "Facebook Accounts" },
    { value: "YouTube Accounts", label: "YouTube Accounts" },
    { value: "Other Accounts", label: "Other Accounts" },
  ];
  const FashionBeautyJobs = [
    { value: "Tailor", label: "Tailor" },
    { value: "Female Hairdresser", label: "Female Hairdresser" },
    { value: "Fashion Designer", label: "Fashion Designer" },
    { value: "Model", label: "Model" },
    { value: "Makeup Artist", label: "Makeup Artist" },
    { value: "Hair Stylist", label: "Hair Stylist" },
    { value: "Other Beauty Jobs", label: "Other Beauty Jobs" },
  ];
  const ITDesignJobs = [
    { value: "Other IT Jobs", label: "Other IT Jobs" },
    {
      value: "Network & Telecommunications Specialist",
      label: "Network & Telecommunications Specialist",
    },
    { value: "Content Writer", label: "Content Writer" },
    { value: "Programmer", label: "Programmer" },
    { value: "Media Designer", label: "Media Designer" },
  ];
  const SecuritySafetyJobs = [
    { value: "Security Guard", label: "Security Guard" },
    { value: "Safety Technician", label: "Safety Technician" },
  ];

  const AgricultureFarmingJobs = [
    { value: "Farm Worker", label: "Farm Worker" },
    { value: "Other Agricultural Jobs", label: "Other Agricultural Jobs" },
  ];
  const AdministrativeJobs = [
    { value: "Marketing & Sales", label: "Marketing & Sales" },
    { value: "Customer Service", label: "Customer Service" },
    { value: "Secretary", label: "Secretary" },
    { value: "Tourism & Hospitality", label: "Tourism & Hospitality" },
    { value: "Accountant", label: "Accountant" },
    { value: "Delivery Representative", label: "Delivery Representative" },
    { value: "Other Administrative Jobs", label: "Other Administrative Jobs" },
    { value: "Public Relations & Media", label: "Public Relations & Media" },
    { value: "Translator", label: "Translator" },
    { value: "Lawyer & Legal Jobs", label: "Lawyer & Legal Jobs" },
  ];
  const ChildrenClothingAccessories = [
    { value: "Baby Care Products", label: "Baby Care Products" },
    { value: "Children's Accessories", label: "Children's Accessories" },
    { value: "Toys for Kids", label: "Toys for Kids" },
    { value: "Children's Cribs & Chairs", label: "Children's Cribs & Chairs" },
    { value: "Children's Bags", label: "Children's Bags" },
    { value: "Strollers", label: "Strollers" },
    { value: "Car Seats for Kids", label: "Car Seats for Kids" },
    { value: "Girls' Clothing", label: "Girls' Clothing" },
    { value: "Boys' Clothing", label: "Boys' Clothing" },
  ];
  const WomenFashion = [
    {
      value: "Women's Accessories & Jewelry",
      label: "Women's Accessories & Jewelry",
    },
    {
      value: "Women's Blouses & T-Shirts",
      label: "Women's Blouses & T-Shirts",
    },
    { value: "Women's Skirts & Trousers", label: "Women's Skirts & Trousers" },
    { value: "Women's Jackets", label: "Women's Jackets" },
    { value: "Kaftans", label: "Kaftans" },
    { value: "Women's Bags", label: "Women's Bags" },
    { value: "Abayas", label: "Abayas" },
    { value: "Dresses", label: "Dresses" },
    { value: "Lingerie", label: "Lingerie" },
    { value: "Women's Sportswear", label: "Women's Sportswear" },
  ];
  const Watches = [
    { value: "Other Watches", label: "Other Watches" },
    { value: "Men's Watches", label: "Men's Watches" },
    { value: "Women's Watches", label: "Women's Watches" },
  ];

  const PerfumesIncense = [
    { value: "Other Perfumes", label: "Other Perfumes" },
    { value: "Men's Perfumes", label: "Men's Perfumes" },
    { value: "Women's Perfumes", label: "Women's Perfumes" },
    { value: "Oud & Incense", label: "Oud & Incense" },
  ];
  const IndustrialJobs = [
    { value: "Other Industrial Jobs", label: "Other Industrial Jobs" },
    { value: "Car Mechanic", label: "Car Mechanic" },
    { value: "Auto Electrician", label: "Auto Electrician" },
    { value: "Bodywork Technician", label: "Bodywork Technician" },
  ];
  const MedicalNursingJobs = [
    { value: "Pharmacist", label: "Pharmacist" },
    { value: "Doctor", label: "Doctor" },
    {
      value: "Physical Therapy Technician",
      label: "Physical Therapy Technician",
    },
    { value: "Massage Therapist", label: "Massage Therapist" },
    { value: "Nurse", label: "Nurse" },
    { value: "Other Medical Jobs", label: "Other Medical Jobs" },
  ];
  const SpecialNumber = [
    { value: "STC", label: "STC" },
    { value: "Mobily", label: "Mobily" },
    { value: "Zain", label: "Zain" },
  ];
  const Goats = [
    { value: "Local Goats", label: "Local Goats" },
    { value: "Hure Sheep", label: "Hure Sheep" },
    { value: "Romanian Sheep", label: "Romanian Sheep" },
    { value: "Sawakni Sheep", label: "Sawakni Sheep" },
    { value: "Najdi Sheep", label: "Najdi Sheep" },
    { value: "Naemi Sheep", label: "Naemi Sheep" },
    { value: "Rafidi Sheep", label: "Rafidi Sheep" },
    { value: "Sheep Supplies", label: "Sheep Supplies" },
    { value: "Sheep Products", label: "Sheep Products" },
  ];
  const Parrot = [
    { value: "Amazoni Parrot", label: "Amazoni Parrot" },
    { value: "Congo African Grey Parrot", label: "Congo African Grey Parrot" },
    { value: "Cockatoo Parrot", label: "Cockatoo Parrot" },
    { value: "Macaw Parrot", label: "Macaw Parrot" },
    { value: "Pet Birds", label: "Pet Birds" },
    { value: "Bird Supplies", label: "Bird Supplies" },
  ];
  const DovePigeon = [
    { value: "Pakistani Pigeon", label: "Pakistani Pigeon" },
    { value: "Turkish Pigeon", label: "Turkish Pigeon" },
    { value: "Homers (Pigeons)", label: "Homers (Pigeons)" },
    { value: "Sudanese Pigeon", label: "Sudanese Pigeon" },
    { value: "Shami Pigeon", label: "Shami Pigeon" },
    { value: "Sanaani Pigeon", label: "Sanaani Pigeon" },
    { value: "French Pigeon", label: "French Pigeon" },
    { value: "Egyptian Pigeon", label: "Egyptian Pigeon" },
    { value: "Dutch Pigeon", label: "Dutch Pigeon" },
    { value: "Qatifi Pigeon", label: "Qatifi Pigeon" },
  ];
  const Cats = [
    { value: "Scottish Cats", label: "Scottish Cats" },
    { value: "Persian Cats", label: "Persian Cats" },
    { value: "Cats for Adoption", label: "Cats for Adoption" },
    { value: "Himalayan Cats", label: "Himalayan Cats" },
    { value: "Cat Supplies", label: "Cat Supplies" },
  ];
  const Chickens = [
    { value: "Brahma Chickens", label: "Brahma Chickens" },
    { value: "Local Chickens", label: "Local Chickens" },
    { value: "Turkish Chickens", label: "Turkish Chickens" },
    { value: "Persian Chickens", label: "Persian Chickens" },
    { value: "French Chickens", label: "French Chickens" },

    { value: "Fayoumi Chickens", label: "Fayoumi Chickens" },
    { value: "Pakistani Chickens", label: "Pakistani Chickens" },
    { value: "Poultry Supplies", label: "Poultry Supplies" },
  ];
  const Camels = [
    { value: "Bakar Camels", label: "Bakar Camels" },
    { value: "Stud Camels", label: "Stud Camels" },
    { value: "Camel Stallions", label: "Camel Stallions" },
    { value: "Female Camels", label: "Female Camels" },
    { value: "Camel Supplies", label: "Camel Supplies" },
  ];
  const Horses = [
    { value: "Popular Horses", label: "Popular Horses" },
    { value: "Mixed Horses", label: "Mixed Horses" },
    { value: "Wahho Horses", label: "Wahho Horses" },
    { value: "English Horses", label: "English Horses" },
    { value: "Horse Supplies", label: "Horse Supplies" },
  ];
  const Cows = [
    { value: "German Cows", label: "German Cows" },
    { value: "Local Cows", label: "Local Cows" },
    { value: "Jersey Cows", label: "Jersey Cows" },
    { value: "Swiss Cows", label: "Swiss Cows" },
    { value: "Dutch Cows", label: "Dutch Cows" },
    { value: "Dairy Products", label: "Dairy Products" },
  ];
  const Squirrels = [
    { value: "Turtles", label: "Turtles" },
    { value: "Sharshari Ducks", label: "Sharshari Ducks" },
  ];
  const Hamsters = [{ value: "Geese", label: "Geese" }];
  const Ducks = [
    { value: "Bikini Ducks", label: "Bikini Ducks" },
    { value: "Sharshari Ducks", label: "Sharshari Ducks" },
    { value: "Geese", label: "Geese" },
    { value: "Fish", label: "Fish" },
    { value: "Bikini Ducks", label: "Bikini Ducks" },
  ];
  const Dogs = [
    { value: "Pitbull Dogs", label: "Pitbull Dogs" },
    { value: "Pomeranian Dogs", label: "Pomeranian Dogs" },
    { value: "Golden Retriever Dogs", label: "Golden Retriever Dogs" },
    { value: "German Shepherd Dogs", label: "German Shepherd Dogs" },
    { value: "Shih Tzu Dog", label: "Shih Tzu Dog" },
    { value: "Chihuahua Dog", label: "Chihuahua Dog" },
    { value: "Maltese Dog", label: "Maltese Dog" },
    { value: "Husky Dog", label: "Husky Dog" },
    { value: "Dog Supplies", label: "Dog Supplies" },
  ];
  const Sheep = [
    { value: "Barbary Sheep", label: "Barbary Sheep" },
    { value: "Hure Sheep", label: "Hure Sheep" },
    { value: "Romanian Sheep", label: "Romanian Sheep" },
    { value: "Sawakni Sheep", label: "Sawakni Sheep" },
    { value: "Najdi Sheep", label: "Najdi Sheep" },
    { value: "Naemi Sheep", label: "Naemi Sheep" },
    { value: "Rafidi Sheep", label: "Rafidi Sheep" },
    { value: "Sheep Supplies", label: "Sheep Supplies" },
    { value: "Sheep Products", label: "Sheep Products" },
  ];
  const RestaurantJobs = [
    { value: "Chef & Cook Instructor", label: "Chef & Cook Instructor" },
    { value: "Waiter & Host", label: "Waiter & Host" },
    { value: "Other Restaurant Jobs", label: "Other Restaurant Jobs" },
  ];
  const HousekeepingJobs = [
    { value: "Private Driver", label: "Private Driver" },
    { value: "Household Worker", label: "Household Worker" },
    { value: "Domestic Worker", label: "Domestic Worker" },
    { value: "Other Labor Jobs", label: "Other Labor Jobs" },
  ];
  const ArchitectureConstructionJobs = [
    { value: "Building Painter", label: "Building Painter" },
    { value: "AC Technician", label: "AC Technician" },
    { value: "Decorator", label: "Decorator" },
    { value: "Building Electrician", label: "Building Electrician" },
    { value: "Tiler", label: "Tiler" },
    { value: "Building Supervisor", label: "Building Supervisor" },
    { value: "Building Contractor", label: "Building Contractor" },
    { value: "Plasterer", label: "Plasterer" },
    { value: "Carpenter", label: "Carpenter" },
    { value: "Other Construction Jobs", label: "Other Construction Jobs" },
  ];
  const Cameras = [
    { value: "Lenses", label: "Lenses" },
    { value: "Drone", label: "Drone" },
    { value: "Camera Accessories", label: "Camera Accessories" },
  ];
  const SportsEquipment = [
    { value: "Eyeglasses", label: "Eyeglasses" },
    { value: "Other Eyeglasses", label: "Other Eyeglasses" },
    { value: "Men's Eyeglasses", label: "Men's Eyeglasses" },
    {
      value: "HeadsWomen's Eyeglassesets",
      label: "HeadsWomen's Eyeglassesets",
    },
    { value: "Sports Equipment", label: "Sports Equipment" },
  ];
  const HomeKitchenAppliance = [
    { value: "Stoves & Ovens", label: "Stoves & Ovens" },
    { value: "Refrigerators & Coolers", label: "Refrigerators & Coolers" },
    { value: "Mixers & Blenders", label: "Mixers & Blenders" },
    { value: "Washing Machines", label: "Washing Machines" },
    { value: "Kettles", label: "Kettles" },
    { value: "Fryers", label: "Fryers" },
    { value: "Coffee Machines", label: "Coffee Machines" },
    { value: "Microwaves & Toasters", label: "Microwaves & Toasters" },
    { value: "Vacuum Cleaners", label: "Vacuum Cleaners" },
    { value: "Clothing Irons", label: "Clothing Irons" },
    { value: "Air Conditioners", label: "Air Conditioners" },
  ];
  const MenFashion = [
    { value: "Men's Shemaghs", label: "Men's Shemaghs" },
    { value: "Men's Accessories", label: "Men's Accessories" },
    { value: "Men's Clothing", label: "Men's Clothing" },
    { value: "Men's Jackets", label: "Men's Jackets" },
    { value: "Men's Bags", label: "Men's Bags" },
    { value: "Men's Shirts & Trousers", label: "Men's Shirts & Trousers" },
    { value: "Men's Sportswear", label: "Men's Sportswear" },
  ];
  const SpareParts = [
    { value: "others", label: "Others" },
    { value: "batteries", label: "Batteries" },
    { value: "spareparts", label: "Spare Parts" },
    { value: "mechanicalparts", label: "Mechanical Parts" },
    { value: "bodyparts", label: "Body Parts" },
  ];
  const VideoGames = [
    { value: "VR Glasses", label: "VR Glasses" },
    { value: "PlayStation (PS) Devices", label: "PlayStation (PS) Devices" },
    { value: "PlayStation (PS) Games", label: "PlayStation (PS) Games" },
    { value: "Xbox Devices", label: "Xbox Devices" },
    { value: "Xbox Games", label: "Xbox Games" },
    { value: "Nintendo", label: "Nintendo" },
  ];
  const BoatsJetSki = [
    { value: "Others", label: "Others" },
    { value: "Jet-ski", label: "Jet-ski" },
    { value: "Motorboats", label: "Motorboats" },
  ];
  const TabletDevices = [
    { value: "iPad", label: "iPad" },
    { value: "Galaxy Tab", label: "Galaxy Tab" },
  ];
  const MobilePhones = [
    { value: "Smart Watches", label: "Smart Watches" },
    { value: "Headsets", label: "Headsets" },
    { value: "Chargers & Cables", label: "Chargers & Cables" },
    { value: "Covers & Protectors", label: "Covers & Protectors" },
  ];
  const TrucksHeavyMachinery = [
    { value: "Heavy Equipmen", label: "Heavy Equipmen" },
    { value: "Excavator", label: "Excavator" },
    { value: "Crusher", label: "Crusher" },
    { value: "Bulldozer", label: "Bulldozer" },
    { value: "Crane", label: "Crane" },
    { value: "Recovery", label: "Recovery" },
    { value: "Wheel Loader", label: "Wheel Loader" },
    { value: "Dump Truck", label: "Dump Truck" },
    { value: "Trucks", label: "Trucks" },
    { value: "Crane", label: "Crane" },

    { value: "Agricultural Equipment", label: "Agricultural Equipment" },
  ];
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
    const docRef = doc(db, "PETANIMALCOMP", id);
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

  const closeModal = () => setIsOpen(false);
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsCollection = collection(db, "PETANIMALCOMP"); // Get reference to the 'Cars' collection
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
            whatsapp: data.whatsapp || "",
            FeaturedAds: data.FeaturedAds || "",

            AdType: data.AdType || "",
            FuelType: data.FuelType || "",
            galleryImages: data.galleryImages || "",
            isActive: data.isActive || "",
          };
        });

        console.log(adsList, "adsList___________adsList");

        console.log(adsList, "adsList___________adsList");
        if (selectedOption === "All") {
          setAds(adsList); // Set the state with the ads data
        } else {
          var newad = adsList.filter(
            (val) => val.FeaturedAds === selectedOption
          );
          setAds(newad); // Set the state with the ads data
        }
        setLoading(false); // Stop loading when data is fetched
      } catch (error) {
        console.error("Error fetching ads:", error);
        setLoading(false);
      }
    };

    fetchAds();
  }, [refresh, selectedOption]);
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true); // Show spinner
        const carsCollectionRef = collection(db, "PETANIMALCOMP");
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
  const handleEditClick = async (id: any) => {
    console.log(id, "WhatWhat");
    try {
      const adDoc = await getDoc(doc(db, "PETANIMALCOMP", id));
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
          galleryImages: adData.FuelType || "galleryImages",
          isActive: adData.isActive || "isActive",

          FeaturedAds: "",
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
        // setSelectedFuelType(selectedAd.FuelType);

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
          await deleteDoc(doc(db, "PETANIMALCOMP", ad.id)); // Delete document by id
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

  const resetForm = () => {
    setDescription("");
    setLink("");
    setManufactureYear("");
    setAssembly("");
    setTimeAgo(new Date());

    setModel("");
    setPhoneNumber("");
    setType("");
    setPrice("");
    setLocation("");
    setName("");
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
  const [PropertyType, setPropertyType] = useState("");

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
      const carsCollection = collection(db, "PETANIMALCOMP");

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
        Size: Size,
        Breed: Breed,
        category: Category1,

        Color: Color,
        Brand: selectedCarBrand,
        Temperament: Temperament,
        HealthStatus: HealthStatus,
        DietaryPreferences: DietaryPreferences,
        Accuracy: Accuracy,
        Gender: Gender,
        StorageCapacity: StorageCapacity,
        SpeedofMeasurement: SpeedofMeasurement,
        BuildingType: BuildingType,
        PropertyFeatures: PropertyFeatures,
        Accessibility: Accessibility,
        Amenities: Amenities,
        Features: Features,
        CuffSize: CuffSize,
        PropertyType: PropertyType,
        MeasurementRange: MeasurementRange,
        BatteryLife: BatteryLife,
        StorageType: StorageType,
        Age: Age,
        Storagecapacity: Storagecapacity,
        GraphicsCard: GraphicsCard,
        DisplayQuality: DisplayQuality,
        Connectivity: Connectivity,
        SpecialFeatures: SpecialFeatures,
        BatteryType: BatteryType,
        DisplayType: DisplayType,
        MeasurementUnits: MeasurementUnits,
        TrainingLevel: TrainingLevel,
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
        <div className="flex space-x-4 items-center">
          <span className="text-gray-700 font-medium">Filter:</span>

          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedOption === "All"}
              onChange={() => handleCheckboxChange("All")}
              className="form-checkbox text-blue-600"
            />
            <span>All</span>
          </label>

          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedOption === "Featured Ads"}
              onChange={() => handleCheckboxChange("Paid")}
              className="form-checkbox text-blue-600"
            />
            <span>Paid</span>
          </label>

          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedOption === "Not Featured Ads"}
              onChange={() => handleCheckboxChange("Unpaid")}
              className="form-checkbox text-blue-600"
            />
            <span>Unpaid</span>
          </label>
        </div>
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
          style={{ marginTop: "8%" }}
        >
          <div
            className="flex justify-center items-center h-full"
            style={{ marginTop: "55%" }}
          >
            <div className="relative w-full max-w-lg">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              >
                &times;
              </button>
              <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h3 className="text-center text-2xl font-bold mb-4">
                  Add a New Pet or Animal
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
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
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
                  <div className="card w-100 w-md-50">
                    <div className="form-group">
                      <label className="col-form-label label-heading">
                        Category
                      </label>
                      <div className="row category-listing">
                        <Select
                          options={categoryOptions}
                          value={categoryOptions.find(
                            (option) => option.value === formData.category
                          )}
                          onChange={handleCategoryChange}
                          className="basic-single"
                          classNamePrefix="select"
                          placeholder="Select Category"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="card w-100 w-md-50">
                    <div className="form-group">
                      <label className="col-form-label label-heading">
                        Select SubCategory
                      </label>
                      <div className="row category-listing">
                        <Select
                          options={subcategories}
                          value={subcategories.find(
                            (option) => option.value === formData.SubCategory
                          )}
                          onChange={handleSubcategoryChange}
                          className="basic-single"
                          classNamePrefix="select"
                          placeholder="Select Subcategory"
                        />
                      </div>
                    </div>
                  </div>

                  {Category.SubCategory === "Spare Parts" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={SpareParts}
                            value={SpareParts.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Trucks & Heavy Machinery" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={TrucksHeavyMachinery}
                            value={TrucksHeavyMachinery.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Boats & Jet Ski" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={BoatsJetSki}
                            value={BoatsJetSki.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Mobile Phones" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={MobilePhones}
                            value={MobilePhones.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Tablet Devices" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={TabletDevices}
                            value={TabletDevices.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Video Games" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={VideoGames}
                            value={VideoGames.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {Category.SubCategory === "Accounts & Subscriptions" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={AccountsSubscriptions}
                            value={AccountsSubscriptions.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {Category.SubCategory === "Special Number" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={SpecialNumber}
                            value={SpecialNumber.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {Category.SubCategory === "Home & Kitchen Appliance" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={HomeKitchenAppliance}
                            value={HomeKitchenAppliance.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Watches" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={Watches}
                            value={Watches.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Perfumes & Incense" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={PerfumesIncense}
                            value={PerfumesIncense.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {Category.SubCategory === "Cameras" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={Cameras}
                            value={Cameras.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Sports Equipment" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={SportsEquipment}
                            value={SportsEquipment.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Men's Fashion" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={MenFashion}
                            value={MenFashion.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Women's Fashion" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={WomenFashion}
                            value={WomenFashion.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory ===
                  "Children's Clothing & Accessories" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={ChildrenClothingAccessories}
                            value={ChildrenClothingAccessories.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Health & Beauty" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={HealthBeauty}
                            value={HealthBeauty.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Administrative Jobs" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={AdministrativeJobs}
                            value={AdministrativeJobs.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Fashion & Beauty Jobs" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={FashionBeautyJobs}
                            value={FashionBeautyJobs.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Security & Safety Jobs" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={SecuritySafetyJobs}
                            value={SecuritySafetyJobs.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "IT & Design Jobs" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={ITDesignJobs}
                            value={ITDesignJobs.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Agriculture & Farming Jobs" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={AgricultureFarmingJobs}
                            value={AgricultureFarmingJobs.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Industrial Jobs" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={IndustrialJobs}
                            value={IndustrialJobs.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {Category.SubCategory === "Medical & Nursing Jobs" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={MedicalNursingJobs}
                            value={MedicalNursingJobs.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory ===
                  "Architecture & Construction Jobs" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={ArchitectureConstructionJobs}
                            value={ArchitectureConstructionJobs.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Housekeeping Jobs" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={HousekeepingJobs}
                            value={HousekeepingJobs.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Restaurant Jobs" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={RestaurantJobs}
                            value={RestaurantJobs.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Sheep" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={Sheep}
                            value={Sheep.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Goats" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={Goats}
                            value={Goats.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Parrot" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={Parrot}
                            value={Parrot.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Dove/Pigeon" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={DovePigeon}
                            value={DovePigeon.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Cats" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={Cats}
                            value={Cats.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Chickens" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={Chickens}
                            value={Chickens.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Camels" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={Camels}
                            value={Camels.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Horses" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={Horses}
                            value={Horses.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {Category.SubCategory === "Dogs" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={Dogs}
                            value={Dogs.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {Category.SubCategory === "Cows" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={Cows}
                            value={Cows.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Hamsters" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={Hamsters}
                            value={Hamsters.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Squirrels" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={Squirrels}
                            value={Squirrels.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {Category.SubCategory === "Ducks" ? (
                    <div className="card w-100 w-md-50">
                      <div className="form-group">
                        <label className="col-form-label label-heading">
                          Select Nested SubCategory
                        </label>
                        <div className="row category-listing">
                          <Select
                            options={Ducks}
                            value={Ducks.find(
                              (option) =>
                                option.value === formData.NestedSubCategory
                            )}
                            onChange={SparePartsChange}
                            className="basic-single"
                            classNamePrefix="select"
                            placeholder="Select Subcategory"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {/* Car Brand Selection */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Breed
                    </label>

                    <select
                      onChange={(e) => setBreed(e.target.value)}
                      value={Breed}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option disabled value="">
                        Select Breed
                      </option>
                      <option value="German Shepherd">German Shepherd</option>
                      <option value="Labrador Retriever">
                        Labrador Retriever
                      </option>
                      <option value="Golden Retriever">Golden Retriever</option>
                      <option value="Beagle">Beagle</option>
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
                      Age
                    </label>
                    <select
                      onChange={(e) => setAge(e.target.value)}
                      value={Age}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>
                        Age
                      </option>
                      <option value="Puppy (0–1 year)">Puppy (0–1 year)</option>
                      <option value="Young (1–3 years)">
                        Young (1–3 years)
                      </option>
                      <option value="Adult (3–6 years)">
                        Adult (3–6 years)
                      </option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Gender
                    </label>
                    <select
                      onChange={(e) => setGender(e.target.value)}
                      value={Gender}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>
                        Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Color
                    </label>
                    <select
                      onChange={(e) => setColor(e.target.value)}
                      value={Color}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>
                        Color
                      </option>
                      <option value="Yellow">Yellow</option>
                      <option value="Black">Black</option>
                      <option value="Chocolate">Chocolate</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Size
                    </label>
                    <select
                      onChange={(e) => setSize(e.target.value)}
                      value={Size}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>
                        Size
                      </option>
                      <option value="Small (10–20 lbs)">
                        Small (10–20 lbs)
                      </option>
                      <option value="Medium (20–50 lbs)">
                        Medium (20–50 lbs)
                      </option>
                      <option value="Large (50–80 lbs)">
                        Large (50–80 lbs)
                      </option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Temperament
                    </label>
                    <select
                      onChange={(e) => setTemperament(e.target.value)}
                      value={Temperament}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>
                        Temperament
                      </option>
                      <option value="Friendly">Friendly</option>
                      <option value="Protective">Protective</option>
                      <option value="Playful">Playful</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Health Status
                    </label>
                    <select
                      onChange={(e) => setHealthStatus(e.target.value)}
                      value={HealthStatus}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>
                        Health Status
                      </option>
                      <option value="Spayed/Neutered">Spayed/Neutered</option>
                      <option value="Vaccinated">Vaccinated</option>
                      <option value="Dewormed">Dewormed</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Training Level
                    </label>
                    <select
                      onChange={(e) => setTrainingLevel(e.target.value)}
                      value={TrainingLevel}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>
                        Training Level
                      </option>
                      <option value="Untrained">Untrained</option>
                      <option value="Basic Commands">Basic Commands</option>
                      <option value="Fully Trained">Fully Trained</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Dietary Preferences
                    </label>
                    <select
                      onChange={(e) => setDietaryPreferences(e.target.value)}
                      value={DietaryPreferences}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>
                        Dietary Preferences
                      </option>
                      <option value="Grain-Free Diet">Grain-Free Diet</option>
                      <option value="Standard Dog Food">
                        Standard Dog Food
                      </option>
                      <option value="Organic Food">Organic Food</option>4
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
      )}
    </>
  );
};

export default PETANIMALCOMP;
