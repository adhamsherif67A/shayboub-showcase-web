import { X, ZoomIn } from "lucide-react";
import { useEffect } from "react";

interface ImageModalProps {
  imageUrl: string;
  itemName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({ imageUrl, itemName, isOpen, onClose }: ImageModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative max-w-4xl max-h-[90vh] p-4 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:scale-110 transition-transform duration-200"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Zoom Indicator */}
        <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
          <ZoomIn className="w-4 h-4" />
          <span>Click to close</span>
        </div>

        {/* Image */}
        <img
          src={imageUrl}
          alt={itemName}
          className="w-full h-full object-contain rounded-2xl shadow-2xl max-h-[85vh]"
        />

        {/* Image Title */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full text-lg font-semibold backdrop-blur-sm">
          {itemName}
        </div>
      </div>
    </div>
  );
}
