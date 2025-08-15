import { useAuth } from '../context/auth-context.js';
import { LogOut, User } from 'lucide-react';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
      // greeting the user - small detail, but enhances a simple app a little bit
    <header className="header">

      <div className="header-content">
        <div className="header-nav">
          <div className="header-brand">
            <h1 className="header-title">Task Master</h1>
            <span className="header-welcome">
              Welcome back, {user?.name || user?.email?.split('@')[0]}!
            </span>
          </div>

          
          <div className="header-actions">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            
            <button
              onClick={logout}
              className="btn-secondary"
            >
              <LogOut className="btn-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

    </header>
  );
}