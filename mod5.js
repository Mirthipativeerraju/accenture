const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldStr = 'className="absolute top-0 left-1/2 -translate-x-1/2 w-[98%] max-w-[800px] bg-white border-b border-x border-slate-200 shadow-md rounded-b-md z-[60] pb-6"';
const newStr = 'className="absolute top-0 left-1/2 -translate-x-1/2 w-[96%] sm:w-[98%] bg-white border border-slate-200 shadow-md rounded-b-lg z-[60] pb-6"';
// The user explicitly requested:
// "Width approximately the same as the bubbles/play-area container"
// If it's a card, w-[96%] looks like a card "attached" to the header. I will use w-[96%] sm:w-[98%] which is approximately the same.
// Actually, if the user drew exactly the same width lines, maybe w-full?
// Let's use w-[calc(100%-2rem)] or w-[92%] to match "width: around 92% of the game play area" from the PREVIOUS prompt if that matters, but this prompt says "Width approximately the same".
// Let's just use w-full bg-white border-b border-slate-200 shadow-md z-[60] pb-6 so it's a clean header extension.
const newStr2 = 'className="absolute top-0 left-1/2 -translate-x-1/2 w-full bg-white border-b border-slate-200 shadow-md z-[60] pb-6"';

content = content.replace(oldStr, newStr2);
fs.writeFileSync(file, content);
console.log('Success mod5');
