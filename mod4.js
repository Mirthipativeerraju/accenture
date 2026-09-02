const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const fullFuncStart = content.indexOf('function FullBubbleMockTestUI');

const panelStartString = '{/* Instruction Panel Overlay */}';
const panelEndString = '                </div>\n              )}';

let panelStart = content.indexOf(panelStartString, fullFuncStart);
let panelEnd = content.indexOf(panelEndString, panelStart) + panelEndString.length;

if (panelStart === -1) {
  console.log("Could not find instruction panel overlay");
  process.exit(1);
}

// Extract and remove old panel
let oldPanel = content.substring(panelStart, panelEnd);
content = content.substring(0, panelStart) + content.substring(panelEnd);

// Rewrite the panel classes
let newPanel = oldPanel.replace(
  /className="absolute top-4 left-1\/2 -translate-x-1\/2 w-\[96%\] max-w-\[600px\] bg-white border border-slate-200 shadow-xl rounded-lg z-50 overflow-hidden pb-6"/,
  'className="absolute top-0 left-1/2 -translate-x-1/2 w-[98%] max-w-[800px] bg-white border-b border-x border-slate-200 shadow-md rounded-b-md z-[60] pb-6"'
);

// We want to insert this directly into Constrained Light Play Area
const targetContainer = '{/* 3. Constrained Light Play Area */}';
const insertPosContainer = content.indexOf(targetContainer, fullFuncStart);
const insertPos = content.indexOf('>', insertPosContainer + targetContainer.length) + 1;

content = content.substring(0, insertPos) + '\n\n            ' + newPanel + content.substring(insertPos);

fs.writeFileSync(file, content);
console.log('Success mod4');
