const fs = require('fs');
let c = fs.readFileSync('d:/bsuir/kursavik/cleaning-app/src/screens/ClientOrderDetailScreen.tsx', 'utf8');
c = c.replace(/className=\{\\text-xs font-medium \}/g, 'className={`text-xs font-medium ${isDone || isCurrent ? \'text-gray-900\' : \'text-gray-400\'}`}');
c = c.replace(/className=\{\\text-sm font-medium \}/g, 'className={`text-sm font-medium ${STATUS_STYLES[order.status].text}`}');
c = c.replace(/className=\{\\font-semibold text-gray-900 \}/g, 'className={`font-semibold text-gray-900 ${STATUS_STYLES[order.status].text}`}');
fs.writeFileSync('d:/bsuir/kursavik/cleaning-app/src/screens/ClientOrderDetailScreen.tsx', c);
console.log('Done');