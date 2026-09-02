const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('elative flex')) {
        // Just completely overwrite any line that has this messed up string
        if (lines[i].includes('w-14 h-14 sm:w-16 sm:h-16 shrink-0')) {
            lines[i] = '              <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 shrink-0">';
        } else {
            lines[i] = '              <div className="relative flex items-center justify-center w-14 h-14 shrink-0">';
        }
    }
}
fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed lines');
