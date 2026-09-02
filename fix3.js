const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const broken = 'className={elative flex items-center justify-center font-bold text-lg sm:text-xl transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none \\}';
const fixed = 'className={\elative flex items-center justify-center font-bold text-lg sm:text-xl transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none \\}>';

// replace all
content = content.split(broken).join(fixed);

// also fix the timer div if it got corrupted in other places
const timerBroken = 'className={elative flex items-center justify-center w-14 h-14 shrink-0 \\}';
const timerFixed = 'className="relative flex items-center justify-center w-14 h-14 shrink-0">';
content = content.split(timerBroken).join(timerFixed);

fs.writeFileSync(file, content);
console.log('Fixed syntax again');
