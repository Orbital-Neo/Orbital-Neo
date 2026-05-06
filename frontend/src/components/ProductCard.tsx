import type { MenuItem } from "../types"; 

interface ProductCardProps {
  product: MenuItem;
  onAdd: (product: MenuItem) => void;
}

const defaultImageMap: Record<string, string> = {
  calabresa: '/calabresa.png',
  portuguesa: '/portuguesa.png',
  'frango com catupiry': '/frango.png',
  'quatro queijos': '/quatroQueijos.png',
  margherita: '/margherita.png',
  pepperoni: '/pepperoni.png',
  refrigerante: '/refrigerante.png',
  suco: '/suco.png',
  agua: '/agua.png',
};

function getImageUrl(product: MenuItem) {
  if (product.imageUrl) return product.imageUrl;

  const normalized = product.name.toLowerCase().trim();
  return defaultImageMap[normalized] ?? '/bg.png';
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  // Considerar disponível se não for explicitamente false
  const isAvailable = product.available === undefined || product.available === true;
  
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);

  const sizeLabel = product.size
    ? product.category === 'pizza'
      ? `Tamanho ${product.size}`
      : product.size
    : 'Tamanho padrão';

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow relative cursor-pointer"
      onClick={() => isAvailable && onAdd(product)}
    >
      {/* Container da Imagem */}
      <div className="h-40 w-full bg-slate-200 relative">
        <img
          src={getImageUrl(product)}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Badge de Categoria - Minimalista conforme solicitado */}
        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-slate-600 z-10">
          {product.category}
        </span>
      </div>

      {/* Informações do Produto */}
      <div className="p-4 flex flex-col h-full relative z-0">
        <div className="mb-3">
          <h3 className="font-semibold text-slate-800 leading-tight">
            {product.name}
          </h3>
          <p className="text-[11px] uppercase tracking-[0.2em] text-orange-500 font-bold mt-1">
            {product.category === 'pizza' ? 'Pizza' : 'Bebida'}
          </p>
        </div>

        <div className="mb-3 text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{sizeLabel}</span>
        </div>

        <div className="flex items-center justify-between mt-auto relative z-10">
          <span className="text-lg font-bold text-green-600">
            {formattedPrice}
          </span>
          
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (isAvailable) onAdd(product);
            }}
            disabled={!isAvailable}
            className={`
              w-10 h-10 rounded-full transition-colors relative z-20
              ${isAvailable 
                ? "bg-slate-900 hover:bg-slate-800 cursor-pointer" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"}
            `}
            title={isAvailable ? "Adicionar ao carrinho" : "Indisponível"}
            aria-label={isAvailable ? "Adicionar ao carrinho" : "Produto indisponível"}
          />
        </div>
      </div>
    </div>
  );
}