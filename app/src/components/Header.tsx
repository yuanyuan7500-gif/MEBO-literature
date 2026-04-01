import { useState } from 'react';
import { BookOpen, Search, MessageSquare, BarChart3, Menu, X, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ViewType = 'home' | 'search' | 'detail' | 'chat' | 'analytics';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: ViewType) => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ViewType; label: string; icon: typeof BookOpen }[] = [
    { id: 'home', label: '首页', icon: BookOpen },
    { id: 'search', label: '文献库', icon: Search },
    { id: 'chat', label: 'AI对话', icon: MessageSquare },
    { id: 'analytics', label: '数据分析', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onViewChange('home')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-slate-900 leading-tight">MEBO文献库</h1>
            <p className="text-xs text-slate-500">湿润烧伤膏学术数据平台</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange(item.id)}
                className={`gap-2 ${isActive ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container mx-auto px-4 py-2 flex flex-col">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    onViewChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`justify-start gap-2 my-1 ${isActive ? 'bg-blue-600' : 'text-slate-600'}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
