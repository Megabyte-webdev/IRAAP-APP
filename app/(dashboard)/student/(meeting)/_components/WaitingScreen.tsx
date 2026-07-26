"use client";

import Image from "next/image";
import WaitingRoomContent from "./WaitingRoomContent";

const WaitingScreen = () => {
  return (
    <div className="min-h-screen bg-[#EBF5FB] flex flex-col justify-center items-center p-4 md:p-8">
      {/* IRAAP Header Brand Logo */}
      <div className="sticky z-10 top-4  md:top-8 mr-auto mb-3 flex items-center gap-2">
        <Image
          src="/irap-logo.png"
          alt="IRAAP"
          width={50}
          height={50}
          className="h-10 md:h-14 w-auto"
        />
      </div>

      <WaitingRoomContent />
    </div>
  );
};

export default WaitingScreen;
