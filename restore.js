const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

// Get the pristine FullMockTestUI source
const start = content.indexOf('function FullMockTestUI({');
const end = content.indexOf('// -----------------------------------------------------------------------------\n// Generic UI');
let mockSrc = content.substring(start, end).trim();

// 1. Rename to FullBubbleMockTestUI
mockSrc = mockSrc.replace('function FullMockTestUI({', 'function FullBubbleMockTestUI({');

// 2. Remove step 6 from state and effects
mockSrc = mockSrc.replace('const [tutorialStep, setTutorialStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | "playing">(1);', 'const [tutorialStep, setTutorialStep] = useState<1 | 2 | 3 | 4 | 5 | "playing">(1);');
mockSrc = mockSrc.replace('const [hasSeenStep6, setHasSeenStep6] = useState(false);\n\n  // Trigger Step 6 after first two questions are completed\n  useEffect(() => {\n    if (currentSession.currentItemIndex === 2 && !hasSeenStep6 && tutorialStep === "playing") {\n      setTutorialStep(6);\n      timer?.stop();\n    }\n  }, [currentSession.currentItemIndex, hasSeenStep6, tutorialStep, timer]);', '');

// 3. Add demoSelected state and effect
const hookAnchor = 'const [tutorialStep, setTutorialStep] = useState<1 | 2 | 3 | 4 | 5 | "playing">(1);';
const demoStateStr = `const [tutorialStep, setTutorialStep] = useState<1 | 2 | 3 | 4 | 5 | "playing">(1);
  const [demoSelected, setDemoSelected] = useState(false);

  useEffect(() => {
    if (tutorialStep === 3) {
      const interval = setInterval(() => setDemoSelected(prev => !prev), 1000);
      return () => clearInterval(interval);
    }
  }, [tutorialStep]);`;
mockSrc = mockSrc.replace(hookAnchor, demoStateStr);

// 4. Update panel position
mockSrc = mockSrc.replace('const panelPosition = tutorialStep === 4 ? "top-[15%]" : "bottom-[5%]";', 'const panelPosition = "top-[10px] sm:top-[20px]";');
mockSrc = mockSrc.replace('className="fixed top-6 sm:top-8 left-1/2 -translate-x-1/2 w-[92%] max-w-[540px] bg-white rounded-md shadow-xl z-[110] overflow-hidden"', 'className="absolute top-[48px] left-0 right-0 z-[70] bg-white rounded-b-xl shadow-[0_12px_20px_rgba(0,0,0,0.15)] border-x border-b border-slate-100 overflow-hidden min-h-[140px]"');
mockSrc = mockSrc.replace('<div className="relative flex items-center justify-between p-4 sm:p-6 min-h-[140px] sm:min-h-[160px]">', '<div className="absolute top-0 left-0 w-1 h-full bg-black"></div><div className="absolute top-0 left-0 right-0 h-1 bg-black"></div><div className="relative flex items-center justify-between p-2 sm:p-4 min-h-[140px]">');

// 5. Instruction 5 text and button
const instr5Old = `{tutorialStep === 5 && (
                  <div className="flex flex-col items-center gap-4">
                    <p>
                      The practice exercise will have 4 questions in total.<br/><br/>
                      The first two questions will be ones you can replay, so you should take this opportunity to practice how to navigate.
                    </p>
                    <button onClick={() => {
                      if (currentSession.status === "IDLE" && onStartSession) {
                        onStartSession();
                      }
                      if (currentSession.currentItemIndex >= 2) {
                        setTutorialStep(6);
                      } else {
                        setTutorialStep("playing");
                        if (currentSession.status !== "IDLE") {
                          timer?.start();
                        }
                      }
                    }} className="bg-black text-white py-2.5 px-8 rounded font-semibold transition-transform active:scale-95 text-sm">
                      PRACTICE
                    </button>
                  </div>
                )}`;
const instr5New = `{tutorialStep === 5 && (
                  <div className="flex flex-col items-center gap-4">
                    <p>
                      The practice exercise will have 2 questions in total.<br/><br/>
                      So you should take this opportunity to practice how to navigate.
                    </p>
                    <button onClick={() => {
                      setTutorialStep("playing");
                      if (currentSession.status === "IDLE" && onStartSession) {
                        onStartSession();
                      }
                      timer?.start();
                    }} className="bg-black text-white py-2.5 px-8 rounded font-semibold transition-transform active:scale-95 text-sm">
                      PRACTICE
                    </button>
                  </div>
                )}`;
mockSrc = mockSrc.replace(instr5Old, instr5New);

// 6. Remove Step 6 block
const step6Block = `{tutorialStep === 6 && (
                  <div className="flex flex-col items-center gap-5 w-full">
                    <p>
                      You completed the first two practice items.<br/><br/>
                      To repeat the instructions, select REPLAY.<br/>
                      To continue to the next two practice items, select START.
                    </p>
                    <div className="flex justify-center gap-3 w-full sm:w-[80%] mx-auto">
                      <button onClick={() => setTutorialStep(1)} className="flex-1 bg-white border border-slate-300 text-black py-2.5 px-4 rounded font-semibold transition-transform active:scale-95 hover:bg-slate-50 text-sm">
                        REPLAY
                      </button>
                      <button onClick={() => {
                        setTutorialStep("playing");
                        setHasSeenStep6(true);
                        timer?.start();
                      }} className="flex-1 bg-black text-white py-2.5 px-4 rounded font-semibold transition-transform active:scale-95 hover:bg-neutral-800 text-sm">
                        START
                      </button>
                    </div>
                  </div>
                )}`;
mockSrc = mockSrc.replace(step6Block, '');

mockSrc = mockSrc.replace(/{tutorialStep !== 6 && \(/g, '{true && (');
mockSrc = mockSrc.replace(/tutorialStep \!== 6/g, 'true');
mockSrc = mockSrc.replace(/<div className="fixed inset-0 z-\[100\] bg-black\/40 flex flex-col items-center pointer-events-auto">/g, '');
mockSrc = mockSrc.replace(/<div className="w-full bg-slate-100 border-x border-b border-slate-200 rounded-b-lg shadow-sm flex flex-col min-h-\[480px\] p-5 justify-between relative overflow-hidden">/g, '<div className="w-full bg-slate-100 border-x border-b border-slate-200 rounded-b-lg shadow-sm flex flex-col min-h-[480px] p-5 justify-between relative overflow-hidden">\n          {tutorialStep === 4 && <div className="absolute inset-0 bg-black/40 z-[50] pointer-events-none rounded-b-lg" />}\n');

// Update tutorial positions
mockSrc = mockSrc.replace(
    'let positions = patternA;\n  if (currentQ.layoutPattern === "B") positions = patternB;\n  else if (currentQ.layoutPattern === "C") positions = patternC;\n  else if (currentQ.layoutPattern === "D") positions = patternD;',
    'let positions = patternA;\n  if (currentQ.layoutPattern === "B") positions = patternB;\n  else if (currentQ.layoutPattern === "C") positions = patternC;\n  else if (currentQ.layoutPattern === "D") positions = patternD;\n\n  if (tutorialStep !== "playing") {\n    positions = [\n      "top-[19%] sm:top-[21%] left-[50%] -translate-x-1/2",\n      "top-[42%] left-[25%]",\n      "top-[65%] right-[28%]",\n    ];\n  }'
);

// Update bubble isSelected
const oldIsSelected = `const isSelected = selectedIds.includes(id) \n                || (tutorialStep === 2 && index === 0)\n                || (tutorialStep === 3 && (index === 0 || index === 1));`;
const newIsSelected = `const isSelected = selectedIds.includes(id) \n                || (tutorialStep === 2 && index === 0)\n                || (tutorialStep === 3 && index === 0 && demoSelected);`;
mockSrc = mockSrc.replace(oldIsSelected, newIsSelected);

// Update Timer step 4 spotlight
mockSrc = mockSrc.replace('<div className="relative flex items-center justify-center w-14 h-14 shrink-0">', '<div className={`relative flex items-center justify-center w-14 h-14 shrink-0 ${tutorialStep === 4 ? "z-[60] bg-white rounded-full ring-4 ring-white shadow-[0_0_20px_rgba(255,255,255,0.6)]" : ""}`}>');

// Now we replace the BROKEN FullBubbleMockTestUI with this newly generated pristine one
const replaceStart = content.indexOf('function FullBubbleMockTestUI({');
const replaceEnd = content.indexOf('function FullMockTestUI({');
content = content.substring(0, replaceStart) + mockSrc + '\n\n// -----------------------------------------------------------------------------\n// Full Mock Test UI (EXPERIMENTAL & SAFE TO MODIFY)\n// -----------------------------------------------------------------------------\n\n' + content.substring(replaceEnd);

fs.writeFileSync(file, content);
console.log('Restored FullBubbleMockTestUI perfectly via node script clone');
