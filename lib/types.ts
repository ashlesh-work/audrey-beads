export type SiteContent = {
  brand: string;
  heroLead: string;
  badge1: string;
  badge2: string;
  badge3: string;
  onlineText: string;
  stallSociety: string;
  stallTime: string;
  about1: string;
  about2: string;
};

export type Product = {
  id: string;
  name: string;
  tag: string;
  description: string;
  image_url: string;
  sort: number;
};

export type OrderStatus = "New" | "Making" | "Ready" | "Delivered";

export type Order = {
  id: string;
  name: string;
  style: string;
  message: string;
  status: OrderStatus;
  created_at: string;
};

export type Testimonial = {
  id: string;
  name: string;
  text: string;
  image_url: string;
  sort: number;
};

