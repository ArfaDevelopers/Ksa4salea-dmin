"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { db } from "../Firebase/FirebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const SliderImage: React.FC = () => {
  const MySwal = withReactContent(Swal);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [existingImageId, setExistingImageId] = useState<string | null>(null);
  const imagesExist = previews.length > 0;

  console.log(previews, "previews________________");
  useEffect(() => {
    const fetchExistingImage = async () => {
      const querySnapshot = await getDocs(collection(db, "SliderImage"));
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0];
        setExistingImageId(docData.id);
        const imageUrls = docData.data().imageUrls;
        setPreviews(Array.isArray(imageUrls) ? imageUrls : []);
      }
    };
    fetchExistingImage();
  }, []);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const fileArray = Array.from(files);

    if (fileArray.length !== 3) {
      MySwal.fire({
        title: "Error!",
        text: "Please select exactly 3 images.",
        icon: "error",
        timer: 2000,
      });
      event.target.value = ""; // Reset file input
      return;
    }

    setSelectedImages(fileArray);
    const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleUpload = async () => {
    if (!imagesExist) {
      MySwal.fire({
        title: "Error!",
        text: "No existing images found to replace.",
        icon: "error",
        timer: 2000,
      });
      return;
    }

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (const image of selectedImages) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "ksa4saleadmin");
        formData.append("cloud_name", "dx3adrtsz");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dx3adrtsz/image/upload",
          formData
        );
        uploadedUrls.push(response.data.secure_url);
      }

      // Save all uploaded image URLs to Firestore
      const bannerImgRef = doc(
        db,
        "SliderImage",
        existingImageId || "defaultBannerImg"
      );
      await setDoc(bannerImgRef, {
        imageUrls: uploadedUrls,
        createdAt: new Date(),
      });

      MySwal.fire({
        title: "Success!",
        text: "Images uploaded successfully!",
        icon: "success",
        timer: 1500,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      MySwal.fire({
        title: "Error!",
        text: "Failed to upload images.",
        icon: "error",
        timer: 2000,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-md mx-auto text-center">
      <h2 className="text-lg font-semibold mb-4">Upload to 3 slider Images</h2>
      <input
        type="file"
        accept="image/*"
        multiple
        disabled={!imagesExist}
        onChange={handleImageChange}
        className="mb-4"
      />
      {!imagesExist && (
        <p className="text-sm text-red-500 mb-2">
          No existing images. You can only update if images are already
          uploaded.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {previews.flat().map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Preview ${index + 1}`}
            className="w-full h-32 object-cover rounded-md"
          />
        ))}
      </div>
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        disabled={uploading || selectedImages.length !== 3}
      >
        {uploading ? "Uploading..." : "Upload Images"}
      </button>
    </div>
  );
};

export default SliderImage;
