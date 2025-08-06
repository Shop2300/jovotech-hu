// src/app/admin/page.tsx
import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Since we removed the dashboard, redirect to orders page
  redirect('/admin/orders');
}