"use client";
import { motion } from "framer-motion";

type Props = {
  date: string;
  icon: string;
  tempMin: string;
  tempMax: string;
};

const ForecastCard = ({ date, icon, tempMin, tempMax }: Props) => {
  return (
    <motion.div
      className="card ripple bg-white shadow-lg p-6 rounded-lg text-center min-w-[240px] min-h-[240px] cursor-pointer"
      whileHover={{
        scale: 1.04,
        boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.12)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <p className="text-2xl font-medium mt-4">{date}</p>
      <motion.img
        src={`https://openweathermap.org/img/wn/${icon}.png`}
        alt="weather icon"
        className="mx-auto h-20 w-20 my-2"
        whileHover={{
          scale: 1.15,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      />
      <p className="text-xl text-gray-500">
        {tempMin}° / {tempMax}°
      </p>
    </motion.div>
  );
};

export default ForecastCard;
