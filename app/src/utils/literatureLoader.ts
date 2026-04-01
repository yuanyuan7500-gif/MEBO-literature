// app/src/utils/literatureLoader.ts
interface LiteratureItem {
  id: string;
  title: string;
  titleEn: string;
  authors: string[];
  abstract: string;
  abstractEn: string;
  publication: string;
  year: number;
  volume: string;
  issue: string;
  pages: string;
  doi: string;
  pmid: string;
  keywords: string[];
  keywordsEn: string[];
  itemType: string;
  language: string;
}

interface Manifest {
  total: number;
  pages: number;
  pageSize: number;
  generatedAt: string;
}

class LiteratureLoader {
  private db: IDBDatabase | null = null;
  private cache = new Map<number, LiteratureItem[]>();
  public manifest: Manifest | null = null;

  // 初始化：打开数据库，加载清单
  async init(): Promise<void> {
    this.db = await this.openDB();
    
    const res = await fetch('/data/manifest.json');
    this.manifest = await res.json();
    
    // 后台预加载完整数据到 IndexedDB
    this.preloadFullData();
  }

  // 获取首页数据（首屏用）
  async getFirstPage(): Promise<LiteratureItem[]> {
    return this.getPage(1);
  }

  // 获取指定页
  async getPage(pageNum: number): Promise<LiteratureItem[]> {
    // 1. 检查内存缓存
    if (this.cache.has(pageNum)) {
      return this.cache.get(pageNum)!;
    }

    // 2. 检查 IndexedDB
    const cached = await this.getFromDB(`page-${pageNum}`);
    if (cached) {
      this.cache.set(pageNum, cached);
      return cached;
    }

    // 3. 网络请求
    const res = await fetch(`/data/page-${pageNum}.json`);
    const data: LiteratureItem[] = await res.json();
    
    // 存入缓存
    this.cache.set(pageNum, data);
    await this.saveToDB(`page-${pageNum}`, data);
    
    return data;
  }

  // 搜索功能（在所有数据中搜索）
  async search(keyword: string): Promise<LiteratureItem[]> {
    const lowerKeyword = keyword.toLowerCase();
    const results: LiteratureItem[] = [];
    
    // 加载所有页并搜索（实际使用时可优化）
    if (!this.manifest) return results;
    
    for (let i = 1; i <= this.manifest.pages; i++) {
      const page = await this.getPage(i);
      const matches = page.filter(item => 
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.authors.some(a => a.toLowerCase().includes(lowerKeyword)) ||
        item.keywords.some(k => k.toLowerCase().includes(lowerKeyword)) ||
        item.publication.toLowerCase().includes(lowerKeyword)
      );
      results.push(...matches);
    }
    
    return results;
  }

  // 根据 ID 获取单条
  async getById(id: string): Promise<LiteratureItem | null> {
    if (!this.manifest) return null;
    
    for (let i = 1; i <= this.manifest.pages; i++) {
      const page = await this.getPage(i);
      const item = page.find(item => item.id === id);
      if (item) return item;
    }
    return null;
  }

  // 后台预加载完整数据
  private async preloadFullData(): Promise<void> {
    const hasFullData = await this.getFromDB('has-full-data');
    if (hasFullData) {
      console.log('完整数据已在 IndexedDB 中');
      return;
    }

    console.log('后台预加载完整数据...');
    
    try {
      const res = await fetch('/data/literature-full.json');
      const data: LiteratureItem[] = await res.json();
      
      // 分批存入，避免阻塞
      const batchSize = 500;
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        await this.saveToDB(`batch-${i / batchSize}`, batch);
      }
      
      await this.saveToDB('has-full-data', true);
      console.log('完整数据预加载完成');
    } catch (err) {
      console.log('完整数据预加载失败，将使用分页加载');
    }
  }

  // IndexedDB 操作
  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('LiteratureDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('data')) {
          db.createObjectStore('data');
        }
      };
    });
  }

  private async saveToDB(key: string, value: any): Promise<void> {
    if (!this.db) return;
    const tx = this.db.transaction(['data'], 'readwrite');
    tx.objectStore('data').put(value, key);
  }

  private async getFromDB(key: string): Promise<any> {
    if (!this.db) return null;
    return new Promise((resolve) => {
      const tx = this.db!.transaction(['data'], 'readonly');
      const request = tx.objectStore('data').get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  }
}

// 单例导出
export const literatureLoader = new LiteratureLoader();