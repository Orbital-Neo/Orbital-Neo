import { useState } from "react";

export function ProductCard({ product, onAdd }: any) {
  const sizes = Object.keys(product.sizes);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);

  const price = product.sizes[selectedSize];

  return (
    <div className="bg-white border border-slate-200 rounded-[28px] shadow-xl w-[240px] overflow-hidden transition hover:-translate-y-1 hover:shadow-2xl">
      <img
        src={product.image}
        className="w-full h-40 object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 text-lg">
          {product.name}
        </h3>

        <p className="text-orange-500 font-bold text-base mt-2">
          R$ {price}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-3 py-1.5 text-xs rounded-full border transition ${
                selectedSize === size
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            onAdd({
              name: `${product.name} (${selectedSize})`,
              price,
            })
          }
          className="mt-4 w-full rounded-2xl bg-orange-500 text-white text-sm font-semibold py-2 hover:bg-orange-600 transition"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}