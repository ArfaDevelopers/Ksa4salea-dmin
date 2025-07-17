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
import {
  FiX,
  FiPhone,
  FiTag,
  FiCheck,
  FiShield,
  FiSettings,
  FiDollarSign,
} from "react-icons/fi";
import {
  FaCity,
  FaMapMarkedAlt,
  FaListAlt,
  FaCar,
  FaCarSide,
  FaRoad,
  FaTools,
  FaIdCard,
} from "react-icons/fa";
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
interface City {
  CITY_ID: number;
  "City En Name": string;
  REGION_ID: number;
}

interface CityOption {
  value: number;
  label: string;
  regionId: number;
  cityId: number;
}

interface SelectedCity {
  REGION_ID: number;
  CITY_ID: number;
  label: string;
}
interface District {
  DISTRICT_ID: number;
  REGION_ID: number;
  CITY_ID: number;
  "District En Name": string;
}

interface DistrictOption {
  value: number;
  label: string;
  regionId: number;
  cityId: number;
}

interface SelectedDistrict {
  REGION_ID: number;
  CITY_ID: number;
  DISTRICT_ID: number;
  label: string;
}

type Ad = {
  id: any; // Change from string to number
  link: string;
  userId: string;
  category: string;
  views: string;
  createdAt: any;

  // timeAgo: string;
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
  value: number;
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

    PriceRange: "",
    PriceFrom: "65",
    PriceTo: "120",
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
  const [Price, setPrice] = useState("");
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
  const [cities, setCities] = useState<City[]>([]);

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
  const [AdditionalFeatures, setAdditionalFeatures] = useState<string[]>([]);

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
  const [modalVisible, setModalVisible] = useState(false);
  const [isCityModalVisible, setIsCityModalVisible] = useState(false);
  const [isCityModalVisible1, setIsCityModalVisible1] = useState(false);

  const [selectedDistricts, setSelectedDistricts] = useState<
    SelectedDistrict[]
  >([]);
  console.log(selectedDistricts, "selectedDistricts___________");

  const [selectedCities, setSelectedCities] = useState<SelectedCity[]>([]);

  const [selectedRegion, setSelectedRegionId] = useState<number | "">("");
  console.log(selectedRegion, "selectedRegion_____2");
  const [districts, setDistricts] = useState<District[]>([]);
  console.log(districts, "selectedRegion_____3");
  console.log(formData, "selectedRegion_____4");

  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedRegion) return;

      try {
        const response = await fetch(
          `http://168.231.80.24:9002/api/cities?REGION_ID=${selectedRegion}`
        );
        const data = await response.json();

        if (data.cities) {
          setCities(data.cities);
          console.log("Fetched cities:", data.cities);
        } else {
          console.warn("No cities found");
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, [selectedRegion]);

  const cityOptions: CityOption[] = cities.map((city) => ({
    value: city.CITY_ID,
    label: city["City En Name"],
    regionId: city.REGION_ID,
    cityId: city.CITY_ID,
  }));

  const handleCheckboxChange1 = (option: CityOption) => {
    const exists = selectedCities.some(
      (city) => city.CITY_ID === option.cityId
    );

    if (exists) {
      // Uncheck
      setSelectedCities([]);
    } else {
      // Add with label and string values
      setSelectedCities([
        {
          CITY_ID: option.cityId,
          REGION_ID: option.regionId,
          label: option.label,
        },
      ]);
    }
  };

  type District = {
    District_ID: number;
    "District En Name": string;
    REGION_ID: number;
    CITY_ID: number;
    // Add other properties if needed
  };
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedCities.length) return;

      const REGION_ID = selectedCities[0]?.REGION_ID;
      const CITY_ID = selectedCities[0]?.CITY_ID;

      try {
        const response = await fetch(
          `http://168.231.80.24:9002/api/districts?REGION_ID=${REGION_ID}&CITY_ID=${CITY_ID}`
        );
        const data = await response.json();
        if (data.districts) {
          setDistricts(data.districts);
          console.log("Districts fetched:", data.districts);
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();
  }, [selectedCities]);

  const regionOptions = [
    {
      value: 1,
      label: "Riyadh (الرياض)",
      regionId: 1,
      regionEn: "Riyadh",
      // regionAr: "الرياض",
      latitude: 24.63651,
      longitude: 46.718845,
    },
    {
      value: 2,
      label: "Makkah (مكة المكرمة)",
      regionId: 2,
      regionEn: "Makkah",
      // regionAr: "مكة المكرمة",
      latitude: 21.406328,
      longitude: 39.809088,
    },
    {
      value: 3,
      label: "Al Madinah (المدينة المنورة)",
      regionId: 3,
      regionEn: "Al Madinah",
      // regionAr: "المدينة المنورة",
      latitude: 24.427145,
      longitude: 39.649658,
    },
    {
      value: 4,
      label: "Al Qassim (القصيم)",
      regionId: 4,
      regionEn: "Al Qassim",
      // regionAr: "القصيم",
      latitude: 26.338499,
      longitude: 43.965396,
    },
    {
      value: 5,
      label: "Eastern (المنطقة الشرقية)",
      regionId: 5,
      regionEn: "Eastern",
      // regionAr: "المنطقة الشرقية",
      latitude: 26.372185,
      longitude: 49.993286,
    },
    {
      value: 6,
      label: "Asir (عسير)",
      regionId: 6,
      regionEn: "Asir",
      // regionAr: "عسير",
      latitude: 18.20848,
      longitude: 42.533569,
    },
    {
      value: 7,
      label: "Tabuk (تبوك)",
      regionId: 7,
      regionEn: "Tabuk",
      // regionAr: "تبوك",
      latitude: 28.401064,
      longitude: 36.573486,
    },
    {
      value: 8,
      label: "Hail (حائل)",
      regionId: 8,
      regionEn: "Hail",
      // regionAr: "حائل",
      latitude: 27.527758,
      longitude: 41.698608,
    },
    {
      value: 9,
      label: "Northern Borders (الحدود الشماليه)",
      regionId: 9,
      regionEn: "Northern Borders",
      // regionAr: "الحدود الشماليه",
      latitude: 30.977609,
      longitude: 41.011962,
    },
    {
      value: 10,
      label: "Jazan (جازان)",
      regionId: 10,
      regionEn: "Jazan",
      // regionAr: "جازان",
      latitude: 16.890959,
      longitude: 42.548375,
    },
    {
      value: 11,
      label: "Najran (نجران)",
      regionId: 11,
      regionEn: "Najran",
      // regionAr: "نجران",
      latitude: 17.489489,
      longitude: 44.134333,
    },
    {
      value: 12,
      label: "Al Bahah (الباحة)",
      regionId: 12,
      regionEn: "Al Bahah",
      // regionAr: "الباحة",
      latitude: 20.014645,
      longitude: 41.456909,
    },
    {
      value: 13,
      label: "Al Jawf (الجوف)",
      regionId: 13,
      regionEn: "Al Jawf",
      // regionAr: "الجوف",
      latitude: 29.971888,
      longitude: 40.200476,
    },
  ];
  const regionPairs = [];
  for (let i = 0; i < regionOptions.length; i += 2) {
    regionPairs.push(regionOptions.slice(i, i + 2));
  }

  const districtOptions = districts.map((district) => ({
    value: district.District_ID,
    label: district["District En Name"],
    regionId: district.REGION_ID,
    cityId: district.CITY_ID,
  }));
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
    console.log("useEffect triggered");

    const fetchAds = async () => {
      setLoading(true);
      try {
        const params: any = {};

        if (selectedOption.includes("Featured Ads")) {
          params.FeaturedAds = "Featured Ads";
        }

        if (selectedOption.includes("Not Featured Ads")) {
          params.FeaturedAds = "Not Featured Ads";
        }

        if (selectedOption.includes("true")) {
          params.isActive = "true";
        }

        if (selectedOption.includes("inactive")) {
          params.isActive = "false";
        }

        if (selectedOption.includes("Premium")) {
          params.AdType = "Premium";
        }

        if (selectedDate) {
          params.createdDate = selectedDate;
        }

        if (searchTerm.trim() !== "") {
          params.searchText = searchTerm.trim();
        }

        console.log("Sending query params:", params);

        const response = await axios.get(
          "http://168.231.80.24:9002/currentUserData/Motors",
          {
            params,
          }
        );

        setAds(response.data);
        console.log("Fetched Ads:", response.data);
      } catch (error: any) {
        console.error(
          "Error fetching ads:",
          error?.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [refresh, selectedOption, selectedDate, searchTerm]);

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
        // setTimeAgo(adData.timeAgo);
        setLocation(adData.location);
        setPrice(adData.Price);
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
          // timeAgo: adData.timeAgo || new Date().toISOString(),
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
    // setTimeAgo(new Date());

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
    setAdditionalFeatures([]);

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
  const handleAdditionalFeatures = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setAdditionalFeatures(selectedOptions);
    console.log(selectedOptions); // Logs an array of selected features
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
    "CaPrice",
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
    try {
      const carsCollection = collection(db, "Cars");

      const docRef = await addDoc(carsCollection, {
        Title: name,
        galleryImages: imageUrls, // 👈 Save all images in one array
        Location: location,
        Price: Price,
        Link: link,
        category: Category1,
        NestedSubCategory: nestedSubCategory,
        Description: description,

        registeredCity: registeredCity,
        assembly: assembly,
        Condition: Condition,
        Purpose: purpose,
        RegionalSpec: selectedSpec,
        Insurance: Insurance,
        createdAt: Timestamp.now(),
        regionId: selectedRegion,
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
        // City: selectedCity,
        DrivenKm: DrivenKm,
        PhoneNumber: PhoneNumber,
        SelectedCities: selectedCities,
        CityName: selectedCities[0]?.label,
        City: selectedCities[0]?.label,
        CITY_ID: selectedCities[0]?.CITY_ID,
        REGION_ID: selectedCities[0]?.REGION_ID,
        DISTRICT_ID: selectedDistricts[0]?.DISTRICT_ID,
        District: selectedDistricts[0]?.label,

        mileage: mileage,
      });

      alert("Car added successfully!");
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
      <div className="relative overflow-x-auto">
        <div className="flex space-x-4 items-center mb-2">
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
              checked={selectedOption.includes("Featured Ads")}
              onChange={() => handleCheckboxChange("Featured Ads")}
              className="form-checkbox text-blue-600"
            />
            <span>Paid</span>
          </label>

          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedOption.includes("Not Featured Ads")}
              onChange={() => handleCheckboxChange("Not Featured Ads")}
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
        <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 p-3 bg-white dark:bg-gray-900">
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
                <td
                  scope="row"
                  className="items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    style={{
                      display: "inline-block",
                    }}
                    src={ad.galleryImages[0]}
                    alt={ad.title}
                  />
                  <div
                    className="ps-3"
                    style={{
                      display: "inline-block",
                    }}
                  >
                    <div className="text-base font-semibold">{ad.title}</div>
                    <div className="font-normal text-gray-500"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {ad.FeaturedAds === "Featured Ads"
                    ? "Featured Ads"
                    : "Not Featured Ads"}
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

                <td className="px-6 py-4 items-center gap-2">
                  <input
                    style={{
                      marginRight: "5px",
                    }}
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="flex justify-center items-center min-h-screen py-8 px-4">
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mt-20 -mr-20 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -mb-10 -ml-10 blur-xl"></div>

                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors z-10"
                  aria-label="Close"
                >
                  <FiX className="w-5 h-5" />
                </button>

                <div className="flex items-center mb-2">
                  <div className="flex space-x-1 mr-3">
                    <FaCar className="text-white/90 h-5 w-5" />
                    <FaCarSide className="text-white/90 h-5 w-5" />
                    <FaRoad className="text-white/90 h-5 w-5" />
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
              <div className="p-6 max-h-[70vh] overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <form onSubmit={handleAddCar} className="space-y-6">
                  {/* Basic Information Section */}
                  <div className="bg-white dark:bg-gray-750 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                        <FaIdCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      Basic Information
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          <div className="flex items-center">
                            <FiTag className="mr-2 h-4 w-4 text-blue-500" />
                            Car Name
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

                      {/* Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          <div className="flex items-center">
                            <FiDollarSign className="mr-2 h-4 w-4 text-blue-500" />
                            Type
                          </div>
                        </label>
                        <select
                          onChange={(e) => setType(e.target.value)}
                          value={type}
                          required
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors appearance-none bg-no-repeat bg-right"
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                            backgroundSize: "1.5em 1.5em",
                            paddingRight: "2.5rem",
                          }}
                        >
                          <option value="Sale">Sale</option>
                          <option value="Lease">Lease</option>
                        </select>
                      </div>

                      {/* Phone */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          <div className="flex items-center">
                            <FiPhone className="mr-2 h-4 w-4 text-blue-500" />
                            Contact Phone
                          </div>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiPhone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            placeholder="Enter Phone Number"
                            value={PhoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="w-full pl-10 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Location Section */}
                  <div className="bg-white dark:bg-gray-750 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                        <FaMapMarkedAlt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      Location Information
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                        <FaMapMarkedAlt className="mr-2 h-4 w-4 text-purple-500" />
                        Select Region
                      </label>
                      {regionOptions.slice(0, 4).map((region) => (
                        <div className="form-check" key={region.regionId}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`region-${region.regionId}`}
                            checked={selectedRegion === region.regionId}
                            onChange={() =>
                              setSelectedRegionId(
                                selectedRegion === region.regionId
                                  ? ""
                                  : region.regionId
                              )
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`region-${region.regionId}`}
                          >
                            {region.label}
                          </label>
                        </div>
                      ))}{" "}
                      <button
                        type="button"
                        className="btn btn-link p-0 underline"
                        onClick={() => setModalVisible(true)}
                      >
                        Show more choices...
                      </button>
                      <div className="p-4">
                        {/* Modal */}
                        {modalVisible && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="relative bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                              {/* ❌ Close Icon */}
                              <button
                                onClick={() => setModalVisible(false)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                              >
                                &times;
                              </button>

                              <h2 className="text-xl font-semibold mb-4">
                                Modal Title
                              </h2>
                              <p className="text-gray-700 mb-4">I am content</p>

                              <ul className="space-y-2">
                                {regionOptions.map((region) => (
                                  <li key={region.regionId}>
                                    <label
                                      className="form-check-label flex items-center"
                                      htmlFor={`modal-region-${region.regionId}`}
                                    >
                                      <input
                                        className="form-check-input mr-2 mt-1"
                                        type="checkbox"
                                        id={`modal-region-${region.regionId}`}
                                        checked={
                                          selectedRegion === region.regionId
                                        }
                                        onChange={() =>
                                          setSelectedRegionId(
                                            selectedRegion === region.regionId
                                              ? ""
                                              : region.regionId
                                          )
                                        }
                                      />
                                      <span className="font-medium text-gray-800">
                                        {region.regionEn}
                                      </span>
                                    </label>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-5">
                      {/* City */}

                      {/* City */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                          <FaCity className="mr-2 h-4 w-4 text-purple-500" />
                          City here
                        </label>
                        {cityOptions.slice(0, 4).map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-2 text-gray-800"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCities.some(
                                (city) => city.CITY_ID === option.cityId
                              )}
                              onChange={() => handleCheckboxChange1(option)}
                              className="accent-blue-500"
                            />
                            <span>{option.label}</span>
                          </label>
                        ))}

                        <button
                          type="button"
                          className="btn btn-link p-0"
                          onClick={() => setIsCityModalVisible1(true)}
                        >
                          Show more choices...
                        </button>
                        {isCityModalVisible1 && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="relative bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                              {/* ❌ Close Icon */}
                              <button
                                onClick={() => setIsCityModalVisible1(false)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                              >
                                &times;
                              </button>

                              <h2 className="text-xl font-semibold mb-4">
                                Select City
                              </h2>

                              <ul className="space-y-2">
                                {cityOptions.map((option) => (
                                  <label
                                    key={option.value}
                                    className="flex items-center gap-2 text-gray-800"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedCities.some(
                                        (city) => city.CITY_ID === option.cityId
                                      )}
                                      onChange={() =>
                                        handleCheckboxChange1(option)
                                      }
                                      className="accent-blue-500"
                                    />
                                    <span>{option.label}</span>
                                  </label>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* District */}
                    </div>
                    <div className="space-y-5">
                      {/* City */}

                      {/* City */}
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                          <FaCity className="mr-2 h-4 w-4 text-purple-500" />
                          Select District{" "}
                        </label>
                        {districtOptions.slice(0, 4).map((option) => {
                          const isChecked = selectedDistricts.some(
                            (district) => district.DISTRICT_ID === option.value
                          );

                          return (
                            <label
                              key={option.value}
                              className="flex items-center gap-2 text-gray-800 text-sm"
                            >
                              <input
                                type="checkbox"
                                className="accent-blue-500"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedDistricts([
                                      {
                                        REGION_ID: option.regionId,
                                        CITY_ID: option.cityId,
                                        DISTRICT_ID: option.value,
                                        label: option.label,
                                      },
                                    ]);
                                  } else {
                                    setSelectedDistricts([]);
                                  }
                                }}
                              />
                              <span>{option.label}</span>
                            </label>
                          );
                        })}

                        <button
                          type="button"
                          className="btn btn-link p-0"
                          onClick={() => setIsCityModalVisible(true)}
                        >
                          Show more choices...
                        </button>
                        {isCityModalVisible && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="relative bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
                              {/* ❌ Close Icon */}
                              <button
                                onClick={() => setIsCityModalVisible(false)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                              >
                                &times;
                              </button>

                              <ul className="space-y-2">
                                {districtOptions.slice(0, 4).map((option) => {
                                  const isChecked = selectedDistricts.some(
                                    (district) =>
                                      district.DISTRICT_ID === option.value
                                  );

                                  return (
                                    <label
                                      key={option.value}
                                      className="flex items-center gap-2 text-gray-800 text-sm"
                                    >
                                      <input
                                        type="checkbox"
                                        className="accent-blue-500"
                                        checked={isChecked}
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setSelectedDistricts([
                                              {
                                                REGION_ID: option.regionId,
                                                CITY_ID: option.cityId,
                                                DISTRICT_ID: option.value,
                                                label: option.label,
                                              },
                                            ]);
                                          } else {
                                            setSelectedDistricts([]);
                                          }
                                        }}
                                      />
                                      <span>{option.label}</span>
                                    </label>
                                  );
                                })}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* District */}
                    </div>
                  </div>
                  {/* Category Section */}
                  <div className="bg-white dark:bg-gray-750 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                        <FaListAlt className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      Category Information
                    </h4>

                    <div className="space-y-5">
                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          <div className="flex items-center">
                            <FaCar className="mr-2 h-4 w-4 text-blue-500" />
                            Category
                          </div>
                        </label>
                        <Select
                          options={categoryOptions}
                          value={categoryOptions.find(
                            (option) => option.value === formData.category
                          )}
                          onChange={handleCategoryChange}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="Select Category"
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderRadius: "0.5rem",
                              borderColor: "#d1d5db",
                              minHeight: "42px",
                              boxShadow: "none",
                              "&:hover": {
                                borderColor: "#2563eb",
                              },
                            }),
                            option: (base, state) => ({
                              ...base,
                              backgroundColor: state.isSelected
                                ? "#2563eb"
                                : state.isFocused
                                ? "#eff6ff"
                                : undefined,
                              "&:active": {
                                backgroundColor: "#2563eb",
                              },
                            }),
                          }}
                        />
                      </div>

                      {/* SubCategory */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          <div className="flex items-center">
                            <FaCarSide className="mr-2 h-4 w-4 text-blue-500" />
                            SubCategory
                          </div>
                        </label>
                        <Select
                          options={subcategories}
                          value={subcategories.find(
                            (option) => option.value === formData.SubCategory
                          )}
                          onChange={handleSubcategoryChange}
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="Select Subcategory"
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderRadius: "0.5rem",
                              borderColor: "#d1d5db",
                              minHeight: "42px",
                              boxShadow: "none",
                              "&:hover": {
                                borderColor: "#2563eb",
                              },
                            }),
                            option: (base, state) => ({
                              ...base,
                              backgroundColor: state.isSelected
                                ? "#2563eb"
                                : state.isFocused
                                ? "#eff6ff"
                                : undefined,
                              "&:active": {
                                backgroundColor: "#2563eb",
                              },
                            }),
                          }}
                        />
                      </div>
                    </div>
                  </div>{" "}
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
                      placeholder="Enter Price"
                      value={Price}
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
                  {/* <div className="mb-4">
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
                  </div> */}
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
                  <div className="bg-white dark:bg-gray-750 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                        <FaTools className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      Car Features & Insurance
                    </h4>

                    <div className="space-y-5">
                      {/* Insurance */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          <div className="flex items-center">
                            <FiShield className="mr-2 h-4 w-4 text-blue-500" />
                            Insurance
                          </div>
                        </label>
                        <select
                          onChange={handleInsuranceChange}
                          value={Insurance}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors appearance-none bg-no-repeat bg-right"
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                            backgroundSize: "1.5em 1.5em",
                            paddingRight: "2.5rem",
                          }}
                        >
                          <option value="" disabled>
                            Select Insurance
                          </option>
                          <option value="Comprehensive">
                            Comprehensive Insurance
                          </option>
                          <option value="ThirdParty">
                            Third-Party Insurance
                          </option>
                          <option value="electric">Electric</option>
                          <option value="hybrid">Hybrid</option>
                          <option value="No Insurance">No Insurance</option>
                          <option value="cng">CNG</option>
                        </select>
                      </div>

                      {/* Additional Features */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          <div className="flex items-center">
                            <FiSettings className="mr-2 h-4 w-4 text-blue-500" />
                            Additional Features
                          </div>
                        </label>
                        <select
                          multiple
                          onChange={handleAdditionalFeatures}
                          value={AdditionalFeatures}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors appearance-none bg-no-repeat bg-right"
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                            backgroundSize: "1.5em 1.5em",
                            paddingRight: "2.5rem",
                          }}
                        >
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
                          <option value="parkingSensors">
                            Parking Sensors
                          </option>
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
                          <option value="blindSpot">
                            Blind Spot Monitoring
                          </option>
                          <option value="premiumSound">
                            Premium Sound System
                          </option>
                          <option value="awd">All-Wheel Drive</option>
                          <option value="touchscreen">
                            Touchscreen Display
                          </option>
                          <option value="carPlay">
                            Apple CarPlay/Android Auto
                          </option>
                          <option value="ledHeadlights">LED Headlights</option>
                          <option value="towPackage">Tow Package</option>
                          <option value="powerLiftgate">Power Liftgate</option>
                          <option value="headUpDisplay">Head-Up Display</option>
                          <option value="rainWipers">
                            Rain-Sensing Wipers
                          </option>
                          <option value="emergencyBraking">
                            Automatic Emergency Braking
                          </option>
                          <option value="ambientLighting">
                            Ambient Lighting
                          </option>
                        </select>
                      </div>
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

export default Cars;
