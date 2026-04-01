import { useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { LiteratureSearch } from '@/components/LiteratureSearch';
import { LiteratureDetail } from '@/components/LiteratureDetail';
import { AIChat } from '@/components/AIChat';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { Footer } from '@/components/Footer';
import type { Literature } from '@/types/literature';
import { mockStatistics } from '@/data/mockLiterature';

type ViewType = 'home' | 'search' | 'detail' | 'chat' | 'analytics';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedLiterature, setSelectedLiterature] = useState<Literature | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentView('search');
  };

  const handleSelectLiterature = (literature: Literature) => {
    setSelectedLiterature(literature);
    setCurrentView('detail');
  };

  const handleBackToSearch = () => {
    setSelectedLiterature(null);
    setCurrentView('search');
  };

  const handleAskAI = (literature: Literature) => {
    setSelectedLiterature(literature);
    setCurrentView('chat');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <HeroSection 
            onSearch={handleSearch}
            onViewChange={setCurrentView}
            statistics={mockStatistics}
          />
        );
      
      case 'search':
        return (
          <LiteratureSearch 
            initialQuery={searchQuery}
            onSelectLiterature={handleSelectLiterature}
          />
        );
      
      case 'detail':
        return selectedLiterature ? (
          <LiteratureDetail 
            literature={selectedLiterature}
            onBack={handleBackToSearch}
            onAskAI={handleAskAI}
          />
        ) : (
          <LiteratureSearch 
            onSelectLiterature={handleSelectLiterature}
          />
        );
      
      case 'chat':
        return (
          <AIChat initialLiterature={selectedLiterature} />
        );
      
      case 'analytics':
        return (
          <AnalyticsDashboard />
        );
      
      default:
        return (
          <HeroSection 
            onSearch={handleSearch}
            onViewChange={setCurrentView}
            statistics={mockStatistics}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView}
      />
      
      <main className="flex-1">
        {renderContent()}
      </main>

      <Footer />
    </div>
  );
}

export default App;
