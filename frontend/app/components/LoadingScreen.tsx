"use client";

import Lottie from "lottie-react";
import animationData from "../../public/loading.json";

export default function LoadingScreen() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="text-center space-y-6">
        <Lottie
          animationData={animationData}
          loop
          className="w-52 h-52 mx-auto"
        />
        <p className="text-lg font-medium text-gray-700">
          Loading weather data...
        </p>
      </div>
    </main>
  );
}
