"use client";
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setCookie } from "cookies-next"; // For saving token
import { useRouter } from "next/navigation";
import { auth, db } from "@/components/Firebase/FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import axios from "axios";
// Define types for the props
interface SignupModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const SignupModal = ({ isOpen, closeModal }: SignupModalProps) => {
  const MySwal = withReactContent(Swal);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [subAdmin, setsubAdmin] = useState(false);
  console.log(subAdmin, "subAdmin_________");
  const handleImageChange = (e: any) => {
    setSelectedImage(e.target.files[0]);
  };

  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setDisplayName("");
      setPhoneNumber("");
      setPhotoURL("");
      setError("");
    }
  }, [isOpen]);
  const uploadImageToCloudinary = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ksa4saleadmin");
    formData.append("cloud_name", "dx3adrtsz");

    try {
      setUploading(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dx3adrtsz/image/upload",
        formData
      );
      const imageUrl = res.data.secure_url;
      setPhotoURL(imageUrl);
      setUploading(false);
      MySwal.fire("Uploaded!", "Image uploaded to Cloudinary.", "success");
    } catch (error) {
      setUploading(false);
      console.error("Cloudinary upload failed:", error);
      MySwal.fire("Error", "Image upload failed.", "error");
    }
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      let uploadedImageUrl = "";

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      await addDoc(collection(db, "users"), {
        uid,
        email,
        displayName,
        phoneNumber,
        photoURL,
        createdAt: new Date(),
        isAdmin: subAdmin ? "SubAdmin" : "Admin",
      });

      const token = await userCredential.user.getIdToken();
      setCookie("token", token);
      closeModal();
      // router.push("/dashboard");
      setRefresh(!refresh);
      MySwal.fire({
        title: "Success!",
        text: "User created and image uploaded.",
        icon: "success",
        timer: 1500,
      });
    } catch (error: any) {
      setUploading(false);
      console.error("Signup error:", error);
      setError(error.message);
    }
  };

  if (!isOpen) return null; // Don't render modal if it's closed

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl mb-4">Add New User</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form
          onSubmit={handleSignup}
          className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Add New User
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Full Name"
                className="p-2 border rounded w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="p-2 border rounded w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="p-2 border rounded w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
                className="p-2 border rounded w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Photo URL
              </label>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Upload Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedImage(file);
                    }
                  }}
                  className="p-2 border rounded w-full"
                />
                {photoURL && (
                  <img
                    src={photoURL}
                    alt="Preview"
                    className="mt-2 h-24 rounded object-cover"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => uploadImageToCloudinary(selectedImage)}
                className="bg-indigo-500 text-white px-4 py-2 rounded mt-2"
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="subAdmin"
                checked={subAdmin}
                onChange={(e) => setsubAdmin(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="subAdmin" className="text-sm font-medium">
                Sub Admin
              </label>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
            >
              Add User
            </button>
          </div>
        </form>

        <button className="mt-4 text-blue-500 underline" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SignupModal;
