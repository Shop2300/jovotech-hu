// src/app/admin/orders/[orderNumber]/CustomerInfoEdit.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User, Building2, Save, X, Edit2 } from 'lucide-react';

interface CustomerInfoEditProps {
  orderNumber: string;
  billingFirstName: string;
  billingLastName: string;
  customerEmail: string;
  customerPhone?: string | null;
  isCompany: boolean;
  companyName?: string | null;
  companyNip?: string | null;
}

export function CustomerInfoEdit({
  orderNumber,
  billingFirstName,
  billingLastName,
  customerEmail,
  customerPhone,
  isCompany,
  companyName,
  companyNip
}: CustomerInfoEditProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state - handle null values
  const [formData, setFormData] = useState({
    billingFirstName,
    billingLastName,
    customerEmail,
    customerPhone: customerPhone || '',
    isCompany,
    companyName: companyName || '',
    companyNip: companyNip || ''
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

      if (!response.ok) throw new Error('Failed to update customer information');
      
      toast.success('Customer information has been updated');
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error('Error updating information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      billingFirstName,
      billingLastName,
      customerEmail,
      customerPhone: customerPhone || '',
      isCompany,
      companyName: companyName || '',
      companyNip: companyNip || ''
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <>
        {/* Customer Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-gray-600" />
              {isCompany ? 'Contact Person Details' : 'Customer Details'}
            </h3>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
            >
              <Edit2 size={16} />
              Edit
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-start">
              <span className="text-gray-600 font-medium w-32">Name:</span>
              <span className="text-gray-900">{billingFirstName} {billingLastName}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-600 font-medium w-32">Email:</span>
              <span className="text-gray-900">{customerEmail}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-600 font-medium w-32">Phone:</span>
              <span className="text-gray-900">{customerPhone || '-'}</span>
            </div>
          </div>
        </div>

        {/* Company Details */}
        {isCompany && (companyName || companyNip) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-600" />
              Company Details
            </h3>
            <div className="space-y-2">
              {companyName && (
                <div className="flex items-start">
                  <span className="text-gray-600 font-medium w-32">Company Name:</span>
                  <span className="text-gray-900">{companyName}</span>
                </div>
              )}
              {companyNip && (
                <div className="flex items-start">
                  <span className="text-gray-600 font-medium w-32">NIP:</span>
                  <span className="text-gray-900 font-mono">{companyNip}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // Edit mode
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-gray-600" />
        Edit Customer Information
      </h3>
      
      <div className="space-y-4">
        {/* Is Company Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isCompany"
            checked={formData.isCompany}
            onChange={(e) => setFormData({ ...formData, isCompany: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="isCompany" className="text-sm font-medium text-gray-700">
            Company Order
          </label>
        </div>

        {/* Customer Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={formData.billingFirstName}
              onChange={(e) => setFormData({ ...formData, billingFirstName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={formData.billingLastName}
              onChange={(e) => setFormData({ ...formData, billingLastName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.customerEmail}
            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={formData.customerPhone}
            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Company Fields */}
        {formData.isCompany && (
          <>
            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Building2 size={16} />
                Company Details
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIP
                  </label>
                  <input
                    type="text"
                    value={formData.companyNip}
                    onChange={(e) => setFormData({ ...formData, companyNip: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save size={16} />
                Save
              </>
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition disabled:opacity-50 flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}