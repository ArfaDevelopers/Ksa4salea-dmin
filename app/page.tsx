"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/components/Firebase/FirebaseConfig";
import { setCookie } from "cookies-next";
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
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component
import image from "../app/Logo.png"; // Your imported image
const Login = () => {
  const MySwal = withReactContent(Swal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
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

      const usersQuery = query(
        collection(db, "users"),
        where("uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(usersQuery);

      if (!querySnapshot.empty) {
        const userDocSnap = querySnapshot.docs[0];
        const userData = userDocSnap.data();
        console.log(userData);

        if (userData?.isAdmin === "Admin") {
          setCookie("token", token);
          router.push("/Cars");
        } else {
          MySwal.fire({
            title: "Access Denied",
            text: "You are not an admin.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } else {
        MySwal.fire({
          title: "User Not Found",
          text: "User data not found as admin.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      MySwal.fire({
        title: "Login Failed",
        text: "An error occurred while logging in. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
      }}
    >
      <div
        className="flex flex-col items-center space-y-6"
        style={{ width: "120%" }}
      >
        <div
          className="qr-section"
          style={{
            position: "relative",
            padding: 20,
            width: "440px",
            height: "170px",
            background: "linear-gradient(135deg, #E6F0FA 0%, #FFE5E5 100%)",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            border: "1px solid #E0E0E0", // Simulates the phone border
          }}
        >
          {/* QR Code Image */}
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src={image}
              alt="QR Code"
              layout="fill"
              objectFit="cover"
              style={{ borderRadius: "10px" }}
            />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Login
          </h2>
          {error && (
            <p className="text-red-300 bg-red-500/20 p-2 rounded-md mb-4 text-sm text-center">
              {error}
            </p>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 "
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ color: "#2D4495" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username"
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                  required
                />
              </div>
            </div>
            <div className="mb-5">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ color: "#2D4495" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 2c-1.104 0-2 .896-2 2v3h4v-3c0-1.104-.896-2-2-2zm7-5h-1V6c0-2.761-2.239-5-5-5S8 3.239 8 6v2H7c-1.104 0-2 .896-2 2v9c0 1.104.896 2 2 2h10c1.104 0 2-.896 2-2v-9c0-1.104-.896-2-2-2z"
                    />
                  </svg>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <label
                className="flex items-center  text-sm"
                style={{ color: "#2D4495" }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 h-4 w-4 text-white/50 border-white/20 rounded focus:ring-0"
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-white/80 text-sm hover:underline"
                style={{ color: "#2D4495" }}
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-white text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
            >
              Login
            </button>
            {/* <p
              className="mt-4 text-center text-sm"
              style={{ color: "#2D4495" }}
            >
              Don’t have an account?{" "}
              <Link
                href="/register"
                className="text-white hover:underline"
                style={{ color: "#2D4495" }}
              >
                Register
              </Link>
            </p> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
