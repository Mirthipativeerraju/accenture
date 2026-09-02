const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const startTarget = '          {/* 4. Bottom Timer & Instruction Bar */}';
const endTarget = 'function FullMockTestUI({';

const startIndex = content.indexOf(startTarget);
const endIndex = content.indexOf(endTarget);

if (startIndex !== -1 && endIndex !== -1) {
    let bottomSection = content.substring(startIndex, endIndex);

    const newBottomSection = `          {/* 4. Bottom Timer & Instruction Bar */}
          <div className="flex items-center justify-center gap-3 pt-4 pb-1 px-2 border-t border-slate-100">

            {/* Timer */}
            <div className={\`relative flex items-center justify-center w-14 h-14 shrink-0 \${phase === "intro" && tutorialStep === 4 ? "z-[60] bg-white rounded-full ring-4 ring-white shadow-[0_0_20px_rgba(255,255,255,0.6)]" : ""}\`}>
              <svg
                className="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 36 36"
                aria-hidden="true"
              >
                <path
                  className="text-slate-200"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />

                <path
                  className="text-neutral-900 transition-all duration-1000 ease-linear"
                  strokeDasharray={\`\${(
                    ((phase === "intro" ? timeLimitSeconds : (phase === "practice" ? practiceRemainingSeconds : remainingSeconds)) / timeLimitSeconds) *
                    100
                  ).toFixed(2)}, 100\`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>

              <span className="text-lg font-bold text-neutral-900 font-mono">
                {phase === "intro" ? timeLimitSeconds : (phase === "practice" ? practiceRemainingSeconds : remainingSeconds)}
              </span>
            </div>

            {/* Instruction */}
            {practicePhase === "completed" ? (
              <div className="flex flex-col gap-3">
                <p className="text-lg sm:text-sm text-slate-700 leading-snug text-center">
                  You completed the two practice questions.<br/><br/>
                  To replay the instructions select replay.<br/>
                  To continue to the actual assessment, select start
                </p>
                <div className="flex flex-col gap-2 w-full mt-2">
                  <button onClick={startRealAssessment} className="w-full bg-black text-white py-2 rounded font-semibold text-sm">START</button>
                  <button onClick={replayInstructions} className="w-full bg-white border border-slate-300 text-black py-2 rounded font-semibold text-sm">REPLAY</button>
                </div>
              </div>
            ) : (
              <p className="text-lg sm:text-sm text-slate-700 leading-snug text-center">
                <span className="block">
                  Select the bubbles in order from the
                </span>
                <span className="block">
                  <strong className="font-bold text-neutral-900">
                    LOWEST
                  </strong>{" "}
                  value to{" "}
                  <strong className="font-bold text-neutral-900">
                    HIGHEST
                  </strong>{" "}
                  value
                </span>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


// -----------------------------------------------------------------------------
// Full Mock Test UI (EXPERIMENTAL & SAFE TO MODIFY)
// Isolated developmental copy of Full Challenge UI for experimentation.
// -----------------------------------------------------------------------------

`;

    content = content.substring(0, startIndex) + newBottomSection + content.substring(endIndex + endTarget.length);
    fs.writeFileSync(file, content);
    console.log('Fixed bottom section layout perfectly!');
} else {
    console.log('Could not find boundaries');
}
