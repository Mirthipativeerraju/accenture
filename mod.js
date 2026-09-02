const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetFunction = 'function FullBubbleMockTestUI({';
const startIndex = content.indexOf(targetFunction);
const phaseState = 'const [phase, setPhase] = useState<\"intro\" | \"playing\">(\"intro\");';
const phaseIndex = content.indexOf(phaseState, startIndex);

const injectedStates = 
  phaseState + '\n  const [tutorialStep, setTutorialStep] = useState(1);\n\n  useEffect(() => {\n    if (phase === \"intro\" && tutorialStep === 4) {\n      const t = setTimeout(() => {\n        setPhase(\"playing\");\n        if (onStartSession) onStartSession();\n      }, 3500);\n      return () => clearTimeout(t);\n    }\n  }, [phase, tutorialStep, onStartSession]);';

content = content.substring(0, phaseIndex) + injectedStates + content.substring(phaseIndex + phaseState.length);

const overlayStart = content.indexOf('{phase === \"intro\" && (', phaseIndex);
const overlayEnd = content.indexOf('</button>\n              </div>\n            )}', overlayStart);
if (overlayStart > -1 && overlayEnd > -1) {
  content = content.substring(0, overlayStart) + content.substring(overlayEnd + 45);
}

const instructionPanel = 
          '{/* Instruction Panel */}\n' +
          '{phase === "intro" && (\n' +
          '  <div className="w-full bg-white border border-slate-200 shadow-md rounded-lg mb-4 z-10 overflow-hidden">\n' +
          '    <div className="flex items-center justify-between p-4 min-h-[120px]">\n' +
          '      {/* Left Arrow */}\n' +
          '      <button \n' +
          '        onClick={() => setTutorialStep((prev) => prev > 1 ? prev - 1 : 1)}\n' +
          '        disabled={tutorialStep === 1}\n' +
          '        className={"w-12 h-12 flex items-center justify-center shrink-0 text-slate-400 hover:text-black transition-colors " + (tutorialStep === 1 ? "invisible" : "visible")}\n' +
          '        aria-label="Previous Instruction"\n' +
          '      >\n' +
          '        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">\n' +
          '          <path d="m15 18-6-6 6-6"/>\n' +
          '        </svg>\n' +
          '      </button>\n' +
          '\n' +
          '      {/* Text Content */}\n' +
          '      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 text-slate-800 text-[16px] font-medium leading-relaxed">\n' +
          '        {tutorialStep === 1 && (\n' +
          '          <p>Select the bubbles in order from the <strong className="font-bold text-black">LOWEST</strong> to the <strong className="font-bold text-black">HIGHEST</strong> value.</p>\n' +
          '        )}\n' +
          '        {tutorialStep === 2 && (\n' +
          '          <p>Select a bubble by clicking on it. Your selected bubbles will be highlighted.</p>\n' +
          '        )}\n' +
          '        {tutorialStep === 3 && (\n' +
          '          <p>You can deselect a bubble by clicking on it again. However, you will automatically advance to the next question after the third bubble is selected.</p>\n' +
          '        )}\n' +
          '        {tutorialStep === 4 && (\n' +
          '          <p>Each set of bubbles has a time limit, indicated by the timer at the bottom of the screen. <br/><br/><span className="text-sm text-slate-500 font-normal">Starting in a moment...</span></p>\n' +
          '        )}\n' +
          '      </div>\n' +
          '\n' +
          '      {/* Right Arrow */}\n' +
          '      <button \n' +
          '        onClick={() => setTutorialStep((prev) => prev < 4 ? prev + 1 : 4)}\n' +
          '        disabled={tutorialStep === 4}\n' +
          '        className={"w-12 h-12 flex items-center justify-center shrink-0 text-slate-400 hover:text-black transition-colors " + (tutorialStep === 4 ? "invisible" : "visible")}\n' +
          '        aria-label="Next Instruction"\n' +
          '      >\n' +
          '        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">\n' +
          '          <path d="m9 18 6-6-6-6"/>\n' +
          '        </svg>\n' +
          '      </button>\n' +
          '\n' +
          '    </div>\n' +
          '  </div>\n' +
          ')}\n';

const playAreaStart = content.indexOf('{/* 3. Constrained Light Play Area */}', startIndex);
if (playAreaStart > -1) {
  content = content.substring(0, playAreaStart) + instructionPanel + '          ' + content.substring(playAreaStart);
}

fs.writeFileSync(file, content);
console.log('Done');
