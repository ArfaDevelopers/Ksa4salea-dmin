"use client";
import React, { useState, useEffect } from "react";
import { db } from "../Firebase/FirebaseConfig";
import { FiSearch } from "react-icons/fi"; // Importing Search Icon

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

const Users = () => {
  const MySwal = withReactContent(Swal);

  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [users, setUsers] = useState<any[]>([]); // To store users data
  const [selectedUser, setSelectedUser] = useState<any>(null); // To store selected user data for editing
  console.log(selectedUser, "user_______00");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("All");
  const [activeCheckboxes, setActiveCheckboxes] = useState<{
    [key: number]: boolean;
  }>({});
  // Open and close modal functions
  const openModal = () => setIsSignupModalOpen(true);
  const closeModal = () => setIsSignupModalOpen(false);
  const handleToggle = (id: number) => {
    setActiveCheckboxes((prev) => {
      const newState = { ...prev, [id]: !prev[id] };
      if (newState[id]) {
        console.log("Checked Ad ID:", id);
      }
      return newState;
    });
  };
  const handleFirebaseToggle = async (id: string, currentState: boolean) => {
    const docRef = doc(db, "users", id);
    try {
      await updateDoc(docRef, {
        isActive: !currentState,
      });
      MySwal.fire({
        title: "Status Changed!",
        text: `Status updated to: ${
          !currentState === true ? "Banned" : "Activated"
        }`,
        icon: "success",
        timer: 1000,
      });
      console.log(`isActive updated to: ${!currentState}`);
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };
  const handleCheckboxChange = (option: string) => {
    if (option === "Paid") {
      setSelectedOption("Featured Ads");
      console.log("Filtering: Featured Ads");
    } else if (option === "Unpaid") {
      setSelectedOption("Not Featured Ads");
      console.log("Filtering: Not Featured Ads");
    } else {
      setSelectedOption("All");
      console.log("Filtering: All Ads");
    }
  };

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

      // const newData = usersData.filter((user) => user?.isAdmin === "Admin");
      setUsers(usersData);
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
              <p className="text-gray-500">No users found.</p>
            ) : (
              <ul className="space-y-4">
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
                      className="p-4 bg-white rounded-lg shadow-md border flex flex-col md:flex-row md:justify-between md:items-center"
                    >
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        {user.photoURL && (
                          <img
                            src={user.photoURL}
                            alt="User Avatar"
                            className="w-14 h-14 rounded-full object-cover border border-gray-300"
                          />
                        )}
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

                      <div className="flex space-x-3 justify-end">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          // onClick={() => openEditModal(user)}
                        >
                          {/* <MdEdit size={22} /> */}
                          <input
                            type="checkbox"
                            checked={user.isActive}
                            onChange={() => {
                              handleToggle(user.id); // Toggle UI state
                              handleFirebaseToggle(
                                user.id,
                                !!activeCheckboxes[user.id]
                              ); // Update Firestore
                            }}
                          />
                        </button>
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

export default Users;
