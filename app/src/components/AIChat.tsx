import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, BookOpen, Loader2, RotateCcw, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Literature, ChatMessage } from '@/types/literature';
import { mockAIResponses, mockLiterature } from '@/data/mockLiterature';

interface AIChatProps {
  initialLiterature?: Literature | null;
}

export function AIChat({ initialLiterature }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '您好！我是MEBO文献智能助手，基于8,641篇湿润烧伤膏研究文献为您提供服务。您可以问我关于湿润烧伤膏的任何问题，例如：\n\n• 湿润烧伤膏的作用机制是什么？\n• 湿润烧伤膏治疗烧伤的效果如何？\n• 湿润烧伤膏有哪些适应症？\n• 湿润烧伤膏的安全性如何？',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 如果有初始文献，添加上下文
  useEffect(() => {
    if (initialLiterature) {
      const contextMessage: ChatMessage = {
        id: 'context',
        role: 'assistant',
        content: `已选择文献：《${initialLiterature.title}》\n\n您可以针对这篇文献向我提问，例如：\n• 这篇研究的主要结论是什么？\n• 这项研究的创新点在哪里？\n• 研究的局限性有哪些？`,
        citations: [initialLiterature],
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, contextMessage]);
    }
  }, [initialLiterature]);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('机制') || lowerQuery.includes('原理') || lowerQuery.includes('pathway')) {
      return mockAIResponses['mechanism'];
    }
    if (lowerQuery.includes('效果') || lowerQuery.includes('疗效') || lowerQuery.includes('efficacy')) {
      return mockAIResponses['efficacy'];
    }
    if (lowerQuery.includes('适应症') || lowerQuery.includes('用途') || lowerQuery.includes('indication')) {
      return mockAIResponses['indications'];
    }
    if (lowerQuery.includes('安全') || lowerQuery.includes('副作用') || lowerQuery.includes('safety')) {
      return mockAIResponses['safety'];
    }
    
    return mockAIResponses['default'];
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 模拟AI响应延迟
    setTimeout(() => {
      const response = generateResponse(input);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        citations: mockLiterature.slice(0, 3),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: '您好！我是MEBO文献智能助手，基于8,641篇湿润烧伤膏研究文献为您提供服务。您可以问我关于湿润烧伤膏的任何问题。',
        timestamp: new Date(),
      },
    ]);
  };

  const quickQuestions = [
    '湿润烧伤膏的作用机制是什么？',
    '湿润烧伤膏治疗烧伤的效果如何？',
    '湿润烧伤膏有哪些适应症？',
    '湿润烧伤膏的主要成分是什么？',
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <Card className="p-4 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-slate-900">快速提问</h3>
            </div>
            <div className="space-y-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q)}
                  className="w-full text-left p-3 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="text-xs text-slate-500">
              <p className="mb-2">基于以下数据源：</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  8,641 篇文献
                </li>
                <li>• 中文文献: 6,234 篇</li>
                <li>• 英文文献: 2,407 篇</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col h-full">
          <Card className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-violet-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">MEBO文献智能助手</h2>
                  <p className="text-xs text-slate-500">基于文献数据的AI问答</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={clearChat}>
                <RotateCcw className="w-4 h-4 mr-1" />
                清空对话
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-blue-100' 
                        : 'bg-gradient-to-br from-violet-500 to-purple-600'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block p-4 rounded-2xl text-left ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      {/* Citations */}
                      {message.citations && message.citations.length > 0 && (
                        <div className="mt-2 text-left">
                          <p className="text-xs text-slate-500 mb-1.5">参考来源：</p>
                          <div className="flex flex-wrap gap-1.5">
                            {message.citations.map((cite, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className="text-xs cursor-pointer hover:bg-slate-100"
                              >
                                <BookOpen className="w-3 h-3 mr-1" />
                                {cite.authors[0]} 等, {cite.year}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-slate-400 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-slate-100 p-4 rounded-2xl">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">正在思考...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  placeholder="输入您的问题..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSend} 
                  disabled={!input.trim() || isLoading}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                AI生成内容仅供参考，请以原始文献为准
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
