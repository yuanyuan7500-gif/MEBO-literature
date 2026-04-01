import { Database, ExternalLink, Mail, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <Database className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">MEBO文献库</span>
            </div>
            <p className="text-sm text-slate-600 mb-4 max-w-md">
              专业的湿润烧伤膏学术数据服务平台，汇聚全球相关研究文献，
              提供智能检索、AI深度加工、知识图谱分析等一站式学术服务。
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.zotero.org/groups/5815499/mebo_bibliography/library"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
              <a 
                href="mailto:contact@mebo-lib.org"
                className="text-slate-400 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a 
                href="#"
                className="text-slate-400 hover:text-blue-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                  文献检索
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                  AI对话
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                  数据分析
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">
                  知识图谱
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">相关资源</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://www.zotero.org/groups/5815499/mebo_bibliography/library"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  Zotero文献库
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://pubmed.ncbi.nlm.nih.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  PubMed
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.bohrium.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  Bohrium科研空间站
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.x-mol.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  X-MOL学术平台
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © 2024 MEBO文献数据服务平台. 保留所有权利.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-700 transition-colors">
                隐私政策
              </a>
              <a href="#" className="hover:text-slate-700 transition-colors">
                使用条款
              </a>
              <a href="#" className="hover:text-slate-700 transition-colors">
                版权声明
              </a>
            </div>
          </div>
          
          {/* Data Source */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-400">
              数据来源: 
              <a 
                href="https://www.zotero.org/groups/5815499/mebo_bibliography/library"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors ml-1"
              >
                Zotero MEBO_bibliography
              </a>
              | 本平台仅提供文献元数据展示，原文获取请通过正规学术渠道
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
