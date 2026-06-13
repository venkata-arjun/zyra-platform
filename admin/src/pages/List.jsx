import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-hot-toast";
import EditProductModal from "../components/EditProductModal"

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // ── Delete ─────────────────────────────────────────────────────────────────
  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setConfirmId(null);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const pendingItem = list.find((p) => p._id === confirmId);

  return (
    <div className="w-full px-2 sm:px-4">
      {/* Page Title */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700 tracking-wide">
          All Products
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {list.length} item{list.length !== 1 ? "s" : ""} listed
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white">
        {/* Header — desktop */}
        <div className="hidden md:grid grid-cols-[80px_1fr_120px_100px_120px] items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Image
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Name
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Category
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Price
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 text-center">
            Actions
          </span>
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg
              className="w-10 h-10 mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4"
              />
            </svg>
            <p className="text-sm font-medium">No products yet</p>
            <p className="text-xs mt-1 text-gray-300">
              Add a product to see it here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {list.map((item, index) => (
              <div
                key={index}
                className="grid items-center gap-3 px-4 py-3 grid-cols-[56px_1fr_auto] md:grid-cols-[80px_1fr_120px_100px_120px] hover:bg-gray-50/60 transition-colors duration-150"
              >
                {/* Thumbnail */}
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src={item.image[0]}
                    alt={item.name}
                  />
                </div>

                {/* Name + mobile meta */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 md:hidden">
                    <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold text-gray-600">
                      {item.price}
                    </span>
                  </div>
                </div>

                {/* Category — desktop */}
                <p className="hidden md:block text-sm text-gray-500">
                  <span className="bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5 text-xs font-medium">
                    {item.category}
                  </span>
                </p>

                {/* Price — desktop */}
                <p className="hidden md:block text-sm font-semibold text-gray-700">
                  {item.price}
                </p>

                {/* Actions */}
                <div className="flex justify-end md:justify-center gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    aria-label={`Edit ${item.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 113 3L12 14l-4 1 1-4 7.5-7.5z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setConfirmId(item._id)}
                    aria-label={`Delete ${item.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          token={token}
          onClose={() => setEditingProduct(null)}
          fetchList={fetchList}
        />
      )}

      {/* Confirm Delete Modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setConfirmId(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="text-base font-semibold text-gray-800">
                Delete product?
              </h3>
              {pendingItem && (
                <p className="text-sm text-gray-500 mt-1">
                  <span className="font-medium text-gray-700">
                    "{pendingItem.name}"
                  </span>{" "}
                  will be permanently removed.
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-1">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => removeProduct(confirmId)}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
