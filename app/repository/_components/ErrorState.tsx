import { X } from "lucide-react";

export default function ErrorState({ message }: { message: string }) {
  return (
    <div className="p-20 text-center">
      <div className="inline-flex p-4 bg-red-50 text-red-600 rounded-full mb-4">
        <X size={32} />
      </div>
      <p className="text-slate-900 font-bold text-xl">{message}</p>
    </div>
  );
}
