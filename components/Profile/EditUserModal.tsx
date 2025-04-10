import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../Firebase/FirebaseConfig";

interface EditUserModalProps {
  isOpen: boolean;
  closeModal: () => void;
  user: any;
}

const EditUserModal = ({ isOpen, closeModal, user }: EditUserModalProps) => {
  if (!user) return null;

  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(user?.password || "");
  const [displayName, setdisplayName] = useState(user?.displayName || "");
  const [phoneNumber, setphoneNumber] = useState(user?.phoneNumber || "");
  const [photoURL, setphotoURL] = useState(user?.photoURL || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setPassword(user.password || "");
      setdisplayName(user.displayName || "");
      setphoneNumber(user.phoneNumber || "");
      setphotoURL(user.photoURL || "");
    }
  }, [user]);

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      if (!user?.id) throw new Error("User ID is missing.");

      const userRef = doc(db, "users", user.id);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) {
        throw new Error(`User with ID ${user.id} does not exist in Firestore.`);
      }

      await updateDoc(userRef, {
        email,
        password,
        displayName,
        phoneNumber,
        photoURL,
      });

      closeModal();
    } catch (error: any) {
      setError("Failed to update user: " + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl mb-4 font-semibold text-gray-800">Edit User</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setdisplayName(e.target.value)}
            placeholder="Full Name"
            className="mb-3 p-2 border rounded w-full"
            required
          />
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setphoneNumber(e.target.value)}
            placeholder="Mobile Number"
            className="mb-3 p-2 border rounded w-full"
            required
          />
          <input
            type="text"
            value={photoURL}
            onChange={(e) => setphotoURL(e.target.value)}
            placeholder="Image URL"
            className="mb-3 p-2 border rounded w-full"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mb-3 p-2 border rounded w-full"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mb-4 p-2 border rounded w-full"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full font-medium"
          >
            Update
          </button>
        </form>

        <button
          className="mt-4 text-sm text-gray-600 hover:text-blue-600 underline"
          onClick={closeModal}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditUserModal;
