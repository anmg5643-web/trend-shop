import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Chip } from "@heroui/react";
import { Star, ShoppingCart, CheckCircle2 } from "lucide-react";
import { getProductIcon } from "../lib/icons.js";
import { getFileUrl } from "../lib/api.js";

export default function ProductCard({ product, onAddToCart }) {
  const Icon = getProductIcon(product.icon);
  const imageUrl = getFileUrl(product.image);

  // لو الصورة ما انحملتش (رابط مكسور أو ملف انحذف) نرجعو للأيقونة بدل صورة مكسورة
  const [imageFailed, setImageFailed] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  const showImage = imageUrl && !imageFailed;

  const handleAdd = () => {
    onAddToCart?.(product);
    setAdded(true);
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-separator/60 bg-white transition-shadow hover:shadow-lg">
      {/* الصورة — مربعة */}
      <Link
        to={`/product/${product._id}`}
        aria-label={product.name}
        className="relative block aspect-square overflow-hidden bg-trend-sage"
      >
        {showImage ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-trend-pine/70">
            <Icon size={56} strokeWidth={1.4} />
          </span>
        )}

        {product.badge && (
          <Chip
            color="accent"
            variant="primary"
            size="sm"
            className="absolute top-3 right-3"
          >
            {product.badge}
          </Chip>
        )}
      </Link>

      {/* التفاصيل */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-trend-ink/50">
          <span className="truncate">{product.categoryLabel}</span>
          <span className="flex shrink-0 items-center gap-1">
            <Star size={13} className="fill-trend-gold text-trend-gold" />
            {product.rating}
          </span>
        </div>

        <Link to={`/product/${product._id}`} className="mt-1.5">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-[15px] leading-[1.4] font-bold text-trend-ink transition-colors hover:text-trend-green-text">
            {product.name}
          </h3>
        </Link>

        <p className="mt-3 text-xl font-black text-trend-ink">
          {product.price}{" "}
          <span className="text-sm font-medium text-trend-ink/50">د.ل</span>
        </p>

        <div className="mt-auto pt-3">
          <Button
            variant="primary"
            fullWidth
            className="rounded-full bg-accent"
            onPress={handleAdd}
          >
            {added ? (
              <>
                <CheckCircle2 size={17} />
                تمت الإضافة
              </>
            ) : (
              <>
                <ShoppingCart size={17} />
                أضف للسلة
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}