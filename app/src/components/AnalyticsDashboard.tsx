import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  BookOpen, 
  Users, 
  Globe, 
  FileText,
  Network,
  Lightbulb
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { mockStatistics, mockKnowledgeGraph } from '@/data/mockLiterature';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // 语言分布数据
  const languageData = [
    { name: '中文', value: mockStatistics.languageDistribution.zh, color: '#3B82F6' },
    { name: 'English', value: mockStatistics.languageDistribution.en, color: '#10B981' },
  ];

  // 文献类型数据
  const typeData = [
    { name: '期刊论文', value: mockStatistics.typeDistribution.journalArticle },
    { name: '会议论文', value: mockStatistics.typeDistribution.conferencePaper },
    { name: '图书', value: mockStatistics.typeDistribution.book },
    { name: '学位论文', value: mockStatistics.typeDistribution.thesis },
  ];

  // 实体类型数据
  const entityTypeData = [
    { name: '药物', count: 1 },
    { name: '疾病', count: 8 },
    { name: '机制', count: 2 },
    { name: '成分', count: 5 },
    { name: '通路', count: 2 },
    { name: '治疗', count: 2 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">数据分析</h2>
        <p className="text-slate-600">基于 MEBO 文献库的统计分析与知识图谱</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{mockStatistics.totalLiterature.toLocaleString()}</p>
              <p className="text-sm text-slate-500">文献总数</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{mockStatistics.totalJournals}</p>
              <p className="text-sm text-slate-500">来源期刊</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{mockStatistics.totalAuthors.toLocaleString()}</p>
              <p className="text-sm text-slate-500">研究作者</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
              <Globe className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{mockStatistics.yearRange[0]}-{mockStatistics.yearRange[1]}</p>
              <p className="text-sm text-slate-500">时间跨度</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">
            <TrendingUp className="w-4 h-4 mr-2" />
            趋势分析
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <BookOpen className="w-4 h-4 mr-2" />
            分布统计
          </TabsTrigger>
          <TabsTrigger value="journals">
            <FileText className="w-4 h-4 mr-2" />
            期刊分析
          </TabsTrigger>
          <TabsTrigger value="knowledge">
            <Network className="w-4 h-4 mr-2" />
            知识图谱
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Yearly Trend */}
            <Card className="p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">年度发文趋势</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockStatistics.yearlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="year" 
                      stroke="#64748B"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#64748B"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      name="发文量" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Keywords Cloud */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">热门关键词</h3>
              <div className="flex flex-wrap gap-2">
                {mockStatistics.topKeywords.map((kw, idx) => (
                  <Badge 
                    key={idx}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm"
                    style={{
                      fontSize: `${Math.max(0.75, 1 - idx * 0.05)}rem`,
                      opacity: Math.max(0.5, 1 - idx * 0.08)
                    }}
                  >
                    {kw.name}
                    <span className="ml-1 text-xs text-slate-400">({kw.count})</span>
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">研究热点</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">临床研究</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[75%] h-full bg-blue-500 rounded-full" />
                    </div>
                    <span className="text-sm text-slate-500">75%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">基础研究</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[45%] h-full bg-emerald-500 rounded-full" />
                    </div>
                    <span className="text-sm text-slate-500">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">护理研究</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[30%] h-full bg-amber-500 rounded-full" />
                    </div>
                    <span className="text-sm text-slate-500">30%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">机制研究</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[25%] h-full bg-violet-500 rounded-full" />
                    </div>
                    <span className="text-sm text-slate-500">25%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Language Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">语言分布</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {languageData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-600">{item.name}: {item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Document Type Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">文献类型分布</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" stroke="#64748B" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={12} width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" name="数量" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Entity Types */}
            <Card className="p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">知识实体类型分布</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={entityTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" name="实体数量" radius={[4, 4, 0, 0]}>
                      {entityTypeData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Journals Tab */}
        <TabsContent value="journals">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">主要发文期刊</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={mockStatistics.topJournals} 
                  layout="vertical"
                  margin={{ left: 120 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#64748B" fontSize={12} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#64748B" 
                    fontSize={11} 
                    width={110}
                    tickFormatter={(value) => value.length > 12 ? value.slice(0, 12) + '...' : value}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value} 篇`, '文献数量']}
                    labelFormatter={(label) => label}
                  />
                  <Bar dataKey="count" name="文献数量" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        {/* Knowledge Graph Tab */}
        <TabsContent value="knowledge">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">知识图谱可视化</h3>
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-700">药物</Badge>
                  <Badge variant="outline" className="border-rose-300 bg-rose-50 text-rose-700">疾病</Badge>
                  <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">机制</Badge>
                  <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">成分</Badge>
                </div>
              </div>
              
              {/* Simple Network Visualization */}
              <div className="relative h-96 bg-slate-50 rounded-xl overflow-hidden">
                <svg viewBox="0 0 800 400" className="w-full h-full">
                  {/* Relations */}
                  {mockKnowledgeGraph.relations.map((rel, idx) => {
                    const source = mockKnowledgeGraph.entities.find(e => e.id === rel.source);
                    const target = mockKnowledgeGraph.entities.find(e => e.id === rel.target);
                    if (!source || !target) return null;
                    
                    const sx = 100 + (idx * 30) % 600;
                    const sy = 80 + (idx * 50) % 250;
                    const tx = 150 + (idx * 45) % 550;
                    const ty = 120 + (idx * 35) % 230;
                    
                    return (
                      <line
                        key={idx}
                        x1={sx}
                        y1={sy}
                        x2={tx}
                        y2={ty}
                        stroke="#CBD5E1"
                        strokeWidth="1"
                        strokeDasharray="4"
                      />
                    );
                  })}
                  
                  {/* Nodes */}
                  {mockKnowledgeGraph.entities.slice(0, 15).map((entity, idx) => {
                    const x = 80 + (idx * 47) % 640;
                    const y = 60 + (idx * 37) % 280;
                    const color = 
                      entity.type === 'drug' ? '#3B82F6' :
                      entity.type === 'disease' ? '#F43F5E' :
                      entity.type === 'mechanism' ? '#10B981' :
                      entity.type === 'component' ? '#F59E0B' :
                      entity.type === 'pathway' ? '#8B5CF6' :
                      '#64748B';
                    
                    return (
                      <g key={entity.id}>
                        <circle
                          cx={x}
                          cy={y}
                          r={entity.type === 'drug' ? 25 : 18}
                          fill={color}
                          opacity={0.9}
                        />
                        <text
                          x={x}
                          y={y + 5}
                          textAnchor="middle"
                          fill="white"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {entity.name.slice(0, 4)}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-sm">
                  <p className="text-xs text-slate-500 mb-1">实体数量</p>
                  <p className="text-lg font-bold text-slate-900">{mockKnowledgeGraph.entities.length}</p>
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-sm">
                  <p className="text-xs text-slate-500 mb-1">关系数量</p>
                  <p className="text-lg font-bold text-slate-900">{mockKnowledgeGraph.relations.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-slate-900">核心实体</h3>
              </div>
              <div className="space-y-3 max-h-80 overflow-auto">
                {mockKnowledgeGraph.entities.slice(0, 10).map((entity) => (
                  <div 
                    key={entity.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                  >
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: 
                            entity.type === 'drug' ? '#3B82F6' :
                            entity.type === 'disease' ? '#F43F5E' :
                            entity.type === 'mechanism' ? '#10B981' :
                            entity.type === 'component' ? '#F59E0B' :
                            entity.type === 'pathway' ? '#8B5CF6' :
                            '#64748B'
                        }}
                      />
                      <span className="text-sm font-medium text-slate-900">{entity.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {entity.type === 'drug' ? '药物' :
                       entity.type === 'disease' ? '疾病' :
                       entity.type === 'mechanism' ? '机制' :
                       entity.type === 'component' ? '成分' :
                       entity.type === 'pathway' ? '通路' :
                       entity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
