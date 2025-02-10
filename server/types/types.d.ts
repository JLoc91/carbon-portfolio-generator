export interface ProjectRaw {
  id: number;
  name: string;
  country: string;
  image: string;
  price_per_ton: string;
  offered_volume_in_tons: string;
  distribution_weight: string;
  supplier_name: string;
  earliest_delivery: string;
  description: string;
}

export interface Project
  extends Omit<
    ProjectRaw,
    "price_per_ton" | "offered_volume_in_tons" | "distribution_weight"
  > {
  price_per_ton: number;
  offered_volume_in_tons: number;
  distribution_weight: number;
  invested_carbon_credits?: number | undefined;
  new_distribution_weight?: number;
  total_price?: number;
}
