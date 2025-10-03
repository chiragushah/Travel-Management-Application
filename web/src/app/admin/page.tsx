import Link from 'next/link';

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/tours" className="rounded-xl border p-6 hover:shadow">
          <div className="font-medium">Manage Tours</div>
          <div className="text-sm text-gray-600">Create, edit, publish tours</div>
        </Link>
        <Link href="/admin/users" className="rounded-xl border p-6 hover:shadow">
          <div className="font-medium">Manage Users</div>
          <div className="text-sm text-gray-600">Admins and customers</div>
        </Link>
        <Link href="/admin/orders" className="rounded-xl border p-6 hover:shadow">
          <div className="font-medium">Orders & Payments</div>
          <div className="text-sm text-gray-600">Track and reconcile</div>
        </Link>
      </div>
    </div>
  );
}
