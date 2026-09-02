const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const startStr = 'function FullBubbleMockTestUI({';
const endStr = 'function FullMockTestUI({';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

const fullUI = `function FullBubbleMockTestUI({
  currentSession,
  controller,
  currentQ,
  selectedIds,
  isSubmitting,
  remainingSeconds,
  onBubbleClick,
  onStartSession,
  timer,
}: BubbleUIProps) {
  const timeLimitSeconds = controller?.config?.timeLimitSeconds || 15;

  const [revealedCount, setRevealedCount] = useState(0);
  const [phase, setPhase] = useState<"intro" | "practice" | "playing">("intro");
  const [tutorialStep, setTutorialStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [demoSelected, setDemoSelected] = useState(false);

  // Practice state
  const [practicePhase, setPracticePhase] = useState<"idle" | "q1" | "q2" | "completed">("idle");
  const [practiceSelectedIds, setPracticeSelectedIds] = useState<string[]>([]);
  const [practiceIsSubmitting, setPracticeIsSubmitting] = useState(false);
  const [practiceRemainingSeconds, setPracticeRemainingSeconds] = useState(15);

  const fixedPracticeQ1 = {
    id: "prac1",
    layoutPattern: "A",
    displayOrderIds: ["p1_3", "p1_1", "p1_2"],
    expressions: [
      { id: "p1_1", display: "2 + 2", value: 4 },
      { id: "p1_2", display: "1 + 1", value: 2 },
      { id: "p1_3", display: "3 + 3", value: 6 }
    ]
  };

  const fixedPracticeQ2 = {
    id: "prac2",
    layoutPattern: "B",
    displayOrderIds: ["p2_3", "p2_1", "p2_2"],
    expressions: [
      { id: "p2_1", display: "5 - 1", value: 4 },
      { id: "p2_2", display: "10 - 2", value: 8 },
      { id: "p2_3", display: "15 - 5", value: 10 }
    ]
  };

  const activeQ = phase === "practice" && practicePhase !== "completed" ? (practicePhase === "q1" ? fixedPracticeQ1 : fixedPracticeQ2) : currentQ;
  const activeSelectedIds = phase === "practice" ? practiceSelectedIds : selectedIds;
  const activeIsSubmitting = phase === "practice" ? practiceIsSubmitting : isSubmitting;

  // Staged sequential reveal per question
  useEffect(() => {
    const timer0 = setTimeout(() => setRevealedCount(0), 0);
    const timer1 = setTimeout(() => setRevealedCount(1), 60);
    const timer2 = setTimeout(() => setRevealedCount(2), 180);
    const timer3 = setTimeout(() => setRevealedCount(3), 300);

    return () => {
      clearTimeout(timer0);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [currentSession.currentItemIndex, practicePhase]);

  // Demo selection toggle for instruction 3
  useEffect(() => {
    if (phase === "intro" && tutorialStep === 3) {
      const interval = setInterval(() => {
        setDemoSelected(prev => !prev);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase, tutorialStep]);

  // Practice Timers
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === "practice" && (practicePhase === "q1" || practicePhase === "q2") && !practiceIsSubmitting) {
      interval = setInterval(() => {
        setPracticeRemainingSeconds(prev => {
          if (prev <= 1) {
            setPracticeIsSubmitting(true);
            setTimeout(() => {
              setPracticeSelectedIds([]);
              setPracticeIsSubmitting(false);
              setPracticeRemainingSeconds(15);
              setPracticePhase(p => p === "q1" ? "q2" : "completed");
            }, 800);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, practicePhase, practiceIsSubmitting]);

  const handlePracticeBubbleClick = (id: string) => {
    if (practiceIsSubmitting) return;

    if (practiceSelectedIds.includes(id)) {
      setPracticeSelectedIds(prev => prev.filter(x => x !== id));
      return;
    }

    const newSelections = [...practiceSelectedIds, id];
    setPracticeSelectedIds(newSelections);

    if (newSelections.length === 3) {
      setPracticeIsSubmitting(true);
      setTimeout(() => {
        setPracticeSelectedIds([]);
        setPracticeIsSubmitting(false);
        setPracticeRemainingSeconds(15);
        if (practicePhase === "q1") {
          setPracticePhase("q2");
        } else if (practicePhase === "q2") {
          setPracticePhase("completed");
        }
      }, 800);
    }
  };

  const startRealAssessment = () => {
    setPhase("playing");
    setPracticePhase("idle");
    if (onStartSession) onStartSession();
  };

  const replayInstructions = () => {
    setPracticePhase("idle");
    setTutorialStep(1);
    setPhase("intro");
  };

  const patternA = [
    "top-[4%] left-[60%] -translate-x-1/2",
    "top-[30%] left-[25%]",
    "top-[58%] right-[28%]",
  ];

  const patternB = [
    "top-[5%] left-[28%]",
    "top-[32%] left-[65%] -translate-x-1/2",
    "top-[60%] left-[20%]",
  ];

  const patternC = [
    "top-[10%] right-[25%]",
    "top-[40%] left-[25%]",
    "top-[70%] right-[30%]",
  ];

  const patternD = [
    "top-[5%] left-[50%] -translate-x-1/2",
    "top-[35%] left-[15%]",
    "top-[60%] right-[15%]",
  ];

  let positions = patternA;
  if (activeQ.layoutPattern === "B") positions = patternB;
  else if (activeQ.layoutPattern === "C") positions = patternC;
  else if (activeQ.layoutPattern === "D") positions = patternD;

  if (phase === "intro") {
    positions = [
      "top-[19%] sm:top-[21%] left-[50%] -translate-x-1/2",
      "top-[42%] left-[25%]",
      "top-[65%] right-[28%]",
    ];
  }

  const totalQuestions = currentSession.totalItems || 28;
  const currentItemNum = currentSession.currentItemIndex + 1;
  const currentDisplayNum = phase === "practice" && practicePhase !== "completed" ? (practicePhase === "q1" ? 1 : 2) : currentItemNum;
  const currentTotal = phase === "practice" && practicePhase !== "completed" ? 2 : totalQuestions;

  return (
    <div className="w-full h-full flex flex-col font-sans select-none overflow-hidden max-w-[600px] mx-auto bg-slate-50 relative">
      <main className="flex-1 flex flex-col relative w-full h-full">
        <div className="flex-1 flex flex-col relative bg-white w-full h-full shadow-xl">
          
          {/* Header */}
          <div className="w-full bg-neutral-900 text-white px-5 py-3 rounded-t-lg flex items-center justify-between shadow-md select-none border-b border-neutral-800 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm sm:text-base text-neutral-100 tracking-wide">
                {(phase === "playing" || (phase === "practice" && practicePhase !== "completed")) ? \`Question \${currentDisplayNum} of \${currentTotal}\` : ""}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400 font-mono tracking-wider">
                {(phase === "playing" || (phase === "practice" && practicePhase !== "completed")) ? \`\${Math.round((currentDisplayNum / currentTotal) * 100)}% COMPLETED\` : ""}
              </span>
            </div>
          </div>

          {/* Tutorial Instruction Card attached below header */}
          {phase === "intro" && (
            <div className="absolute top-[48px] left-0 right-0 z-[70]">
              <div className="bg-white rounded-b-xl shadow-[0_12px_20px_rgba(0,0,0,0.15)] border-x border-b border-slate-100 overflow-hidden relative min-h-[140px]">
                
                <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-black"></div>

                <div className="flex items-center justify-between h-full min-h-[140px] px-2 sm:px-4">
                  {/* Left Arrow */}
                  <button 
                    onClick={() => setTutorialStep((prev) => (prev > 1 ? (prev - 1) as any : 1))}
                    disabled={tutorialStep === 1}
                    className={\`w-10 h-10 flex items-center justify-center shrink-0 text-slate-400 hover:text-black transition-colors \${tutorialStep === 1 ? "invisible" : "visible"}\`}
                    aria-label="Previous Instruction"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                  </button>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-center text-center px-4 pb-6 pt-4 text-slate-800 text-[15px] sm:text-base font-medium leading-relaxed max-w-[400px] mx-auto min-h-[100px]">
                    {tutorialStep === 1 && (
                      <p>In this test, you'll need to answer mathematical expressions to establish the value of each bubble.</p>
                    )}
                    {tutorialStep === 2 && (
                      <p>Tap a bubble to select it.</p>
                    )}
                    {tutorialStep === 3 && (
                      <p>To deselect a bubble, simply tap it again.</p>
                    )}
                    {tutorialStep === 4 && (
                      <p>Each set of bubbles has a time limit, indicated by the timer at the bottom of the screen.</p>
                    )}
                    {tutorialStep === 5 && (
                      <div className="flex flex-col items-center gap-4">
                        <p>
                          The practice exercise will have 2 questions in total.<br/><br/>
                          So you should take this opportunity to practice how to navigate.
                        </p>
                        <button onClick={() => {
                          setPhase("practice");
                          setPracticePhase("q1");
                          setPracticeRemainingSeconds(15);
                        }} className="bg-black text-white py-2.5 px-8 rounded font-semibold transition-transform active:scale-95 text-sm tracking-wide">
                          PRACTICE
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Arrow */}
                  <button 
                    onClick={() => setTutorialStep((prev) => (prev < 5 ? (prev + 1) as any : 5))}
                    disabled={tutorialStep === 5}
                    className={\`w-10 h-10 flex items-center justify-center shrink-0 text-slate-400 hover:text-black transition-colors \${tutorialStep === 5 ? "invisible" : "visible"}\`}
                    aria-label="Next Instruction"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </button>
                </div>

                {/* Dots */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div 
                      key={step} 
                      className={\`rounded-full transition-colors \${tutorialStep === step ? 'w-1.5 h-1.5 bg-black' : 'w-1.5 h-1.5 bg-transparent border border-slate-400'}\`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="w-full bg-slate-100 border-x border-b border-slate-200 rounded-b-lg shadow-sm flex flex-col min-h-[480px] p-5 justify-between relative overflow-hidden">
            
            {/* Step 4 dim overlay */}
            {phase === "intro" && tutorialStep === 4 && (
              <div className="absolute inset-0 bg-black/40 z-[50] pointer-events-none rounded-lg" />
            )}

            {/* Bubbles */}
            <div className="relative w-full h-[460px] sm:h-[500px] my-1 select-none overflow-hidden">
              {activeQ.displayOrderIds.map((id, index) => {
                const expr = activeQ.expressions.find((e) => e.id === id)!;
                const isSelected = activeSelectedIds.includes(id) 
                  || (phase === "intro" && tutorialStep === 2 && index === 0)
                  || (phase === "intro" && tutorialStep === 3 && index === 0 && demoSelected);
                
                const isRevealed = index < revealedCount;

                let animationClass = "translate-y-6 opacity-0 pointer-events-none";
                if (activeIsSubmitting) {
                  animationClass = "-translate-y-24 opacity-0 transition-all duration-400 ease-in pointer-events-none";
                } else if (isRevealed || phase === "intro") {
                  animationClass = "translate-y-0 opacity-100 transition-all duration-300 ease-out";
                }

                const bubbleStyleClass = isSelected
                  ? "w-32 h-36 sm:w-40 sm:h-40 rounded-full bg-neutral-900 border-2 border-neutral-900 text-white shadow-md transition-all duration-300 ease-out"
                  : "w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white border-2 border-slate-300 text-neutral-900 shadow-sm transition-all duration-300 ease-out";

                return (
                  <div
                    key={id}
                    className={\`absolute \${positions[index]} \${animationClass}\`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if ((phase === "playing" || phase === "practice") && isRevealed && revealedCount === 3 && !activeIsSubmitting) {
                          if (phase === "practice") {
                            handlePracticeBubbleClick(id);
                          } else {
                            onBubbleClick(id);
                          }
                        }
                      }}
                      disabled={activeIsSubmitting || revealedCount < 3 || phase === "intro"}
                      aria-label={\`Bubble \${expr.display}\`}
                      className={\`relative flex items-center justify-center font-bold text-lg sm:text-xl transition-all duration-200 active:scale-95 cursor-pointer focus:outline-none \${bubbleStyleClass}\`}
                    >
                      <span>{expr.display}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* 4. Bottom Timer & Instruction Bar */}
            <div className="flex items-center justify-center gap-3 pt-4 pb-1 px-2 border-t border-slate-100">
              {/* Timer */}
              <div className={\`relative flex items-center justify-center w-14 h-14 shrink-0 \${phase === "intro" && tutorialStep === 4 ? "z-[60] bg-white rounded-full ring-4 ring-white shadow-[0_0_20px_rgba(255,255,255,0.6)]" : ""}\`}>
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
                  <path className="text-slate-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path className="text-neutral-900 transition-all duration-1000 ease-linear" strokeDasharray={\`\${(
                      ((phase === "intro" ? timeLimitSeconds : (phase === "practice" ? practiceRemainingSeconds : remainingSeconds)) / timeLimitSeconds) *
                      100
                    ).toFixed(2)}, 100\`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
                <span className="text-lg font-bold text-neutral-900 font-mono">
                  {phase === "intro" ? timeLimitSeconds : (phase === "practice" ? practiceRemainingSeconds : remainingSeconds)}
                </span>
              </div>

              {/* Instruction */}
              {practicePhase === "completed" ? (
                <div className="flex flex-col gap-3 w-full max-w-[300px]">
                  <p className="text-[15px] text-slate-800 font-medium leading-snug text-center">
                    You completed the two practice questions.<br/><br/>
                    To replay the instructions select replay.<br/>
                    To continue to the actual assessment, select start
                  </p>
                  <div className="flex flex-col gap-2 w-full mt-2">
                    <button onClick={startRealAssessment} className="w-full bg-black text-white py-2.5 rounded font-semibold text-sm">START</button>
                    <button onClick={replayInstructions} className="w-full bg-white border border-slate-300 text-black py-2.5 rounded font-semibold text-sm">REPLAY</button>
                  </div>
                </div>
              ) : (
                <p className="text-lg sm:text-sm text-slate-700 leading-snug text-center">
                  <span className="block">
                    Select the bubbles in order from the
                  </span>
                  <span className="block">
                    <strong className="font-bold text-neutral-900">LOWEST</strong> value to <strong className="font-bold text-neutral-900">HIGHEST</strong> value
                  </span>
                </p>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
`;

content = content.substring(0, startIndex) + fullUI + '\n// -----------------------------------------------------------------------------\n// Full Mock Test UI (EXPERIMENTAL & SAFE TO MODIFY)\n// -----------------------------------------------------------------------------\n\n' + endStr + content.substring(endIndex + endStr.length);

fs.writeFileSync(file, content);
console.log('Successfully rebuilt FullBubbleMockTestUI from scratch and injected it!');
