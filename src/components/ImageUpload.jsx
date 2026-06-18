import { useState, useRef, useCallback } from "react";
import { Upload, X, Camera, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function ImageUpload({ images = [], onChange, maxImages = 5, maxSizeMB = 5 }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const validateImage = (file) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      throw new Error(`${file.name} is not an image file`);
    }
    
    // Check file size (max 5MB)
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`${file.name} exceeds ${maxSizeMB}MB limit`);
    }
    
    return true;
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });
  };

  // Compress image before converting to base64
  const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            file.type,
            quality
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    await processFiles(files);
  };

  const processFiles = async (files) => {
    setError(null);
    
    if (images.length + files.length > maxImages) {
      const errorMsg = `You can only upload up to ${maxImages} images`;
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setUploading(true);
    const newImages = [...images];
    let hasError = false;

    for (const file of files) {
      try {
        validateImage(file);
        
        // Show compression toast for large files
        if (file.size > 1024 * 1024) { // > 1MB
          toast.info(`Compressing ${file.name}...`, { duration: 1000 });
        }
        
        // Compress image if needed
        let imageToProcess = file;
        if (file.size > 2 * 1024 * 1024) { // > 2MB
          imageToProcess = await compressImage(file);
        }
        
        const base64 = await fileToBase64(imageToProcess);
        newImages.push(base64);
      } catch (err) {
        hasError = true;
        toast.error(err.message);
        setError(err.message);
      }
    }

    if (!hasError) {
      onChange(newImages);
      toast.success(`Added ${files.length} photo${files.length !== 1 ? 's' : ''}`);
    }
    
    setUploading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
    toast.info("Photo removed");
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  }, [images, maxImages]);

  return (
    <div className="space-y-3">
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, index) => (
          <div 
            key={index} 
            className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#E7E5E0] group bg-[#F5F3EE]"
          >
            <img 
              src={img} 
              alt={`Gallery ${index + 1}`} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              aria-label="Remove image"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/50 rounded text-white text-[10px]">
              {index + 1}
            </div>
          </div>
        ))}
        
        {/* Add Photo Button */}
        {images.length < maxImages && (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all cursor-pointer
              ${dragActive 
                ? 'border-[#7C3AED] bg-[#F3E8FF] scale-105' 
                : 'border-[#D4D2CB] hover:border-[#7C3AED] hover:bg-[#F3E8FF] hover:scale-105'
              } 
              ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin" />
                <span className="text-xs text-[#7C3AED]">Uploading...</span>
              </>
            ) : (
              <>
                {dragActive ? (
                  <>
                    <Upload className="w-8 h-8 text-[#7C3AED]" />
                    <span className="text-xs text-[#7C3AED] font-medium">Drop to upload</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-[#6B6B70]" />
                    <span className="text-xs text-[#6B6B70]">Add Photo</span>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      
      {/* Info Text */}
      <div className="flex items-center justify-between text-xs text-[#6B6B70]">
        <div className="flex items-center gap-1">
          <ImageIcon className="w-3 h-3" />
          <span>{images.length}/{maxImages} photos</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Max {maxSizeMB}MB each</span>
          <span className="w-1 h-1 rounded-full bg-[#D4D2CB]" />
          <span>JPG, PNG, WEBP</span>
        </div>
      </div>
      
      {/* Drag & Drop Hint */}
      {images.length < maxImages && !uploading && (
        <div className="text-center text-[10px] text-[#6B6B70] border-t border-[#E7E5E0] pt-2">
          Drag & drop images here or click to browse
        </div>
      )}
      
      {/* Upload Progress (if multiple files) */}
      {uploading && (
        <div className="mt-2">
          <div className="h-1 bg-[#E7E5E0] rounded-full overflow-hidden">
            <div className="h-full bg-[#7C3AED] rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      )}
    </div>
  );
}