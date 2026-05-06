import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // Adicionado para navegação limpa
import { ClientHeader } from "../components/ClientHeader";
import { ClientCard } from "../components/ClientCard";
import { ClientInfo } from "../components/ClientInfo";
import { ProductCard } from "../components/ProductCard";
import type { MenuItem, CreateOrderDTO } from "../types"; // Importação correta
import { menuService, pedidosService } from "../services/api"; // Importação correta

// Mantemos o CartItem local se for exclusivo desta lógica de UI
type CartItem = MenuItem & {
  quantity: number;
};

export function ClientPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [orderType, setOrderType] = useState<"delivery" | "retirada">("delivery");
  const [notes, setNotes] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const user = useMemo(() => {
    const authData = localStorage.getItem("@OrbitalNeo:user");
    return authData ? JSON.parse(authData) : null;
  }, []);

  const [phone, setPhone] = useState(() => user?.phone ?? "");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const data = await menuService.getMenu();
        setProducts(data);
      } catch (err) {
        setErrorMessage("Erro ao carregar o cardápio.");
      }
    }
    fetchMenu();
  }, []);

  function toggleCart() {
    setIsCartOpen(!isCartOpen);
  }

  function handleAdd(product: MenuItem) {
    setCart((currentCart) => {
      const exists = currentCart.find((item) => item.id === product.id);
      if (exists) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }

  function handleRemove(id: string) {
    setCart(cart.filter((item) => item.id !== id));
  }

  const filteredProducts = filter === "all" 
    ? products 
    : products.filter((p) => p.category === filter);

  async function handleCheckout() {
    if (!user) return navigate("/login");
    if (cart.length === 0) return alert("Adicione itens ao carrinho.");
    if (!phone.trim()) return alert("Informe um telefone.");

    setIsSending(true);

    // Montagem do Payload seguindo o CreateOrderDTO
    const payload: CreateOrderDTO = {
      customerName: user.name,
      customerPhone: phone,
      type: orderType,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
      })),
    };

    try {
      // Alterado para usar o serviço correto. Token é injetado pelo interceptor
      await pedidosService.create(payload); 
      setCart([]);
      setIsCartOpen(false);
      setNotes("");
      alert("Pedido enviado com sucesso!");
    } catch (error) {
      // Fallback local caso o servidor esteja offline
      const fallbackOrder = {
        id: String(Date.now()),
        customerName: user.name,
        customerPhone: phone,
        type: orderType,
        status: "recebido",
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        createdAt: new Date().toISOString(),
        items: payload.items,
      };

      const localOrders = JSON.parse(localStorage.getItem("localOrders") || "[]");
      localStorage.setItem("localOrders", JSON.stringify([...localOrders, fallbackOrder]));
      
      setCart([]);
      setIsCartOpen(false);
      alert("Pedido criado localmente. O administrador verá o pedido no painel.");
    } finally {
      setIsSending(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("@OrbitalNeo:token");
    localStorage.removeItem("@OrbitalNeo:user");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50">
      <ClientHeader onToggleCart={toggleCart} onLogout={handleLogout} />
      <ClientInfo />

      <main className="mx-auto max-w-6xl px-4 py-8 flex flex-col items-center gap-8">
        <section className="w-full max-w-5xl rounded-3xl bg-white/90 border border-slate-200 p-6 shadow-xl backdrop-blur-sm">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Escolha o seu pedido</h2>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row sm:justify-center gap-3 mb-8">
            {["all", "pizza", "bebida"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-3 rounded-2xl border transition font-semibold capitalize ${
                  filter === cat
                    ? "bg-orange-500 text-white border-orange-500 shadow-lg"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat === "all" ? "Todos" : cat + "s"}
              </button>
            ))}
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 mb-6 text-center">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={handleAdd} />
            ))}
          </div>
        </section>
      </main>

      {/* Carrinho Lateral */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleCart} />
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto">
            <ClientCard
              items={cart}
              onRemove={handleRemove}
              phone={phone}
              onPhoneChange={setPhone}
              orderType={orderType}
              onOrderTypeChange={setOrderType}
              notes={notes}
              onNotesChange={setNotes}
              onCheckout={handleCheckout}
              isSending={isSending}
            />
          </div>
        </div>
      )}
    </div>
  );
}