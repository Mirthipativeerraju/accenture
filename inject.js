const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

// We only want to modify inside FullBubbleMockTestUI.
const start = content.indexOf('function FullBubbleMockTestUI({');
const end = content.indexOf('function FullMockTestUI({');
if (start === -1 || end === -1) {
    console.error("Could not find boundaries!");
    process.exit(1);
}

let ui = content.substring(start, end);

// 1. Add demoSelected
ui = ui.replace(
    'const [tutorialStep, setTutorialStep] = useState(1);',
    'const [tutorialStep, setTutorialStep] = useState(1);\n  const [demoSelected, setDemoSelected] = useState(false);\n\n  useEffect(() => {\n    if (phase === "intro" && tutorialStep === 3) {\n      const interval = setInterval(() => setDemoSelected(prev => !prev), 1000);\n      return () => clearInterval(interval);\n    }\n  }, [phase, tutorialStep]);'
);

// 2. Add isSelected logic
ui = ui.replace(
    'const isSelected = selectedIds.includes(id);',
    'const isSelected = selectedIds.includes(id) || (phase === "intro" && tutorialStep === 2 && index === 0) || (phase === "intro" && tutorialStep === 3 && index === 0 && demoSelected);'
);

// 3. Fix isRevealed for intro phase so they don't stay hidden
ui = ui.replace(
    '} else if (isRevealed) {\n                animationClass = "translate-y-0 opacity-100 transition-all duration-300 ease-out";',
    '} else if (isRevealed || phase === "intro") {\n                animationClass = "translate-y-0 opacity-100 transition-all duration-300 ease-out";'
);

// 4. Add dim overlay for Step 4
ui = ui.replace(
    '{/* Bubble Play Area Canvas with Upward Exit Animation */}',
    '{/* Step 4 dim overlay */}\n          {phase === "intro" && tutorialStep === 4 && <div className="absolute inset-0 bg-black/40 z-[50] pointer-events-none rounded-b-lg" />}\n\n          {/* Bubble Play Area Canvas with Upward Exit Animation */}'
);

// 5. Highlight timer for step 4
ui = ui.replace(
    '<div className="relative flex items-center justify-center w-14 h-14 shrink-0">',
    '<div className={`relative flex items-center justify-center w-14 h-14 shrink-0 ${phase === "intro" && tutorialStep === 4 ? "z-[60] bg-white rounded-full ring-4 ring-white shadow-[0_0_20px_rgba(255,255,255,0.6)]" : ""}`}>'
);

// 6. Update Instruction 5 text
const oldInst5 = `{tutorialStep === 5 && (
                        <div className="flex flex-col items-center gap-4">
                          <p>
                            The tutorial phase is now complete.<br/><br/>
                            The actual assessment will contain 28 questions. You should take this opportunity to prepare before starting.
                          </p>
                          <button onClick={() => {
                            setPhase("playing");
                            if (onStartSession) onStartSession();
                          }} className="bg-black text-white py-2.5 px-8 rounded font-semibold transition-transform active:scale-95 text-sm">
                            START
                          </button>
                        </div>
                      )}`;

const newInst5 = `{tutorialStep === 5 && (
                        <div className="flex flex-col items-center gap-4">
                          <p>
                            The practice exercise will have 2 questions in total.<br/><br/>
                            So you should take this opportunity to practice how to navigate.
                          </p>
                          <button onClick={() => {
                            setPhase("playing");
                            if (onStartSession) onStartSession();
                          }} className="bg-black text-white py-2.5 px-8 rounded font-semibold transition-transform active:scale-95 text-sm tracking-wide">
                            PRACTICE
                          </button>
                        </div>
                      )}`;

ui = ui.replace(oldInst5, newInst5);

content = content.substring(0, start) + ui + content.substring(end);
fs.writeFileSync(file, content);
console.log("Successfully injected tutorial logic securely into faL4.tsx state!");

