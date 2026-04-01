// split-data.cjs - 数据分片脚本
const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'literatureData.json';
const OUTPUT_DIR = 'app/public/data';

console.log('🚀 开始分片处理...\n');

try {
  // 1. 读取原始数据
  const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
  const data = JSON.parse(rawData);
  console.log(`📖 读取完成：共 ${data.length} 条记录`);

  // 2. 创建输出目录
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 3. 生成轻量级索引（用于列表展示）
  console.log('\n📝 生成索引文件...');
  const index = data.map(item => ({
    id: item.id,
    title: item.title,
    year: item.year,
    authors: item.authors?.slice(0, 3) || [],      // 只存前3个作者
    publication: item.publication,
    keywords: item.keywords?.slice(0, 5) || []     // 只存前5个关键词
  }));

  const indexPath = path.join(OUTPUT_DIR, 'literature-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index));
  const indexSize = (fs.statSync(indexPath).size / 1024).toFixed(1);
  console.log(`✅ 索引文件：${indexSize} KB（${index.length} 条）`);

  // 4. 按年份分片（存储完整数据）
  console.log('\n📦 按年份分片...');
  const yearGroups = {};
  
  data.forEach(item => {
    const year = item.year || 'unknown';
    if (!yearGroups[year]) yearGroups[year] = [];
    yearGroups[year].push(item);
  });

  const years = Object.keys(yearGroups).sort();
  let totalChunkSize = 0;

  years.forEach(year => {
    const chunk = yearGroups[year];
    const chunkPath = path.join(OUTPUT_DIR, `literature-${year}.json`);
    fs.writeFileSync(chunkPath, JSON.stringify(chunk));
    const chunkSize = fs.statSync(chunkPath).size;
    totalChunkSize += chunkSize;
    console.log(`  📄 ${year}年：${chunk.length.toString().padStart(3)} 条，${(chunkSize/1024).toFixed(1)} KB`);
  });

  // 5. 生成清单文件
  const manifest = {
    total: data.length,
    years: years,
    indexSize: `${indexSize} KB`,
    generatedAt: new Date().toISOString()
  };
  fs.writeFileSync(path.join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(manifest));

  // 6. 统计结果
  const originalSize = fs.statSync(INPUT_FILE).size;
  console.log('\n📊 分片完成！');
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`原始文件：${(originalSize/1024/1024).toFixed(2)} MB`);
  console.log(`索引文件：${indexSize} KB（首屏加载）`);
  console.log(`分片数量：${years.length} 个年份`);
  console.log(`分片总大小：${(totalChunkSize/1024/1024).toFixed(2)} MB`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`💡 使用方式：`);
  console.log(`   1. 首屏加载 literature-index.json（${indexSize} KB）`);
  console.log(`   2. 点击查看详情时加载对应年份文件`);
  console.log(`   3. 配合 IndexedDB 缓存，二次访问秒开`);

} catch (error) {
  console.error('\n❌ 错误：', error.message);
  process.exit(1);
}