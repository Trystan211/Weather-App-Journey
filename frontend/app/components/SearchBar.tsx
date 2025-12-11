"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type Props = {
  onSearch: (city: string) => void;
};

const SearchBar = ({ onSearch }: Props) => {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    const trimmedCity = city.trim();
    if (trimmedCity === "") {
      toast.error("Please enter a city name.");
      return;
    }
    onSearch(trimmedCity);
  };

  return (
    <div className="flex justify-center mt-2 w-full">
      <div className="relative w-full max-w-md flex items-center">
        <input
          type="text"
          className="input input-primary"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <div className="ml-4">
          {" "}
          {/* Add margin to the left of the button */}
          <button onClick={handleSearch} className="btn btn-primary">
            <Search />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
