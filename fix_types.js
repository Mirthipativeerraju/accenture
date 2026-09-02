const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('let interval;', 'let interval: NodeJS.Timeout;');
content = content.replace('const handlePracticeBubbleClick = (id) => {', 'const handlePracticeBubbleClick = (id: string) => {');

fs.writeFileSync(file, content);
console.log('Fixed types');
