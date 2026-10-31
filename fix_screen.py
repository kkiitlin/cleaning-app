with open('d:/bsuir/kursavik/cleaning-app/src/screens/ClientOrderDetailScreen.tsx', 'r', encoding='utf-8-sig') as f:
    content = f.read()

content = content.replace('          className={\\x60text-xs font-medium ${isDone || isCurrent ? \\x27text-gray-900\\x27 : \\x27text-gray-400\\x27}\\x60}\n', '')
content = content.replace('className={\\text-xs font-medium }', 'className={\\x60text-xs font-medium ${isDone || isCurrent ? \\x27text-gray-900\\x27 : \\x27text-gray-400\\x27}\\x60}')
content = content.replace('className={\\text-sm font-medium }', 'className={\\x60text-sm font-medium ${STATUS_STYLES[order.status].text}\\x60}')
content = content.replace('className={\\font-semibold text-gray-900 }', 'className={\\x60font-semibold text-gray-900 ${STATUS_STYLES[order.status].text}\\x60}')

with open('d:/bsuir/kursavik/cleaning-app/src/screens/ClientOrderDetailScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')