"use client";
import React, { useState, useEffect } from "react";
import { auth, db } from "../Firebase/FirebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  where,
  query,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import SignupModal from "./SignupModal";
import EditUserModal from "./EditUserModal";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { FiSearch } from "react-icons/fi"; // Importing Search Icon

interface User {
  id: string;
  isAdmin?: string; // optional because not all users have it
  photoURL?: string | null;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  uid: string;
  phoneNumber: string;
  displayName?: string;
  fullName?: string;
  email: string;
}
interface UserProfile {
  fullName: string;
  phoneNumber: string;
  email: string;
  username: string;
  displayName: string;
  isAdmin: string;
  uid: string;

  bio: string;
  photoURL: string;
}
const Profile = () => {
  const MySwal = withReactContent(Swal);

  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null); // To store selected user data for editing

  const [users, setUsers] = useState<any[]>([]); // To store users data
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  console.log("user___________1", userProfile?.isAdmin);
  console.log("user___________2", currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);

        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();

          setUserProfile({
            fullName: docData.fullName || "",
            username: docData.username || "",
            bio: docData.bio || "",
            displayName: docData.displayName || "",
            email: docData.email || "",
            phoneNumber: docData.phoneNumber || "",
            photoURL: docData.photoURL || "/images/user/user-03.png",
            isAdmin: docData.isAdmin || "User",
            uid: docData.uid || user.uid,
          });
        } else {
          console.warn("No Firestore user profile found for UID:", user.uid);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  // Open and close modal functions
  const openModal = () => setIsSignupModalOpen(true);
  const closeModal = () => setIsSignupModalOpen(false);
  const handleDelete = async (user: any) => {
    // Rule 2: SubAdmin cannot delete Admin
    if (userProfile?.isAdmin === "SubAdmin" && user.isAdmin === "Admin") {
      MySwal.fire("Access Denied", "SubAdmins cannot delete Admins.", "error");
      return;
    }

    const confirmResult = await MySwal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${user.fullName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmResult.isConfirmed) {
      try {
        await deleteDoc(doc(db, "users", user.id)); // `user.id` must match Firestore document ID
        MySwal.fire("Deleted!", "The user has been deleted.", "success");
        setRefresh(!refresh);
        // Optional: Refresh list if needed
      } catch (error) {
        console.error("Error deleting user:", error);
        MySwal.fire(
          "Failed!",
          "Something went wrong while deleting the user.",
          "error"
        );
      }
    }
  };

  const openEditModal = (user: any) => {
    if (user && user.uid) {
      setSelectedUser(user); // Set the selected user for editing
      setIsEditModalOpen(true);
    } else {
      console.error("User data is missing");
    }
  };

  const closeEditModal = () => setIsEditModalOpen(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));

      const usersData: User[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<User, "id">),
      }));

      console.log(usersData, "usersData");
      const newData = usersData.filter(
        (user) => user?.isAdmin === "Admin" || user?.isAdmin === "SubAdmin"
      );
      console.log("user___________data", newData);
      setUsers(newData);
    };

    fetchUsers();
  }, [refresh]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
          {/* Search Input */}
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-sm">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setSearchTerm(e.target.value)} // Assuming you define setSearchTerm
              />
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>

            <button
              onClick={openModal}
              className="ml-4 bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-300"
            >
              Add New
            </button>
          </div>

          {/* Display List of Users */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              Users Accounts:
            </h2>
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No users found.</p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {users
                  .filter(
                    (user) =>
                      user.displayName
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      user.email
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                  )
                  .map((user, index) => (
                    <li
                      key={index}
                      className="p-5 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition duration-300 flex flex-col justify-between"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt="User Avatar"
                            className="w-16 h-16 rounded-full object-cover border border-gray-300"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl font-bold border border-gray-300">
                            {user.displayName?.[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div>
                          <p className="text-lg font-semibold text-gray-800">
                            {user.displayName}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <p className="text-sm text-gray-500">
                            📞 {user.phoneNumber || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between mb-4">
                        <span className="text-sm text-gray-500">
                          Created:{" "}
                          <span className="font-medium">
                            {user.createdAt?.seconds
                              ? new Date(
                                  user.createdAt.seconds * 1000
                                ).toLocaleString()
                              : "N/A"}
                          </span>
                        </span>
                        {user.isAdmin && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              user.isAdmin === "Admin"
                                ? "bg-blue-100 text-blue-800"
                                : user.isAdmin === "SubAdmin"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.isAdmin}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => openEditModal(user)}
                          title="Edit User"
                        >
                          <MdEdit size={22} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(user)}
                          title="Delete User"
                        >
                          <RiDeleteBin5Line size={22} />
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        {/* Modals */}
        <SignupModal isOpen={isSignupModalOpen} closeModal={closeModal} />
        <EditUserModal
          isOpen={isEditModalOpen}
          closeModal={closeEditModal}
          user={selectedUser} // Pass selected user to the edit modal
        />
      </div>
    </>
  );
};

export default Profile;
