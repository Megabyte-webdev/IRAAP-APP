"use client";

import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import ViewerNav from "./ViewerNav";
import SafeImage from "@/app/_components/SafeImage";

const ImageViewer = ({ media, startIndex, onClose, viewerOpen }: any) => {
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);

  // keep in sync when opening different image
  useEffect(() => {
    setIndex(startIndex);
    setZoom(1);
  }, [startIndex]);

  const toggleZoom = () => setZoom((prev) => (prev === 1 ? 2 : 1));

  const current = media?.[index];

  if (!current) return null;

  const goPrev = () => {
    setIndex((i: number) => Math.max(i - 1, 0));
  };

  const goNext = () => {
    setIndex((i: number) => Math.min(i + 1, media.length - 1));
  };

  return (
    <div
      className={`${viewerOpen ? "fixed inset-0 z-50" : "hidden"} fixed inset-0 bg-white flex flex-col z-50`}
    >
      {/* HEADER */}
      <ViewerNav
        user={current?.sender}
        message={current}
        handleClose={onClose}
        onZoom={toggleZoom}
      />

      {/* VIEWPORT */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* LEFT */}
        <button
          onClick={goPrev}
          className="cursor-pointer absolute left-6 z-10 w-11 h-11 rounded-full bg-orange text-white flex items-center justify-center shadow-md"
        >
          <MdKeyboardArrowLeft />
        </button>

        {/* IMAGE */}
        <div className="p-10 w-full h-full flex flex-col items-center justify-center">
          <SafeImage
            src={current.src}
            alt="media"
            width={1200}
            height={800}
            className="max-h-full w-auto h-auto object-contain mx-auto"
          />
        </div>

        {/* RIGHT */}
        <button
          onClick={goNext}
          className="cursor-pointer absolute right-6 z-10 w-11 h-11 rounded-full bg-orange text-white flex items-center justify-center shadow-md"
        >
          <MdKeyboardArrowRight />
        </button>
      </div>

      {/* THUMBNAILS */}
      <div className="h-21.25 bg-white flex items-center gap-3 px-6 overflow-x-auto border-t border-[#00000033]">
        {media.map((m: any, i: number) => (
          <div
            key={m.src + i}
            onClick={() => setIndex(i)}
            className={`shrink-0 w-19.75 h-18 overflow-hidden cursor-pointer border-2 transition-all ${
              i === index
                ? "border-orange scale-105 shadow-sm"
                : "border-transparent opacity-50"
            }`}
          >
            <SafeImage
              width={100}
              height={100}
              src={m.src}
              className="w-full h-full object-cover aspect-square"
              alt="thumb"
              showLoader={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageViewer;
