"use client";

import Image from "next/image";
import WaitingRoomContent from "./WaitingRoomContent";

const WaitingScreen = () => {
  return (
    <div className="min-h-screen bg-[#EBF5FB] flex flex-col justify-center items-center p-4 md:p-8">
      {/* IRAAP Header Brand Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <Image
          src="/irap-logo.png"
          alt="IRAAP"
          width={50}
          height={50}
          className="h-14 w-auto"
        />
      </div>

      <WaitingRoomContent />
    </div>
  );
};

export default WaitingScreen;
