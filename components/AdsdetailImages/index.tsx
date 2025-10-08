"use client";

import type React from "react";
import { useEffect, useState } from "react";
import axios, { type AxiosProgressEvent } from "axios";
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
  FiLink,
  FiExternalLink,
} from "react-icons/fi";

const AdsdetailImages: React.FC = () => {
  const MySwal = withReactContent(Swal);

  // 3 slots
  const [selectedImages, setSelectedImages] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);
  const [previews, setPreviews] = useState<string[]>(["", "", ""]);
  const [links, setLinks] = useState<string[]>(["", "", ""]);
  const [uploading, setUploading] = useState(false);
  const [existingImageId, setExistingImageId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number[]>([0, 0, 0]);

  // Fetch once on mount (fixes "input clears" issue)
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "AdsdetailImages"));
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setExistingImageId(docSnap.id);

          const data = docSnap.data() as {
            imageUrls?: string[];
            links?: string[];
          };

          if (Array.isArray(data.imageUrls)) {
            const normalized = [...data.imageUrls];
            while (normalized.length < 3) normalized.push("");
            setPreviews(normalized.slice(0, 3));
          }

          if (Array.isArray(data.links)) {
            const normalizedLinks = [...data.links];
            while (normalizedLinks.length < 3) normalizedLinks.push("");
            setLinks(normalizedLinks.slice(0, 3));
          }
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        MySwal.fire("Error", "Failed to load existing images.", "error");
      }
    };

    fetchImages();
    // Intentionally empty dependency array so we don't overwrite user typing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSingleImageChange = (index: number, file: File) => {
    const updatedImages = [...selectedImages];
    const updatedPreviews = [...previews];

    updatedImages[index] = file;
    updatedPreviews[index] = URL.createObjectURL(file);

    setSelectedImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  const handleLinkChange = (index: number, value: string) => {
    setLinks((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const isHttpUrl = (value: string) => /^https?:\/\//i.test(value.trim());

  const domainFromUrl = (value: string) => {
    try {
      const u = new URL(value);
      return u.hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
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
              onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                if (progressEvent.total) {
                  const percentCompleted = Math.round(
                    ((progressEvent.loaded || 0) * 100) / progressEvent.total
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

          const url = response.data.secure_url as string;
          uploadedUrls.push(url);

          // Update preview to the final cloud URL (so it persists)
          setPreviews((prev) => {
            const next = [...prev];
            next[i] = url;
            return next;
          });
        } else {
          // Keep old URL if not changed
          uploadedUrls.push(previews[i]);
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

      await setDoc(
        docRef,
        {
          imageUrls: uploadedUrls,
          links,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      MySwal.fire({
        icon: "success",
        title: "Success!",
        text: "Your ad images and links have been updated successfully!",
        confirmButtonColor: "#3B82F6",
      });

      setUploadProgress([0, 0, 0]);
      // Keep previews and links as-is
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
            {previews.map((src, index) => {
              const link = links[index] || "";
              const domain = domainFromUrl(link);
              const linkIsHttp = isHttpUrl(link);

              return (
                <div key={index} className="relative group">
                  <div
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 ${
                      src ? "border-blue-300" : "border-dashed border-gray-300"
                    } transition-all duration-300 hover:border-blue-500`}
                  >
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={
                          src ||
                          "/placeholder.svg?height=675&width=1200&query=ad%20image%20slot" ||
                          "/placeholder.svg"
                        }
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

                    {/* Link overlay preview on image */}
                    {link && (
                      <div className="absolute left-2 bottom-2 bg-black/60 text-white text-[11px] px-2 py-1 rounded-full flex items-center gap-1 max-w-[90%]">
                        <FiLink className="text-white" />
                        <span className="truncate">
                          {domain || link.replace(/^https?:\/\//i, "")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() =>
                        document.getElementById(`imgInput-${index}`)?.click()
                      }
                      className={`${
                        uploading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center`}
                      disabled={uploading}
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

                  {/* Link input for this image */}
                  <div className="mt-3">
                    <label
                      htmlFor={`link-${index}`}
                      className="block text-xs font-medium text-gray-700 mb-1"
                    >
                      Target Link (optional)
                    </label>
                    <div className="relative">
                      <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id={`link-${index}`}
                        type="url"
                        placeholder="https://example.com/your-page"
                        value={links[index] || ""}
                        onChange={(e) =>
                          handleLinkChange(index, e.target.value)
                        }
                        disabled={uploading}
                        className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>

                    {/* Inline link preview / open button */}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-[11px] text-gray-500 truncate">
                        {link
                          ? `Current: ${link}`
                          : "No link set for this slot"}
                      </div>
                      {linkIsHttp && (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                          title="Open link"
                        >
                          <FiExternalLink />
                          Open
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
            <div className="text-sm text-gray-500 flex items-center">
              <FiAlertCircle className="mr-1 text-blue-500" />
              All three images are required for the ad display. Links are
              optional and editable.
            </div>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`px-6 py-3 rounded-lg font-medium text-white flex items-center justify-center min-w-[180px] transition-all duration-300 ${
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
                  Upload Images & Links
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
