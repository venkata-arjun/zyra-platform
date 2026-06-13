import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-hot-toast";

const TOPWEAR_SIZES = ["S", "M", "L", "XL", "XXL"];
const BOTTOMWEAR_SIZES = ["28", "30", "32", "34", "36"];

const getSizes = (subCategory) =>
  subCategory === "Bottomwear" ? BOTTOMWEAR_SIZES : TOPWEAR_SIZES;

// ── ImageSlot ────────────────────────────────────────────────────────────────
const ImageSlot = ({
  index,
  existingUrl,
  file,
  removed,
  onChange,
  onRemove,
  onUndo,
}) => {
  const inputRef = useRef(null);
  const preview = file
    ? URL.createObjectURL(file)
    : !removed
      ? existingUrl || null
      : null;

  const openPicker = () => inputRef.current?.click();

  return (
    <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50">
      <button
        type="button"
        onClick={openPicker}
        className="absolute inset-0 group w-full h-full flex items-center justify-center hover:border-blue-300 hover:bg-blue-50/40 transition-all duration-200 active:scale-[0.97]"
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-white text-[10px] font-medium">
                Replace
              </span>
            </div>
            {file && (
              <span className="absolute top-2 left-2 bg-blue-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md leading-none">
                NEW
              </span>
            )}
          </>
        ) : removed ? (
          <div className="flex flex-col items-center gap-1.5 text-gray-400">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9.5 4h5L15 7H9l.5-3z"
              />
            </svg>
            <span className="text-[10px] font-medium">Removed</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-gray-400 group-hover:text-blue-400 transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-[10px] font-medium">Add image</span>
          </div>
        )}
      </button>

      {/* Remove existing image button */}
      {existingUrl && !removed && !file && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-red-500 shadow hover:bg-red-50 active:scale-90 transition-all"
          aria-label="Remove image"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Undo removal button */}
      {removed && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUndo();
          }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white shadow text-blue-600 hover:bg-blue-50 active:scale-95 transition-all"
        >
          Undo
        </button>
      )}

      {/* Clear newly added file */}
      {file && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange(null);
          }}
          className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow hover:bg-gray-100 active:scale-90 transition-all"
          aria-label="Cancel new image"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files[0] || null)}
      />
    </div>
  );
};

const EditProductModal = ({ product, token, onClose, fetchList }) => {
  const [editForm, setEditForm] = useState({
    name: product.name,
    description: product.description || "",
    price: product.price,
    category: product.category || "Men",
    subCategory: product.subCategory || "Topwear",
    sizes: product.sizes || [],
    bestseller: product.bestseller || false,
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    removeImages: [],
  });
  const [editLoading, setEditLoading] = useState(false);
  const modalRef = useRef(null);

  const setField = (key) => (val) => setEditForm((f) => ({ ...f, [key]: val }));
  const onFieldChange = (key) => (e) => setField(key)(e.target.value);

  // When subCategory changes, clear sizes incompatible with new set
  const handleSubCategoryChange = (e) => {
    const newSub = e.target.value;
    const validSizes = getSizes(newSub);
    setEditForm((f) => ({
      ...f,
      subCategory: newSub,
      sizes: f.sizes.filter((s) => validSizes.includes(s)),
    }));
  };

  const toggleSize = (size) =>
    setEditForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size],
    }));

  const markRemoved = (index) =>
    setEditForm((f) => ({
      ...f,
      removeImages: f.removeImages.includes(index)
        ? f.removeImages
        : [...f.removeImages, index],
      [`image${index + 1}`]: null,
    }));

  const undoRemoved = (index) =>
    setEditForm((f) => ({
      ...f,
      removeImages: f.removeImages.filter((i) => i !== index),
    }));

  const handleImageChange = (index) => (file) =>
    setEditForm((f) => ({
      ...f,
      [`image${index + 1}`]: file,
      removeImages: file
        ? f.removeImages.filter((i) => i !== index)
        : f.removeImages,
    }));

  const handleSave = async () => {
    if (!editForm.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!editForm.price || Number(editForm.price) <= 0) {
      toast.error("Enter a valid price");
      return;
    }

    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", product._id);
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("price", editForm.price);
      formData.append("category", editForm.category);
      formData.append("subCategory", editForm.subCategory);
      formData.append("sizes", JSON.stringify(editForm.sizes));
      formData.append("bestseller", editForm.bestseller);
      formData.append("removeImages", JSON.stringify(editForm.removeImages));

      if (editForm.image1) formData.append("image1", editForm.image1);
      if (editForm.image2) formData.append("image2", editForm.image2);
      if (editForm.image3) formData.append("image3", editForm.image3);
      if (editForm.image4) formData.append("image4", editForm.image4);

      const response = await axios.post(
        backendUrl + "/api/product/update",
        formData,
        { headers: { token } },
      );

      if (response.data.success) {
        toast.success("Product updated");
        await fetchList();
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const availableSizes = getSizes(editForm.subCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative bg-white w-full sm:max-w-lg sm:mx-4 sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[94dvh] sm:max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="min-w-0 flex-1 pr-4">
            <h3 className="text-base font-semibold text-gray-900">
              Edit Product
            </h3>
            <p className="text-sm text-gray-500 truncate mt-0.5">
              {product.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-5 sm:py-6 space-y-5 sm:space-y-6">
          {/* Images */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Product Images
              <span className="ml-1.5 text-gray-400 font-normal normal-case">
                (tap to replace, X to remove)
              </span>
            </label>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <ImageSlot
                  key={idx}
                  index={idx}
                  existingUrl={product.image?.[idx] || null}
                  file={editForm[`image${idx + 1}`]}
                  removed={editForm.removeImages.includes(idx)}
                  onChange={handleImageChange(idx)}
                  onRemove={() => markRemoved(idx)}
                  onUndo={() => undoRemoved(idx)}
                />
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Product Name
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={onFieldChange("name")}
              placeholder="e.g. Classic Cotton Hoodie"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 text-[15px] text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              value={editForm.description}
              onChange={onFieldChange("description")}
              rows={3}
              placeholder="Short product description..."
              className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 text-[15px] text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 resize-none transition-all"
            />
          </div>

          {/* Category + Sub Category */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={editForm.category}
                onChange={onFieldChange("category")}
                className="w-full rounded-2xl border border-gray-200 px-3 sm:px-4 py-3.5 text-[15px] text-gray-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Sub Category
              </label>
              <select
                value={editForm.subCategory}
                onChange={handleSubCategoryChange}
                className="w-full rounded-2xl border border-gray-200 px-3 sm:px-4 py-3.5 text-[15px] text-gray-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
              >
                <option value="Topwear">Topwear</option>
                <option value="Bottomwear">Bottomwear</option>
                <option value="Winterwear">Winterwear</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Price ({currency})
            </label>
            <input
              type="number"
              min="0"
              value={editForm.price}
              onChange={onFieldChange("price")}
              placeholder="0"
              className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 text-[15px] text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Available Sizes
            </label>
            <p className="text-xs text-gray-400 mb-3">
              {editForm.subCategory === "Bottomwear"
                ? "Waist sizes in inches"
                : "Select all sizes in stock"}
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {availableSizes.map((size) => {
                const active = editForm.sizes?.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`h-11 min-w-[48px] sm:min-w-[52px] px-3.5 sm:px-4 rounded-2xl border text-sm font-semibold transition-all active:scale-95
                      ${
                        active
                          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bestseller */}
          <label className="flex items-center justify-between rounded-2xl border border-gray-200 px-4 sm:px-5 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors select-none">
            <div>
              <p className="text-[15px] font-medium text-gray-800">
                Bestseller
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                Feature on homepage
              </p>
            </div>
            <div className="relative flex-shrink-0 ml-4">
              <input
                type="checkbox"
                checked={editForm.bestseller}
                onChange={(e) => setField("bestseller")(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full transition-all" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all peer-checked:translate-x-5" />
            </div>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 bg-gray-50 border-t border-gray-100 flex-shrink-0">
          <p className="text-xs text-gray-400 font-mono hidden sm:block">
            ID: {product._id?.slice(-8)}
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 sm:px-6 py-3.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={editLoading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed rounded-2xl transition-all active:scale-[0.985]"
            >
              {editLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
