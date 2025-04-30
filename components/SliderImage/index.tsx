"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { db } from "../Firebase/FirebaseConfig";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
      const querySnapshot = await getDocs(collection(db, "SliderImage"));
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0];
        setExistingImageId(docData.id);
        const urls = docData.data().imageUrls;
        console.log(urls, "urls________________");
        if (Array.isArray(urls) && urls.length === 2) {
          setPreviews(urls);
        }
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

  const handleUpload = async () => {
    if (!previews[0] || !previews[1]) {
      MySwal.fire(
        "Error",
        "Both image slots must have a valid image.",
        "error"
      );
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < 2; i++) {
        const image = selectedImages[i];

        if (image instanceof File) {
          const formData = new FormData();
          formData.append("file", image);
          formData.append("upload_preset", "ksa4saleadmin");
          formData.append("cloud_name", "dx3adrtsz");

          const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dx3adrtsz/image/upload",
            formData
          );

          uploadedUrls.push(response.data.secure_url);
        } else {
          uploadedUrls.push(previews[i]); // unchanged image
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

      MySwal.fire("Success", "Images updated successfully!", "success");
      setSelectedImages([null, null]); // reset after upload
    } catch (err) {
      console.error("Upload error:", err);
      MySwal.fire("Error", "Failed to upload images.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-md mx-auto text-center">
      <h2 className="text-lg font-semibold mb-4">Update 2 Slider Images</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {previews.map((src, index) => (
          <div key={index} className="relative">
            <img
              src={src}
              alt={`Image ${index + 1}`}
              className="w-full h-32 object-cover rounded cursor-pointer border"
              onClick={() =>
                document.getElementById(`imgInput-${index}`)?.click()
              }
            />
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
          </div>
        ))}
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default SliderImage;
