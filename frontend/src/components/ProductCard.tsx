import type { MenuItem } from "../services/api";

type ProductCardProps = {
  product: MenuItem;
  onAdd: (product: MenuItem) => void;
};

const imageMap: Record<string, string> = {
  "calabresa": "calabresa.png",
  "frango com catupiry": "frango.png",
  "margherita": "margherita.png",
  "pepperoni": "pepperoni.png",
  "portuguesa": "portuguesa.png",
  "quatro queijos": "quatroQueijos.png",
  "quatroqueijos": "quatro-queijos.png",
  "refrigerante": "refrigerante.png",
  "suco": "suco.png",
  "agua": "agua.png",
};

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const normalizedName = product.name.toLowerCase().trim();
  const imageSrc = product.imageUrl || imageMap[normalizedName] || "/logo.png";

  return (
    <div className="bg-white border border-slate-200 rounded-[28px] shadow-xl w-[240px] overflow-hidden transition hover:-translate-y-1 hover:shadow-2xl">
      <img
        src={imageSrc}
        alt={product.name}
        className="w-full h-50 object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-lg">{product.name}</h3>

        <p className="text-sm text-slate-500 mt-1">
          {product.category === "bebida" ? "Bebida" : "Pizza"} · {product.size}
        </p>

        <p className="text-orange-500 font-bold text-base mt-2">
          R$ {product.price}
        </p>

        <button
          onClick={() => onAdd(product)}
          className="mt-4 w-full rounded-2xl bg-orange-500 text-white text-sm font-semibold py-2 hover:bg-orange-600 transition"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
