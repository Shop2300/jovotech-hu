'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FileText, Truck, Save, X, Edit2 } from 'lucide-react';

interface AddressEditProps {
  orderNumber: string;
  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  billingCity: string;
  billingPostalCode: string;
  useDifferentDelivery: boolean;
  deliveryFirstName?: string | null;
  deliveryLastName?: string | null;
  deliveryAddress?: string | null;
  deliveryCity?: string | null;
  deliveryPostalCode?: string | null;
  isCompany: boolean;
}

export function AddressEdit({
  orderNumber,
  billingFirstName,
  billingLastName,
  billingAddress,
  billingCity,
  billingPostalCode,
  useDifferentDelivery,
  deliveryFirstName,
  deliveryLastName,
  deliveryAddress,
  deliveryCity,
  deliveryPostalCode,
  isCompany
}: AddressEditProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    billingAddress,
    billingCity,
    billingPostalCode,
    useDifferentDelivery,
    deliveryFirstName: deliveryFirstName || '',
    deliveryLastName: deliveryLastName || '',
    deliveryAddress: deliveryAddress || '',
    deliveryCity: deliveryCity || '',
    deliveryPostalCode: deliveryPostalCode || ''
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update addresses');
      
      toast.success('Adresy byly aktualizovány');
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error('Chyba při aktualizaci adres');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      billingAddress,
      billingCity,
      billingPostalCode,
      useDifferentDelivery,
      deliveryFirstName: deliveryFirstName || '',
      deliveryLastName: deliveryLastName || '',
      deliveryAddress: deliveryAddress || '',
      deliveryCity: deliveryCity || '',
      deliveryPostalCode: deliveryPostalCode || ''
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Billing Address */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-gray-600" />
              <h2 className="text-xl font-semibold text-black">
                {isCompany ? 'Adres firmy' : 'Fakturační adresa'}
              </h2>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
            >
              <Edit2 size={16} />
              Upravit
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-black">
              <strong>{billingFirstName} {billingLastName}</strong>
            </p>
            <p className="text-black">{billingAddress}</p>
            <p className="text-black">{billingCity}, {billingPostalCode}</p>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck size={20} className="text-gray-600" />
            <h2 className="text-xl font-semibold text-black">Doručovací adresa</h2>
          </div>
          <div className="space-y-2">
            {useDifferentDelivery ? (
              <>
                <p className="text-black">
                  <strong>{deliveryFirstName} {deliveryLastName}</strong>
                </p>
                <p className="text-black">{deliveryAddress}</p>
                <p className="text-black">{deliveryCity}, {deliveryPostalCode}</p>
              </>
            ) : (
              <>
                <p className="text-gray-600 text-sm italic">Stejná jako fakturační</p>
                <p className="text-black">
                  <strong>{billingFirstName} {billingLastName}</strong>
                </p>
                <p className="text-black">{billingAddress}</p>
                <p className="text-black">{billingCity}, {billingPostalCode}</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Edit mode
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Upravit adresy</h3>
      
      <div className="space-y-6">
        {/* Billing Address Section */}
        <div>
          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <FileText size={16} />
            {isCompany ? 'Adres firmy' : 'Fakturační adresa'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ulice a číslo popisné
              </label>
              <input
                type="text"
                value={formData.billingAddress}
                onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Město
              </label>
              <input
                type="text"
                value={formData.billingCity}
                onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PSČ
              </label>
              <input
                type="text"
                value={formData.billingPostalCode}
                onChange={(e) => setFormData({ ...formData, billingPostalCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Different Delivery Address Checkbox */}
        <div className="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            id="useDifferentDelivery"
            checked={formData.useDifferentDelivery}
            onChange={(e) => setFormData({ ...formData, useDifferentDelivery: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="useDifferentDelivery" className="text-sm font-medium text-gray-700">
            Použít jinou doručovací adresu
          </label>
        </div>

        {/* Delivery Address Section */}
        {formData.useDifferentDelivery && (
          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Truck size={16} />
              Doručovací adresa
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jméno
                </label>
                <input
                  type="text"
                  value={formData.deliveryFirstName}
                  onChange={(e) => setFormData({ ...formData, deliveryFirstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Příjmení
                </label>
                <input
                  type="text"
                  value={formData.deliveryLastName}
                  onChange={(e) => setFormData({ ...formData, deliveryLastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ulice a číslo popisné
                </label>
                <input
                  type="text"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Město
                </label>
                <input
                  type="text"
                  value={formData.deliveryCity}
                  onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PSČ
                </label>
                <input
                  type="text"
                  value={formData.deliveryPostalCode}
                  onChange={(e) => setFormData({ ...formData, deliveryPostalCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <span>Ukládám...</span>
            ) : (
              <>
                <Save size={16} />
                Uložit
              </>
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition disabled:opacity-50 flex items-center gap-2"
          >
            <X size={16} />
            Zrušit
          </button>
        </div>
      </div>
    </div>
  );
}
