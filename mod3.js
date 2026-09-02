const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

// The Instruction Panel currently looks something like this:
const panelStartMarker = '{/* Instruction Panel */}';
const panelEndMarker = '  )}\n\n                    {/* 3. Constrained Light Play Area */}';

let panelStartIndex = content.indexOf(panelStartMarker);
// Wait, my previous script injected: content = content.substring(0, oldPanelStart) + newPanel + '\n          ' + content.substring(oldPanelEnd);
// Let's just find where it is currently.
let oldPanelStart = content.indexOf(panelStartMarker, content.indexOf('function FullBubbleMockTestUI'));
let oldPanelEnd = content.indexOf('                    {/* 3. Constrained Light Play Area */}', oldPanelStart);
if (oldPanelEnd === -1) {
    oldPanelEnd = content.indexOf('{/* 3. Constrained Light Play Area */}', oldPanelStart);
}

if (oldPanelStart === -1 || oldPanelEnd === -1) {
    console.error('Could not find existing panel bounds');
    process.exit(1);
}

// Remove the existing panel from where it is
content = content.substring(0, oldPanelStart) + content.substring(oldPanelEnd);

// Now define the new ABSOLUTE OVERLAY panel
const newPanel = 
          '              {/* Instruction Panel Overlay */}\n' +
          '              {phase === "intro" && (\n' +
          '                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[96%] max-w-[600px] bg-white border border-slate-200 shadow-xl rounded-lg z-50 overflow-hidden pb-6">\n' +
          '                  <div className="flex items-center justify-between p-4 min-h-[100px] sm:min-h-[120px]">\n' +
          '                    {/* Left Arrow */}\n' +
          '                    <button \n' +
          '                      onClick={() => setTutorialStep((prev) => prev > 1 ? prev - 1 : 1)}\n' +
          '                      disabled={tutorialStep === 1}\n' +
          '                      className={"w-12 h-12 flex items-center justify-center shrink-0 text-slate-400 hover:text-black transition-colors " + (tutorialStep === 1 ? "invisible" : "visible")}\n' +
          '                      aria-label="Previous Instruction"\n' +
          '                    >\n' +
          '                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">\n' +
          '                        <path d="m15 18-6-6 6-6"/>\n' +
          '                      </svg>\n' +
          '                    </button>\n' +
          '\n' +
          '                    {/* Text Content */}\n' +
          '                    <div className="flex-1 flex flex-col items-center justify-center text-center px-2 sm:px-4 text-slate-800 text-[15px] sm:text-[16px] font-medium leading-relaxed">\n' +
          '                      {tutorialStep === 1 && (\n' +
          '                        <p>Select the bubbles in order from the <strong className="font-bold text-black">LOWEST</strong> to the <strong className="font-bold text-black">HIGHEST</strong> value.</p>\n' +
          '                      )}\n' +
          '                      {tutorialStep === 2 && (\n' +
          '                        <p>Select a bubble by clicking on it. Your selected bubbles will be highlighted.</p>\n' +
          '                      )}\n' +
          '                      {tutorialStep === 3 && (\n' +
          '                        <p>You can deselect a bubble by clicking on it again. However, you will automatically advance to the next question after the third bubble is selected.</p>\n' +
          '                      )}\n' +
          '                      {tutorialStep === 4 && (\n' +
          '                        <p>Each set of bubbles has a time limit, indicated by the timer at the bottom of the screen.</p>\n' +
          '                      )}\n' +
          '                      {tutorialStep === 5 && (\n' +
          '                        <div className="flex flex-col items-center gap-4">\n' +
          '                          <p>\n' +
          '                            The tutorial phase is now complete.<br/><br/>\n' +
          '                            The actual assessment will contain 28 questions. You should take this opportunity to prepare before starting.\n' +
          '                          </p>\n' +
          '                          <button onClick={() => {\n' +
          '                            setPhase("playing");\n' +
          '                            if (onStartSession) onStartSession();\n' +
          '                          }} className="bg-black text-white py-2.5 px-8 rounded font-semibold transition-transform active:scale-95 text-sm">\n' +
          '                            START\n' +
          '                          </button>\n' +
          '                        </div>\n' +
          '                      )}\n' +
          '                    </div>\n' +
          '\n' +
          '                    {/* Right Arrow */}\n' +
          '                    <button \n' +
          '                      onClick={() => setTutorialStep((prev) => prev < 5 ? prev + 1 : 5)}\n' +
          '                      disabled={tutorialStep === 5}\n' +
          '                      className={"w-12 h-12 flex items-center justify-center shrink-0 text-slate-400 hover:text-black transition-colors " + (tutorialStep === 5 ? "invisible" : "visible")}\n' +
          '                      aria-label="Next Instruction"\n' +
          '                    >\n' +
          '                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">\n' +
          '                        <path d="m9 18 6-6-6-6"/>\n' +
          '                      </svg>\n' +
          '                    </button>\n' +
          '                  </div>\n' +
          '                  \n' +
          '                  {/* Progress Dots */}\n' +
          '                  <div className="absolute bottom-2 left-0 right-0 flex justify-center items-center gap-2">\n' +
          '                    {[1, 2, 3, 4, 5].map((step) => (\n' +
          '                      <div \n' +
          '                        key={step} \n' +
          '                        className={"rounded-full transition-colors " + (tutorialStep === step ? "w-1.5 h-1.5 bg-black" : "w-1.5 h-1.5 bg-transparent border border-slate-400")} \n' +
          '                      />\n' +
          '                    ))}\n' +
          '                  </div>\n' +
          '                </div>\n' +
          '              )}\n\n';

const canvasTarget = '{/* Bubble Play Area Canvas with Upward Exit Animation */}';
const targetIndex = content.indexOf(canvasTarget, content.indexOf('function FullBubbleMockTestUI'));
const insertionPoint = content.indexOf('<div', targetIndex);
const insertAfter = content.indexOf('>', insertionPoint) + 1;

content = content.substring(0, insertAfter) + '\n' + newPanel + content.substring(insertAfter);

fs.writeFileSync(file, content);
console.log('Success mod3');
