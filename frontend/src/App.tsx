import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { usePedidos } from './hooks/usePedidos';
import { useMetrics } from './hooks/useMetrics'; 
import { useAuthStore } from './store/useAuthStore';

// 1. Página de Login
const LoginPage = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSimulatedLogin = (role: 'cliente' | 'operador') => {
    const mockUser = {
      // Nome profissional para a apresentação da squad Orbital-Neo
      nome: role === 'operador' ? 'Operador de Caixa' : 'Cliente Visitante',
      role: role
    };
    const mockToken = 'token-fake-orbital-neo';
    
    setAuth(mockToken, mockUser);

    if (role === 'operador') {
      navigate('/dashboard');
    } else {
      navigate('/menu');
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Pizzaria Orbital-Neo</h1>
      <p>Escolha um perfil para validar as rotas e o dashboard</p>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
        <button 
          onClick={() => handleSimulatedLogin('operador')}
          style={{ padding: '12px 24px', cursor: 'pointer', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '8px' }}
        >
          Entrar como Operador (Dashboard)
        </button>
        <button 
          onClick={() => handleSimulatedLogin('cliente')}
          style={{ padding: '12px 24px', cursor: 'pointer', background: '#e67e22', color: 'white', border: 'none', borderRadius: '8px' }}
        >
          Entrar como Cliente (Cardápio)
        </button>
      </div>
    </div>
  );
};

// 2. Página do Menu (Cliente) -
const MenuPage = () => (
  <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
    <h1>Cardápio Digital</h1>
    <p>Bem-vindo! Área do Cliente em desenvolvimento </p>
  </div>
);

// 3. Painel Administrativo (Operador)
function DashboardPage() {
  const { pedidos, isLoading: loadingPedidos, isError: errorPedidos } = usePedidos();
  const { data: metrics, isLoading: loadingMetrics } = useMetrics(); 
  const logout = useAuthStore((state) => state.logout);

  if (loadingPedidos || loadingMetrics) return <p style={{ padding: '20px' }}>Carregando dados da pizzaria...</p>;
  if (errorPedidos) return <p style={{ padding: '20px' }}>Erro ao carregar o dashboard.</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Painel de Pedidos (Kanban)</h1>
        <button 
          onClick={logout} 
          style={{ color: '#d63031', cursor: 'pointer', border: '1px solid #d63031', background: 'none', padding: '5px 15px', borderRadius: '5px' }}
        >
          Sair
        </button>
      </div>

      {/* Métricas Integradas  */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <div style={{ padding: '15px', background: '#f1f2f6', borderRadius: '10px', flex: 1, borderBottom: '4px solid #2c3e50' }}>
          <small style={{ color: '#747d8c', fontWeight: 'bold' }}>TOTAL VENDIDO HOJE</small>
          <h2 style={{ margin: '5px 0 0 0' }}>
            {metrics?.totalVendido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h2>
        </div>

        <div style={{ padding: '15px', background: '#e3fcef', borderRadius: '10px', flex: 1, borderBottom: '4px solid #2ecc71' }}>
          <small style={{ color: '#747d8c', fontWeight: 'bold' }}>MÉDIA DE PREPARO</small>
          <h2 style={{ margin: '5px 0 0 0' }}>{metrics?.tempoMedioMinutos} min</h2>
        </div>

        <div style={{ padding: '15px', background: '#fff9db', borderRadius: '10px', flex: 1, borderBottom: '4px solid #f1c40f' }}>
          <small style={{ color: '#747d8c', fontWeight: 'bold' }}>SABOR MAIS PEDIDO</small>
          <h2 style={{ margin: '5px 0 0 0', fontSize: '1.1rem' }}>
            {metrics?.rankingSabores[0]?.sabor || 'Nenhum pedido'}
          </h2>
        </div>
      </div>

      {/* Lista de Pedidos Detalhada */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {pedidos?.map(pedido => (
          <li key={pedido.id} style={{ border: '1px solid #eee', margin: '12px 0', padding: '18px', borderRadius: '10px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f2f6', paddingBottom: '10px', marginBottom: '10px' }}>
              <strong>Pedido #{pedido.id.slice(0, 5)}</strong>
              <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', background: '#dfe6e9', color: '#2d3436' }}>
                {pedido.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div style={{ marginBottom: '10px' }}>
               Cliente: <b>{pedido.customerName}</b>
            </div>

            {/* Exibição dos Itens vindos do Mock JSON */}
            <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
              <small style={{ color: '#636e72', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>ITENS DO PEDIDO:</small>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px' }}>
                {(pedido as any).itens?.map((item: string, index: number) => (
                  <li key={index} style={{ color: '#2d3436', marginBottom: '2px' }}>{item}</li>
                )) || <li>Detalhes indisponíveis</li>}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '12px' }}>
              <span style={{ color: '#b2bec3' }}>Modalidade: {pedido.type === 'delivery' ? 'Entrega' : 'Retirada'}</span>
              <strong style={{ fontSize: '14px', color: '#2ecc71' }}>
                {pedido.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </strong>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 4. Configuração de Rotas Protegidas
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRole="operador">
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/menu" 
        element={
          <ProtectedRoute allowedRole="cliente">
            <MenuPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;