import { Link } from "react-router-dom";
import { Card, Button, Chip } from "@heroui/react";
import { Star, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { getProductIcon } from "../lib/icons.js";
import { getFileUrl } from "../lib/api.js";

export default function ProductCard({ product, onAddToCart }) {
  const Icon = getProductIcon(product.icon);
  const imageUrl = getFileUrl(product.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -6 }}
    >
      <Card
        variant="default"
        className="h-full !gap-4 border border-separator/60 !p-5 transition-shadow hover:shadow-lg"
      >
        <Card.Header className="!flex-row items-start justify-between gap-2">
          <Link to={`/product/${product._id}`}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="size-16 rounded-2xl object-cover"
              />
            ) : (
              <span className="flex size-16 items-center justify-center rounded-2xl bg-trend-sage text-trend-pine">
                <Icon size={30} strokeWidth={1.7} />
              </span>
            )}
          </Link>
          {product.badge && (
            <Chip color="accent" variant="soft" size="sm">
              {product.badge}
            </Chip>
          )}
        </Card.Header>

        <Card.Content className="!gap-2">
          <p className="text-xs font-medium text-trend-ink/50">
            {product.categoryLabel}
          </p>
          <Link to={`/product/${product._id}`}>
            <Card.Title className="!text-base !font-bold text-trend-ink hover:text-accent">
              {product.name}
            </Card.Title>
          </Link>
          <div className="flex items-center gap-1 text-sm text-trend-ink/60">
            <Star size={15} className="fill-trend-gold text-trend-gold" />
            {product.rating}
          </div>
        </Card.Content>

        <Card.Footer className="items-center justify-between">
          <span className="text-lg font-black text-trend-pine">
            {product.price}{" "}
            <span className="text-sm font-medium text-trend-ink/50">د.ل</span>
          </span>
          <Button
            variant="primary"
            size="sm"
            isIconOnly
            aria-label="أضف للسلة"
            className="rounded-full bg-accent"
            onPress={() => onAddToCart?.(product)}
          >
            <ShoppingCart size={17} />
          </Button>
        </Card.Footer>
      </Card>
    </motion.div>
  );
}
