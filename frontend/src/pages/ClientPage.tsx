import { useEffect, useState } from "react";
import { ClientHeader } from "../components/ClientHeader";
import { ClientCard } from "../components/ClientCard";
import { ClientInfo } from "../components/ClientInfo";
import { ProductCard } from "../components/ProductCard";
import type { MenuItem } from "../services/api";
import { createOrder, getMenu, type AuthUser } from "../services/api";

type CartItem = {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
};

export function ClientPage() {
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [orderType, setOrderType] = useState<"delivery" | "retirada">("delivery");
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const authData = localStorage.getItem("auth");
  const auth = authData ? (JSON.parse(authData) as { token: string; user: AuthUser }) : null;

  useEffect(() => {
    if (!auth) {
      window.location.href = "/";
      return;
    }

    setPhone(auth.user.phone ?? "");
  }, []);

  useEffect(() => {
    async function loadMenu() {
      try {
        const items = await getMenu();
        setProducts(items.filter((item) => item.available));
      } catch (error) {
        setErrorMessage(
          "Não foi possível carregar o cardápio. Verifique a conexão e tente novamente."
        );
      }
    }

    loadMenu();
  }, []);

  function toggleCart() {
    setIsCartOpen(!isCartOpen);
  }

  function handleAdd(product: MenuItem) {
    const exists = cart.find((item) => item.id === product.id);

    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  }

  function handleRemove(id: string) {
    setCart(cart.filter((item) => item.id !== id));
  }

  function getFilteredProducts() {
    if (filter === "all") return products;

    if (filter === "pizza") {
      return products.filter((product) => product.category === "pizza");
    }

    return products.filter((product) => product.category === "bebida");
  }

  async function handleCheckout() {
    if (!auth) {
      window.location.href = "/";
      return;
    }

    if (cart.length === 0) {
      alert("Adicione itens ao carrinho antes de finalizar o pedido.");
      return;
    }

    if (!phone.trim()) {
      alert("Informe um telefone para contato.");
      return;
    }

    setIsSending(true);

    const payload = {
      customerName: auth.user.name,
      customerPhone: phone,
      type: orderType,
      notes: notes.trim() || undefined,
      items: cart.map((item) => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    };

    try {
      await createOrder(payload, auth.token);
      setCart([]);
      setIsCartOpen(false);
      alert("Pedido enviado com sucesso!");
    } catch (error) {
      const fallbackOrder = {
        id: crypto.randomUUID?.() ?? String(Date.now()),
        number: Date.now(),
        customerName: auth.user.name,
        customerPhone: phone,
        type: orderType,
        status: "recebido",
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        estimatedAt: new Date(Date.now() + 40 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: notes.trim(),
        items: payload.items,
      };

      const localOrders = JSON.parse(localStorage.getItem("localOrders") || "[]");
      localStorage.setItem("localOrders", JSON.stringify([...localOrders, fallbackOrder]));
      setCart([]);
      setIsCartOpen(false);
      alert(
        "Pedido criado localmente. O administrador verá o pedido no painel local."
      );
    } finally {
      setIsSending(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("auth");
    window.location.href = "/";
  }

  const filteredProducts = getFilteredProducts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50">
      <ClientHeader onToggleCart={toggleCart} onLogout={handleLogout} />

      <ClientInfo />

      <main className="mx-auto max-w-6xl px-4 py-8 flex flex-col items-center gap-8">
        <section className="w-full max-w-5xl rounded-3xl bg-white/90 border border-slate-200 p-6 shadow-xl backdrop-blur-sm">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Escolha o seu pedido</h2>
            <p className="mt-2 text-slate-500">Filtre os itens e adicione ao carrinho.</p>
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
              onClick={() => setFilter("bebida")}
              className={`px-5 py-3 rounded-2xl border transition font-semibold ${
                filter === "bebida"
                  ? "bg-orange-500 text-white border-orange-500 shadow-lg"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Bebidas
            </button>
          </div>

          {errorMessage ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700 mb-6">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAdd} />
            ))}
          </div>
        </section>
      </main>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleCart} />

          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto">
            <ClientCard
              items={cart}
              onRemove={handleRemove}
              phone={phone}
              onPhoneChange={(value: string) => setPhone(value)}
              orderType={orderType}
              onOrderTypeChange={(value: "delivery" | "retirada") => setOrderType(value)}
              notes={notes}
              onNotesChange={(value: string) => setNotes(value)}
              onCheckout={handleCheckout}
              isSending={isSending}
            />
          </div>
        </div>
      )}
    </div>
  );
}
