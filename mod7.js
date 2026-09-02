const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const fullFuncStart = content.indexOf('function FullBubbleMockTestUI');
const targetLine = 'const isSelected = selectedIds.includes(id);';
const searchIndex = content.indexOf(targetLine, fullFuncStart);

if (searchIndex === -1) {
    console.error("Could not find target line.");
    process.exit(1);
}

const newCode = 'const isSelected = selectedIds.includes(id) || (phase === "intro" && tutorialStep === 2 && index === 0);';

content = content.substring(0, searchIndex) + newCode + content.substring(searchIndex + targetLine.length);

fs.writeFileSync(file, content);
console.log('Success mod7');
