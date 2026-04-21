export interface NavItem {
  name: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: NavItem[];
}

export interface HeroContent {
  headline: string;
  subtext: string;
  ctaText: string;
  ctaHref: string;
}

export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

export type UserRole =
  | "student"
  | "instructor"
  | "lecturer"
  | "admin"
  | "owner"
  | "manager"
  | "content_editor"
  | "support";

export interface User {
  id: number;
  name: string;
  email: string;
  photo?: string | null;
  phone?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  bio?: string | null;
  role: UserRole;
  verified?: boolean;
}
