const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const fullFuncStart = content.indexOf('function FullBubbleMockTestUI');

const oldStep5 = `{tutorialStep === 5 && (
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

const newStep5 = `{tutorialStep === 5 && (
                          <div className="flex flex-col items-center gap-4">
                            <p className="text-center">
                              The practice exercise will have 2 questions in total.<br/>
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

let targetIndex = content.indexOf(oldStep5, fullFuncStart);
if (targetIndex !== -1) {
    content = content.substring(0, targetIndex) + newStep5 + content.substring(targetIndex + oldStep5.length);
    fs.writeFileSync(file, content);
    console.log('Successfully updated Instruction 5');
} else {
    console.log('Could not find Instruction 5 string.');
    // fallback logic just in case whitespace is different
    const match = content.match(/\{tutorialStep === 5 && \([\s\S]*?START[\s\S]*?<\/button>\s*<\/div>\s*\)\}/);
    if (match && match.index > fullFuncStart) {
        content = content.replace(match[0], newStep5);
        fs.writeFileSync(file, content);
        console.log('Successfully updated Instruction 5 via regex fallback');
    } else {
        console.log('Fallback regex failed too.');
    }
}
