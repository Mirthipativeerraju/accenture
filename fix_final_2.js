const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('className={`relative flex items-center justify-center font-bold text-lg sm:text-xl transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none ${bubbleStyleClass}`}>')) {
        lines[i] = '                    className={`relative flex items-center justify-center font-bold text-lg sm:text-xl transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none ${bubbleStyleClass}`}';
    }
}
fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed extra angle bracket');
