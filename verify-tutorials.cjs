const fs = require('fs');

const tutorialsContent = fs.readFileSync('./src/data/tutorials.ts', 'utf-8');
const zhCNContent = fs.readFileSync('./src/i18n/locales/tutorials.zh-CN.ts', 'utf-8');

const allIds = [];
const idPattern = /id:\s*['"]([\w-]+)['"]/g;
let match;
while ((match = idPattern.exec(tutorialsContent)) !== null) {
  allIds.push(match[1]);
}

console.log('数据层总共有 ' + allIds.length + ' 个 id');

const missingIds = [];
allIds.forEach(id => {
  if (!zhCNContent.includes("'" + id + "'")) {
    missingIds.push(id);
  }
});

console.log('\n缺失的 id 数量:', missingIds.length);
if (missingIds.length > 0) {
  console.log('缺失的 id:', missingIds);
} else {
  console.log('✅ 所有 id 都已覆盖！');
}
