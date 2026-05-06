import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import type { JSX } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRole?: 'cliente' | 'operador';
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { token, user } = useAuthStore();

  // 1. Se o usuário não tiver um token (não logou), manda para o Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Se a rota pedir um cargo (ex: operador) e o usuário não for, redireciona
  if (allowedRole && user?.role !== allowedRole) {
    const fallback = user?.role === 'operador' ? '/dashboard' : '/menu';
    return <Navigate to={fallback} replace />;
  }

  // 3. Se passou pelas verificações acima, libera o acesso ao componente filho
  return children;
}