const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const fullFuncStart = content.indexOf('function FullBubbleMockTestUI');

let timerIndex = content.indexOf('className="relative flex items-center justify-center w-14 h-14 shrink-0"', fullFuncStart);
if (timerIndex !== -1) {
    const fixedClass = 'className={\elative flex items-center justify-center w-14 h-14 shrink-0 \\}';
    content = content.substring(0, timerIndex) + fixedClass + content.substring(timerIndex + 'className="relative flex items-center justify-center w-14 h-14 shrink-0"'.length);
    fs.writeFileSync(file, content);
    console.log('Applied spotlight correctly');
} else {
    console.log('Timer not found');
}
