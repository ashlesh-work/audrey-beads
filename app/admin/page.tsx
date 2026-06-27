import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { getContent, listProducts, listOrders, listTestimonials } from "@/lib/store";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const content = getContent();
  return (
    <AdminDashboard
      email={user.email}
      brand={content.brand}
      content={content}
      products={listProducts()}
      orders={listOrders()}
      testimonials={listTestimonials()}
    />
  );
}
