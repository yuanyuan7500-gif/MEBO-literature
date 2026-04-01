import { useState } from 'react';
import { Search, BookOpen, TrendingUp, Database, ExternalLink, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onViewChange: (view: 'home' | 'search' | 'detail' | 'chat' | 'analytics') => void;
  statistics: {
    totalLiterature: number;
    totalJournals: number;
    totalAuthors: number;
  };
}

export function HeroSection({ onSearch, onViewChange, statistics }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      onViewChange('search');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const quickAccess = [
    { 
      icon: TrendingUp, 
      label: '最新文献', 
      desc: '2024年发表的研究',
      color: 'from-emerald-500 to-emerald-600',
      onClick: () => { onSearch('year:2024'); onViewChange('search'); }
    },
    { 
      icon: Sparkles, 
      label: 'AI对话', 
      desc: '智能文献问答',
      color: 'from-violet-500 to-violet-600',
      onClick: () => onViewChange('chat')
    },
    { 
      icon: FileText, 
      label: '系统评价', 
      desc: 'Meta分析与综述',
      color: 'from-amber-500 to-amber-600',
      onClick: () => { onSearch('系统评价 OR Meta分析'); onViewChange('search'); }
    },
    { 
      icon: Database, 
      label: '知识图谱', 
      desc: '实体关系可视化',
      color: 'from-rose-500 to-rose-600',
      onClick: () => onViewChange('analytics')
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-white">
      {/* Main Hero */}
      <div className="container mx-auto px-4 pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            基于 8,641 篇文献的学术数据平台
          </Badge>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            湿润烧伤膏
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
              文献数据服务平台
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            汇聚全球湿润烧伤膏研究文献，提供智能检索、AI深度加工、
            知识图谱分析等一站式学术服务
          </p>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="搜索标题、作者、DOI、关键词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 h-14 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl shadow-sm"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-lg rounded-xl"
              >
                搜索
              </Button>
            </div>
            <p className="text-sm text-slate-500 mt-3">
              支持 DOI、PubMed ID、标题、作者、关键词等多种检索方式
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 md:gap-16 mb-12">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900">{formatNumber(statistics.totalLiterature)}</div>
              <div className="text-sm text-slate-500 mt-1">文献总数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900">{statistics.totalJournals}</div>
              <div className="text-sm text-slate-500 mt-1">来源期刊</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900">{formatNumber(statistics.totalAuthors)}</div>
              <div className="text-sm text-slate-500 mt-1">研究作者</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {quickAccess.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 text-left transition-all duration-300 hover:shadow-lg hover:border-blue-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{item.label}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
                <ExternalLink className="absolute top-4 right-4 w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Zotero Link */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <a 
            href="https://www.zotero.org/groups/5815499/mebo_bibliography/library"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            数据来源：Zotero MEBO_bibliography 文献库
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
