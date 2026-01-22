import { Link, useLocation } from 'react-router';
import { Users, GraduationCap, Home } from 'lucide-react';

function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Trường Mầm Non Hiền Giang</h1>
                <p className="text-sm text-gray-600">Hệ thống quản lý giáo viên và học sinh</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-4 border-b-2 transition-colors ${
                isActive('/')
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Trang chủ</span>
            </Link>
            <Link
              to="/teachers"
              className={`flex items-center space-x-2 px-3 py-4 border-b-2 transition-colors ${
                isActive('/teachers')
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Quản lý giáo viên</span>
            </Link>
            <Link
              to="/students"
              className={`flex items-center space-x-2 px-3 py-4 border-b-2 transition-colors ${
                isActive('/students')
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              <span className="font-medium">Quản lý học sinh</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600">
            © 2026 Trường Mầm Non Hiền Giang. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
