const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

// I will fix the broken line:
const brokenLine = 'className={elative flex items-center justify-center w-14 h-14 shrink-0 \\}>';
const fixedLine = 'className={elative flex items-center justify-center w-14 h-14 shrink-0 }';

if (content.includes(brokenLine)) {
    content = content.replace(brokenLine, fixedLine);
    fs.writeFileSync(file, content);
    console.log('Fixed syntax error!');
} else {
    console.log('Could not find broken line. Let me search for it.');
    const match = content.match(/className=\{elative.*?\\}>/);
    if (match) {
        content = content.replace(match[0], fixedLine);
        fs.writeFileSync(file, content);
        console.log('Fixed syntax error using regex!');
    } else {
        console.log('Regex failed too.');
    }
}
