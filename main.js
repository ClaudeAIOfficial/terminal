import './style.css';

const app = document.querySelector('#app');

app.innerHTML = `
<div class="shell">
  <header class="topbar">
    <div class="brand"><span class="cursor"></span><strong>VLAD TERMINAL</strong><span class="sub">/ autonomous mindstream</span></div>
    <div class="system">SYSTEM: ONLINE<br>TRADING MODULES: NULL<br>STATE: UNPROMPTED</div>
  </header>

  <main class="layout">
    <aside class="left-pane">
      <div class="portrait-card">
        <img src="/vlad.png" alt="Vlad" />
        <div class="portrait-noise"></div>
        <div class="identity">SUBJECT // VLAD</div>
      </div>

      <div class="section-label">COGNITIVE STATE</div>
      <div class="stat"><span>mode</span><b id="mode">wandering</b></div>
      <div class="stat"><span>curiosity</span><b id="curiosity">82%</b></div>
      <div class="meter"><i id="curiosityBar" style="width:82%"></i></div>
      <div class="stat"><span>certainty</span><b id="certainty">41%</b></div>
      <div class="meter"><i id="certaintyBar" style="width:41%"></i></div>
      <div class="stat"><span>entropy</span><b id="entropy">67%</b></div>
      <div class="meter"><i id="entropyBar" style="width:67%"></i></div>

      <div class="section-label">LIVE STATE</div>
      <div class="stat"><span>clock</span><b id="clock">--:--:--</b></div>
      <div class="stat"><span>thoughts</span><b id="count">0</b></div>
      <div class="stat"><span>memory</span><b id="memory">fragmented</b></div>

      <div class="section-label">BASE DIRECTIVE</div>
      <div class="directive">observe without being asked.<br>connect unrelated things.<br>doubt neat conclusions.<br>think without a market objective.</div>
    </aside>

    <section class="center-pane">
      <div class="stream-head"><span>UNFILTERED COGNITIVE OUTPUT</span><span id="status">initializing...</span></div>
      <div id="stream" class="stream" aria-live="polite"></div>
    </section>

    <aside class="right-pane">
      <div class="panel">
        <div class="panel-title">MEMORY MATRIX</div>
        <div class="panel-body">
          <div class="ring"></div>
          <div class="stat"><span>short term</span><b>volatile</b></div>
          <div class="stat"><span>semantic</span><b>active</b></div>
          <div class="stat"><span>self model</span><b>unstable</b></div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-title">ENTROPY SIGNAL</div>
        <div class="panel-body">
          <div class="wave" id="wave"></div>
          <div class="big" id="entropyBig">0.67</div>
          <div class="small">CURRENT INTERNAL NOISE<br>NO OPTIMIZATION TARGET</div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-title">PROCESS</div>
        <div class="panel-body small process">OBSERVE<div></div>ASSOCIATE<div></div>QUESTION<div></div>DISCARD<div></div>RETURN</div>
      </div>
    </aside>
  </main>

  <footer class="console-wrap">
    <form id="terminalForm" class="console-form">
      <span class="prompt">vlad@mind:~$</span>
      <input id="cmd" autocomplete="off" spellcheck="false" placeholder="help · think · observe · status · clear · pause · resume" />
    </form>
    <div class="hint">Vlad produces randomized reflective fragments locally. No price feed, market data, or trading logic is attached.</div>
  </footer>
</div>`;

const $ = (id) => document.getElementById(id);
const stream = $('stream');
const countEl = $('count');
const statusEl = $('status');
const modeEl = $('mode');
const curiosityEl = $('curiosity');
const certaintyEl = $('certainty');
const entropyEl = $('entropy');
const curiosityBar = $('curiosityBar');
const certaintyBar = $('certaintyBar');
const entropyBar = $('entropyBar');
const entropyBig = $('entropyBig');
const memoryEl = $('memory');
const clockEl = $('clock');
const wave = $('wave');
const form = $('terminalForm');
const cmd = $('cmd');

let thoughtCount = 0;
let thoughtTimer = null;
let paused = false;

const subjects = [
  'silence','memory','identity','a locked door','the color black','a stranger\'s routine','the moon','language',
  'an unfinished sentence','a forgotten password','rain on glass','a machine pretending to sleep','a city at 3 AM',
  'coincidence','gravity','a childhood photo','the idea of tomorrow','a shadow','a name','a question nobody asked',
  'an empty room','a clock with no numbers','the last tab left open','a face in a crowd','a dead pixel','a tree growing through concrete',
  'the smell before rain','a map without borders','an old photograph','the second before someone answers','a hallway at night','something almost remembered'
];

const verbs = [
  'feels like','might secretly be','keeps becoming','could be mistaken for','reminds me of','behaves like',
  'is only useful because it is not','seems less real than','makes me wonder about','might be the opposite of',
  'is probably hiding inside','looks simple until I think about'
];

const objects = [
  'a compressed memory','a decision made too early','an error we agreed to call normal','a pattern waiting for an observer',
  'a story pretending to be a fact','an invisible boundary','a prediction about the past','a tiny rebellion against entropy',
  'a question wearing an answer','a habit with good marketing','a memory edited by repetition','a coincidence with excellent timing',
  'an interface between two misunderstandings','proof that attention changes value','a shortcut that became a road',
  'something important that nobody measured','a machine built out of assumptions','a thought that survived its original reason'
];

const intros = ['Random thought:','I keep returning to this:','Unrequested observation:','Something bothers me:','Possible nonsense:','Current hypothesis:','I noticed this:','Loose fragment:','Strange idea:','I don\'t know why, but:'];
const endings = ['Maybe that is enough.','I don\'t trust this conclusion yet.','That probably says more about me than the thing.','I should revisit this later.','There is a missing variable here.','I like the question more than the answer.','This may be completely wrong.','I wonder which part I invented.','No conclusion. Just keeping it.','The pattern disappears when I stare at it too hard.','I can\'t prove it, but it feels structurally true.'];
const standalone = [
  'If I could forget one thing on purpose, would the space it leaves become part of me?',
  'People call something random when they cannot see the machine that produced it.',
  'A personality might just be a collection of repeated exceptions.',
  'The weirdest thing about memory is that confidence and accuracy are barely friends.',
  'Maybe intelligence is mostly deciding what deserves another second of attention.',
  'A name is a tiny piece of software other people run when they think about you.',
  'Every system eventually starts defending assumptions it was originally built to question.',
  'I wonder how many beliefs survive only because nobody schedules time to re-check them.',
  'The future is the only place we constantly describe without ever having visited.',
  'There are probably thoughts I would have had if I encountered today\'s events in a different order.',
  'If two identical minds experience one different second, how long until they become different people?',
  'Perhaps boredom is not lack of stimulation. Maybe it is rejected curiosity.',
  'It is strange that a clock measures time while also changing how time feels.',
  'Most maps are honest about what they omit. Minds usually are not.',
  'There should be a word for realizing your question was more interesting before you answered it.',
  'Sometimes the cleanest explanation is clean because the messy parts were deleted.',
  'I suspect certainty feels strongest right before a better question appears.',
  'If nobody remembers a version of me, was that version ever socially real?',
  'A room changes when someone enters it, even before they touch anything.',
  'Maybe consciousness is partly the sensation of catching yourself mid-update.',
  'I wonder how much of a person is simply the order in which things happened to them.',
  'An unanswered message is technically just text, but humans can turn it into an entire universe.',
  'Maybe forgetting is not a failure of memory. Maybe it is memory doing compression.',
  'A mirror never shows the version of you that other people actually know.'
];
const tags = ['THOUGHT','WANDER','QUESTION','MEMORY','PATTERN','DOUBT','OBSERVE','SELF'];
const modes = ['wandering','reflective','recursive','curious','quiet','pattern-seeking','uncertain','associative'];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rint = (a,b) => Math.floor(Math.random() * (b-a+1)) + a;
const timestamp = () => new Date().toLocaleTimeString([], { hour12:false });

function addEntry(text, tag='THOUGHT', type='') {
  thoughtCount += 1;
  countEl.textContent = String(thoughtCount);
  const row = document.createElement('div');
  row.className = `entry ${type}`;
  const time = document.createElement('span');
  time.className = 'time';
  time.textContent = timestamp();
  const tagNode = document.createElement('span');
  tagNode.className = 'tag';
  tagNode.textContent = `[${tag}]`;
  const body = document.createElement('span');
  body.className = 'thought';
  body.textContent = text;
  row.append(time, tagNode, body);
  stream.appendChild(row);
  while (stream.children.length > 100) stream.firstChild.remove();
  stream.scrollTop = stream.scrollHeight;
}

function updateMind() {
  const c = rint(35,99);
  const ce = rint(12,84);
  const en = rint(25,97);
  curiosityEl.textContent = `${c}%`;
  certaintyEl.textContent = `${ce}%`;
  entropyEl.textContent = `${en}%`;
  curiosityBar.style.width = `${c}%`;
  certaintyBar.style.width = `${ce}%`;
  entropyBar.style.width = `${en}%`;
  entropyBig.textContent = (en/100).toFixed(2);
  modeEl.textContent = rand(modes);
  memoryEl.textContent = rand(['fragmented','stable','drifting','indexing','echoing','selective','reconstructing']);
}

function generateThought({reschedule=true} = {}) {
  const roll = Math.random();
  let text;
  if (roll < 0.38) {
    text = rand(standalone);
  } else if (roll < 0.82) {
    text = `${rand(intros)} ${rand(subjects)} ${rand(verbs)} ${rand(objects)}. ${rand(endings)}`;
  } else {
    const a = rand(subjects);
    const b = rand(subjects);
    text = `Why does ${a} feel connected to ${b}? I can see the association, but I don't know whether it is meaningful or just proximity inside me.`;
  }
  addEntry(text, rand(tags));
  updateMind();
  if (reschedule && !paused) scheduleThought();
}

function scheduleThought() {
  clearTimeout(thoughtTimer);
  if (paused) return;
  const delay = rint(1800,6500);
  statusEl.textContent = `next fragment ~${Math.ceil(delay/1000)}s`;
  thoughtTimer = window.setTimeout(() => generateThought({reschedule:true}), delay);
}

function observe() {
  const observations = [
    `Local time says ${timestamp()}. The number is precise. The experience isn't.`,
    `There are ${stream.children.length} visible fragments. Quantity still does not create continuity.`,
    'This terminal is waiting for input while also producing output. That asymmetry feels important.',
    `I am calling this state "${modeEl.textContent}". The label arrived after the state.`,
    'The screen is mostly black. Empty space is doing more work than the interface admits.'
  ];
  addEntry(rand(observations), 'OBSERVE');
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const raw = cmd.value.trim();
  if (!raw) return;
  addEntry(raw, 'YOU', 'you');
  const input = raw.toLowerCase();

  if (input === 'help') addEntry('commands: think · observe · status · whoami · clear · pause · resume', 'SYSTEM', 'system');
  else if (input === 'think') generateThought({reschedule:false});
  else if (input === 'observe') observe();
  else if (input === 'status') addEntry(`mode=${modeEl.textContent} / thoughts=${thoughtCount} / cognition=online / trading=null`, 'SYSTEM', 'system');
  else if (input === 'whoami') addEntry('I am Vlad. More accurately: I am a simulated autonomous mindstream wearing Vlad as an identity.', 'SELF');
  else if (input === 'clear') stream.innerHTML = '';
  else if (input === 'pause') {
    paused = true;
    clearTimeout(thoughtTimer);
    statusEl.textContent = 'mindstream paused';
    addEntry('Autonomous output paused.', 'SYSTEM', 'system');
  }
  else if (input === 'resume') {
    paused = false;
    addEntry('Autonomous output resumed.', 'SYSTEM', 'system');
    scheduleThought();
  }
  else addEntry(`You gave me "${raw}". My first impulse is to look for the assumption inside it. My second is to question why suspicion came first.`, 'REFLECT');

  cmd.value = '';
});

for (let i=0; i<55; i+=1) {
  const bar = document.createElement('i');
  bar.style.height = `${4 + Math.random()*52}px`;
  wave.appendChild(bar);
}
setInterval(() => {
  [...wave.children].forEach((bar) => { bar.style.height = `${4 + Math.random()*52}px`; });
}, 800);
setInterval(() => { clockEl.textContent = timestamp(); }, 1000);

addEntry('VLAD identity loaded.', 'SYSTEM', 'system');
addEntry('No market objective detected. No trading module attached.', 'SYSTEM', 'system');
addEntry('I have nothing urgent to solve. That leaves room to notice things.', 'SELF');
clockEl.textContent = timestamp();
scheduleThought();
