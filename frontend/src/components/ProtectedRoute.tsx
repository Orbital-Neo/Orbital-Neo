import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { UserRole } from '../types'; // 1. Importamos o tipo oficial

interface ProtectedRouteProps {
  // 2. Usamos o tipo centralizado em vez de reescrever a string
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { token, user } = useAuthStore();

  // 3. Segurança extra: se não tiver token OU não tiver dados do usuário, barra!
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 4. Sem uso de "as". O TS já garante que user.role é UserRole.
  const hasAccess = allowedRoles.includes(user.role);

  if (!hasAccess) {
    // 5. Redirecionamento Inteligente:
    // Se ele tá logado mas tentou entrar na rota errada, manda pro lugar certo dele.
    const fallbackRoute = user.role === 'operador' ? '/dashboard' : '/menu';
    return <Navigate to={fallbackRoute} replace />;
  }

  // Se tem token, tem usuário e tem o cargo certo, libera o acesso!
  return <Outlet />;
}