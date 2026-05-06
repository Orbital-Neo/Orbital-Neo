import { useState } from "react";
import { ClientHeader } from "../components/ClientHeader";
import { ClientCard } from "../components/ClientCard";
import { ClientInfo } from "../components/ClientInfo";
import { ProductCard } from "../components/ProductCard";

export function ClientPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  function toggleCart() {
    setIsCartOpen(!isCartOpen);
  }

  function handleAdd(product: any) {
    const exists = cart.find(
      (item) => item.name === product.name
    );

    if (exists) {
      setCart(
        cart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  function handleRemove(name: string) {
    setCart(cart.filter((item) => item.name !== name));
  }

  // 🍕 PIZZAS
  const pizzas = [
    {
      id: 1,
      name: "Calabresa",
      image: "/hamb-1.png",
      sizes: { P: 35, M: 45, G: 55, F: 65 },
    },
    {
      id: 2,
      name: "Portuguesa",
      image: "/hamb-8.png",
      sizes: { P: 37, M: 47, G: 57, F: 67 },
    },
  ];

  // 🥤 BEBIDAS
  const drinks = [
    {
      id: 10,
      name: "Refrigerante",
      image: "/refri-1.png",
      sizes: { "350ml": 5, "600ml": 8, "2L": 12 },
    },
    {
      id: 11,
      name: "Suco",
      image: "/refri-2.png",
      sizes: { "300ml": 7 },
    },
  ];

  // 🔎 FILTRO
  const allProducts = [
    ...pizzas.map((p) => ({ ...p, type: "pizza" })),
    ...drinks.map((d) => ({ ...d, type: "drink" })),
  ];

  const filtered =
    filter === "all"
      ? allProducts
      : allProducts.filter((p) => p.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50">
      <ClientHeader onToggleCart={toggleCart} />
      
      <ClientInfo />

      <main className="mx-auto max-w-6xl px-4 py-8 flex flex-col items-center gap-8">

        <section className="w-full max-w-5xl rounded-3xl bg-white/90 border border-slate-200 p-6 shadow-xl backdrop-blur-sm">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Escolha o seu pedido
            </h2>
            <p className="mt-2 text-slate-500">
              Filtre e adicione ao carrinho rapidamente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-center gap-3 mb-8">
            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-3 rounded-2xl border transition font-semibold ${
                filter === "all"
                  ? "bg-orange-500 text-white border-orange-500 shadow-lg"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Todos
            </button>

            <button
              onClick={() => setFilter("pizza")}
              className={`px-5 py-3 rounded-2xl border transition font-semibold ${
                filter === "pizza"
                  ? "bg-orange-500 text-white border-orange-500 shadow-lg"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Pizzas
            </button>

            <button
              onClick={() => setFilter("drink")}
              className={`px-5 py-3 rounded-2xl border transition font-semibold ${
                filter === "drink"
                  ? "bg-orange-500 text-white border-orange-500 shadow-lg"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Bebidas
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={handleAdd}
              />
            ))}
          </div>
        </section>
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={toggleCart}
          />

          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-6">
            <ClientCard items={cart} onRemove={handleRemove} />
          </div>
        </div>
      )}
    </div>
  );
}