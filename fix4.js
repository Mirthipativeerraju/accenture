const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const startStr = 'function FullBubbleMockTestUI({';
const endStr = 'function FullMockTestUI({';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    let uiComponent = content.substring(startIndex, endIndex);

    // Replace the specific states
    uiComponent = uiComponent.replace(
        'const [phase, setPhase] = useState<"intro" | "playing">("intro");',
        'const [phase, setPhase] = useState<"intro" | "practice" | "playing">("intro");\n' +
        '  const [practicePhase, setPracticePhase] = useState<"idle" | "q1" | "q2" | "completed">("idle");\n' +
        '  const [practiceSelectedIds, setPracticeSelectedIds] = useState<string[]>([]);\n' +
        '  const [practiceIsSubmitting, setPracticeIsSubmitting] = useState(false);\n' +
        '  const [practiceRemainingSeconds, setPracticeRemainingSeconds] = useState(15);\n\n' +
        '  useEffect(() => {\n' +
        '    let interval;\n' +
        '    if (phase === "practice" && (practicePhase === "q1" || practicePhase === "q2") && !practiceIsSubmitting) {\n' +
        '      interval = setInterval(() => {\n' +
        '        setPracticeRemainingSeconds(prev => {\n' +
        '          if (prev <= 1) {\n' +
        '            setPracticeIsSubmitting(true);\n' +
        '            setTimeout(() => {\n' +
        '              setPracticeSelectedIds([]);\n' +
        '              setPracticeIsSubmitting(false);\n' +
        '              setPracticeRemainingSeconds(15);\n' +
        '              setPracticePhase(p => p === "q1" ? "q2" : "completed");\n' +
        '            }, 800);\n' +
        '            return 0;\n' +
        '          }\n' +
        '          return prev - 1;\n' +
        '        });\n' +
        '      }, 1000);\n' +
        '    }\n' +
        '    return () => clearInterval(interval);\n' +
        '  }, [phase, practicePhase, practiceIsSubmitting]);\n\n' +
        '  const handlePracticeBubbleClick = (id) => {\n' +
        '    if (practiceIsSubmitting) return;\n' +
        '    if (practiceSelectedIds.includes(id)) {\n' +
        '      setPracticeSelectedIds(prev => prev.filter(x => x !== id));\n' +
        '      return;\n' +
        '    }\n' +
        '    const newSelections = [...practiceSelectedIds, id];\n' +
        '    setPracticeSelectedIds(newSelections);\n' +
        '    if (newSelections.length === 3) {\n' +
        '      setPracticeIsSubmitting(true);\n' +
        '      setTimeout(() => {\n' +
        '        setPracticeSelectedIds([]);\n' +
        '        setPracticeIsSubmitting(false);\n' +
        '        setPracticeRemainingSeconds(15);\n' +
        '        if (practicePhase === "q1") {\n' +
        '          setPracticePhase("q2");\n' +
        '        } else if (practicePhase === "q2") {\n' +
        '          setPracticePhase("completed");\n' +
        '        }\n' +
        '      }, 800);\n' +
        '    }\n' +
        '  };\n\n' +
        '  const startRealAssessment = () => {\n' +
        '    setPhase("playing");\n' +
        '    setPracticePhase("idle");\n' +
        '    if (onStartSession) onStartSession();\n' +
        '  };\n\n' +
        '  const replayInstructions = () => {\n' +
        '    setPracticePhase("idle");\n' +
        '    setTutorialStep(1);\n' +
        '    setPhase("intro");\n' +
        '  };\n\n' +
        '  const fixedPracticeQ1 = {\n' +
        '    id: "prac1",\n' +
        '    layoutPattern: "A",\n' +
        '    displayOrderIds: ["p1_3", "p1_1", "p1_2"],\n' +
        '    expressions: [\n' +
        '      { id: "p1_1", display: "2 + 2", value: 4 },\n' +
        '      { id: "p1_2", display: "1 + 1", value: 2 },\n' +
        '      { id: "p1_3", display: "3 + 3", value: 6 }\n' +
        '    ]\n' +
        '  };\n\n' +
        '  const fixedPracticeQ2 = {\n' +
        '    id: "prac2",\n' +
        '    layoutPattern: "B",\n' +
        '    displayOrderIds: ["p2_3", "p2_1", "p2_2"],\n' +
        '    expressions: [\n' +
        '      { id: "p2_1", display: "5 - 1", value: 4 },\n' +
        '      { id: "p2_2", display: "10 - 2", value: 8 },\n' +
        '      { id: "p2_3", display: "15 - 5", value: 10 }\n' +
        '    ]\n' +
        '  };\n'
    );

    // Update revealedCount dependency
    uiComponent = uiComponent.replace(
        '  }, [currentSession.currentItemIndex]);',
        '  }, [currentSession.currentItemIndex, practicePhase]);'
    );
    
    const patternInit = 'let positions = patternA;';
    uiComponent = uiComponent.replace(
        patternInit,
        'const activeQ = phase === "practice" && practicePhase !== "completed" ? (practicePhase === "q1" ? fixedPracticeQ1 : fixedPracticeQ2) : currentQ;\n' +
        '  const activeSelectedIds = phase === "practice" ? practiceSelectedIds : selectedIds;\n' +
        '  const activeIsSubmitting = phase === "practice" ? practiceIsSubmitting : isSubmitting;\n\n' +
        '  let positions = patternA;'
    );

    uiComponent = uiComponent.replace(
        /if \(currentQ\.layoutPattern === "B"\)/g,
        'if (activeQ.layoutPattern === "B")'
    ).replace(
        /else if \(currentQ\.layoutPattern === "C"\)/g,
        'else if (activeQ.layoutPattern === "C")'
    ).replace(
        /else if \(currentQ\.layoutPattern === "D"\)/g,
        'else if (activeQ.layoutPattern === "D")'
    );
    
    uiComponent = uiComponent.replace(
        '{currentQ.displayOrderIds.map((id, index) => {',
        '{activeQ.displayOrderIds.map((id, index) => {'
    ).replace(
        'const expr = currentQ.expressions.find((e) => e.id === id)!;',
        'const expr = activeQ.expressions.find((e) => e.id === id)!;'
    );
    
    uiComponent = uiComponent.replace(
        'const isSelected = selectedIds.includes(id) || (phase === "intro" && tutorialStep === 2 && index === 0) || (phase === "intro" && tutorialStep === 3 && index === 0 && demoSelected);',
        'const isSelected = activeSelectedIds.includes(id) || (phase === "intro" && tutorialStep === 2 && index === 0) || (phase === "intro" && tutorialStep === 3 && index === 0 && demoSelected);'
    );

    uiComponent = uiComponent.replace(
        'disabled={isSubmitting || revealedCount < 3 || phase === "intro"}',
        'disabled={activeIsSubmitting || revealedCount < 3 || phase === "intro"}'
    );
    
    uiComponent = uiComponent.replace(
        'if (phase === "playing" && isRevealed && revealedCount === 3 && !isSubmitting) {\n                        onBubbleClick(id);\n                      }',
        'if ((phase === "playing" || phase === "practice") && isRevealed && revealedCount === 3 && !activeIsSubmitting) {\n' +
        '                        if (phase === "practice") {\n' +
        '                          handlePracticeBubbleClick(id);\n' +
        '                        } else {\n' +
        '                          onBubbleClick(id);\n' +
        '                        }\n' +
        '                      }'
    );

    uiComponent = uiComponent.replace(
        '{phase === "playing" ? `Question ${currentItemNum} of ${totalQuestions}` : ""}',
        '{phase === "practice" && practicePhase !== "completed" ? `Question ${practicePhase === "q1" ? 1 : 2} of 2` : (phase === "playing" ? `Question ${currentItemNum} of ${totalQuestions}` : "")}'
    );
    uiComponent = uiComponent.replace(
        '{phase === "playing" ? `${Math.round((currentItemNum / totalQuestions) * 100)}% COMPLETED` : ""}',
        '{phase === "practice" && practicePhase !== "completed" ? `${Math.round(((practicePhase === "q1" ? 1 : 2) / 2) * 100)}% COMPLETED` : (phase === "playing" ? `${Math.round((currentItemNum / totalQuestions) * 100)}% COMPLETED` : "")}'
    );

    uiComponent = uiComponent.replace(
        '((phase === "intro" ? timeLimitSeconds : remainingSeconds) / timeLimitSeconds)',
        '((phase === "intro" ? timeLimitSeconds : (phase === "practice" ? practiceRemainingSeconds : remainingSeconds)) / timeLimitSeconds)'
    );

    uiComponent = uiComponent.replace(
        '{phase === "intro" ? timeLimitSeconds : remainingSeconds}',
        '{phase === "intro" ? timeLimitSeconds : (phase === "practice" ? practiceRemainingSeconds : remainingSeconds)}'
    );

    const bottomBarStart = '<div className={`flex items-center justify-center gap-3 pt-4 pb-1 px-2 border-t border-slate-100 ${' + '\n' +
                           '              tutorialStep === 4 ? "z-[60] bg-white rounded-lg shadow-lg relative p-2" : ""' + '\n' +
                           '            }`}>';
            
    const newBottomBarStart = '<div className={`flex ${practicePhase === "completed" ? "flex-col" : "items-center"} justify-center gap-4 pt-4 pb-1 px-2 border-t border-slate-100`}>\n' +
                              '              {practicePhase === "completed" && (\n' +
                              '                <div className="flex flex-col items-center gap-4 text-center text-sm sm:text-[15px] font-medium text-slate-800 bg-white p-5 rounded-md shadow-sm border border-slate-200 w-full">\n' +
                              '                  <p>\n' +
                              '                    You completed the two practice questions.<br/><br/>\n' +
                              '                    To replay the instructions select replay.<br/>\n' +
                              '                    To continue to the actual assessment, select start\n' +
                              '                  </p>\n' +
                              '                  <div className="flex flex-col gap-2 w-full mt-2">\n' +
                              '                    <button onClick={startRealAssessment} className="w-full bg-black text-white py-2.5 rounded font-semibold tracking-wide">START</button>\n' +
                              '                    <button onClick={replayInstructions} className="w-full bg-white border border-slate-300 text-black py-2.5 rounded font-semibold tracking-wide">REPLAY</button>\n' +
                              '                  </div>\n' +
                              '                </div>\n' +
                              '              )}\n' +
                              '              \n' +
                              '              <div className={`flex items-center justify-center gap-3 ${\n' +
                              '              tutorialStep === 4 ? "z-[60] bg-white rounded-lg shadow-lg relative p-2" : ""\n' +
                              '            }`}>';

    uiComponent = uiComponent.replace(
        bottomBarStart,
        newBottomBarStart
    );
    
    uiComponent = uiComponent.replace(
        '            </p>\n          </div>\n        </div>\n      </main>\n    </div>\n  );\n}',
        '            </p>\n          </div>\n          </div>\n        </div>\n      </main>\n    </div>\n  );\n}'
    );

    const oldPracticeBtn = '<button onClick={() => {\n' +
                           '                              setPhase("playing");\n' +
                           '                              if (onStartSession) onStartSession();\n' +
                           '                            }} className="bg-black text-white py-2.5 px-8 rounded font-semibold transition-transform active:scale-95 text-sm tracking-wide">\n' +
                           '                              PRACTICE\n' +
                           '                            </button>';
    const newPracticeBtn = '<button onClick={() => {\n' +
                           '                              setPhase("practice");\n' +
                           '                              setPracticePhase("q1");\n' +
                           '                              setPracticeRemainingSeconds(15);\n' +
                           '                            }} className="bg-black text-white py-2.5 px-8 rounded font-semibold transition-transform active:scale-95 text-sm tracking-wide">\n' +
                           '                              PRACTICE\n' +
                           '                            </button>';
    uiComponent = uiComponent.replace(oldPracticeBtn, newPracticeBtn);

    content = content.substring(0, startIndex) + uiComponent + content.substring(endIndex);
    fs.writeFileSync(file, content);
    console.log('Done refactoring FullBubbleMockTestUI');
} else {
    console.log('Component not found');
}
