const fs = require('fs');
const file = 'src/components/game/bubble-math/BubbleMathGame.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    '// Isolated developmental copy of Full Challenge UI for experimentation.\n// -----------------------------------------------------------------------------\n\n\n  currentSession,',
    '// Isolated developmental copy of Full Challenge UI for experimentation.\n// -----------------------------------------------------------------------------\n\nfunction FullMockTestUI({\n  currentSession,'
);
fs.writeFileSync(file, content);
console.log('Fixed function declaration');
