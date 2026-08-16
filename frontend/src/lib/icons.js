import {
  Headphones,
  Watch,
  ShoppingBag,
  Shirt,
  Coffee,
  Sparkles,
  Footprints,
  Glasses,
  Package,
} from "lucide-react";

export const iconMap = {
  Headphones,
  Watch,
  ShoppingBag,
  Shirt,
  Coffee,
  Sparkles,
  Footprints,
  Glasses,
};

export function getProductIcon(name) {
  return iconMap[name] || Package;
}
