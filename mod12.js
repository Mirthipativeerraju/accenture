const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const fullFuncStart = content.indexOf('function FullBubbleMockTestUI');

// 1. Inject Dimming Overlay
const targetContainer = '{/* Instruction Panel Overlay */}';
const targetIndex = content.indexOf(targetContainer, fullFuncStart);
if (targetIndex === -1) {
    console.error('Could not find Instruction Panel Overlay');
    process.exit(1);
}

const dimmingOverlay = '              {/* Dimming Overlay for Step 4 */}\n' +
                       '              {phase === "intro" && tutorialStep === 4 && (\n' +
                       '                <div className="absolute inset-0 bg-black/40 z-[50] rounded-b-lg pointer-events-none" />\n' +
                       '              )}\n\n';

content = content.substring(0, targetIndex) + dimmingOverlay + content.substring(targetIndex);

// 2. Modify Timer in FullBubbleMockTestUI
// It should be the first instance of 'w-14 h-14 shrink-0' after fullFuncStart
const timerClassTarget = 'w-14 h-14 shrink-0';
const timerIndex = content.indexOf(timerClassTarget, fullFuncStart);
if (timerIndex === -1) {
    console.error('Could not find timer div');
    process.exit(1);
}

// Ensure it's the exact match in the className string
// original: className="relative flex items-center justify-center w-14 h-14 shrink-0"
const timerLineTarget = 'className="relative flex items-center justify-center w-14 h-14 shrink-0"';
const timerLineIndex = content.indexOf(timerLineTarget, fullFuncStart);

if (timerLineIndex === -1) {
    console.error('Could not find timer line');
    process.exit(1);
}

const newTimerLine = 'className={\elative flex items-center justify-center w-14 h-14 shrink-0 \\}';

content = content.substring(0, timerLineIndex) + newTimerLine + content.substring(timerLineIndex + timerLineTarget.length);

fs.writeFileSync(file, content);
console.log('Success mod12');
