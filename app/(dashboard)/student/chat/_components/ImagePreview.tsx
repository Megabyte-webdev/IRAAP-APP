const ImagePreview = ({
  images,
  setImages,
}: {
  images: string[];
  setImages: (imgs: string[]) => void;
}) => {
  return (
    <div className="mb-2 flex gap-2 flex-wrap">
      {images.map((img, index) => (
        <div key={index} className="relative">
          <img src={img} className="w-16 h-16 object-cover rounded-lg border" />

          <button
            onClick={() => setImages(images.filter((_, i) => i !== index))}
            className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImagePreview;
