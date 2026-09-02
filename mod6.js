const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const fullFuncStart = content.indexOf('function FullBubbleMockTestUI');
const targetLine = 'else if (currentQ.layoutPattern === "D") positions = patternD;';
const searchIndex = content.indexOf(targetLine, fullFuncStart);

if (searchIndex === -1) {
    console.error("Could not find target line.");
    process.exit(1);
}

const insertionIndex = searchIndex + targetLine.length;

const newCode = '\n' +
    '    if (phase === "intro") {\n' +
    '      positions = [\n' +
    '        "top-[19%] sm:top-[21%] left-[50%] -translate-x-1/2",\n' +
    '        "top-[55%] sm:top-[55%] left-[25%] -translate-x-1/2",\n' +
    '        "top-[55%] sm:top-[55%] left-[75%] -translate-x-1/2",\n' +
    '        "top-[75%] left-[50%] -translate-x-1/2",\n' +
    '      ];\n' +
    '    }';

content = content.substring(0, insertionIndex) + newCode + content.substring(insertionIndex);

fs.writeFileSync(file, content);
console.log('Success mod6');
