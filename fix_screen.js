const fs = require('fs');
let c = fs.readFileSync('d:/bsuir/kursavik/cleaning-app/src/screens/ClientOrderDetailScreen.tsx', 'utf8');

// Remove orphaned className line (line 65)
c = c.replace(/\n          className={\\x60text-xs font-medium \${isDone \|\| isCurrent \? \\x27text-gray-900\\x27 : \\x27text-gray-400\\x27}\\\\x60}/, '');

// Fix broken template literals with tab character
c = c.replace(/className={\ttext-xs font-medium }/g, 'className={\\x60text-xs font-medium ${isDone || isCurrent ? \\x27text-gray-900\\x27 : \\x27text-gray-400\\x27}\\x60}');
c = c.replace(/className={\ttext-sm font-medium }/g, 'className={\\x60text-sm font-medium ${STATUS_STYLES[order.status].text}\\x60}');
c = c.replace(/className={\tfont-semibold text-gray-900 }/g, 'className={\\x60font-semibold text-gray-900 ${STATUS_STYLES[order.status].text}\\x60}');

fs.writeFileSync('d:/bsuir/kursavik/cleaning-app/src/screens/ClientOrderDetailScreen.tsx', c);
console.log('Done');