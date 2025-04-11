"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/components/Firebase/FirebaseConfig";
import { setCookie } from "cookies-next"; // install it: npm i cookies-next
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const Login = () => {
  const MySwal = withReactContent(Swal);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const token = await user.getIdToken();

      // Search for user document where the `uid` field matches the authenticated user
      const usersQuery = query(
        collection(db, "users"),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        const userDocSnap = querySnapshot.docs[0]; // Get the first matching document
        const userData = userDocSnap.data();
        console.log(userData); // Log user data for debugging

        if (userData?.isAdmin === "Admin") {
          setCookie("token", token); // ✅ Store token
          router.push("/Cars"); // ✅ Redirect to Cars page
        } else {
          // Show a SweetAlert2 error message
          MySwal.fire({
            title: "Access Denied",
            text: "You are not an admin.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        // Show a SweetAlert2 error message
        MySwal.fire({
          title: "User Not Found",
          text: "User data not found as admin.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      // Show a SweetAlert2 error message for login failure
      MySwal.fire({
        title: "Login Failed",
        text: "An error occurred while logging in. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl mb-4 text-center font-semibold">Login</h2>
        {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="mb-4 p-2 border rounded w-full"
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
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
