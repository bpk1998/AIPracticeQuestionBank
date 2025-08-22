"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupForm({ onSwitch }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else {
      setMessage("Signup successful! Please login.");
      setTimeout(() => {
        router.push("/auth"); 
      }, 1500);
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="w-full max-w-sm bg-white shadow-lg rounded-xl p-6 space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 text-gray-800"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 text-gray-800"
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
      >
        Sign Up
      </button>
      {message && <p className="text-sm text-red-500">{message}</p>}
      <p className="text-sm text-gray-600">
        Already have an account?{" "}
        <span
          onClick={onSwitch}
          className="text-indigo-600 cursor-pointer hover:underline"
        >
          Login
        </span>
      </p>
    </form>
  );
}
