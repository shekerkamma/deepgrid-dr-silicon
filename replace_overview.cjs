const fs = require('fs');
let content = fs.readFileSync('app/page.tsx', 'utf8');

// Find the start of overview view
const startMarker = "{view==='overview'&&<>}";
const startIdx = content.indexOf(startMarker);

if (startIdx === -1) {
  console.log('Start marker not found');
  process.exit(1);
}

console.log('Found start at:', startIdx);

// Find the closing </>} of the overview view fragment
let depth = 0;
let endIdx = -1;

let searchStart = startIdx + startMarker.length;
for (let i = searchStart; i < content.length; i++) {
  // Check for fragment open <>
  if (content[i] === '<' && content[i+1] === '>' && (i === 0 || content[i-1] !== '/')) {
    depth++;
  } 
  // Check for fragment close </>
  else if (content[i] === '<' && content[i+1] === '/' && content[i+2] === '>') {
    depth--;
    if (depth === 0) {
      endIdx = i + 3; // Include the </>
      break;
    }
  }
}

if (endIdx === -1) {
  console.log('Could not find matching end');
  process.exit(1);
}

console.log('Found section from', startIdx, 'to', endIdx);

// The closing is actually </>} not just </>
// Find the }
let finalEndIdx = endIdx;
while (finalEndIdx < content.length && content[finalEndIdx] !== '}') {
  finalEndIdx++;
}
if (finalEndIdx < content.length) {
  finalEndIdx++; // Include the }
  console.log('Final end at:', finalEndIdx);
}

const newSection = "{view==='overview'&&<>}\n  <ImprovedOverview reduced={reduced} navigate={navigate} go={go} />\n</>}";

const newContent = content.slice(0, startIdx) + newSection + content.slice(finalEndIdx);

fs.writeFileSync('app/page.tsx', newContent);
console.log('Done! Replaced section from', startIdx, 'to', finalEndIdx);