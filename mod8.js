const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const fullFuncStart = content.indexOf('function FullBubbleMockTestUI');

// Inject state
const targetState = 'const [tutorialStep, setTutorialStep] = useState(1);';
const stateIndex = content.indexOf(targetState, fullFuncStart);
if (stateIndex === -1) {
    console.error("Could not find tutorialStep state.");
    process.exit(1);
}
const newStateCode = targetState + '\n  const [demoSelected, setDemoSelected] = useState(false);';
content = content.substring(0, stateIndex) + newStateCode + content.substring(stateIndex + targetState.length);

fs.writeFileSync(file, content);
console.log('Success mod8 - state injected');
