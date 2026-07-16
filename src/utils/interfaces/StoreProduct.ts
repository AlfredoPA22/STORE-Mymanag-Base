export interface IStoreBrand {
  _id: string;
  name: string;
}

export interface IStoreCategory {
  _id: string;
  name: string;
}

export interface IStoreProduct {
  _id: string;
  code: string;
  name: string;
  description: string;
  image: string;
  images?: string[];
  sale_price: number;
  regular_price?: number | null;
  stock: number;
  status: string;
  stock_type: "serializado" | "individual";
  brand: IStoreBrand | null;
  category: IStoreCategory | null;
}

export interface IStoreTheme {
  primary?: string;
  primaryDark?: string;
  primaryForeground?: string;
  dark?: string;
  darkLight?: string;
  light?: string;
}

export interface ICompanyInfo {
  companyId: string;
  name: string;
  slug?: string;
  tagline?: string;
  description?: string;
  image?: string;
  address?: string;
  phone?: string;
  email?: string;
  country?: string;
  store_banner_image?: string;
  store_theme?: IStoreTheme | null;
}
