import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, ChevronDown, Calendar, BookOpen, Globe, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { Literature, SearchFilters } from '@/types/literature';
import { literatureLoader } from '@/utils/literatureLoader';

interface LiteratureSearchProps {
  initialQuery?: string;
  onSelectLiterature: (literature: Literature) => void;
}

export function LiteratureSearch({ initialQuery = '', onSelectLiterature }: LiteratureSearchProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    language: 'all',
    itemType: undefined,
    isOA: undefined,
  });
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // 默认每页20条
  const [pageData, setPageData] = useState<Literature[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [allData, setAllData] = useState<Literature[]>([]);

  // 初始化加载
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await literatureLoader.init();
        setTotalPages(literatureLoader.manifest?.pages || 0);
        
        // 加载第一页
        const firstPage = await literatureLoader.getFirstPage();
        setPageData(firstPage);
        setLoading(false);
        
        // 后台加载所有数据用于搜索
        loadAllDataForSearch();
      } catch (error) {
        console.error('初始化失败:', error);
        setLoading(false);
      }
    };
    init();
  }, []);

  // 后台加载所有数据（用于搜索）
  const loadAllDataForSearch = async () => {
    try {
      const all = await literatureLoader.getAllData();
      console.log(`Loaded ${all.length} items for search`);
      setAllData(all);
    } catch (error) {
      console.error('Error loading all data:', error);
      // 备用方案
      const all: Literature[] = [];
      const total = literatureLoader.manifest?.pages || 0;
      
      for (let i = 1; i <= total; i++) {
        try {
          const page = await literatureLoader.getPage(i);
          all.push(...page);
        } catch (err) {
          console.warn(`Failed to load page ${i}:`, err);
        }
      }
      setAllData(all);
    }
  };

  // 搜索过滤（在所有数据中搜索）
  const filteredLiterature = useMemo(() => {
    let results = [...allData];

    // 搜索词过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const yearMatch = query.match(/year:(\d{4})/);
      
      if (yearMatch) {
        const year = parseInt(yearMatch[1]);
        results = results.filter(item => item.year === year);
      } else {
        results = results.filter(item => 
          item.title.toLowerCase().includes(query) ||
          item.titleEn?.toLowerCase().includes(query) ||
          item.authors.some(a => a.toLowerCase().includes(query)) ||
          item.keywords.some(k => k.toLowerCase().includes(query)) ||
          item.doi?.toLowerCase().includes(query) ||
          item.pmid?.includes(query)
        );
      }
    }

    // 语言过滤
    if (filters.language && filters.language !== 'all') {
      results = results.filter(item => item.language === filters.language);
    }

    // 文献类型过滤
    if (filters.itemType) {
      results = results.filter(item => item.itemType === filters.itemType);
    }

    // 开放获取过滤
    if (filters.isOA !== undefined) {
      results = results.filter(item => item.isOA === filters.isOA);
    }

    // 年份范围过滤 - 修复 TypeScript 错误
    if (filters.yearStart !== undefined && filters.yearStart !== null) {
      results = results.filter(item => item.year >= filters.yearStart!);
    }
    if (filters.yearEnd !== undefined && filters.yearEnd !== null) {
      results = results.filter(item => item.year <= filters.yearEnd!);
    }
    // 按年份降序排序（新的在前）
    results.sort((a, b) => (b.year || 0) - (a.year || 0));

    return results;
  }, [searchQuery, filters, allData]);

  // 判断是否在搜索模式
  const isSearchMode = searchQuery.trim() || Object.values(filters).some(v => v !== undefined && v !== 'all');
  
  // 显示的数据源
  const displayData = isSearchMode ? filteredLiterature : pageData;

  // 分页计算
  const totalDisplayPages = Math.ceil(displayData.length / pageSize);
  
  // 当前页显示的数据
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return displayData.slice(start, end);
  }, [displayData, currentPage, pageSize]);

  // 处理页码变化
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalDisplayPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 处理每页条数变化
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // 重置到第一页
  };

  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalDisplayPages <= maxVisible + 2) {
      for (let i = 1; i <= totalDisplayPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalDisplayPages);
      } else if (currentPage >= totalDisplayPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalDisplayPages - 3; i <= totalDisplayPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalDisplayPages);
      }
    }
    return pages;
  };

  const clearFilters = () => {
    setFilters({
      language: 'all',
      itemType: undefined,
      isOA: undefined,
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== 'all').length;

  if (loading && currentPage === 1) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>加载文献数据中...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">文献检索</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="搜索标题、作者、DOI、关键词... (输入 year:2020 筛选年份)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 h-12"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-12 px-4 relative"
          >
            <Filter className="w-4 h-4 mr-2" />
            筛选
            {activeFilterCount > 0 && (
              <Badge variant="default" className="ml-2 bg-blue-600">
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-900">筛选条件</h3>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                清除筛选
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Language Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block">语言</Label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="lang-all"
                    checked={filters.language === 'all'}
                    onCheckedChange={() => setFilters({ ...filters, language: 'all' })}
                  />
                  <Label htmlFor="lang-all" className="ml-2 text-sm">全部</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="lang-zh"
                    checked={filters.language === 'zh'}
                    onCheckedChange={() => setFilters({ ...filters, language: 'zh' })}
                  />
                  <Label htmlFor="lang-zh" className="ml-2 text-sm">中文</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="lang-en"
                    checked={filters.language === 'en'}
                    onCheckedChange={() => setFilters({ ...filters, language: 'en' })}
                  />
                  <Label htmlFor="lang-en" className="ml-2 text-sm">英文</Label>
                </div>
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block">文献类型</Label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="type-all"
                    checked={!filters.itemType}
                    onCheckedChange={() => setFilters({ ...filters, itemType: undefined })}
                  />
                  <Label htmlFor="type-all" className="ml-2 text-sm">全部</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="type-journal"
                    checked={filters.itemType === 'journalArticle'}
                    onCheckedChange={() => setFilters({ ...filters, itemType: 'journalArticle' })}
                  />
                  <Label htmlFor="type-journal" className="ml-2 text-sm">期刊论文</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="type-conference"
                    checked={filters.itemType === 'conferencePaper'}
                    onCheckedChange={() => setFilters({ ...filters, itemType: 'conferencePaper' })}
                  />
                  <Label htmlFor="type-conference" className="ml-2 text-sm">会议论文</Label>
                </div>
              </div>
            </div>

            {/* OA Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block">获取方式</Label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="oa-all"
                    checked={filters.isOA === undefined}
                    onCheckedChange={() => setFilters({ ...filters, isOA: undefined })}
                  />
                  <Label htmlFor="oa-all" className="ml-2 text-sm">全部</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="oa-true"
                    checked={filters.isOA === true}
                    onCheckedChange={() => setFilters({ ...filters, isOA: true })}
                  />
                  <Label htmlFor="oa-true" className="ml-2 text-sm">开放获取</Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="oa-false"
                    checked={filters.isOA === false}
                    onCheckedChange={() => setFilters({ ...filters, isOA: false })}
                  />
                  <Label htmlFor="oa-false" className="ml-2 text-sm">需订阅</Label>
                </div>
              </div>
            </div>

            {/* Year Range */}
            <div>
              <Label className="text-sm font-medium mb-3 block">发表年份</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="起始年"
                  value={filters.yearStart || ''}
                  onChange={(e) => setFilters({ ...filters, yearStart: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-24"
                />
                <span className="text-slate-400">-</span>
                <Input
                  type="number"
                  placeholder="结束年"
                  value={filters.yearEnd || ''}
                  onChange={(e) => setFilters({ ...filters, yearEnd: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-24"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-600">
          {isSearchMode ? (
            <>搜索到 <span className="font-semibold text-slate-900">{filteredLiterature.length}</span> 篇文献</>
          ) : (
            <>显示第 <span className="font-semibold text-slate-900">{currentPage}</span> / {totalPages} 页，共 {literatureLoader.manifest?.total || 0} 篇</>
          )}
        </p>
        {searchQuery && (
          <Button variant="ghost" size="sm" onClick={() => {setSearchQuery(''); setCurrentPage(1);}}>
            <X className="w-4 h-4 mr-1" />
            清除搜索
          </Button>
        )}
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {paginatedData.map((item) => (
          <Card 
            key={item.id} 
            className="p-6 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500"
            onClick={() => onSelectLiterature(item)}
          >
            <div className="flex flex-col gap-3">
              {/* Title */}
              <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              {item.titleEn && item.language === 'zh' && (
                <p className="text-sm text-slate-500 line-clamp-1">{item.titleEn}</p>
              )}

              {/* Authors & Year */}
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-slate-700">
                  {item.authors.slice(0, 5).join(', ')}
                  {item.authors.length > 5 && ` 等 ${item.authors.length} 位作者`}
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.year}
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-slate-500 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {item.publication}
                </span>
              </div>

              {/* Abstract Preview */}
              <p className="text-sm text-slate-600 line-clamp-2">
                {item.abstract?.slice(0, 200)}...
              </p>

              {/* Tags & Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {item.language === 'zh' ? (
                    <><Globe className="w-3 h-3 mr-1" /> 中文</>
                  ) : (
                    <><Globe className="w-3 h-3 mr-1" /> English</>
                  )}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  {item.itemType === 'journalArticle' ? '期刊论文' : 
                   item.itemType === 'conferencePaper' ? '会议论文' : 
                   item.itemType === 'book' ? '图书' : '学位论文'}
                </Badge>
                {item.isOA && (
                  <Badge className="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    开放获取
                  </Badge>
                )}
                {item.citations && (
                  <Badge variant="secondary" className="text-xs">
                    被引 {item.citations} 次
                  </Badge>
                )}
                {item.aiSummary && (
                  <Badge className="text-xs bg-violet-100 text-violet-700 hover:bg-violet-100">
                    AI摘要
                  </Badge>
                )}
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1.5">
                {item.keywords.slice(0, 6).map((kw, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {(displayData.length > 0) && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-slate-200">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>每页显示：</span>
            <select 
              value={pageSize}
              onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
              className="border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={20}>20 条</option>
              <option value={50}>50 条</option>
              <option value={100}>100 条</option>
            </select>
            <span className="text-slate-400">|</span>
            <span>共 {displayData.length} 篇</span>
          </div>

          {/* Page Navigation */}
          {totalDisplayPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                上一页
              </Button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNum, idx) => (
                  pageNum === '...' ? (
                    <span key={idx} className="px-2 text-slate-400">...</span>
                  ) : (
                    <Button
                      key={idx}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className="min-w-[40px]"
                      onClick={() => handlePageChange(pageNum as number)}
                    >
                      {pageNum}
                    </Button>
                  )
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalDisplayPages}
              >
                下一页
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Page Info */}
          <div className="text-sm text-slate-500">
            第 {currentPage} / {totalDisplayPages} 页
          </div>
        </div>
      )}

      {paginatedData.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">未找到相关文献</h3>
          <p className="text-sm text-slate-500">
            {isSearchMode ? '请尝试调整搜索词或筛选条件' : '加载中，请稍候...'}
          </p>
        </div>
      )}
    </div>
  );
}
