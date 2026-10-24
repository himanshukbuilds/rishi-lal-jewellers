'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
  Gem,
  Filter,
} from 'lucide-react';
import { api } from '@/services/api';
import { formatPrice } from '@/config/brandConfig';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const initialForm = {
    name: '',
    category: 'Gold',
    categorySlug: 'gold',
    price: '',
    originalPrice: '',
    metal: '22K Yellow Gold',
    purity: '22KT (916 Hallmarked)',
    grossWeight: '',
    netGoldWeight: '',
    stock: 5,
    description: '',
    craftsmanshipStory: '',
    images: '',
    modelUrl: '',
    availableSizes: 'Standard',
    isBestseller: false,
    isNewArrival: false,
    isBridal: false,
  };
  const [formData, setFormData] = useState(initialForm);

  // TanStack Query for products
  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', selectedCategory, searchTerm],
    queryFn: () =>
      api.getProducts({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchTerm.trim() || undefined,
        limit: 50,
      }),
  });

  const products = data?.products || [];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Create Product Mutation
  const createMutation = useMutation({
    mutationFn: (newProduct) => api.createProduct(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setIsModalOpen(false);
      setFormData(initialForm);
      showToast('New fine jewelry creation added to catalog successfully!');
    },
    onError: (err) => {
      alert(`Error creating product: ${err.message}`);
    },
  });

  // Update Product Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updated }) => api.updateProduct(id, updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setIsModalOpen(false);
      setIsEditing(false);
      setCurrentProductId(null);
      setFormData(initialForm);
      showToast('Product specifications updated successfully!');
    },
    onError: (err) => {
      alert(`Error updating product: ${err.message}`);
    },
  });

  // Delete Product Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setDeleteConfirmId(null);
      showToast('Product removed from catalog.');
    },
    onError: (err) => {
      alert(`Error deleting product: ${err.message}`);
    },
  });

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentProductId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setIsEditing(true);
    setCurrentProductId(product._id);
    setFormData({
      name: product.name,
      category: product.category,
      categorySlug: product.categorySlug || product.category.toLowerCase(),
      price: product.price,
      originalPrice: product.originalPrice || '',
      metal: product.metal,
      purity: product.purity,
      grossWeight: product.grossWeight,
      netGoldWeight: product.netGoldWeight || product.grossWeight,
      stock: product.stock,
      description: product.description,
      craftsmanshipStory: product.craftsmanshipStory || '',
      images: product.images ? product.images.join(', ') : '',
      modelUrl: product.modelUrl || '',
      availableSizes: product.availableSizes ? product.availableSizes.join(', ') : 'Standard',
      isBestseller: !!product.isBestseller,
      isNewArrival: !!product.isNewArrival,
      isBridal: !!product.isBridal,
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    const imgArray = formData.images
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const sizesArray = formData.availableSizes
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      grossWeight: Number(formData.grossWeight) || 10,
      netGoldWeight: Number(formData.netGoldWeight) || Number(formData.grossWeight) || 10,
      stock: Number(formData.stock) || 1,
      images: imgArray.length > 0 ? imgArray : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
      modelUrl: formData.modelUrl.trim() || null,
      availableSizes: sizesArray.length > 0 ? sizesArray : ['Standard'],
      categorySlug: formData.category.toLowerCase(),
    };

    if (isEditing) {
      updateMutation.mutate({ id: currentProductId, updated: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-emerald-950 text-gold-300 border border-gold-400 rounded-sm shadow-xl text-xs flex items-center gap-2 animate-fade-in font-sans">
          <Check className="w-4 h-4 text-gold-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-sans text-gold-700 uppercase tracking-widest font-semibold block">
            Inventory & Catalog
          </span>
          <h1 className="font-serif text-3xl font-normal text-emerald-950">
            Jewelry Product Management
          </h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 bg-emerald-950 text-gold-300 hover:bg-emerald-900 text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors flex items-center gap-2 border border-gold-400/40 shadow-sm"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>Add New Creation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-sm border border-gold-300/50 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, SKU, or purity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gold-300 rounded-sm focus:outline-none focus:border-gold-600 text-emerald-950 font-sans"
          />
          <Search className="w-4 h-4 text-gold-700 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs border border-gold-300 rounded-sm bg-white text-emerald-950 focus:outline-none focus:border-gold-600 font-sans"
          >
            <option value="all">All Categories</option>
            <option value="Gold">Gold</option>
            <option value="Diamond">Diamond</option>
            <option value="Bridal">Bridal</option>
            <option value="Earrings">Earrings</option>
            <option value="Rings">Rings</option>
            <option value="Necklaces">Necklaces</option>
            <option value="Bangles">Bangles</option>
            <option value="Gifts">Gifts</option>
          </select>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-white rounded-sm border border-gold-300/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-ivory-100 text-charcoal-600 uppercase tracking-wider text-[10px] border-b border-gold-200">
              <tr>
                <th className="py-3 px-4">Creation</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Metal & Purity</th>
                <th className="py-3 px-4">Gross Wt.</th>
                <th className="py-3 px-4">Price (₹)</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ivory-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-charcoal-500">
                    Loading inventory...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-charcoal-500 italic">
                    No creations found matching query.
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-ivory-50/60 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-ivory-100 shrink-0 border border-gold-200">
                          <Image
                            src={prod.images?.[0] || '/images/placeholder.jpg'}
                            alt={prod.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-serif font-medium text-emerald-950 block text-sm">
                            {prod.name}
                          </span>
                          <span className="text-[10px] text-charcoal-400 font-mono">
                            SKU: {prod.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-charcoal-700 font-medium">
                      {prod.category}
                    </td>

                    <td className="py-3 px-4 text-charcoal-700">
                      <span>{prod.purity}</span>
                    </td>

                    <td className="py-3 px-4 text-charcoal-700 font-mono">
                      {prod.grossWeight}g
                    </td>

                    <td className="py-3 px-4 font-serif font-bold text-emerald-950 text-sm">
                      {formatPrice(prod.price)}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          prod.stock <= 3
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {prod.stock} units
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="p-1.5 text-charcoal-600 hover:text-emerald-950 rounded hover:bg-ivory-100 transition-colors"
                          title="Edit Creation"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(prod._id)}
                          className="p-1.5 text-charcoal-600 hover:text-red-700 rounded hover:bg-red-50 transition-colors"
                          title="Delete Creation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white rounded-sm p-6 max-w-sm w-full border border-gold-300 shadow-xl space-y-4">
            <h3 className="font-serif text-lg font-semibold text-emerald-950">
              Confirm Deletion
            </h3>
            <p className="text-xs text-charcoal-600 leading-relaxed font-sans">
              Are you sure you want to permanently remove this piece from the catalog? This action will persist to the database immediately.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gold-300 text-xs font-sans uppercase font-medium rounded-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteConfirmId)}
                className="px-4 py-2 bg-red-700 text-white text-xs font-sans uppercase font-semibold rounded-sm hover:bg-red-800 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-white rounded-sm p-6 sm:p-8 max-w-2xl w-full border border-gold-300 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gold-200 mb-6">
              <h3 className="font-serif text-xl font-semibold text-emerald-950">
                {isEditing ? 'Edit Jewelry Specifications' : 'Add New Jewelry Creation'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-charcoal-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-serif uppercase tracking-wider text-emerald-950 font-bold block mb-1">
                    Jewelry Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Nizam Polki Necklace Set"
                    className="w-full px-3 py-2 border border-gold-300 rounded-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-serif uppercase tracking-wider text-emerald-950 font-bold block mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gold-300 rounded-sm bg-white"
                  >
                    <option value="Gold">Gold</option>
                    <option value="Diamond">Diamond</option>
                    <option value="Bridal">Bridal</option>
                    <option value="Earrings">Earrings</option>
                    <option value="Rings">Rings</option>
                    <option value="Necklaces">Necklaces</option>
                    <option value="Bangles">Bangles</option>
                    <option value="Gifts">Gifts</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-serif uppercase tracking-wider text-emerald-950 font-bold block mb-1">
                    Metal *
                  </label>
                  <select
                    value={formData.metal}
                    onChange={(e) => setFormData({ ...formData, metal: e.target.value })}
                    className="w-full px-3 py-2 border border-gold-300 rounded-sm bg-white"
                  >
                    <option value="22K Yellow Gold">22K Yellow Gold</option>
                    <option value="18K Yellow Gold">18K Yellow Gold</option>
                    <option value="18K White Gold">18K White Gold</option>
                    <option value="18K Rose Gold">18K Rose Gold</option>
                    <option value="Platinum 950">Platinum 950</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-serif uppercase tracking-wider text-emerald-950 font-bold block mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 145000"
                    className="w-full px-3 py-2 border border-gold-300 rounded-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-serif uppercase tracking-wider text-emerald-950 font-bold block mb-1">
                    Original Price (₹ MRP)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="e.g. 165000"
                    className="w-full px-3 py-2 border border-gold-300 rounded-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-serif uppercase tracking-wider text-emerald-950 font-bold block mb-1">
                    Gross Weight (g) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.grossWeight}
                    onChange={(e) => setFormData({ ...formData, grossWeight: e.target.value })}
                    placeholder="e.g. 24.8"
                    className="w-full px-3 py-2 border border-gold-300 rounded-sm"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-serif uppercase tracking-wider text-emerald-950 font-bold block mb-1">
                    Inventory Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="e.g. 5"
                    className="w-full px-3 py-2 border border-gold-300 rounded-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-serif uppercase tracking-wider text-emerald-950 font-bold block mb-1">
                    Image URLs (comma separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="https://images.unsplash.com/..., https://..."
                    className="w-full px-3 py-2 border border-gold-300 rounded-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-serif uppercase tracking-wider text-emerald-950 font-bold block mb-1">
                    Optional 3D Model URL (.glb or .gltf)
                  </label>
                  <input
                    type="text"
                    value={formData.modelUrl}
                    onChange={(e) => setFormData({ ...formData, modelUrl: e.target.value })}
                    placeholder="/models/gold-ring.glb"
                    className="w-full px-3 py-2 border border-gold-300 rounded-sm"
                  />
                  <p className="mt-1 text-[10px] text-charcoal-500">Leave blank to use product photos. Local files go in frontend/public/models/.</p>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-serif uppercase tracking-wider text-emerald-950 font-bold block mb-1">
                    Available Sizes (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.availableSizes}
                    onChange={(e) => setFormData({ ...formData, availableSizes: e.target.value })}
                    placeholder="e.g. 12, 14, 16, 18 or 2.4, 2.6, 2.8"
                    className="w-full px-3 py-2 border border-gold-300 rounded-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-serif uppercase tracking-wider text-emerald-950 font-bold block mb-1">
                    Product Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed craftsmanship and design description..."
                    className="w-full px-3 py-2 border border-gold-300 rounded-sm"
                  />
                </div>
              </div>

              {/* Special Badges Checkboxes */}
              <div className="pt-2 flex flex-wrap gap-6 border-t border-ivory-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="text-gold-600 rounded"
                  />
                  <span>Mark as Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="text-gold-600 rounded"
                  />
                  <span>Mark as New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBridal}
                    onChange={(e) => setFormData({ ...formData, isBridal: e.target.checked })}
                    className="text-gold-600 rounded"
                  />
                  <span>Include in Bridal Pavilion</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gold-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gold-300 text-charcoal-700 uppercase tracking-wider font-medium rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2 bg-emerald-950 hover:bg-emerald-900 text-gold-300 uppercase tracking-wider font-semibold rounded-sm transition-colors border border-gold-400/40"
                >
                  {isEditing ? 'Save Changes' : 'Create Piece'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

