import { useState } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  BookOpen, 
  Calendar, 
  Users, 
  Tag, 
  FileText, 
  Globe, 
  Lock, 
  Unlock,
  Sparkles,
  Share2,
  Bookmark,
  MessageSquare,
  Network
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Literature } from '@/types/literature';

interface LiteratureDetailProps {
  literature: Literature;
  onBack: () => void;
  onAskAI: (literature: Literature) => void;
}

export function LiteratureDetail({ literature, onBack, onAskAI }: LiteratureDetailProps) {
  const [showFullAbstract, setShowFullAbstract] = useState(false);

  // 构建外部链接
  const doiUrl = literature.doi ? `https://doi.org/${literature.doi}` : null;
  const pubmedUrl = literature.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${literature.pmid}/` : null;
  const pmcUrl = literature.pmcid ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${literature.pmcid}/` : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="mb-6 -ml-2">
        <ArrowLeft className="w-4 h-4 mr-2" />
        返回列表
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title Card */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">
                {literature.language === 'zh' ? '中文' : 'English'}
              </Badge>
              <Badge variant="outline">
                {literature.itemType === 'journalArticle' ? '期刊论文' : 
                 literature.itemType === 'conferencePaper' ? '会议论文' : 
                 literature.itemType === 'book' ? '图书' : '学位论文'}
              </Badge>
              {literature.isOA ? (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  <Unlock className="w-3 h-3 mr-1" />
                  开放获取
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Lock className="w-3 h-3 mr-1" />
                  需订阅
                </Badge>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
              {literature.title}
            </h1>

            {literature.titleEn && literature.language === 'zh' && (
              <p className="text-lg text-slate-600 mb-4">{literature.titleEn}</p>
            )}

            {/* Authors */}
            <div className="flex items-start gap-2 mb-4">
              <Users className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex flex-wrap gap-x-1">
                {literature.authors.map((author, idx) => (
                  <span key={idx} className="text-slate-700">
                    {author}
                    {idx < literature.authors.length - 1 && ','}
                  </span>
                ))}
              </div>
            </div>

            {/* Publication Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {literature.publication}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {literature.year}
                {literature.volume && `, 卷 ${literature.volume}`}
                {literature.issue && `, 期 ${literature.issue}`}
                {literature.pages && `, 页 ${literature.pages}`}
              </span>
              {literature.citations && (
                <Badge variant="secondary">
                  被引 {literature.citations} 次
                </Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Tabs */}
          <Tabs defaultValue="abstract" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="abstract">
                <FileText className="w-4 h-4 mr-2" />
                摘要
              </TabsTrigger>
              {literature.aiSummary && (
                <TabsTrigger value="ai">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI解读
                </TabsTrigger>
              )}
              <TabsTrigger value="entities">
                <Network className="w-4 h-4 mr-2" />
                知识实体
              </TabsTrigger>
            </TabsList>

            <TabsContent value="abstract" className="mt-4">
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 mb-3">中文摘要</h3>
                <p className="text-slate-700 leading-relaxed mb-6">
                  {showFullAbstract ? literature.abstract : literature.abstract.slice(0, 300)}
                  {literature.abstract.length > 300 && !showFullAbstract && '...'}
                </p>
                {literature.abstract.length > 300 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowFullAbstract(!showFullAbstract)}
                  >
                    {showFullAbstract ? '收起' : '展开全文'}
                  </Button>
                )}

                {literature.abstractEn && (
                  <>
                    <Separator className="my-4" />
                    <h3 className="font-semibold text-slate-900 mb-3">English Abstract</h3>
                    <p className="text-slate-700 leading-relaxed">{literature.abstractEn}</p>
                  </>
                )}
              </Card>
            </TabsContent>

            {literature.aiSummary && (
              <TabsContent value="ai" className="mt-4">
                <Card className="p-6 bg-gradient-to-br from-violet-50 to-white border-violet-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-violet-600" />
                    <h3 className="font-semibold text-violet-900">AI智能摘要</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{literature.aiSummary}</p>
                  <div className="mt-4 pt-4 border-t border-violet-100">
                    <p className="text-xs text-violet-600">
                      * 本摘要由AI基于原文内容生成，仅供参考
                    </p>
                  </div>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="entities" className="mt-4">
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">提取的实体</h3>
                {literature.entities && literature.entities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {literature.entities.map((entity) => (
                      <Badge 
                        key={entity.id}
                        variant="outline"
                        className={`px-3 py-1.5 text-sm ${
                          entity.type === 'drug' ? 'border-blue-300 bg-blue-50 text-blue-700' :
                          entity.type === 'disease' ? 'border-rose-300 bg-rose-50 text-rose-700' :
                          entity.type === 'mechanism' ? 'border-emerald-300 bg-emerald-50 text-emerald-700' :
                          entity.type === 'component' ? 'border-amber-300 bg-amber-50 text-amber-700' :
                          entity.type === 'pathway' ? 'border-purple-300 bg-purple-50 text-purple-700' :
                          'border-slate-300 bg-slate-50'
                        }`}
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {entity.name}
                        <span className="ml-1.5 text-xs opacity-70">
                          ({entity.type === 'drug' ? '药物' :
                            entity.type === 'disease' ? '疾病' :
                            entity.type === 'mechanism' ? '机制' :
                            entity.type === 'component' ? '成分' :
                            entity.type === 'pathway' ? '通路' :
                            entity.type === 'treatment' ? '治疗' :
                            entity.type})
                        </span>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">暂无实体数据</p>
                )}
              </Card>
            </TabsContent>
          </Tabs>

          {/* Keywords */}
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              关键词
            </h3>
            <div className="flex flex-wrap gap-2">
              {literature.keywords.map((kw, idx) => (
                <Badge key={idx} variant="secondary" className="px-3 py-1">
                  {kw}
                </Badge>
              ))}
              {literature.keywordsEn && literature.keywordsEn.map((kw, idx) => (
                <Badge key={`en-${idx}`} variant="outline" className="px-3 py-1">
                  {kw}
                </Badge>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Document Access Card */}
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              文献直达
            </h3>

            <Alert className="mb-4 bg-amber-50 border-amber-200">
              <AlertDescription className="text-xs text-amber-800">
                本平台仅提供文献元数据展示，原文获取请通过以下正规渠道
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {doiUrl && (
                <a 
                  href={doiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">DOI</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">DOI链接</p>
                      <p className="text-xs text-slate-500 truncate max-w-[150px]">{literature.doi}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </a>
              )}

              {pubmedUrl && (
                <a 
                  href={pubmedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-emerald-600">PM</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">PubMed</p>
                      <p className="text-xs text-slate-500">PMID: {literature.pmid}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                </a>
              )}

              {pmcUrl && (
                <a 
                  href={pmcUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-600">PMC</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">PubMed Central</p>
                      <p className="text-xs text-slate-500">免费全文</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
                </a>
              )}

              {literature.url && (
                <a 
                  href={literature.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">期刊官网</p>
                      <p className="text-xs text-slate-500">出版商页面</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                </a>
              )}
            </div>
          </Card>

          {/* Actions Card */}
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">操作</h3>
            <div className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => onAskAI(literature)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                向AI询问
              </Button>
              <Button variant="outline" className="w-full">
                <Bookmark className="w-4 h-4 mr-2" />
                收藏文献
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
            </div>
          </Card>

          {/* Citation Info */}
          {(literature.doi || literature.pmid) && (
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">引用信息</h3>
              <div className="space-y-2 text-sm">
                {literature.doi && (
                  <div>
                    <span className="text-slate-500">DOI:</span>
                    <code className="ml-2 px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                      {literature.doi}
                    </code>
                  </div>
                )}
                {literature.pmid && (
                  <div>
                    <span className="text-slate-500">PMID:</span>
                    <code className="ml-2 px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                      {literature.pmid}
                    </code>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
