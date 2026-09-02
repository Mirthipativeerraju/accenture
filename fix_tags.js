const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

// The messed up part starts from the timer closing div.
// Currently it is:
/*
              <span className="text-lg font-bold text-neutral-900 font-mono">
                {phase === "intro" ? timeLimitSeconds : (phase === "practice" ? practiceRemainingSeconds : remainingSeconds)}
              </span>
            </div>

            {/* Instruction *\/}
            <p className="text-lg sm:text-sm text-slate-700 leading-snug text-center">
*/

// I need to wrap the timer and instruction in the flex row!

// Let's just fix it by replacing it completely.
const fixStart = '<span className="text-lg font-bold text-neutral-900 font-mono">\n                {phase === "intro" ? timeLimitSeconds : (phase === "practice" ? practiceRemainingSeconds : remainingSeconds)}\n              </span>\n            </div>';
const fixEnd = '              <span className="text-lg font-bold text-neutral-900 font-mono">\n                {phase === "intro" ? timeLimitSeconds : (phase === "practice" ? practiceRemainingSeconds : remainingSeconds)}\n              </span>\n            ';

content = content.replace(fixStart, fixEnd);

// Then, add the closing div for the inner row AFTER the paragraph.
const paraEnd = '                value\n              </span>\n            </p>';
const paraFix = '                value\n              </span>\n            </p>\n            </div>';
content = content.replace(paraEnd, paraFix);

// Finally, remove the extra </div> I added at the end.
const endTags = '            </div>\n          </div>\n        </div>\n      </main>\n    </div>\n  );\n}';
const endFix = '          </div>\n        </div>\n      </main>\n    </div>\n  );\n}';
content = content.replace(endTags, endFix);

fs.writeFileSync(file, content);
console.log('Fixed tags');
