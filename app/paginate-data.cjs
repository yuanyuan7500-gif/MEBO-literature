// paginate-data.cjs - 分页数据生成
const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'literatureData.json';
const OUTPUT_DIR = 'app/public/data';
const PAGE_SIZE = 100; // 每页 100 条

console.log('📄 开始生成分页数据...\n');

try {
  const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  console.log(`📖 总记录：${data.length} 条`);
  console.log(`📦 每页：${PAGE_SIZE} 条`);

  // 创建目录
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 1. 生成完整数据（用于 IndexedDB 缓存）
  const fullDataPath = path.join(OUTPUT_DIR, 'literature-full.json');
  fs.writeFileSync(fullDataPath, JSON.stringify(data));
  console.log(`\n💾 完整数据：${(fs.statSync(fullDataPath).size/1024/1024).toFixed(2)} MB`);

  // 2. 按页分割
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  console.log(`\n📑 生成 ${totalPages} 个分页文件...`);

  for (let i = 0; i < totalPages; i++) {
    const start = i * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageData = data.slice(start, end);
    
    const pagePath = path.join(OUTPUT_DIR, `page-${i + 1}.json`);
    fs.writeFileSync(pagePath, JSON.stringify(pageData));
  }

  // 3. 生成清单
  const manifest = {
    total: data.length,
    pages: totalPages,
    pageSize: PAGE_SIZE,
    generatedAt: new Date().toISOString()
  };
  fs.writeFileSync(path.join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(manifest));

  // 4. 测试首页大小
  const firstPageSize = fs.statSync(path.join(OUTPUT_DIR, 'page-1.json')).size;
  
  console.log(`\n✅ 分页完成！`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`总页数：${totalPages} 页`);
  console.log(`首页大小：${(firstPageSize/1024).toFixed(1)} KB`);
  console.log(`完整数据：用于后台预加载到 IndexedDB`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`\n💡 使用策略：`);
  console.log(`   1. 首屏加载 page-1.json（${(firstPageSize/1024).toFixed(1)} KB）`);
  console.log(`   2. 后台静默加载 literature-full.json 到 IndexedDB`);
  console.log(`   3. 翻页时优先从 IndexedDB 读取，无缓存则加载对应 page-N.json`);

} catch (error) {
  console.error('❌ 错误：', error.message);
  process.exit(1);
}