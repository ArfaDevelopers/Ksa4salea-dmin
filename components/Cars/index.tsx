"use client";
import React, { useEffect, useState, useMemo } from "react";
import { db } from "./../Firebase/FirebaseConfig";

import {
  addDoc,
  Timestamp,
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import Select from "react-select";
import { Country, State, City, ICity } from "country-state-city";
import { formatDistanceToNow, parseISO, isValid, format } from "date-fns";
import { useRouter } from "next/navigation";
import WindowedSelect from "react-windowed-select";
import cityData from "../../components/City.json";
import locationData from "../../components/Location.json";

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
  userId: string;
  category: string;
  views: string;
  createdAt: any;

  timeAgo: string;
  title: string;
  description: string;
  displayName: string;

  location: string;
  isActive: any; // <- not string

  img: string;
  Price: string;
  DrivenKm: any;
  Assembly: any;
  EngineCapacity: any;
  Color: string;
  City: string;
  PictureAvailability: any;
  EngineType: string;
  mileage: string;
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
  Condition: string;
  FeaturedAds: string;

  engineCapacity: string;
  isFeatured: string;
  model: string;
  purpose: string;
  registeredCity: string;
  sellerType: string;
  type: string;
  whatsapp: string;
  Purpose: any;
  FuelType: any;
  RegionalSpec: any;
  Insurance: any;
  InteriorColor: any;
  AdditionalFeatures: any;

  galleryImages: any;
};
const saudiCities = City.getCitiesOfCountry("SA"); // 'SA' = Saudi Arabia

interface Subcategory {
  name: string;
}

interface Category {
  name: string;
  subcategories: Subcategory[];
}

interface SelectedOption {
  value: string;
  label: string;
}
interface CityOption {
  value: string;
  label: string;
}

interface FormData {
  City: string;
}
const Cars = () => {
  const MySwal = withReactContent(Swal);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    displayName: "",
    createdAt: "",

    kmDriven: "",
    Transmission: "",
    Emirates: "",
    Registeredin: "",
    TrustedCars: "",
    InteriorColor: "",
    AdditionalFeatures: "",

    EngineType: "",
    EngineCapacity: "",
    mileage: "",
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
  const router = useRouter();

  const [name, setName] = useState("");
  const [imageUrls, setImageUrls] = useState(Array(6).fill("")); // Array to hold image URLs
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [mileage, setmileage] = useState("");

  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [timeAgo, setTimeAgo] = useState<Date | null>(new Date());
  const [imageFiles, setImageFiles] = useState(Array(6).fill(null)); // Array to hold selected image files
  const [registeredCity, setRegisteredCity] = useState("Un-Registered");
  const [assembly, setAssembly] = useState("Imported");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [Condition, setCondition] = useState("Used");
  const [purpose, setPurpose] = useState("Sell");
  const [PhoneNumber, setPhoneNumber] = useState("");

  const [model, setModel] = useState("2022");
  const [DrivenKm, setDrivenKm] = useState("");

  const [whatsapp, setWhatsapp] = useState("03189391781");
  const [type, setType] = useState("Sale");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [cities, setCities] = useState<ICity[]>([]); // IMPORTANT: Set type ICity[]

  useEffect(() => {
    const saudiCities = City.getCitiesOfCountry("SA") || []; // fallback to empty array
    setCities(saudiCities);
  }, []);
  const [Registeredin, setRegisteredin] = useState("");
  const [TrustedCars, setTrustedCars] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [InteriorColor, setInteriorColor] = useState("");

  const [selectedSpec, setSelectedSpec] = useState("");

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
  const [Insurance, selectedInsurance] = useState("");
  const [AdditionalFeatures, setAdditionalFeatures] = useState("");

  const [selectedAdType, setSelectedAdType] = useState("");
  const [ads, setAds] = useState<Ad[]>([]); // Define the type here as an array of 'Ad' objects
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const closeModal = () => setIsOpen(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null); // Holds the selected ad
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
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
  const [locationList, setLocationList] = useState<string[]>([]);
  console.log("1111111111111", locationList);
  // useEffect(() => {
  //   // Assuming Location.json is like { "location": [ ... ] } or is an array itself
  //   if (locationData.location && Array.isArray(locationData.location)) {
  //     setLocationList(locationData.location);
  //   } else if (Array.isArray(locationData)) {
  //     setLocationList(locationData);
  //   } else {
  //     // fallback empty or log error
  //     setLocationList([]);
  //     console.error("Location JSON data is not in expected format");
  //   }
  // }, []);
  useEffect(() => {
    console.log("11111122222", locationData); // Check what data you're getting
    if (Array.isArray(locationData)) {
      setLocationList(locationData); // Set cityList directly from locationData if it's an array
    } else {
      setLocationList([]); // You were using setLocationList before; make sure it's setCityList here
      console.error("City data is not in expected format");
    }
  }, [locationData]);

  const districtOptions = locationList.map((loc) => ({
    value: loc,
    label: loc,
  }));

  const [cityList, setCityList] = useState<string[]>([]);

  useEffect(() => {
    // Check if cityData is an array directly
    if (Array.isArray(cityData)) {
      setCityList(cityData); // Set cityList directly from cityData if it's an array
    } else {
      setCityList([]);
      console.error("City data is not in expected format");
    }
  }, [cityData]);

  const CityOptions = useMemo(
    () =>
      cityList.map((city) => ({
        value: city, // Adjust based on your cityData structure
        label: city,
      })),
    [cityList]
  );
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
  const carBrands = [
    "Toyota",
    "Ford",
    "Chevrolet",
    "Nissan",
    "Hyundai",
    "Genesis",
    "Lexus",
    "GMC",
    "Mercedes",
    "Honda",
    "BMW",
    "Motorcycles",
    "Kia",
    "Dodge",
    "Chrysler",
    "Jeep",
    "Mitsubishi",
    "Mazda",
    "Porsche",
    "Audi",
    "Suzuki",
    "Infinity",
    "Hummer",
    "Lincoln",
    "Volkswagen",
    "Daihatsu",
    "Geely",
    "Mercury",
    "Volvo",
    "Peugeot",
    "Bentley",
    "Jaguar",
    "Subaru",
    "MG",
    "ZXAUTO",
    "Changan",
    "Renault",
    "Buick",
    "Rolls-Royce",
    "Lamborghini",
    "Opel",
    "Skoda",
    "Ferrari",
    "Citroen",
    "Chery",
    "Seat",
    "Daewoo",
    "SABB",
    "SsangYong",
    "Aston Martin",
    "Proton",
    "Haval",
    "GAC",
    "Great Wall",
    "FAW",
    "BYD",
    "Alfa Romeo",
    "TATA",
    "JMC",
    "JETOUR",
    "CMC",
    "VICTORY AUTO",
    "MAXUS",
    "McLaren",
    "JAC",
    "Baic",
    "Dongfeng",
    "EXEED",
    "Tesla",
    "Soueaste",
    "Mahindra",
    "Zotye",
    "Hongqi",
    "SMART",
    "Tank",
    "Lynk & Co",
    "Lucid",
    "INEOS",
  ];
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
    const docRef = doc(db, "Cars", id);
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
    setSelectedOption((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option]
    );
  };

  // const handleCheckboxChange = (option: string) => {
  //   if (option === "Paid") {
  //     setSelectedOption("Featured Ads");
  //     console.log("Filtering: Featured Ads");
  //   } else if (option === "Unpaid") {
  //     setSelectedOption("Not Featured Ads");
  //     console.log("Filtering: Not Featured Ads");
  //   } else if (option === "inactive") {
  //     setSelectedOption("inactive");
  //     console.log("Filtering: Not Featured Ads");
  //   } else if (option === "true") {
  //     setSelectedOption("true");
  //     console.log("Filtering: Not Featured Ads");
  //   } else {
  //     setSelectedOption("All");
  //     console.log("Filtering: All Ads");
  //   }
  // };
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const adsCollection = collection(db, "Cars");
        const adsSnapshot = await getDocs(adsCollection);

        // Fetch views
        const viewsDocRef = doc(db, "views", "cars");
        const viewsDocSnap = await getDoc(viewsDocRef);
        const productViews = viewsDocSnap.exists()
          ? viewsDocSnap.data().products || {}
          : {};

        const updatedViews = { ...productViews }; // To later update back to Firestore

        const adsList: Ad[] = await Promise.all(
          adsSnapshot.docs.map(async (docSnap) => {
            const data = docSnap.data() || {};
            const id = docSnap.id;

            // Increment the view count in memory
            updatedViews[id] = (updatedViews[id] || 0) + 1;

            return {
              id: id,
              link: data.link || "",
              timeAgo: data.timeAgo || "",
              title: data.title || "",
              description: data.description || "",
              location: data.location || "",
              img: data.img || "",
              Price: data.Price || "",
              Assembly: data.Assembly || "",
              BodyType: data.BodyType || "",
              Color: data.Color || "",
              DrivenKm: data.DrivenKm || "",
              EngineCapacity: data.EngineCapacity || "",
              City: data.City || "",
              PictureAvailability: data.PictureAvailability || "",
              EngineType: data.EngineType || "",
              InteriorColor: data.InteriorColor || "",
              AdditionalFeatures: data.AdditionalFeatures || "",

              mileage: data.mileage || "",
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
              Condition: data.Condition || "",
              engineCapacity: data.engineCapacity || "",
              isFeatured: data.isFeatured || "",
              model: data.model || "",
              purpose: data.purpose || "",
              registeredCity: data.registeredCity || "",
              sellerType: data.sellerType || "",
              type: data.type || "",
              whatsapp: data.whatsapp || "",
              isActive: data.isActive || "",
              FeaturedAds: data.FeaturedAds || "",
              AdType: data.AdType || "",
              Purpose: data.Purpose || "",

              FuelType: data.FuelType || "",
              RegionalSpec: data.selectedSpec || "",
              Insurance: data.Insurance || "",

              galleryImages: data.galleryImages || {},

              userId: data.userId || {},
              category: data.category || {},
              displayName: data.displayName || {},
              createdAt: data.createdAt || {},

              views: data.views || 0, // Show updated view count
            };
          })
        );

        // Save updated views back to Firestore
        await setDoc(viewsDocRef, { products: updatedViews }, { merge: true });

        console.log(adsList, "adsList with views");
        console.log(selectedDate, "adsList with views______Date");

        let filteredAds = adsList;

        // Filter by selectedDate
        if (selectedDate) {
          filteredAds = filteredAds.filter((ad) => {
            const createdAtTimestamp = ad.createdAt;
            if (createdAtTimestamp.seconds) {
              const createdAtDate = new Date(createdAtTimestamp.seconds * 1000)
                .toISOString()
                .split("T")[0];
              return createdAtDate === selectedDate;
            }
            return false;
          });
        }

        // If "All" is selected, skip filtering
        if (selectedOption.includes("All")) {
          setAds(filteredAds);
        } else {
          let tempAds = filteredAds;

          if (selectedOption.includes("true")) {
            tempAds = tempAds.filter((ad) => ad.isActive === true);
          }

          if (selectedOption.includes("inactive")) {
            tempAds = tempAds.filter(
              (ad) => !ad.isActive || ad.isActive === "" || ad.isActive === null
            );
          }

          if (selectedOption.includes("Paid")) {
            tempAds = tempAds.filter((ad) => ad.FeaturedAds === "Featured Ads");
          }

          if (selectedOption.includes("Unpaid")) {
            tempAds = tempAds.filter(
              (ad) => ad.FeaturedAds === "Not Featured Ads"
            );
          }

          setAds(tempAds);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching ads:", error);
        setLoading(false);
      }
    };

    fetchAds();
  }, [refresh, selectedOption, activeCheckboxes, selectedDate]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
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
        setFormData((prev) => ({
          ...prev,
          SubCategory: adData.SubCategory || "",
          Category: adData.Category || "",
          NestedSubCategory: adData.NestedSubCategory || "",
        }));

        // Ensure all required fields are present or provide defaults
        const selectedAd: Ad = {
          id,
          link: adData.link || "",
          timeAgo: adData.timeAgo || new Date().toISOString(),
          title: adData.title || "Untitled",
          description: adData.description || "No description",
          displayName: adData.displayName || "No displayName",

          location: adData.location || "Unknown",
          img: adData.img || "",
          Price: adData.Price || "0",
          DrivenKm: adData.DrivenKm || "AdType",
          Assembly: adData.Assembly || "Assembly",
          City: adData.City || "City",
          Color: adData.Color || "Color",
          EngineCapacity: adData.EngineCapacity || "EngineCapacity",
          EngineType: adData.EngineType || "EngineType",
          InteriorColor: adData.InteriorColor || "InteriorColor",
          AdditionalFeatures: adData.AdditionalFeatures || "AdditionalFeatures",

          mileage: adData.mileage || "mileage",
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
          Condition: adData.Condition || "Condition",
          engineCapacity: adData.engineCapacity || "engineCapacity",
          isFeatured: adData.isFeatured || "isFeatured",
          model: adData.model || "engineCapacity",
          purpose: adData.purpose || "purpose",
          registeredCity: adData.registeredCity || "registeredCity",
          sellerType: adData.sellerType || "sellerType",
          type: adData.type || "type",
          whatsapp: adData.whatsapp || "whatsapp",
          Purpose: adData.Purpose || "Purpose",
          FuelType: adData.FuelType || "FuelType",
          galleryImages: adData.galleryImages || "galleryImages",
          RegionalSpec: adData.selectedSpec || "selectedSpec",
          Insurance: adData.Insurance || "Insurance",

          isActive: adData.isActive || "isActive",
          FeaturedAds: adData.FeaturedAds || "FeaturedAds",
          userId: adData.userId || "userId",
          category: adData.category || "category",
          views: adData.views || "views",
          createdAt: adData.createdAt || "createdAt",
        };
        console.log(selectedAd, "selectedAd____________");
        console.log(adData, "selectedAd____________adData");

        const images = Array<string | null>(6).fill(null);
        selectedAd.galleryImages.forEach((url: string, idx: number) => {
          images[idx] = url;
        });

        setImageUrls(images);
        setImageFiles(Array(6).fill(null));
        setDescription(selectedAd.description);
        setLink(selectedAd.link);
        setmileage(selectedAd.mileage);
        setCondition(selectedAd.Condition);
        setAssembly(selectedAd.assembly);
        setRegisteredCity(selectedAd.registeredCity);

        setDrivenKm(selectedAd.DrivenKm);
        setModel(selectedAd.model);
        setPhoneNumber(selectedAd.PhoneNumber);
        setPurpose(selectedAd.purpose);
        setType(selectedAd.type);

        setPrice(selectedAd.Price);
        setLocation(selectedAd.location);
        setName(selectedAd.title);
        setSelectedAd(selectedAd.Purpose);

        setTrustedCars(selectedAd.TrustedCars); // Pass a valid Ad object to setSelectedAd
        setSelectedCity(selectedAd.City); // Pass a valid Ad object to setSelectedAd
        setSelectedEngineType(selectedAd.EngineType); // Pass a valid Ad object to setSelectedAd
        setSelectedColor(selectedAd.Color); // Pass a valid Ad object to setSelectedAd
        setInteriorColor(selectedAd.InteriorColor); // Pass a valid Ad object to setSelectedAd
        setAdditionalFeatures(selectedAd.AdditionalFeatures); // Pass a valid Ad object to setSelectedAd

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
      setPrice;
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
    setmileage("");
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
    setInteriorColor("");
    setAdditionalFeatures("");

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
  const handleAdditionalFeatures = (event: any) => {
    const fuelType = event.target.value;
    setAdditionalFeatures(fuelType);
    console.log(fuelType); // Log selected fuel type to the console
  };
  const handleInsuranceChange = (event: any) => {
    const fuelType = event.target.value;
    selectedInsurance(fuelType);
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
  const nissanModels = [
    "Patrol",
    "DDSEN",
    "Tama",
    "Maxima",
    "Pathfinder",
    "Sunny",
    "Armada",
    "Xterra",
    "Class Z",
    "Nissan Shass",
    "Navara",
    "Murano",
    "Tiida",
    "Orphan",
    "Skyline",
    "Sentra",
    "X Trail",
    "Gloria",
    "Primera",
    "Terrano",
    "Qashqai",
    "Juke",
    "Kicks",
    "370Z",
    "GTR",
    "Civilian",
    "Patrol Safari",
    "Cedric",
    "Patrol NISMO",
  ];
  const bmwModels = [
    "Series VII",
    "Fifth Series",
    "Series X",
    "Series III",
    "Series VI",
    "Series 1st",
    "Series M",
    "Mini Cooper",
    "Series Z",
    "Series i",
    "Series 8",
    "Series 2",
    "Series 4",
  ];
  const jeepModels = [
    "Cherokee",
    "Grand Cherokee",
    "Wrangler",
    "Liberty",
    "Renegade",
    "Compass",
    "Geladiator",
  ];
  const mitsubishiModels = [
    "Pajero",
    "Lancer",
    "L200",
    "Nativa",
    "Galant",
    "Colt",
    "Magna",
    "Sigma",
    "ASX",
    "Attrage",
    "Eclipse Cross",
    "Outlander",
    "Space Star",
    "Montero",
    "Xpander",
    "Grandis",
  ];
  const mazdaModels = [
    "Mazda 6",
    "CX9",
    "Mazda 3",
    "323",
    "626",
    "CX7",
    "BT50",
    "MPV",
    "CX5",
    "CX2",
    "RX8",
    "MX-5",
    "CX3",
    "Mazda 2",
    "Mazda 5",
    "CX30",
    "CX60",
    "CX90",
  ];

  const baicModels = [
    "D50",
    "X35",
    "X7",
    "BJ80",
    "BJ40SE",
    "BJ40S",
    "BJ40 Plus",
    "BJ40F",
    "BJ40 C",
  ];
  const ineosModels = ["Grenadier"];

  const lucidModels = ["Air", "Gravity"];

  const lynkCoModels = ["1", "3", "03 plus", "5", "9"];

  const tankModels = ["Tank 300", "Tank 500"];

  const exeedModels = ["txl", "VX", "Exeed LX"];

  const dongfengModels = [
    "A30",
    "A60 MAX",
    "AX7",
    "AX7 MACH",
    "C31",
    "C32",
    "C35",
    "E32",
    "T5 Evo",
  ];
  const maxusModels = [
    "D90",
    "Maxus V80",
    "Maxus T60",
    "V90",
    "T70",
    "G50",
    "G10",
    "D90 Pro",
    "D60",
    "60 Tornado",
    "Maxus G90",
    "Maxus T90",
  ];
  const victoryAutoModels = ["Lifan"];

  const cmcModels = ["Foton", "Tunland"];

  const jetourModels = ["X70", "X70S", "X90", "Dashing"];

  const tataModels = ["XENON"];

  const alfaRomeoModels = ["GIULIA", "GIULIETTA", "STELVIO"];

  const bydModels = ["F3", "F5", "F7", "S6", "S7"];

  const fawModels = [
    "T80",
    "V80",
    "Oley",
    "Besturn B50",
    "Besturn B70",
    "Besturn X80",
    "T77",
    "X40",
    "T33",
    "T99",
  ];
  const greatWallModels = ["Wingle 5", "Wingle 6", "Wingle 7", "POER"];

  const gacModels = [
    "GA3",
    "GA4",
    "GA8",
    "GS3",
    "GS4",
    "GS8",
    "GN6",
    "GN8",
    "GS5",
    "GA6",
    "EMPOW",
    "EMZOOM",
    "EMKOO",
  ];
  const havalModels = [
    "Haval H2",
    "Haval H6",
    "Haval H9",
    "Jolion",
    "Dargo",
    "H6 GT",
  ];
  const protonModels = ["GEN•2", "Persona", "Waja"];

  const astonMartinModels = ["DB11", "DBS", "Rapide S", "Vantage"];

  const ssangYongModels = [
    "Actyon",
    "Musso",
    "Korando",
    "XLV",
    "Tivoli",
    "Rexton",
  ];
  const sabbModels = [
    "Fiat",
    "Dolce Vita",
    "Fiat 500",
    "Fiat 500X",
    "Fiorino",
    "Linea",
  ];
  const daewooModels = ["Leganza", "Lanos", "Mats", "Nubira"];

  const cheryModels = [
    "QQ",
    "Chery A5",
    "EASTAR",
    "Quinn",
    "Chery A3",
    "Chery A1",
    "Arezzo 3",
    "Arezzo 6",
    "Tiggo 2",
    "Tiggo 7",
    "Tiggo 8",
    "Tiggo 4",
    "Arrizo 5",
    "Arrizo 8",
  ];
  const citroenModels = [
    "C3",
    "C4",
    "C6",
    "Xara",
    "C2",
    "C1",
    "Regency",
    "Berlingo",
  ];
  const ferrariModels = [
    "488 PISTA",
    "812",
    "Break up",
    "GTC4",
    "MONZA",
    "Roma",
    "SF90",
  ];
  const porscheModels = [
    "Cayenne",
    "Panamera",
    "911",
    "Carrera",
    "Cayman",
    "Boxster",
    "Turbo",
    "GT",
    "Macan",
    "718",
  ];
  const skodaModels = [
    "Octavia",
    "Rapid",
    "Superb",
    "Fabia",
    "Karoq",
    "Kodiaq",
  ];
  const opelModels = ["Astra", "Rekord"];

  const rollsRoyceModels = ["Phantom", "Quest", "Dawn", "Wraith", "Cullinan"];
  const lamborghiniModels = ["Aventador", "Urus", "Huracan", "Gallardo"];

  const buickModels = [
    "Encore",
    "Encore GX",
    "Enclave",
    "Envision",
    "LaCrosse",
    "Regal",
    "Verano",
    "Lucerne",
    "Cascada",
    "Century",
    "Rainier",
    "Park Avenue",
    "Rendezvous",
  ];
  const renaultModels = [
    "Megane",
    "Fluence",
    "Safrane",
    "Laguna",
    "Clio",
    "Talisman",
    "Duster",
    "Dokker Van",
    "Symbol",
    "Capture",
    "Koleos",
    "Master",
    "Megane GT",
    "Megane RS",
  ];
  const changanModels = [
    "Eado",
    "CS35",
    "CS75",
    "CS95",
    "Changan V7",
    "CS85",
    "Alsvin",
    "Hunter",
    "CS35 Plus",
    "CS75 Plus",
    "UNI-T",
    "UNI-K",
    "UNI-V",
  ];
  const mgModels = [
    "5",
    "6",
    "HS",
    "MG RX8",
    "RX5",
    "ZS",
    "T60",
    "MG GT",
    "HS PHEV",
    "MG 1",
    "MG 3",
    "WHALE",
  ];
  const subaruModels = [
    "Legacy",
    "Impreza",
    "Forrester",
    "Outback",
    "WRX",
    "WRX STI",
    "XV",
  ];
  const jaguarModels = [
    "XJ",
    "X type",
    "S type",
    "Suv Virgen",
    "Daimler",
    "E pace",
    "F pace",
    "F type",
    "I pace",
    "XE",
    "XF",
  ];
  const bentleyModels = [
    "Continental Flying Spur",
    "Continental GT",
    "Arnage",
    "Azure",
    "Continental GTC",
    "Brooklands Coupe",
    "Bentayga",
    "Mulsanne",
  ];
  const peugeotModels = [
    "307",
    "407",
    "206",
    "508",
    "406",
    "Partner",
    "607",
    "404",
    "3008",
    "301",
    "5008",
    "Boxer",
    "Expert",
    "2008",
    "208",
    "408",
    "504",
    "Traveller",
    "Rifter",
    "Landtrek",
  ];
  const volvoModels = [
    "S 80",
    "850",
    "XC90",
    "S 60R",
    "S 40",
    "960",
    "S 70",
    "V 70XC",
    "C 70",
    "S60",
    "S90",
    "XC40",
    "XC60",
  ];

  const mercuryModels = ["Mountaineer", "Marauder"];

  const daihatsuModels = ["Sirion", "Taurus", "Materia"];
  const geelyModels = [
    "EC7",
    "EC8",
    "LC Panda",
    "Emgrand 7",
    "Emgrand GS",
    "Emgrand X7",
    "Binray",
    "Coolray",
    "Azkarra",
    "Tugella",
    "Okavango",
    "Monjaro",
    "Preface",
    "Geometry c",
    "Starray",
  ];
  const volkswagenModels = [
    "Passat",
    "Touareg",
    "Golf",
    "Beetle",
    "Polo",
    "Jetta",
    "Scirocco",
    "Tiguan",
    "Teramont",
    "T-roc",
    "Arteon",
  ];
  const hummerModels = ["H3", "H2", "H1"];
  const lincolnModels = [
    "Town Car",
    "Navigator",
    "MKS",
    "S",
    "Continental",
    "Nautilus",
    "Aviator",
    "Corsair",
  ];
  const infinitiModels = [
    "FX",
    "QX",
    "G",
    "Q",
    "M",
    "Q30",
    "Q50",
    "Q60",
    "Q70",
    "QX50",
    "QX60",
    "QX70",
    "QX80",
    "QX56",
  ];
  const suzukiModels = [
    "Vitara",
    "Samurai",
    "Swift",
    "Jimny",
    "Liana",
    "SX4",
    "Ertiga",
    "Baleno",
    "Grand Vitara",
    "Ciaz",
    "Celerio",
    "APV Pickup",
    "APV van",
    "Dzire",
    "Kizashi",
    "Fronx",
  ];
  const audiModels = [
    "A8",
    "A6",
    "Q7",
    "Q5",
    "A4",
    "A5",
    "A7",
    "S8",
    "TT",
    "A3",
    "Q3",
    "Q8",
    "R8",
    "RS",
    "S3",
  ];
  const chryslerModels = [
    "M300",
    "C300",
    "Grand Voyager",
    "Concorde",
    "Crossfire",
    "C200",
    "PT Cruiser",
    "Imperial",
    "Plymouth",
    "Pacifica",
  ];
  const dodgeModels = [
    "Charger",
    "Gallinger",
    "Durango",
    "Caravan",
    "Archer",
    "Nitro",
    "Caliber",
    "Fiber",
    "Dodge Pickup",
    "Voyager",
    "Interpid",
    "Neon",
  ];
  const kiaModels = [
    "Optima",
    "Cerato",
    "Rio",
    "Carnival",
    "Sportage",
    "Cadenza",
    "Opirus",
    "Sorento",
    "Cairns",
    "Picanto",
    "Mohave",
    "Corres",
    "Soul",
    "Sephia",
    "K900",
    "Pegas",
    "Telluride",
    "Stinger",
    "Seltos",
    "Niro",
    "K5",
    "Sonet",
    "NS",
  ];
  const motorcycleBrands = [
    "Suzuki",
    "Yamaha Motorcycles",
    "Chinese Motorcycle",
    "Honda Motorcycles",
    "Harley Motorcycles",
    "Ram's Motorcycles",
    "Kuzaki Motorcycles",
    "Jet Ski",
    "BMW Motorcycle",
    "KTM Motorcycles",
    "indian Motorcycle",
    "Buggy Car",
    "Polaris Bike",
    "can am",
    "Karting",
    "Haojue Motorcycle",
  ];
  const hondaModels = [
    "Accord",
    "Civic",
    "Odyssey",
    "CRV",
    "Baylott",
    "City",
    "Legends",
    "Brielle",
    "Integra",
    "HRV",
    "ZRV",
  ];
  const mercedesModels = [
    "S",
    "E",
    "SE",
    "SEL",
    "AMG",
    "Mercedes-Benz G",
    "C",
    "SL",
    "CLS",
    "ML",
    "CL",
    "CLK",
    "SEC",
    "SLK",
    "A-Class",
    "GLS",
    "GLE",
    "GLC",
    "GLA",
    "CLA",
    "V-Class",
    "B",
    "GL",
    "GLK",
    "GT",
    "GTS",
    "R",
    "SLC",
    "Van Sprinter",
    "Maybach",
    "GLB",
    "EQA",
    "EQB",
    "EQE",
    "EQS",
  ];
  const gmcModels = [
    "Yukon",
    "Superban",
    "Sierra",
    "Pick up",
    "Envoy",
    "Acadia",
    "Van",
    "Savana",
    "Safari",
    "Terrain",
    "Jimmy",
  ];
  const genesisModels = ["G70", "G80", "G90", "GV80", "GV70"];
  const lexusModels = [
    "LS",
    "LX",
    "ES",
    "GS",
    "IS",
    "RX",
    "GX",
    "SC",
    "NX",
    "LC",
    "RC",
    "RCF",
    "UX",
    "GSF",
  ];
  const hyundaiModels = [
    "Sonata",
    "Elantra",
    "Accent",
    "Azera",
    "Hyundai H1",
    "Sentavi",
    "Tucson",
    "Veloster",
    "Trajet",
    "i40",
    "Centennial",
    "Coupe",
    "i10",
    "Veracruz",
    "Terracan",
    "Matrix",
    "Galloper",
    "Kona",
    "Creta",
    "Palisade",
    "Grand Santa Fe",
    "i30",
    "Venue",
    "Staria",
    "Stargazer",
  ];
  const chevroletModels = [
    "Caprice",
    "Tahoe",
    "Suburban",
    "Lumina",
    "Salvador",
    "Camaro",
    "Blazer",
    "Epica",
    "Malibu",
    "Aveo",
    "Cruze",
    "Optra",
    "Trail Blazer",
    "Avalanche",
    "Corvette",
    "فان",
    "Impala",
    "Traverse",
    "Uplander",
    "Express Van",
    "فنشر",
    "Captiva",
    "Astro Van",
    "Sonic",
    "Spark",
    "Caravan",
    "Cavalier",
    "Colorado",
    "جي فان",
    "Equinox",
    "Bolt",
    "Groove",
    "Trax",
  ];
  const toyotaModels = [
    "Land Cruiser",
    "Camry",
    "Avalon",
    "Hilux",
    "Corolla",
    "FJ Cruiser",
    "Land Cruiser 70 Series",
    "Land Cruiser 70 Series Pick up",
    "Yaris",
    "Land Cruiser Prado",
    "Fortuner",
    "Aurion",
    "Cressida",
    "Sequoia",
    "Bus",
    "Innova",
    "RAV4",
    "XA",
    "Eco",
    "Tundra",
    "Previa",
    "Supra",
    "Toyota 86",
    "Avanza",
    "Highlander",
    "Prius",
    "Rush",
    "Granvia",
    "C-HR",
    "Corolla Cross",
    "Raize",
    "Crown",
    "Urban Cruiser",
  ];
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
        const carsCollectionRef = collection(db, "Cars");
        const querySnapshot = await getDocs(carsCollectionRef);
        const carsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // 👇 Log all userIds
        // carsData.forEach((car) => {
        //   console.log("carsData_________ ID:", car.userId);
        // });
        console.log(carsData, "carsData_________1122");
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
  console.log(filteredAds, "carsData_________filteredAds");

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
        Title: name,
        img: imageUrls[0], // img1
        img2: imageUrls[1], // img2
        img3: imageUrls[2], // img3
        img4: imageUrls[3], // img4
        img5: imageUrls[4], // img5
        img6: imageUrls[5], // img6
        Location: location,
        Price: price,
        Link: link,
        timeAgo: (timeAgo ?? new Date()).toISOString(), // Use the current date if timeAgo is null
        category: Category1,
        NestedSubCategory: nestedSubCategory,
        Description: description,
        // displayName: displayName,

        registeredCity: registeredCity,
        assembly: assembly,
        LastUpdated: lastUpdated.toISOString(),
        Condition: Condition,
        Purpose: purpose,
        RegionalSpec: selectedSpec,
        Insurance: Insurance,

        Model: model,
        whatsapp: whatsapp,
        type: type,
        isFeatured: selectedAdType,
        VideoAvailability: selectedVideoAvailability,
        PictureAvailability: selectedPictureAvailability,
        FuelType: selectedFuelType,
        ModalCategory: selectedModalCategory,
        SellerType: selectedSellerType,
        NumberOfDoors: selectedNumberOfDoors,
        SeatingCapacity: selectedSeatingCapacity,
        Assembly: selectedAssembly,
        BodyType: selectedBodyType,
        Color: selectedColor,
        InteriorColor: InteriorColor,
        AdditionalFeatures: AdditionalFeatures,

        EngineType: selectedEngineType,
        EngineCapacity: selectedEngineCapacity,
        Transmission: selectedTransmission,
        TrustedCars: TrustedCars,
        Registeredin: Registeredin,
        City: selectedCity,
        DrivenKm: DrivenKm,
        PhoneNumber: PhoneNumber,

        mileage: mileage,
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
        <div className="flex space-x-4 items-center">
          <span className="text-gray-700 font-medium">Filter:</span>

          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedOption.includes("All")}
              onChange={() => handleCheckboxChange("All")}
              className="form-checkbox text-blue-600"
            />
            <span>All</span>
          </label>

          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedOption.includes("Paid")}
              onChange={() => handleCheckboxChange("Paid")}
              className="form-checkbox text-blue-600"
            />
            <span>Paid</span>
          </label>

          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedOption.includes("Unpaid")}
              onChange={() => handleCheckboxChange("Unpaid")}
              className="form-checkbox text-blue-600"
            />
            <span>Unpaid</span>
          </label>

          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedOption.includes("true")}
              onChange={() => handleCheckboxChange("true")}
              className="form-checkbox text-blue-600"
            />
            <span>Banned</span>
          </label>

          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedOption.includes("inactive")}
              onChange={() => handleCheckboxChange("inactive")}
              className="form-checkbox text-blue-600"
            />
            <span>Active</span>
          </label>

          <label className="inline-flex items-center space-x-2">
            <input
              type="date"
              className="ml-4 p-1 border border-gray-300 rounded"
              onChange={(e) => handleDateChange(e.target.value)}
            />
            <span>Date Posted</span>
          </label>
          {/* <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedOption === "Not Featured Ads"}
              onChange={() => handleCheckboxChange("Unpaid")}
              className="form-checkbox text-blue-600"
            />
            <span>Active</span>
          </label>
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedOption === "Not Featured Ads"}
              onChange={() => handleCheckboxChange("Unpaid")}
              className="form-checkbox text-blue-600"
            />
            <span>Date Posted</span>
          </label> */}
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
                Ad Title
              </th>
              <th scope="col" className="px-6 py-3">
                Paid / Unpaid
              </th>

              <th scope="col" className="px-6 py-3">
                Posted Date & Time
              </th>
              <th scope="col" className="px-6 py-3">
                Ad Live Link
              </th>
              <th scope="col" className="px-6 py-3">
                Ad Views
              </th>
              <th scope="col" className="px-6 py-3">
                User Profile
              </th>
              <th scope="col" className="px-6 py-3">
                Ad Status
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
                <td className="px-6 py-4">
                  {ad.FeaturedAds === "Featured Ads" ? "Paid" : "Unpaid"}
                </td>

                <td className="px-6 py-4">
                  {ad.createdAt &&
                  ad.createdAt instanceof Timestamp &&
                  isValid(ad.createdAt.toDate()) ? (
                    <>
                      {format(ad.createdAt.toDate(), "yyyy-MM-dd")}
                      <br />
                      {format(ad.createdAt.toDate(), "HH:mm:ss")}
                    </>
                  ) : (
                    "-"
                  )}
                </td>

                <td className="px-6 py-4">
                  {/* {ad.FeaturedAds === "Featured Ads" && ( */}
                  <a
                    href={`http://168.231.80.24:3002/#/Dynamic_Route?id=${ad.id}&callingFrom=AutomotiveComp`}
                    target="_blank"
                    rel="noopener noreferrer" // Recommended for security
                    className="text-blue-600 underline cursor-pointer"
                  >
                    Live
                  </a>
                  {/* )} */}
                </td>

                <td className="px-6 py-4">{ad.views}</td>
                <td
                  className="px-6 py-4 cursor-pointer text-blue-600 hover:underline"
                  onClick={() =>
                    router.push(
                      `/UserListing?userId=${ad.userId}&callingFrom=${"Cars"}`
                    )
                  }
                >
                  {typeof ad.displayName === "string" &&
                  ad.displayName.trim() !== ""
                    ? ad.displayName
                    : "-"}
                </td>

                <td className="px-6 py-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={ad.isActive}
                    onChange={() => {
                      handleToggle(ad.id); // Toggle UI state
                      handleFirebaseToggle(ad.id, !!activeCheckboxes[ad.id]); // Update Firestore
                    }}
                  />
                  <span>{ad.isActive ? "Banned" : "Active"}</span>
                </td>

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
            style={{ marginTop: "69%" }}
          >
            <div
              className="relative w-full max-w-lg"
              style={{ marginTop: "52%" }}
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              >
                &times;
              </button>
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

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      City
                    </label>
                    <WindowedSelect
                      options={CityOptions}
                      value={
                        CityOptions.find(
                          (option) => option.value === formData.City
                        ) || null
                      }
                      onChange={(newValue: unknown, actionMeta) => {
                        // Type assertion to CityOption or null
                        const selectedOption = newValue as CityOption | null;
                        setFormData((prev) => ({
                          ...prev,
                          City: selectedOption ? selectedOption.value : "",
                        }));
                      }}
                      placeholder="Select a City"
                      isClearable
                      className="w-100"
                      windowThreshold={100}
                    />
                  </div>
                  <div className="card w-100 w-md-50">
                    <div className="card-header">
                      <h4>Select District</h4>
                    </div>
                    <div className="card-body">
                      <Select
                        options={districtOptions}
                        value={
                          districtOptions.find(
                            (option) => option.value === formData.District
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          setFormData((prev) => ({
                            ...prev,
                            District: selectedOption
                              ? selectedOption.value
                              : "",
                          }))
                        }
                        placeholder="Select a district"
                        isClearable
                        className="w-100"
                      />
                    </div>
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
                  {/* Location Selection */}
                  {/* <div className="mb-4">
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
                  </div> */}

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
                      {carBrands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedCarBrand === "Toyota" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {toyotaModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Ford" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {toyotaModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Chevrolet" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {chevroletModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Nissan" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {nissanModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Hyundai" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {hyundaiModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Genesis" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {genesisModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Lexus" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {lexusModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "GMC" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {gmcModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Mercedes" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {mercedesModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Honda" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {hondaModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "BMW" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {bmwModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Motorcycles" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {motorcycleBrands.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Kia" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {kiaModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Dodge" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {dodgeModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Chrysler" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {chryslerModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Jeep" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {jeepModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCarBrand === "Mitsubishi" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {mitsubishiModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCarBrand === "Mazda" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {mazdaModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCarBrand === "Porsche" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {porscheModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Audi" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {audiModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Suzuki" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {suzukiModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCarBrand === "Infiniti" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {infinitiModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCarBrand === "Hummer" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {hummerModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCarBrand === "Lincoln" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {lincolnModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Volkswagen" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {volkswagenModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Daihatsu" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {daihatsuModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Geely" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {geelyModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Mercury" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {mercuryModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCarBrand === "Volvo" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {volvoModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Peugeot" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {peugeotModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Bentley" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {bentleyModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Jaguar" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {jaguarModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Subaru" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {subaruModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "MG" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {mgModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Changan" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {changanModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Renault" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {renaultModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Buick" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {buickModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Rolls-Royce" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {rollsRoyceModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Lamborghini" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {lamborghiniModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Opel" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {opelModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Rolls-Royce" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {rollsRoyceModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Skoda" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {skodaModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Ferrari" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {ferrariModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Citroen" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {citroenModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Chery" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {cheryModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Daewoo" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {daewooModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "SABB" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {sabbModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCarBrand === "SsangYong" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {ssangYongModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Aston Martin" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {astonMartinModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Proton" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {protonModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Haval" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {havalModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "GAC" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {gacModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Great Wall" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {greatWallModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "FAW" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {fawModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "BYD" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {bydModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Alfa Romeo" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {alfaRomeoModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "TATA" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {tataModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "JETOUR" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {jetourModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "CMC" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {cmcModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCarBrand === "VICTORY AUTO" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {victoryAutoModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCarBrand === "MAXUS" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {maxusModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCarBrand === "BAIC" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {baicModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCarBrand === "DONGFENG" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {dongfengModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCarBrand === "EXEED" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {exeedModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCarBrand === "Tank" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {tankModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedCarBrand === "Lynk & Co" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {lynkCoModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "Lucid" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {lucidModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {selectedCarBrand === "INEOS" && (
                    <div className="mb-4">
                      <label className="block w-full text-gray-700 text-sm font-bold mb-2">
                        Make
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            Model: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Model</option>
                        {ineosModels.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
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
                  {/* Condition */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Condition
                    </label>
                    <select
                      onChange={(e) => setCondition(e.target.value)}
                      value={Condition}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="New">New</option>
                      <option value="Used">Used</option>
                    </select>
                  </div>
                  {/* Manufacture Year */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="formmileage"
                    >
                      Manufacture Year
                    </label>
                    <input
                      type="text"
                      placeholder="Enter mileage "
                      value={mileage}
                      onChange={(e) => setmileage(e.target.value)}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  {/* Specification */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Specification
                    </label>
                    <select
                      onChange={(e) => setSelectedSpec(e.target.value)}
                      value={selectedSpec}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>
                        Select Specification
                      </option>
                      <option value="GCC">GCC Specs</option>
                      <option value="American">American Specs</option>
                      <option value="Japanese">Japanese Specs</option>
                      <option value="European">European Specs</option>
                      <option value="Canadian">Canadian Specs</option>
                    </select>
                  </div>

                  {/* Color */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Exterior Color
                    </label>
                    <select
                      onChange={(e) => setSelectedColor(e.target.value)}
                      value={selectedColor}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>
                        Select Exterior Color
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
                  {/* Color */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Interior Color
                    </label>
                    <select
                      onChange={(e) => setInteriorColor(e.target.value)}
                      value={InteriorColor}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>
                        Select Interior Color
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
                      onChange={(e) =>
                        setSelectedSeatingCapacity(e.target.value)
                      }
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
                      <option value="Sell">Sell</option>
                      <option value="Rent">Rent</option>
                      <option value="Wanted">Wanted</option>
                    </select>
                  </div>

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
                      {imageUrls[index] && (
                        <img
                          src={imageUrls[index]}
                          alt={`Preview ${index + 1}`}
                          className="mt-2 w-32 h-32 object-cover border rounded"
                        />
                      )}
                    </div>
                  ))}

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
                      <option value="diesel">Diesel</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="lpg">LPG</option>
                      <option value="cng">CNG</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Insurance{" "}
                    </label>
                    <select
                      onChange={handleInsuranceChange}
                      value={Insurance}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>
                        Select Insurance
                      </option>
                      <option value="Comprehensive">
                        Comprehensive Insurance
                      </option>
                      <option value="ThirdParty">Third-Party Insurance</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="No Insurance">No Insurance</option>
                      <option value="cng">CNG</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Additional Features
                    </label>
                    <select
                      onChange={handleAdditionalFeatures}
                      value={AdditionalFeatures}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>
                        Select Additional Feature
                      </option>
                      <option value="fullOption">Full option</option>
                      <option value="insured">Insured</option>
                      <option value="selfParking">Self Parking</option>
                      <option value="alarmSystem">Alarm System</option>
                      <option value="dealership">Dealership</option>
                      <option value="quickSelling">Quick Selling</option>
                      <option value="navigation">Navigation</option>
                      <option value="temperatureSeats">
                        Temperature Controlled Seats
                      </option>
                      <option value="inspected">Inspected</option>
                      <option value="parkingSensors">Parking Sensors</option>
                      <option value="bluetooth">Bluetooth</option>
                      <option value="sunroof">Sunroof/Moonroof</option>
                      <option value="leatherSeats">Leather Seats</option>
                      <option value="backupCamera">Backup Camera</option>
                      <option value="heatedSeats">Heated Seats</option>
                      <option value="keylessEntry">Keyless Entry</option>
                      <option value="remoteStart">Remote Start</option>
                      <option value="adaptiveCruise">
                        Adaptive Cruise Control
                      </option>
                      <option value="laneDeparture">
                        Lane Departure Warning
                      </option>
                      <option value="blindSpot">Blind Spot Monitoring</option>
                      <option value="premiumSound">Premium Sound System</option>
                      <option value="awd">All-Wheel Drive</option>
                      <option value="touchscreen">Touchscreen Display</option>
                      <option value="carPlay">
                        Apple CarPlay/Android Auto
                      </option>
                      <option value="ledHeadlights">LED Headlights</option>
                      <option value="towPackage">Tow Package</option>
                      <option value="powerLiftgate">Power Liftgate</option>
                      <option value="headUpDisplay">Head-Up Display</option>
                      <option value="rainWipers">Rain-Sensing Wipers</option>
                      <option value="emergencyBraking">
                        Automatic Emergency Braking
                      </option>
                      <option value="ambientLighting">Ambient Lighting</option>
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
              {/* </div> */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cars;
