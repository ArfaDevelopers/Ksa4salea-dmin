"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { db } from "./../Firebase/FirebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const Bannerimg: React.FC = () => {
  const MySwal = withReactContent(Swal);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [existingImageId, setExistingImageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchExistingImage = async () => {
      const querySnapshot = await getDocs(collection(db, "banneradsimg"));
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0];
        setExistingImageId(docData.id);
        setPreview(docData.data().imageUrl);
      }
    };
    fetchExistingImage();
  }, []);

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
    formData.append("upload_preset", "dlfdvlmse"); // Replace with your actual preset
    formData.append("cloud_name", "dlfdvlmse"); // Replace with your actual cloud name

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dlfdvlmse/image/upload", // Your Cloudinary URL
        formData
      );
      const imageUrl = response.data.secure_url;
      console.log("Uploaded Image URL:", imageUrl);

      // Save or update image URL in Firestore
      const bannerImgRef = doc(
        db,
        "banneradsimg",
        existingImageId || "defaultBannerImg"
      );
      await setDoc(bannerImgRef, { imageUrl, createdAt: new Date() });
      setExistingImageId("defaultBannerImg");

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
    <div className="p-4 border rounded-lg shadow-md bg-white w-96 mx-auto text-center">
      <h2 className="text-lg font-semibold mb-4">Upload Banner Image</h2>
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
        {uploading ? "Uploading..." : "Upload Ads"}
      </button>
    </div>
  );
};

export default Bannerimg;
