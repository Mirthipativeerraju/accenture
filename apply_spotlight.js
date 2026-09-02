const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const fullFuncStart = content.indexOf('function FullBubbleMockTestUI');

let timerIndex = content.indexOf('<div className="relative flex items-center justify-center w-14 h-14 shrink-0">', fullFuncStart);
if (timerIndex !== -1) {
    const fixedClass = '<div className={`relative flex items-center justify-center w-14 h-14 shrink-0 ${phase === "intro" && tutorialStep === 4 ? "z-[60] bg-white rounded-full ring-4 ring-white shadow-[0_0_20px_rgba(255,255,255,0.6)]" : ""}`}>';
    content = content.substring(0, timerIndex) + fixedClass + content.substring(timerIndex + '<div className="relative flex items-center justify-center w-14 h-14 shrink-0">'.length);
    fs.writeFileSync(file, content);
    console.log('Applied spotlight accurately');
} else {
    console.log('Timer not found');
}
