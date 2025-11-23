import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Button } from './components/Button';
import { AuthView, User } from './types';
import { LogOut, Database, ShieldCheck } from 'lucide-react';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>(AuthView.LOGIN);
  const [user, setUser] = useState<User | null>(null);

  const handleAuthSuccess = (data: { user: User; token: string }) => {
    setUser(data.user);
    setCurrentView(AuthView.DASHBOARD);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setCurrentView(AuthView.LOGIN);
  };

  if (currentView === AuthView.DASHBOARD && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-black font-bold text-xl">
              <ShieldCheck className="w-6 h-6" />
              <span>SecureApp</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hello, {user.name}</span>
              <Button variant="outline" onClick={handleLogout} className="!py-1.5 !text-xs">
                <LogOut className="w-3 h-3 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-grow p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-gray-500">Welcome to your Vercel-ready application.</p>
              </div>
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900">Vercel Postgres Integration</h3>
                    <p className="mt-2 text-sm text-blue-700 leading-relaxed">
                      This app currently uses a simulation layer for demonstration. 
                      To connect to real Vercel Postgres, update <code>services/authService.ts</code> to point to your API endpoints.
                    </p>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Name</span>
                        <span className="font-medium">{user.name}</span>
                      </div>
                      <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Email</span>
                        <span className="font-medium">{user.email}</span>
                      </div>
                      <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
                        <span className="text-gray-500">ID</span>
                        <span className="font-mono text-xs bg-gray-200 px-2 py-0.5 rounded">{user.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f3f4f6] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-40 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-[1000px] grid md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10 min-h-[600px]">
        
        {/* Left Side: Authentication Forms */}
        <div className="p-8 md:p-12 flex items-center justify-center order-2 md:order-1 bg-white">
          {currentView === AuthView.LOGIN ? (
            <LoginForm 
              onSuccess={handleAuthSuccess} 
              onSwitchToRegister={() => setCurrentView(AuthView.REGISTER)} 
            />
          ) : (
            <RegisterForm 
              onSuccess={handleAuthSuccess} 
              onSwitchToLogin={() => setCurrentView(AuthView.LOGIN)} 
            />
          )}
        </div>

        {/* Right Side: Hero/Branding */}
        <div className="hidden md:flex flex-col justify-center p-12 order-1 md:order-2 bg-black text-white relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
               <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold leading-tight">
              Secure authentication <br />
              <span className="text-blue-400">simplified for Vercel.</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-sm">
              A robust, production-ready foundation for your next React project backed by Postgres.
            </p>
            
            <div className="flex items-center gap-4 pt-8">
               <div className="flex -space-x-3">
                  <img className="w-10 h-10 rounded-full border-2 border-black" src="https://picsum.photos/100/100?random=1" alt="User" />
                  <img className="w-10 h-10 rounded-full border-2 border-black" src="https://picsum.photos/100/100?random=2" alt="User" />
                  <img className="w-10 h-10 rounded-full border-2 border-black" src="https://picsum.photos/100/100?random=3" alt="User" />
               </div>
               <div className="text-sm">
                 <p className="font-bold">1k+ Developers</p>
                 <p className="text-gray-400">Trust this stack</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;