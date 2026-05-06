import { NavLink } from 'react-router-dom';

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-blue-900 text-white p-6 shadow-lg">
      <h1 className="text-2xl font-bold mb-8 text-white">Orbital Neo</h1>

      <nav className="flex flex-col gap-2">
        <NavLink
          to="/pedidos"
          className={({ isActive }) =>
            `text-left p-3 rounded font-semibold transition ${isActive ? 'bg-red-500 text-white' : 'bg-blue-800 text-blue-100 hover:bg-blue-700'}`
          }
        >
          Pedidos
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `text-left p-3 rounded font-semibold transition ${isActive ? 'bg-red-500 text-white' : 'bg-blue-800 text-blue-100 hover:bg-blue-700'}`
          }
        >
          Dashboard
        </NavLink>
      </nav>
    </aside>
  );
}