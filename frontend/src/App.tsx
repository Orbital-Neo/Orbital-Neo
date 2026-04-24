import { usePedidos } from './hooks/usePedidos';

function App() {
  const { pedidos, isLoading, isError } = usePedidos();

  if (isLoading) return <p>Carregando pedidos da pizzaria...</p>;
  if (isError) return <p>Ops! Erro ao carregar.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Painel de Pedidos (Teste)</h1>
      <ul>
        {pedidos.map(pedido => (
          <li key={pedido.id}>
            <strong>{pedido.cliente}</strong> - {pedido.status.toUpperCase()} 
            <br />
            Itens: {pedido.itens.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;