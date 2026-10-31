const fs=require('fs');
let c=fs.readFileSync('d:/bsuir/kursavik/cleaning-app/src/screens/ClientOrderDetailScreen.tsx','utf8');
let lines=c.split('\n');
console.log('Total lines: '+lines.length);
console.log('First 5 lines:');
for(let i=0;i<5;i++){
  console.log(i+':'+lines[i]);
}