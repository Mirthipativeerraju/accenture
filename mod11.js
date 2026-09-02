const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = 'setDemoSelected(true);\n      const interval = setInterval(() => {\n        setDemoSelected((prev) => !prev);\n      }, 1000);';
const newStr = 'setDemoSelected(false);\n      const interval = setInterval(() => {\n        setDemoSelected((prev) => !prev);\n      }, 1000);';

content = content.replace(targetStr, newStr);

fs.writeFileSync(file, content);
console.log('Success mod11');
