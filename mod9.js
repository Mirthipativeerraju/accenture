const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const fullFuncStart = content.indexOf('function FullBubbleMockTestUI');

const targetStr = '  }, [currentSession.currentItemIndex]);';
const insertIndex = content.indexOf(targetStr, fullFuncStart) + targetStr.length;

if (insertIndex === -1 + targetStr.length) {
    console.error("Could not find targetStr");
    process.exit(1);
}

const newEffect = '\n\n' +
'  useEffect(() => {\n' +
'    if (phase === "intro" && tutorialStep === 3) {\n' +
'      setDemoSelected(true);\n' +
'      const interval = setInterval(() => {\n' +
'        setDemoSelected((prev) => !prev);\n' +
'      }, 1000);\n' +
'      return () => {\n' +
'        clearInterval(interval);\n' +
'        setDemoSelected(false);\n' +
'      };\n' +
'    } else {\n' +
'      setDemoSelected(false);\n' +
'    }\n' +
'  }, [phase, tutorialStep]);\n';

content = content.substring(0, insertIndex) + newEffect + content.substring(insertIndex);

fs.writeFileSync(file, content);
console.log('Success mod9');
