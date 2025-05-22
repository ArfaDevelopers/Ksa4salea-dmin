"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { db } from "./../Firebase/FirebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { FiUploadCloud, FiImage, FiCheck } from "react-icons/fi";

const BannerUpload: React.FC = () => {
  const MySwal = withReactContent(Swal);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [existingImageId, setExistingImageId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchExistingImage = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Bannermainimg"));
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0];
          setExistingImageId(docData.id);
          setPreview(docData.data().imageUrl);
        }
      } catch (error) {
        console.error("Error fetching existing image:", error);
      }
    };

    fetchExistingImage();
  }, []);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      img.onload = () => {
        if (img.width === 1200 && img.height === 1242) {
          setSelectedImage(file);
          setPreview(objectUrl);
        } else {
          MySwal.fire({
            icon: "error",
            title: "Invalid Image Size",
            text: "Please upload an image with exact dimensions: 1200 × 1242 pixels.",
            confirmButtonColor: "#3085d6",
          });
          URL.revokeObjectURL(objectUrl);
          event.target.value = ""; // Reset input
        }
      };

      img.onerror = () => {
        MySwal.fire({
          icon: "error",
          title: "File Error",
          text: "The selected file is not a valid image.",
          confirmButtonColor: "#3085d6",
        });
        URL.revokeObjectURL(objectUrl);
        event.target.value = "";
      };
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
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

      // Save or update image URL in Firestore
      const bannerImgRef = doc(
        db,
        "Bannermainimg",
        existingImageId || "defaultBannerImg"
      );
      await setDoc(bannerImgRef, { imageUrl, createdAt: new Date() });
      setExistingImageId("defaultBannerImg");

      MySwal.fire({
        title: "Success!",
        text: "Your banner has been uploaded successfully.",
        icon: "success",
        timer: 1500,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      MySwal.fire({
        title: "Error!",
        text: "Failed to upload image.",
        icon: "error",
        timer: 1500,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Home Banner Upload
          </h2>
          {existingImageId && (
            <div className="flex items-center text-sm text-green-600">
              <FiCheck className="mr-1" />
              <span>Current banner active</span>
            </div>
          )}
        </div>

        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 ease-in-out ${
            dragActive
              ? "border-indigo-500 bg-indigo-50"
              : preview
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          <div className="text-center">
            {preview ? (
              <div className="mb-4">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Banner Preview"
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {selectedImage?.name || "Current banner image"}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <FiImage className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700">
                  Drag and drop your banner image here
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to browse files
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Recommended size: 1200 x 400 pixels
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={uploading || !selectedImage}
            className={`w-full flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 ${
              uploading
                ? "bg-indigo-400 cursor-not-allowed"
                : selectedImage
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <FiUploadCloud className="mr-2" />
                Upload Banner
              </>
            )}
          </button>

          {preview && !uploading && (
            <p className="text-center text-sm text-gray-500 mt-3">
              Click the button above to upload this image as your main banner
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerUpload;
