"use client";
import React, { useState, useEffect } from "react";
import { db } from "../Firebase/FirebaseConfig";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import SignupModal from "./SignupModal";
import EditUserModal from "./EditUserModal";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
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

const Profile = () => {
  const MySwal = withReactContent(Swal);

  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [users, setUsers] = useState<any[]>([]); // To store users data
  const [selectedUser, setSelectedUser] = useState<any>(null); // To store selected user data for editing
  console.log(selectedUser, "user_______00");

  // Open and close modal functions
  const openModal = () => setIsSignupModalOpen(true);
  const closeModal = () => setIsSignupModalOpen(false);
  const handleDelete = async (user: any) => {
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

      const newData = usersData.filter((user) => user?.isAdmin === "Admin");
      setUsers(newData);
    };

    fetchUsers();
  }, [refresh]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <button
              onClick={openModal}
              className="mt-4 bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition duration-300 float-end"
            >
              Add New
            </button>
          </div>

          {/* Display List of Users */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">
              Users with Admin Accounts:
            </h2>
            {users.length === 0 ? (
              <p className="text-gray-500">No users found.</p>
            ) : (
              <ul className="space-y-4">
                <ul className="space-y-4">
                  {users.map((user, index) => (
                    <li
                      key={index}
                      className="p-4 bg-white rounded-lg shadow-md border flex flex-col md:flex-row md:justify-between md:items-center"
                    >
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        {/* User Image */}
                        {user.photoURL && (
                          <img
                            src={user.photoURL}
                            alt="User Avatar"
                            className="w-14 h-14 rounded-full object-cover border border-gray-300"
                          />
                        )}

                        {/* User Info */}
                        <div className="text-sm text-gray-700">
                          <p>
                            <span className="font-semibold">Name:</span>{" "}
                            {user.displayName}
                          </p>
                          <p>
                            <span className="font-semibold">Email:</span>{" "}
                            {user.email}
                          </p>
                          <p>
                            <span className="font-semibold">Phone:</span>{" "}
                            {user.phoneNumber}
                          </p>

                          <p>
                            <span className="font-semibold">Created At:</span>{" "}
                            {user.createdAt?.seconds
                              ? new Date(
                                  user.createdAt.seconds * 1000
                                ).toLocaleString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3 justify-end">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => openEditModal(user)}
                        >
                          <MdEdit size={22} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(user)}
                        >
                          <RiDeleteBin5Line size={22} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
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
