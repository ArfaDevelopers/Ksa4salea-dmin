"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { db } from "../Firebase/FirebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FiPlus, FiTrash2, FiUpload, FiImage, FiEdit } from "react-icons/fi";

const SliderImage: React.FC = () => {
  const MySwal = withReactContent(Swal);

  const [selectedImages, setSelectedImages] = useState<(File | null)[]>([
    null,
    null,
  ]);
  const [previews, setPreviews] = useState<string[]>(["", ""]);
  const [uploading, setUploading] = useState(false);
  const [existingImageId, setExistingImageId] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "SliderImage"));
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0];
          setExistingImageId(docData.id);
          const urls = docData.data().imageUrls;
          if (Array.isArray(urls) && urls.length >= 2) {
            setPreviews(urls);
            setSelectedImages(Array(urls.length).fill(null));
          }
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        MySwal.fire("Error", "Failed to load existing images.", "error");
      }
    };
    fetchImages();
  }, []);

  const handleSingleImageChange = (index: number, file: File) => {
    const updatedImages = [...selectedImages];
    const updatedPreviews = [...previews];
    updatedImages[index] = file;
    updatedPreviews[index] = URL.createObjectURL(file);
    setSelectedImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  const handleMultipleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newImages = [...selectedImages];
    const newPreviews = [...previews];

    let startIndex = newPreviews.findIndex((preview) => !preview);
    if (startIndex === -1) startIndex = newPreviews.length;

    Array.from(files).forEach((file, idx) => {
      const currentIndex = startIndex + idx;
      if (currentIndex >= newImages.length) {
        newImages.push(null);
        newPreviews.push("");
      }

      newImages[currentIndex] = file;
      newPreviews[currentIndex] = URL.createObjectURL(file);
    });

    setSelectedImages(newImages);
    setPreviews(newPreviews);
  };

  const addImageSlot = () => {
    setSelectedImages([...selectedImages, null]);
    setPreviews([...previews, ""]);
  };

  const removeImageSlot = (index: number) => {
    if (previews.length <= 2) {
      MySwal.fire("Error", "You must have at least 2 image slots.", "error");
      return;
    }
    const updatedImages = [...selectedImages];
    const updatedPreviews = [...previews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setSelectedImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  const handleUpload = async () => {
    const validPreviews = previews.filter((preview) => preview);
    if (validPreviews.length < 2) {
      MySwal.fire("Error", "You must have at least 2 images.", "error");
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < previews.length; i++) {
        const image = selectedImages[i];

        if (image instanceof File) {
          const formData = new FormData();
          formData.append("file", image);
          formData.append("upload_preset", "ml_default");
          formData.append("cloud_name", "dv26wjoay");

          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dv26wjoay/image/upload",
            formData
          );

          uploadedUrls.push(response.data.secure_url);
        } else if (previews[i]) {
          uploadedUrls.push(previews[i]);
        }
      }

      const docRef = doc(
        db,
        "SliderImage",
        existingImageId || "defaultSliderImage"
      );

      await setDoc(docRef, {
        imageUrls: uploadedUrls,
        createdAt: new Date(),
      });

      MySwal.fire("Success", "Images saved successfully!", "success");
      setSelectedImages(Array(uploadedUrls.length).fill(null));
    } catch (error) {
      console.error("Upload error:", error);
      MySwal.fire("Error", "Failed to upload images.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-lg bg-white w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Slider Image Manager
      </h2>
      <p className="mb-4 text-gray-600">
        Minimum 2 images required. You currently have{" "}
        {previews.filter((p) => p).length} images.
      </p>

      {/* Instruction Box */}
      {/* <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
        <ul className="list-disc list-inside text-blue-700">
          <li>Choose or change image for each slot</li>
          <li>Add or remove image slots (min 2)</li>
          <li>Upload multiple images at once</li>
          <li>Click "Save All Images" to update Firestore</li>
        </ul>
      </div> */}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={addImageSlot}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          <FiPlus /> Add New Image
        </button>

        <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition cursor-pointer">
          <FiUpload /> Upload Multiple
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleMultipleImageUpload}
          />
        </label>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {previews.map((src, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50">
            <p className="font-medium mb-2 text-gray-700">Image {index + 1}</p>

            <div className="w-full h-48 mb-3 flex items-center justify-center bg-white border rounded overflow-hidden">
              {src ? (
                <img
                  src={src}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <FiImage className="text-4xl mx-auto mb-2" />
                  <p>No image selected</p>
                </div>
              )}
            </div>

            <label className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition mb-2">
              <FiEdit className="inline mr-2" />
              Choose File
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleSingleImageChange(index, file);
                  }
                }}
              />
            </label>

            <button
              onClick={() => removeImageSlot(index)}
              disabled={previews.length <= 2}
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition disabled:opacity-50"
            >
              <FiTrash2 />
              Remove
            </button>

            <div className="mt-2 text-center text-sm">
              {selectedImages[index] instanceof File ? (
                <span className="text-green-600">
                  New: {(selectedImages[index] as File).name.slice(0, 25)}
                  {(selectedImages[index] as File).name.length > 25
                    ? "..."
                    : ""}
                </span>
              ) : src ? (
                <span className="text-blue-600">Existing image</span>
              ) : (
                <span className="text-gray-500">Empty slot</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition font-medium"
        >
          {uploading ? "Uploading..." : "Save All Images"}
        </button>
      </div>
    </div>
  );
};

export default SliderImage;
