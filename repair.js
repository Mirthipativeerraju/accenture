const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<div className="relative flex items-center justify-center w-14 h-14 shrink-0">') && lines[i+1] && lines[i+1].trim() === '>') {
        lines[i] = '                    className={\elative flex items-center justify-center font-bold text-lg sm:text-xl transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none \\}';
    }
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Repaired buttons!');
