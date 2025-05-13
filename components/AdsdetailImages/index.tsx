"use client";
import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { db } from "../Firebase/FirebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  FiUpload,
  FiImage,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

const AdsdetailImages: React.FC = () => {
  const MySwal = withReactContent(Swal);

  const [selectedImages, setSelectedImages] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);
  const [previews, setPreviews] = useState<string[]>(["", "", ""]);
  const [uploading, setUploading] = useState(false);
  const [existingImageId, setExistingImageId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number[]>([0, 0, 0]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "AdsdetailImages"));
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0];
          setExistingImageId(docData.id);
          const urls = docData.data().imageUrls;
          if (Array.isArray(urls) && urls.length === 3) {
            setPreviews(urls);
          }
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        MySwal.fire("Error", "Failed to load existing images.", "error");
      }
    };
    fetchImages();
  }, [MySwal]);

  const handleSingleImageChange = (index: number, file: File) => {
    const updatedImages = [...selectedImages];
    const updatedPreviews = [...previews];
    updatedImages[index] = file;
    updatedPreviews[index] = URL.createObjectURL(file);
    setSelectedImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  const handleUpload = async () => {
    if (!previews.every((p) => p)) {
      MySwal.fire({
        icon: "error",
        title: "Missing Images",
        text: "All 3 image slots must have a valid image.",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < 3; i++) {
        const image = selectedImages[i];
        setUploadProgress((prev) => {
          const newProgress = [...prev];
          newProgress[i] = 10;
          return newProgress;
        });

        if (image instanceof File) {
          const formData = new FormData();
          formData.append("file", image);
          formData.append("upload_preset", "ml_default");
          formData.append("cloud_name", "dv26wjoay");

          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dv26wjoay/image/upload",
            formData,
            {
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                  );
                  setUploadProgress((prev) => {
                    const newProgress = [...prev];
                    newProgress[i] = percentCompleted;
                    return newProgress;
                  });
                }
              },
            }
          );
          uploadedUrls.push(response.data.secure_url);
        } else {
          uploadedUrls.push(previews[i]); // Keep old URL if not changed
          setUploadProgress((prev) => {
            const newProgress = [...prev];
            newProgress[i] = 100;
            return newProgress;
          });
        }
      }

      const docRef = doc(
        db,
        "AdsdetailImages",
        existingImageId || "defaultAdsdetailImages"
      );

      await setDoc(docRef, {
        imageUrls: uploadedUrls,
        createdAt: new Date(),
      });

      MySwal.fire({
        icon: "success",
        title: "Success!",
        text: "Your ad images have been updated successfully!",
        confirmButtonColor: "#3B82F6",
      });

      // Don't reset selected images to maintain the preview
      setUploadProgress([0, 0, 0]);
    } catch (err) {
      console.error("Upload error:", err);
      MySwal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "There was a problem uploading your images. Please try again.",
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center">
            <FiImage className="mr-2" />
            Update Detail Page Advertisements
          </h2>
          <p className="text-blue-100 mt-2 text-sm sm:text-base">
            Upload three high-quality images to display on your details page
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {previews.map((src, index) => (
              <div key={index} className="relative group">
                <div
                  className={`aspect-video rounded-lg overflow-hidden border-2 ${
                    src ? "border-blue-300" : "border-dashed border-gray-300"
                  } transition-all duration-300 hover:border-blue-500`}
                >
                  {src ? (
                    <img
                      src={src || "/placeholder.svg"}
                      alt={`Advertisement ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <FiImage className="text-gray-400 text-4xl" />
                    </div>
                  )}

                  {uploading &&
                    uploadProgress[index] > 0 &&
                    uploadProgress[index] < 100 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <FiLoader className="animate-spin text-2xl mx-auto mb-2" />
                          <span className="text-sm font-medium">
                            {uploadProgress[index]}%
                          </span>
                        </div>
                      </div>
                    )}
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() =>
                      document.getElementById(`imgInput-${index}`)?.click()
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center"
                  >
                    <FiUpload className="mr-1" />
                    {src ? "Change Image" : "Select Image"}
                  </button>
                </div>

                <input
                  id={`imgInput-${index}`}
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

                <div className="mt-2 text-center">
                  <span className="text-sm font-medium text-gray-700">
                    Ad Slot {index + 1}
                  </span>
                  {src && (
                    <div className="flex items-center justify-center mt-1">
                      <FiCheckCircle className="text-green-500 mr-1" />
                      <span className="text-xs text-green-600">
                        Image selected
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
            <div className="text-sm text-gray-500 flex items-center">
              <FiAlertCircle className="mr-1 text-blue-500" />
              All three images are required for the ad display
            </div>

            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`px-6 py-3 rounded-lg font-medium text-white flex items-center justify-center min-w-[150px] transition-all duration-300 ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              {uploading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload className="mr-2" />
                  Upload Images
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        Recommended image size: 1200 × 675 pixels (16:9 ratio)
      </div>
    </div>
  );
};

export default AdsdetailImages;
