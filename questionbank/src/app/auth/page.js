"use client";
import { useState } from "react";
import SignupForm from "./signupForm";
import LoginForm from "./loginForm";

export default function AuthPage() {
  const [mode, setMode] = useState("signup");

  return (
    <div className="flex h-screen">
      {mode === "signup" ? (
        <>
          <div className="hidden md:flex flex-1 bg-gradient-to-br from-purple-500 to-indigo-600 text-white items-center justify-center">
            <h2 className="text-4xl font-bold">Welcome to QuizGen!</h2>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <SignupForm onSwitch={() => setMode("login")} />
          </div>
        </>
      ) : (
        <>
          <div className="flex-1 flex items-center justify-center">
            <LoginForm onSwitch={() => setMode("signup")} />
          </div>
          <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-600 to-purple-500 text-white items-center justify-center">
            <h2 className="text-4xl font-bold">Welcome Back!</h2>
          </div>
        </>
      )}
    </div>
  );
}
