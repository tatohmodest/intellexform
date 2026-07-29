/**
 * Generates Computer Architecture & Organization tutorial lesson files
 * aligned to CSE 203 curriculum (SIU / InTelleX).
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const root = join(process.cwd(), 'lib/tutorials/computer-architecture');
mkdirSync(root, { recursive: true });

function lesson(partial) {
  return partial;
}

function blocks(...parts) {
  return parts.flat();
}

const p = (text) => ({ type: 'p', text });
const h2 = (text) => ({ type: 'h2', text });
const h3 = (text) => ({ type: 'h3', text });
const ul = (items) => ({ type: 'ul', items });
const ol = (items) => ({ type: 'ol', items });
const code = (codeText, title, language = 'text') => ({
  type: 'code',
  code: codeText,
  title,
  language,
});
const note = (text) => ({ type: 'note', text });
const tip = (text) => ({ type: 'tip', text });
const warning = (text) => ({ type: 'warning', text });
const tryIt = (text) => ({ type: 'try', text });
const keypoints = (items) => ({ type: 'keypoints', items });
const table = (headers, rows) => ({ type: 'table', headers, rows });

const beginnerLessons = [
  lesson({
    slug: 'welcome-to-computer-architecture',
    title: 'Welcome to Computer Architecture',
    description:
      'Meet CSE 203 - why hardware DNA matters for every software engineer, and how this InTelleX path is organized.',
    level: 'beginner',
    section: 'Course Orientation',
    order: 1,
    minutes: 12,
    content: blocks(
      p('Computer Architecture and Organization (CSE 203) teaches the structural and logical frameworks that turn high-level code into electronic execution. At InTelleX, this path follows a university-grade curriculum: Instruction Set Architecture, ALU design, single-cycle and pipelined datapaths, hazards, caches, virtual memory, I/O, and multicore systems.'),
      p('The goal is not memorizing jargon. You will learn to think in clock cycles, instruction-level parallelism, and memory locality - so you can explain why a program is slow, and what hardware choices set the performance ceiling.'),
      h2('What you will master'),
      ul([
        'Translate high-level constructs into RISC-V / MIPS-style assembly',
        'Design and reason about ALUs, registers, and datapaths',
        'Model a 5-stage pipeline and resolve hazards',
        'Analyze cache mapping and Average Memory Access Time (AMAT)',
        'Explain DMA, interrupts, virtual memory, and multicore coherence',
      ]),
      h2('How this tutorial is structured'),
      table(
        ['Level', 'Focus', 'Curriculum weeks'],
        [
          ['Beginner', 'Abstraction, ISA, ALU, single-cycle datapath', 'Weeks 1-4'],
          ['Intermediate', 'Pipelines, hazards, caches', 'Weeks 5-8'],
          ['Advanced', 'VM, I/O, DMA, multicore, synthesis', 'Weeks 9-10'],
        ],
      ),
      note('Required textbook mindset: Computer Organization and Design (Patterson & Hennessy), RISC-V or MIPS edition. Tools: Venus (RISC-V) or MARS (MIPS), plus Logisim-Evolution for digital logic.'),
      tip('Professionalism here means architectural optimization. A design that wastes clock cycles or ignores hazards fails the engineering standard - even if it "works."'),
      tryIt('Write one sentence: "I want to understand how my code becomes electrical signals on silicon." Keep it as your north star for this course.'),
      keypoints([
        'Architecture bridges abstract software and physical hardware.',
        'This path mirrors CSE 203 across ISA, datapath, pipeline, memory, and multicore.',
        'You will reason in cycles, hazards, and locality - not only in source code.',
        'Tools: Venus/MARS for assembly, Logisim for digital logic.',
      ]),
    ),
  }),
  lesson({
    slug: 'course-map-and-tools',
    title: 'Course Map, Labs & Tools',
    description:
      'Set up your mental map of CSE 203 activities: Assembly Duel, Bottleneck Audit, Hardware Visualization, and Clock-Cycle Stress Test.',
    level: 'beginner',
    section: 'Course Orientation',
    order: 2,
    minutes: 11,
    content: blocks(
      p('CSE 203 uses active learning. Every week you practice tracing, measuring, and redesigning - not only reading theory.'),
      h2('Signature activities'),
      ul([
        'Assembly Duel - manually trace registers and memory without an IDE',
        'Bottleneck Audit - find pipeline stalls in compiled assembly and reschedule instructions',
        'Hardware Visualization Labs - follow data through datapath diagrams / Logisim',
        'Clock-Cycle Stress Test - feed complex instruction streams into a datapath and find where hazards break timing',
      ]),
      h2('Recommended toolchain'),
      code(
        `Venus (RISC-V) - browser/desktop assembler & simulator
MARS (MIPS) - classic MIPS assembler & runtime
Logisim-Evol. - combinational & sequential circuit design
Pencil + paper - still the best tool for pipeline timing charts`,
        'Tool stack',
        'text',
      ),
      h2('Assessment mindset (for context)'),
      table(
        ['Component', 'Weight'],
        [
          ['Lab participation & punctuality', '10%'],
          ['Assignments & architectural reports', '20%'],
          ['Mid-term exam', '30%'],
          ['Final exam', '40%'],
        ],
      ),
      note('On InTelleX you learn the same content self-paced. Treat each "Project Focus" lesson as a portfolio artifact.'),
      tryIt('Install or open Venus (or MARS). Run a 3-instruction program that adds two numbers into a register. Confirm you can single-step.'),
      keypoints([
        'Active labs: Assembly Duel, Bottleneck Audit, visualization, stress tests.',
        'Venus/MARS + Logisim cover assembly and digital logic practice.',
        'Project lessons become your hardware-thinking portfolio.',
      ]),
    ),
  }),
  lesson({
    slug: 'von-neumann-vs-harvard',
    title: 'Von Neumann vs Harvard Architecture',
    description:
      'Compare the classic stored-program model with Harvard separation of instruction and data memory.',
    level: 'beginner',
    section: 'Architecture of Abstraction',
    order: 3,
    minutes: 12,
    content: blocks(
      p('Every modern computer is built around a small set of functional components: processor (CPU), memory, and I/O - connected by buses. Two foundational organization models are Von Neumann and Harvard.'),
      h2('Von Neumann (stored-program)'),
      p('Instructions and data share the same memory space and typically the same bus path to the CPU. This is flexible and simple, but contention between instruction fetch and data access can limit bandwidth - the classic "Von Neumann bottleneck."'),
      code(
        `CPU  <──bus──>  Unified Memory
                 [instructions + data]`,
        'Von Neumann sketch',
        'text',
      ),
      h2('Harvard architecture'),
      p('Instructions and data live in separate memories with separate pathways. Embedded DSPs and many microcontrollers use Harvard (or modified Harvard) so instruction fetch and data access can happen in parallel.'),
      table(
        ['Aspect', 'Von Neumann', 'Harvard'],
        [
          ['Memory spaces', 'Unified', 'Separate I & D'],
          ['Bus contention', 'Higher risk', 'Lower for fetch vs data'],
          ['Flexibility', 'High', 'More rigid'],
          ['Common in', 'General-purpose CPUs (conceptually)', 'DSPs, MCUs, caches as modified Harvard'],
        ],
      ),
      tip('Modern CPUs look Von Neumann at the ISA level but often use Harvard-style split caches (I-cache / D-cache) - a modified Harvard design.'),
      tryIt('Draw both organizations on paper. Label where a load instruction would travel in each model.'),
      keypoints([
        'Von Neumann stores instructions and data in one address space.',
        'Harvard separates instruction and data memories/paths.',
        'Real CPUs often blend both ideas with split caches.',
      ]),
    ),
  }),
  lesson({
    slug: 'levels-of-program-abstraction',
    title: 'Levels of Program Abstraction',
    description:
      'Walk the stack from problem statement through HLL, assembly, machine code, microarchitecture, and digital logic.',
    level: 'beginner',
    section: 'Architecture of Abstraction',
    order: 4,
    minutes: 11,
    content: blocks(
      p('Software engineers usually live at high levels of abstraction. Architects must see every layer beneath - because each layer hides costs that show up as CPI, stalls, and energy.'),
      h2('The abstraction tower'),
      ol([
        'Problem / algorithm',
        'High-level language (C, Python, …)',
        'Assembly language (ISA interface)',
        'Machine code (binary encodings)',
        'Microarchitecture (pipelines, ALUs, caches)',
        'Digital logic (gates, flip-flops)',
        'Devices & circuits (transistors)',
      ]),
      code(
        `int sum = a + b;          // HLL
add  x5, x10, x11         // assembly (RISC-V style)
0x00b505b3                // machine word (example encoding)
  → ALU add in EX stage   // microarchitecture
  → XOR/AND gate network  // logic`,
        'Same idea, five layers',
        'text',
      ),
      note('The ISA is the contract between software and hardware. Compilers target the ISA; microarchitects implement it.'),
      tryIt('Pick a one-line C statement. Name which layers change if you switch from x86 to RISC-V.'),
      keypoints([
        'Programs exist at many abstraction layers.',
        'The ISA is the software-hardware contract.',
        'Performance bugs often hide in layers below your source code.',
      ]),
    ),
  }),
  lesson({
    slug: 'iron-law-of-performance',
    title: 'The Iron Law of Performance',
    description:
      'Master CPU time = Instruction Count × CPI × Clock Period - and what each term really means.',
    level: 'beginner',
    section: 'Architecture of Abstraction',
    order: 5,
    minutes: 13,
    content: blocks(
      p('The Iron Law of Processor Performance is the backbone of architectural reasoning. Every optimization must improve at least one factor without destroying the others.'),
      h2('The equation'),
      code(
        `CPU_time = IC × CPI × T
where
  IC  = instruction count
  CPI = average clock cycles per instruction
  T   = clock period (1 / frequency)`,
        'Iron Law',
        'text',
      ),
      h2('What moves each dial'),
      table(
        ['Factor', 'Improved by', 'Made worse by'],
        [
          ['IC', 'Better algorithms, smarter ISA', 'Verbose ISA use, poor compilers'],
          ['CPI', 'Pipelining, caches, ILP', 'Hazards, misses, stalls'],
          ['T', 'Faster technology, shorter critical path', 'Deeper logic in one cycle'],
        ],
      ),
      warning('Faster GHz does not always mean faster programs. Higher frequency with much worse CPI can lose.'),
      h2('Worked example'),
      code(
        `Program A: IC=1e9, CPI=2.0, f=2 GHz → T=0.5 ns
CPU_time = 1e9 × 2.0 × 0.5e-9 = 1.0 s

Program B: IC=1.2e9, CPI=1.2, f=2 GHz
CPU_time = 1.2e9 × 1.2 × 0.5e-9 = 0.72 s  (faster despite more instructions)`,
        'Comparing two runs',
        'text',
      ),
      tryIt('Invent two machines with different CPI and frequency. Compute which finishes a 500 million instruction program first.'),
      keypoints([
        'CPU time = IC × CPI × clock period.',
        'Architecture work targets CPI and critical path; software targets IC.',
        'Always compare using the full product, not one metric alone.',
      ]),
    ),
  }),
  lesson({
    slug: 'cpi-clock-cycles-execution-time',
    title: 'CPI, Clock Cycles & Execution Time',
    description:
      'Calculate total cycles, effective CPI for mixed instruction mixes, and wall-clock execution time.',
    level: 'beginner',
    section: 'Architecture of Abstraction',
    order: 6,
    minutes: 12,
    content: blocks(
      p('Real programs are mixes of instruction classes. Effective CPI is a weighted average over that mix.'),
      h2('Effective CPI'),
      code(
        `CPI_eff = Σ (CPI_i × fraction_i)

Example mix:
  ALU   50% @ 1 cycle
  Load  20% @ 5 cycles
  Store 10% @ 4 cycles
  Branch 20% @ 2 cycles

CPI_eff = 0.5*1 + 0.2*5 + 0.1*4 + 0.2*2 = 2.3`,
        'Weighted CPI',
        'text',
      ),
      h2('Total cycles and time'),
      ul([
        'Clock cycles = IC × CPI_eff',
        'Execution time = clock cycles × clock period',
        'Throughput ≈ frequency / CPI for sustained pipelines (idealized)',
      ]),
      tip('When you later study caches, miss penalties show up as extra cycles that inflate CPI.'),
      tryIt('A loop is 40% loads (CPI 4), 40% ALU (CPI 1), 20% branches (CPI 2). Find CPI_eff.'),
      keypoints([
        'Effective CPI is a mix-weighted average.',
        'Total cycles = IC × CPI_eff.',
        'Misses and stalls increase effective CPI.',
      ]),
    ),
  }),
  lesson({
    slug: 'architectural-profiler-lab',
    title: 'Project: The Architectural Profiler',
    description:
      'Design a lightweight profiler concept that tracks instruction mixes and graphs CPI for software blocks.',
    level: 'beginner',
    section: 'Architecture of Abstraction',
    order: 7,
    minutes: 16,
    content: blocks(
      p('Week 1 project focus: The Architectural Profiler. You will outline a tool that tracks instruction counts by class, estimates CPI, and compares blocks of code.'),
      h2('What the profiler reports'),
      ul([
        'Instruction count per basic block',
        'Mix percentages: ALU / Load / Store / Branch',
        'Estimated CPI using a simple cost model',
        'Estimated CPU time for a given clock frequency',
      ]),
      h2('Minimal data model'),
      code(
        `{
  "block": "matmul_inner",
  "ic": 1200000,
  "mix": { "alu": 0.55, "load": 0.25, "store": 0.10, "branch": 0.10 },
  "cpiModel": { "alu": 1, "load": 5, "store": 4, "branch": 2 },
  "frequencyHz": 2000000000
}`,
        'Profiler sample record (JSON)',
        'json',
      ),
      h2('Analysis you must write'),
      ol([
        'Compute CPI_eff and CPU_time for the block',
        'Identify which instruction class dominates time',
        'Propose one software change that could cut IC or improve locality',
      ]),
      tryIt('Profile (manually) a short loop: count instruction classes for 10 iterations. Fill the JSON model and compute CPI_eff.'),
      keypoints([
        'Profilers connect software structure to Iron Law metrics.',
        'Instruction mix drives effective CPI.',
        'Document assumptions in your architectural report.',
      ]),
    ),
  }),
  lesson({
    slug: 'what-is-an-isa',
    title: 'What Is an Instruction Set Architecture?',
    description:
      'Define the ISA as the hardware/software interface: operations, registers, memory model, and encodings.',
    level: 'beginner',
    section: 'Instruction Set Architecture',
    order: 8,
    minutes: 12,
    content: blocks(
      p('An Instruction Set Architecture (ISA) is the visible interface a program uses to talk to a processor. Microarchitecture can change; the ISA stays the compatibility surface.'),
      h2('What an ISA specifies'),
      ul([
        'Operations (add, load, branch, …)',
        'Data types and sizes',
        'Register set and naming',
        'Memory model and addressing',
        'Instruction encodings (binary formats)',
        'Exception / interrupt behavior (at a high level)',
      ]),
      code(
        `Software (compiler / assembly)
        │  uses
        ▼
   ┌─────────┐
   │   ISA   │  ← contract
   └─────────┘
        │  implemented by
        ▼
 Microarchitecture (pipeline, caches, …)`,
        'ISA as contract',
        'text',
      ),
      note('RISC-V and MIPS are teaching-friendly RISC ISAs used throughout this course.'),
      tryIt('List five instructions you expect every general-purpose ISA to provide.'),
      keypoints([
        'ISA is the software-visible processor interface.',
        'Same ISA can have many microarchitectures.',
        'This course emphasizes RISC-V / MIPS style ISAs.',
      ]),
    ),
  }),
  lesson({
    slug: 'risc-vs-cisc',
    title: 'RISC vs CISC Philosophies',
    description:
      'Contrast Reduced vs Complex Instruction Set designs and why modern machines borrow from both.',
    level: 'beginner',
    section: 'Instruction Set Architecture',
    order: 9,
    minutes: 12,
    content: blocks(
      p('RISC aims for simple, regular instructions that pipeline cleanly. CISC historically packed more work into each instruction to save memory and programmer effort.'),
      table(
        ['Idea', 'RISC', 'CISC'],
        [
          ['Instruction complexity', 'Simple, fixed-ish formats', 'Varied, sometimes dense'],
          ['Memory ops', 'Usually load/store only', 'Many ops may touch memory'],
          ['Pipelining', 'Easier to decode & schedule', 'Harder historically'],
          ['Examples', 'MIPS, RISC-V, ARM (RISC roots)', 'x86 legacy surface'],
        ],
      ),
      tip('Modern high-performance x86 cores translate CISC ops into RISC-like micro-ops internally - CISC outside, RISC-like inside.'),
      tryIt('Argue in three sentences why a teaching course prefers RISC for pipeline labs.'),
      keypoints([
        'RISC favors simplicity and pipeline-friendly instructions.',
        'CISC densifies work per instruction at the cost of complexity.',
        'Implementations may blur the line with micro-ops.',
      ]),
    ),
  }),
  lesson({
    slug: 'registers-and-operands',
    title: 'Registers, Operands & Calling Conventions',
    description:
      'Learn register files, operand types, and the RISC-V / MIPS calling convention essentials.',
    level: 'beginner',
    section: 'Instruction Set Architecture',
    order: 10,
    minutes: 13,
    content: blocks(
      p('Registers are the fastest storage the ISA exposes. Most ALU ops work on register operands; memory is accessed via loads and stores.'),
      h2('RISC-V register sketch (user-level)'),
      code(
        `x0  (zero) - hardwired 0
x1  (ra) - return address
x2  (sp) - stack pointer
x5-x7 / x28-x31 - temporaries (t0-t6)
x8-x9 / x18-x27 - saved (s0-s11)
x10-x17 - arguments / return (a0-a7)`,
        'Common RISC-V ABI names',
        'text',
      ),
      h2('Operand kinds'),
      ul([
        'Register - value already in the register file',
        'Immediate - constant encoded in the instruction',
        'Memory - address computed, then load/store',
      ]),
      warning('x0 is always zero. Writing to it is discarded - a useful architectural trick.'),
      tryIt('Write a 4-instruction RISC-V-style sequence that computes y = (a + b) - c using only registers.'),
      keypoints([
        'Registers dominate ALU operand access.',
        'Calling conventions assign roles (args, temps, saved, sp, ra).',
        'Immediates encode constants; memory needs load/store.',
      ]),
    ),
  }),
  lesson({
    slug: 'riscv-instruction-formats',
    title: 'RISC-V Instruction Formats',
    description:
      'Decode R-Type, I-Type, S-Type (and friends): fields, opcodes, and why formats stay regular.',
    level: 'beginner',
    section: 'Instruction Set Architecture',
    order: 11,
    minutes: 14,
    content: blocks(
      p('RISC-V keeps encodings regular so hardware decode stays simple - essential for pipelined control.'),
      h2('Core formats you must know'),
      table(
        ['Format', 'Typical use', 'Key fields'],
        [
          ['R-Type', 'reg-reg ALU (add, sub, and)', 'opcode, rd, funct3, rs1, rs2, funct7'],
          ['I-Type', 'immediates, loads, jalr', 'opcode, rd, funct3, rs1, imm'],
          ['S-Type', 'stores', 'opcode, funct3, rs1, rs2, imm (split)'],
          ['B-Type', 'branches', 'rs1, rs2, imm (PC-relative)'],
          ['U/J-Type', 'lui / auipc / jal', 'rd + large immediate'],
        ],
      ),
      code(
        `add  rd, rs1, rs2     # R-Type: rd = rs1 + rs2
addi rd, rs1, imm     # I-Type: rd = rs1 + imm
lw   rd, off(rs1)     # I-Type load
sw   rs2, off(rs1)    # S-Type store
beq  rs1, rs2, label  # B-Type branch`,
        'Assembly ↔ format mapping',
        'asm',
      ),
      note('Immediate bits are often scrambled in the encoding to keep register fields in fixed positions - a hardware-friendly choice.'),
      tryIt('For `lw x5, 8(x10)`, name the format and which register is base vs destination.'),
      keypoints([
        'R/I/S/B/U/J formats cover common RISC-V ops.',
        'Fixed field positions simplify decode hardware.',
        'Stores and branches place immediates differently than R-Type.',
      ]),
    ),
  }),
  lesson({
    slug: 'memory-addressing-modes',
    title: 'Memory Addressing Modes',
    description:
      'Understand base+offset addressing, alignment, and how addressing modes affect hardware complexity.',
    level: 'beginner',
    section: 'Instruction Set Architecture',
    order: 12,
    minutes: 11,
    content: blocks(
      p('Addressing modes describe how an instruction forms a memory address. RISC ISAs keep modes few and regular.'),
      h2('Dominant RISC mode: base + offset'),
      code(
        `address = R[rs1] + sign_extend(offset)
lw rd, offset(rs1)
sw rs2, offset(rs1)`,
        'Base+displacement',
        'asm',
      ),
      ul([
        'Register indirect - offset 0',
        'Displacement - nonzero offset (struct fields, stack slots)',
        'PC-relative - branches and some data references',
      ]),
      warning('Misaligned accesses may trap or be slow depending on the implementation. Prefer naturally aligned loads/stores.'),
      tryIt('Given `sp = 0x1000`, what address does `lw x5, 12(sp)` access?'),
      keypoints([
        'RISC memory ops mostly use base+offset.',
        'Fewer modes → simpler, faster address hardware.',
        'Alignment matters for correctness and speed.',
      ]),
    ),
  }),
  lesson({
    slug: 'translating-c-to-assembly',
    title: 'Translating C into RISC-V Assembly',
    description:
      'Compile nested loops and conditionals by hand into clean assembly with minimal redundant instructions.',
    level: 'beginner',
    section: 'Instruction Set Architecture',
    order: 13,
    minutes: 15,
    content: blocks(
      p('Hand translation builds ISA fluency. Aim for O(1) waste - no redundant loads, no dead moves.'),
      h2('Example: sum an array'),
      code(
        `// C
int sum = 0;
for (int i = 0; i < n; i++)
  sum += a[i];`,
        'Source',
        'c',
      ),
      code(
        `# a0 = &a[0], a1 = n
    li   t0, 0          # sum
    li   t1, 0          # i
loop:
    bge  t1, a1, done
    slli t2, t1, 2      # i * 4
    add  t2, a0, t2
    lw   t3, 0(t2)
    add  t0, t0, t3
    addi t1, t1, 1
    j    loop
done:
    mv   a0, t0         # return sum`,
        'RISC-V style assembly',
        'asm',
      ),
      tip('Keep induction variables in registers across the loop. Reloading them from memory every iteration is an architectural foul.'),
      tryIt('Translate `if (x < y) z = x; else z = y;` into branch-based assembly without unnecessary instructions.'),
      keypoints([
        'Map variables to registers; memory only when needed.',
        'Loops become labels + conditional branches.',
        'Eliminate redundant loads/stores for clean CPI.',
      ]),
    ),
  }),
  lesson({
    slug: 'assembly-duel-register-tracing',
    title: 'Lab: The Assembly Duel',
    description:
      'Manually trace register state and memory contents step-by-step - no emulator crutches.',
    level: 'beginner',
    section: 'Instruction Set Architecture',
    order: 14,
    minutes: 14,
    content: blocks(
      p('In the Assembly Duel you prove you can simulate the machine in your head. This skill feeds every later datapath and hazard lesson.'),
      h2('Trace table template'),
      code(
        `PC   | Instruction        | x5 | x6 | x7 | Mem notes
100  | addi x5, x0, 4     | 4  |  ? |  ? |
104  | addi x6, x0, 7     | 4  |  7 |  ? |
108  | add  x7, x5, x6    | 4  |  7 | 11 |
10C  | sw   x7, 0(x10)    | 4  |  7 | 11 | MEM[x10]=11`,
        'Register/memory trace',
        'text',
      ),
      h2('Rules of engagement'),
      ol([
        'Update only the destination the instruction defines',
        'For loads/stores, compute the effective address explicitly',
        'Branches: decide taken/not-taken before updating PC',
        'Never skip a row - silent mistakes hide here',
      ]),
      tryIt('Trace this sequence on paper starting with all regs 0, x10=0x200: addi x5,x0,3; slli x6,x5,2; add x7,x5,x6; sw x7,0(x10); lw x8,0(x10).'),
      keypoints([
        'Manual tracing builds trustworthy hardware intuition.',
        'Record PC, regs, and memory side effects each step.',
        'This is exam-critical skill for mid-term and final.',
      ]),
    ),
  }),
  lesson({
    slug: 'native-translator-project',
    title: 'Project: The Native Translator',
    description:
      'Design a lightweight disassembler that maps binary machine words to human-readable assembly.',
    level: 'beginner',
    section: 'Instruction Set Architecture',
    order: 15,
    minutes: 16,
    content: blocks(
      p('Week 2 project: The Native Translator. Given a 32-bit RISC-V word, decode fields and emit assembly text.'),
      h2('Decode pipeline'),
      ol([
        'Extract opcode (bits 6:0)',
        'Classify format (R/I/S/B/U/J)',
        'Extract rd/rs1/rs2/funct3/funct7/imm as needed',
        'Map to mnemonic via opcode+funct tables',
        'Pretty-print with ABI register names',
      ]),
      code(
        `function disassemble(word32):
  opcode = word32 & 0x7f
  if opcode == 0x33:  # OP
    funct3 = ...
    funct7 = ...
    return f"{mnem} {rd}, {rs1}, {rs2}"
  if opcode == 0x13:  # OP-IMM
    ...
  ...`,
        'Disassembler sketch',
        'text',
      ),
      note('Start with a subset: add, addi, lw, sw, beq. Expand after the subset is solid.'),
      tryIt('Hand-decode one R-Type add and one I-Type addi bitfield by bitfield. Write the assembly line.'),
      keypoints([
        'Disassembly is reverse encoding using fixed field positions.',
        'Opcode selects format; funct fields refine the mnemonic.',
        'Subset-first keeps the project testable.',
      ]),
    ),
  }),
  lesson({
    slug: 'fixed-point-and-signed-numbers',
    title: 'Fixed-Point & Signed Number Systems',
    description:
      'Represent unsigned and signed integers, two\'s complement, and overflow conditions.',
    level: 'beginner',
    section: 'ALU & Binary Logic',
    order: 16,
    minutes: 12,
    content: blocks(
      p('Before building ALUs, nail number representation. Hardware does not know "integers" - it knows bit patterns and rules.'),
      h2('Two\'s complement'),
      ul([
        'Positive numbers look like unsigned',
        'Negate by invert bits + 1',
        'Range for n bits: −2^(n−1) … 2^(n−1)−1',
      ]),
      code(
        `8-bit examples
  5  = 0000_0101
 -5  = 1111_1011
 -1  = 1111_1111
127  = 0111_1111
-128 = 1000_0000`,
        'Two\'s complement patterns',
        'text',
      ),
      warning('Overflow ≠ carry out. Signed overflow occurs when carry into the sign bit differs from carry out of the sign bit.'),
      tryIt('Show the 8-bit two\'s complement for −20. Add 20 + (−20) and confirm you get 0.'),
      keypoints([
        'Two\'s complement unifies add/sub hardware.',
        'Know the representable range for n bits.',
        'Detect signed overflow carefully.',
      ]),
    ),
  }),
  lesson({
    slug: 'binary-arithmetic-basics',
    title: 'Binary Addition, Subtraction & Logic Ops',
    description:
      'Build intuition for full adders, subtract-via-negate, AND/OR/XOR, and shifts as ALU building blocks.',
    level: 'beginner',
    section: 'ALU & Binary Logic',
    order: 17,
    minutes: 12,
    content: blocks(
      p('An ALU is a multiplexed collection of arithmetic and logic circuits. Start with the 1-bit full adder and scale up.'),
      code(
        `Full adder:
  sum   = a XOR b XOR cin
  cout  = majority(a, b, cin)

Subtraction:
  a - b = a + (~b + 1)`,
        'Adder fundamentals',
        'text',
      ),
      h2('Logic & shifts'),
      ul([
        'AND / OR / XOR - bitwise parallel gates',
        'Logical shift - fill with zeros',
        'Arithmetic shift right - sign-extend',
        'Rotate - optional; not always in base ISA',
      ]),
      tip('Shifters can be barrel shifters (fast, more hardware) or iterative (cheap, slower).'),
      tryIt('Compute 0b0110_1100 AND 0b1010_1010 and a logical shift left by 2.'),
      keypoints([
        'Full adders compose into n-bit adders.',
        'Subtraction reuses the adder with invert+cin.',
        'ALU ops are selected by control multiplexers.',
      ]),
    ),
  }),
  lesson({
    slug: 'carry-lookahead-adders',
    title: 'Carry-Lookahead Adders',
    description:
      'Design faster addition with generate/propagate signals - escape the ripple-carry bottleneck.',
    level: 'beginner',
    section: 'ALU & Binary Logic',
    order: 18,
    minutes: 14,
    content: blocks(
      p('Ripple-carry adders are simple but slow: carry may traverse every bit. Carry-lookahead (CLA) computes carries in parallel using generate and propagate.'),
      code(
        `g_i = a_i AND b_i          # generate
p_i = a_i XOR b_i          # propagate
c_{i+1} = g_i OR (p_i AND c_i)

CLA expands this into non-recursive forms
so high carries do not wait on long ripples.`,
        'Generate / propagate',
        'text',
      ),
      h2('Trade-off'),
      table(
        ['Adder', 'Speed', 'Hardware cost'],
        [
          ['Ripple-carry', 'O(n)', 'Low'],
          ['Carry-lookahead', '≈O(log n) with hierarchy', 'Higher gate count / wiring'],
        ],
      ),
      note('Week 3 activity: design an 8-bit CLA and compare critical path to ripple-carry.'),
      tryIt('For bits a=1,b=1 and a=1,b=0, compute g and p. Explain whether carry is generated or only propagated.'),
      keypoints([
        'CLA uses generate/propagate to speed carries.',
        'You trade silicon area/wiring for lower latency.',
        'Hierarchical CLA scales beyond 4-8 bits cleanly.',
      ]),
    ),
  }),
  lesson({
    slug: 'multipliers-wallace-tree',
    title: 'Multipliers & Wallace Trees',
    description:
      'See how array multipliers and Wallace trees compress partial products for high-speed multiply.',
    level: 'beginner',
    section: 'ALU & Binary Logic',
    order: 19,
    minutes: 13,
    content: blocks(
      p('Multiplication forms partial products, then sums them. Naive array multipliers are regular; Wallace trees reduce critical path by compressing columns with CSA (carry-save adders).'),
      h2('Mental model'),
      ol([
        'Form partial products (AND of multiplicand by each multiplier bit)',
        'Reduce columns with half/full adders (Wallace) or arrays',
        'Final CPA (carry-propagate adder) produces the product',
      ]),
      tip('In processors, multiplies may take multiple pipeline cycles or use dedicated multiply units.'),
      tryIt('On paper, multiply 6 × 5 in binary showing partial products. Count how many rows you add.'),
      keypoints([
        'Multiply = partial products + reduction + final add.',
        'Wallace trees target shorter critical paths.',
        'Hardware cost rises quickly with operand width.',
      ]),
    ),
  }),
  lesson({
    slug: 'ieee-754-floating-point',
    title: 'IEEE 754 Floating-Point Arithmetic',
    description:
      'Decode sign, exponent, mantissa; normalize; and handle corner cases that break naive intuition.',
    level: 'beginner',
    section: 'ALU & Binary Logic',
    order: 20,
    minutes: 15,
    content: blocks(
      p('Floating-point approximates real numbers with sign, biased exponent, and fraction. IEEE 754 is the universal contract.'),
      h2('Binary32 layout'),
      code(
        `1 sign | 8 exponent (bias 127) | 23 fraction
value ≈ (-1)^s × 1.frac × 2^(exp-bias)   # normals
subnormals, ±inf, NaN are special cases`,
        'IEEE 754 single',
        'text',
      ),
      h2('Corner cases to trace'),
      ul([
        'Overflow → infinity',
        'Underflow → subnormal or zero',
        'NaN propagation from invalid ops',
        'Rounding modes (round-to-nearest-even default)',
      ]),
      warning('Floating-point addition is not associative. Architecture and compilers must respect that.'),
      tryIt('Decode the sign/exponent/fraction story for 1.0 and 0.5 in binary32 (conceptually).'),
      keypoints([
        'IEEE 754 defines binary floating formats and specials.',
        'Normalization and rounding are part of correct FP ALUs.',
        'Never assume FP ops behave like exact real arithmetic.',
      ]),
    ),
  }),
  lesson({
    slug: 'custom-alu-project',
    title: 'Project: The Custom ALU',
    description:
      'Specify a simulated ALU supporting arithmetic, logic, and shifts with clear control encodings.',
    level: 'beginner',
    section: 'ALU & Binary Logic',
    order: 21,
    minutes: 18,
    content: blocks(
      p('Week 3 project: The Custom ALU. Implement (in Logisim, HDL, or a software model) an ALU with a documented control interface.'),
      h2('Required operations'),
      ul(['ADD', 'SUB', 'AND', 'OR', 'XOR', 'SLT', 'SLL', 'SRL', 'SRA']),
      h2('Control sketch'),
      code(
        `ALUControl | Result
0000       | A AND B
0001       | A OR  B
0010       | A + B
0110       | A - B
0111       | SLT
1100       | NOR (optional)`,
        'Example ALU control map',
        'text',
      ),
      h2('Report requirements'),
      ol([
        'Block diagram of muxing and adder path',
        'Critical-path discussion (what limits clock if single-cycle?)',
        'Test vectors proving each op, including overflow flags if implemented',
      ]),
      tryIt('Write 8 test vectors (A, B, control → expected). Include at least one signed overflow case for ADD.'),
      keypoints([
        'ALU = ops + multiplexer + flags.',
        'Document control encodings like a hardware API.',
        'Tests are part of architectural professionalism.',
      ]),
    ),
  }),
  lesson({
    slug: 'datapath-elements',
    title: 'Datapath Elements',
    description:
      'Identify PC, instruction memory, register file, ALU, data memory, and the muxes that steer them.',
    level: 'beginner',
    section: 'Single-Cycle Datapath',
    order: 22,
    minutes: 12,
    content: blocks(
      p('A datapath is the set of functional units and wires that move and transform instruction data. Control tells it what to do each cycle.'),
      h2('Core elements'),
      ul([
        'Program Counter (PC)',
        'Instruction memory',
        'Register file (2 read, 1 write typically)',
        'ALU (+ maybe shifter)',
        'Data memory',
        'Sign/immediate extender',
        'Multiplexers for ALU src, writeback, next PC',
      ]),
      code(
        `PC → Imem → fields
           ↘ RegFile → ALU → Dmem → writeback mux → RegFile
           ↘ ImmGen ↗`,
        'Single-cycle dataflow sketch',
        'text',
      ),
      tryIt('On a blank page, place the seven elements and draw arrows for a `lw` instruction path.'),
      keypoints([
        'Datapath elements are shared resources steered by muxes.',
        'Instruction fields feed control and register addresses.',
        'Loads exercise the longest typical path in single-cycle designs.',
      ]),
    ),
  }),
  lesson({
    slug: 'fetch-decode-execute-memory-writeback',
    title: 'The Instruction Execution Cycle',
    description:
      'Trace Fetch → Decode → Execute → Memory → Writeback for ALU, load, store, and branch instructions.',
    level: 'beginner',
    section: 'Single-Cycle Datapath',
    order: 23,
    minutes: 14,
    content: blocks(
      p('Even in a single-cycle machine, we describe instruction flow in five logical stages. Later, pipelining will overlap them in time.'),
      table(
        ['Stage', 'What happens'],
        [
          ['IF', 'Fetch instruction at PC; compute PC+4'],
          ['ID', 'Decode opcode; read registers; extend immediates'],
          ['EX', 'ALU op / address / branch compare'],
          ['MEM', 'Access data memory if load/store'],
          ['WB', 'Write result to register file if needed'],
        ],
      ),
      h2('Different instructions, different paths'),
      ul([
        'R-Type: IF-ID-EX-WB (skip MEM)',
        'Load: all five stages',
        'Store: IF-ID-EX-MEM (no reg write)',
        'Branch: IF-ID-EX (next PC select)',
      ]),
      tryIt('List which stages are active for `beq` vs `add` vs `sw`.'),
      keypoints([
        'Five-stage vocabulary applies even before pipelining.',
        'Not every instruction uses every stage.',
        'Control signals enable only the needed paths.',
      ]),
    ),
  }),
  lesson({
    slug: 'control-unit-hardwired-vs-microprogrammed',
    title: 'Control Units: Hardwired vs Microprogrammed',
    description:
      'Compare hardwired combinational control with microprogrammed control stores and when each shines.',
    level: 'beginner',
    section: 'Single-Cycle Datapath',
    order: 24,
    minutes: 12,
    content: blocks(
      p('The control unit turns opcodes (and funct fields) into datapath enable signals: RegWrite, ALUSrc, MemRead, MemWrite, Branch, ALUOp, …'),
      table(
        ['Style', 'How it works', 'Pros / cons'],
        [
          ['Hardwired', 'Combinational logic / PLA from opcode', 'Fast, less flexible'],
          ['Microprogrammed', 'Microcode ROM sequences control words', 'Flexible, historically slower'],
        ],
      ),
      code(
        `opcode → Control
  RegWrite, ALUSrc, ALUOp,
  MemRead, MemWrite, MemToReg, Branch, Jump`,
        'Typical single-cycle control outputs',
        'text',
      ),
      tip('RISC single-cycle/pipeline labs almost always use hardwired control for clarity.'),
      tryIt('Fill a control-signal table row for `lw` and `sw` (which signals asserted?).'),
      keypoints([
        'Control decodes ISA bits into datapath enables.',
        'Hardwired control fits RISC teaching datapaths.',
        'Microcode trades flexibility for complexity/latency.',
      ]),
    ),
  }),
  lesson({
    slug: 'blueprint-simulator-project',
    title: 'Project: The Blueprint Simulator',
    description:
      'Model a single-cycle datapath that routes data correctly from opcode-driven control signals.',
    level: 'beginner',
    section: 'Single-Cycle Datapath',
    order: 25,
    minutes: 18,
    content: blocks(
      p('Week 4 project: The Blueprint Simulator. Simulate (diagram + truth tables + optional code) a single-cycle machine for a subset ISA.'),
      h2('Minimum instruction subset'),
      ul(['add', 'addi', 'lw', 'sw', 'beq']),
      h2('Deliverables'),
      ol([
        'Labeled datapath diagram with mux select meanings',
        'Control signal table for each instruction',
        'Cycle-by-cycle (logically) walkthrough of one load and one branch',
        'Critical path note: which instruction limits the clock?',
      ]),
      warning('In a true single-cycle CPU, clock period ≥ longest instruction path. Loads usually dominate.'),
      tryIt('Identify the longest path for `lw` through your diagram. List the units on that path in order.'),
      keypoints([
        'Single-cycle: one instruction completes per cycle.',
        'Control must correctly steer every mux.',
        'Clock is limited by the slowest instruction path.',
      ]),
    ),
  }),
];

const intermediateLessons = [
  lesson({
    slug: 'why-pipelining',
    title: 'Why Pipelining? Instruction-Level Parallelism',
    description:
      'See how overlapping instruction stages multiplies throughput without magically shortening individual instruction latency.',
    level: 'intermediate',
    section: 'Pipeline Paradigm',
    order: 26,
    minutes: 12,
    content: blocks(
      p('Pipelining is the assembly line of processors. Multiple instructions occupy different stages at once, raising instruction throughput.'),
      h2('Latency vs throughput'),
      ul([
        'Latency - time for one instruction end-to-end (may stay similar)',
        'Throughput - instructions finished per unit time (rises with pipeline)',
      ]),
      code(
        `Ideal speedup ≈ number of stages
(when stages balanced and no hazards)

Reality: hazards, uneven stages, overhead → less than ideal`,
        'Idealized view',
        'text',
      ),
      tryIt('If a non-pipelined CPI=5 and a perfect 5-stage pipeline approaches CPI≈1, what speedup do you expect before hazards?'),
      keypoints([
        'Pipelining overlaps ILP in time.',
        'Throughput gains are the main win.',
        'Hazards will tax ideal speedup - next weeks.',
      ]),
    ),
  }),
  lesson({
    slug: 'five-stage-pipeline',
    title: 'The Classic 5-Stage Pipeline',
    description:
      'Map IF, ID, EX, MEM, WB onto hardware resources and pipeline registers between stages.',
    level: 'intermediate',
    section: 'Pipeline Paradigm',
    order: 27,
    minutes: 13,
    content: blocks(
      p('The MIPS/RISC-V teaching pipeline splits work into five stages separated by pipeline registers that capture intermediate results each clock.'),
      code(
        `IF | ID | EX | MEM | WB
 ▲    ▲    ▲     ▲
 pipeline registers between stages`,
        'Stage boundaries',
        'text',
      ),
      h2('What each stage owns'),
      table(
        ['Stage', 'Primary resources'],
        [
          ['IF', 'PC, instruction memory'],
          ['ID', 'Register file read, decode, imm'],
          ['EX', 'ALU, branch address'],
          ['MEM', 'Data memory'],
          ['WB', 'Register file write'],
        ],
      ),
      note('Pipeline registers grow the hardware but enable higher clock rates by shortening the work per cycle.'),
      tryIt('Draw five boxes and label which memory (I vs D) each stage may touch.'),
      keypoints([
        'Five stages: IF ID EX MEM WB.',
        'Pipeline registers isolate stage timing.',
        'Resource usage per stage drives structural hazard analysis.',
      ]),
    ),
  }),
  lesson({
    slug: 'pipeline-performance-throughput',
    title: 'Pipeline Performance & Throughput',
    description:
      'Compute pipelined speedup, pipeline CPI with stalls, and the cost of unbalanced stages.',
    level: 'intermediate',
    section: 'Pipeline Paradigm',
    order: 28,
    minutes: 12,
    content: blocks(
      p('Performance math returns - now with stall cycles baked into effective CPI.'),
      code(
        `CPI_pipeline ≈ 1 + stall_cycles_per_instruction
Speedup ≈ (CPI_nonpipe × T_nonpipe) / (CPI_pipe × T_pipe)

Often T_pipe < T_nonpipe because each stage is shorter.`,
        'Pipeline performance',
        'text',
      ),
      tip('Unbalanced stages waste time every cycle. Architects split or merge work to balance the pipeline.'),
      tryIt('Non-pipe: 800 ps/instruction. Pipe: 200 ps clock, 0.3 stalls/instr. Estimate speedup.'),
      keypoints([
        'Stalls raise pipeline CPI above 1.',
        'Clock may be faster than single-cycle.',
        'Balance stages to avoid idle time.',
      ]),
    ),
  }),
  lesson({
    slug: 'pipeline-factory-lab',
    title: 'Lab: The Pipeline Factory',
    description:
      'Manually plot multi-cycle execution charts and calculate speedup versus non-pipelined execution.',
    level: 'intermediate',
    section: 'Pipeline Paradigm',
    order: 29,
    minutes: 15,
    content: blocks(
      p('Plot instructions vs time (cycle numbers). Each instruction occupies one stage cell per cycle - the classic pipeline diagram.'),
      code(
        `Cycle:  1   2   3   4   5   6   7
I1:    IF  ID  EX  MEM WB
I2:        IF  ID  EX  MEM WB
I3:            IF  ID  EX  MEM WB`,
        'Happy-path chart',
        'text',
      ),
      h2('Your factory task'),
      ol([
        'Chart 6 independent instructions with no hazards',
        'Count total cycles vs non-pipelined 5×6 = 30',
        'Compute speedup',
        'Then insert one stall bubble and recompute',
      ]),
      tryIt('Build both charts on paper and write the two speedup numbers.'),
      keypoints([
        'Pipeline charts make ILP visible.',
        'Bubbles stretch the chart and cut speedup.',
        'This lab feeds hazard mitigation intuition.',
      ]),
    ),
  }),
  lesson({
    slug: 'stage-monitor-project',
    title: 'Project: The Stage Monitor',
    description:
      'Specify a visualization that shows instructions propagating through a 5-stage pipeline in real time.',
    level: 'intermediate',
    section: 'Pipeline Paradigm',
    order: 30,
    minutes: 16,
    content: blocks(
      p('Week 5 project: The Stage Monitor - a UI or console renderer for pipeline occupancy.'),
      h2('Features'),
      ul([
        'Show five stage slots each cycle',
        'Display PC/mnemonic occupying each slot',
        'Advance on a clock tick (manual button fine)',
        'Highlight bubbles as NOP / stall',
      ]),
      code(
        `state = { IF: instr1, ID: instr0, EX: null, MEM: null, WB: null }
onClock():
  WB  = MEM
  MEM = EX
  EX  = ID   # unless stall
  ID  = IF   # unless stall
  IF  = fetch(nextPC)`,
        'Monitor state machine sketch',
        'text',
      ),
      tryIt('Storyboard 8 cycles of your monitor for a 3-instruction program. Note when WB first writes.'),
      keypoints([
        'Stage monitors teach timing visually.',
        'State is the contents of pipeline registers.',
        'Stalls freeze some transfers while IF may insert NOP.',
      ]),
    ),
  }),
  lesson({
    slug: 'midterm-review-digital-logic',
    title: 'Mid-Term Review: Digital Logic & ALU',
    description:
      'Consolidate adders, number systems, FP basics, and ALU control before the mid-term checkpoint.',
    level: 'intermediate',
    section: 'Mid-Term Checkpoint',
    order: 31,
    minutes: 14,
    content: blocks(
      p('Week 6 mid-term focus areas include digital logic and ALU architectures. Use this lesson as a structured self-exam.'),
      h2('Drill list'),
      ol([
        'Convert ± values to two\'s complement',
        'Explain CLA generate/propagate',
        'Sketch ALU with op mux',
        'Decode a simple IEEE 754 value conceptually',
        'State overflow vs carry differences',
      ]),
      tryIt('Write a 20-minute mini-quiz for yourself from the drill list. Grade ruthlessly.'),
      keypoints([
        'Mid-term weights logic, ISA, assembly, ALU, basic datapath.',
        'Active recall beats rereading notes.',
        'Be fluent in representations and adder trade-offs.',
      ]),
    ),
  }),
  lesson({
    slug: 'midterm-review-isa-assembly',
    title: 'Mid-Term Review: ISA & Assembly',
    description:
      'Rehearse formats, addressing, and hand translation under timed conditions.',
    level: 'intermediate',
    section: 'Mid-Term Checkpoint',
    order: 32,
    minutes: 14,
    content: blocks(
      p('Flush ISA skills: formats, registers, loads/stores, branches, and tracing.'),
      h2('Timed drills'),
      ul([
        'Identify format from an assembly line in 10 seconds',
        'Translate a 5-line C fragment in under 8 minutes',
        'Complete a full register trace for 8 instructions',
      ]),
      warning('Do not rely on an emulator during drill - exams will not.'),
      tryIt('Pick prior Assembly Duel exercises and redo them cold.'),
      keypoints([
        'Speed and accuracy both matter on exams.',
        'Tracing without tools is a graded skill.',
        'Formats + calling roles are high-frequency questions.',
      ]),
    ),
  }),
  lesson({
    slug: 'midterm-review-datapath',
    title: 'Mid-Term Review: Datapath & Control',
    description:
      'Trace control signals and mux settings for core instructions on a single-cycle blueprint.',
    level: 'intermediate',
    section: 'Mid-Term Checkpoint',
    order: 33,
    minutes: 13,
    content: blocks(
      p('Expect questions that ask: for instruction X, which control lines are asserted, and which mux inputs are selected?'),
      table(
        ['Instr', 'MemRead', 'MemWrite', 'RegWrite', 'ALUSrc', 'Branch'],
        [
          ['add', '0', '0', '1', '0', '0'],
          ['lw', '1', '0', '1', '1', '0'],
          ['sw', '0', '1', '0', '1', '0'],
          ['beq', '0', '0', '0', '0', '1'],
        ],
      ),
      tryIt('Cover the table and recreate it from memory. Fix any mismatch.'),
      keypoints([
        'Control tables are exam favorites.',
        'Know why stores do not RegWrite.',
        'Branches redirect Next-PC selection.',
      ]),
    ),
  }),
  lesson({
    slug: 'structural-hazards',
    title: 'Structural Hazards',
    description:
      'Recognize resource conflicts when two stages need the same hardware in one cycle.',
    level: 'intermediate',
    section: 'Pipeline Hazards',
    order: 34,
    minutes: 11,
    content: blocks(
      p('A structural hazard occurs when the pipeline architecture lacks enough hardware to support all overlapping stages.'),
      h2('Classic examples'),
      ul([
        'Unified memory for instructions and data in the same cycle',
        'Single-port register file that cannot read and write as required',
      ]),
      tip('Teaching pipelines often assume separate I-mem and D-mem (or caches) to remove the memory structural hazard.'),
      tryIt('Explain how a modified Harvard split cache avoids a fetch/load structural clash.'),
      keypoints([
        'Structural hazards = resource collisions.',
        'Duplication or multiporting removes them.',
        'ISA-friendly microarchitecture design prevents many clashes.',
      ]),
    ),
  }),
  lesson({
    slug: 'data-hazards-raw-war-waw',
    title: 'Data Hazards: RAW, WAR, WAW',
    description:
      'Classify read-after-write, write-after-read, and write-after-write dependencies in pipelines.',
    level: 'intermediate',
    section: 'Pipeline Hazards',
    order: 35,
    minutes: 13,
    content: blocks(
      p('Data hazards arise from dependencies between instructions that are in flight together.'),
      table(
        ['Hazard', 'Meaning', 'In 5-stage in-order?'],
        [
          ['RAW', 'Read After Write (true dependence)', 'Yes - primary concern'],
          ['WAR', 'Write After Read (anti)', 'Mostly avoided by fixed WB timing'],
          ['WAW', 'Write After Write (output)', 'Mostly avoided in simple pipelines'],
        ],
      ),
      code(
        `add  x5, x1, x2
sub  x8, x5, x3   # RAW on x5 - needs x5 from add`,
        'Classic RAW',
        'asm',
      ),
      tryIt('Label every dependence in a 4-instruction block you write with at least one RAW chain.'),
      keypoints([
        'RAW is the true dependence pipelines must handle.',
        'WAR/WAW matter more with out-of-order & renaming.',
        'Always name the register that causes the hazard.',
      ]),
    ),
  }),
  lesson({
    slug: 'control-hazards',
    title: 'Control Hazards',
    description:
      'See why branches disrupt the pipeline and how delay slots or prediction respond.',
    level: 'intermediate',
    section: 'Pipeline Hazards',
    order: 36,
    minutes: 12,
    content: blocks(
      p('Control hazards occur because the next PC depends on an earlier instruction’s outcome - often known late (EX stage compare).'),
      ul([
        'Fetched instructions after a branch may be wrong-path',
        'Must squash (flush) or prevent fetch until resolved',
        'Branch prediction guesses to keep the pipe full',
      ]),
      warning('Wrong-path instructions must not commit architectural state.'),
      tryIt('In a 5-stage pipe deciding branches in EX, how many following instructions may be in flight incorrectly?'),
      keypoints([
        'Branches create control hazards.',
        'Flush or predict to manage next-PC uncertainty.',
        'Never let wrong-path ops write registers/memory.',
      ]),
    ),
  }),
  lesson({
    slug: 'forwarding-and-bypassing',
    title: 'Forwarding & Bypassing',
    description:
      'Wire EX/MEM and MEM/WB results back to ALU inputs to slash many RAW stalls.',
    level: 'intermediate',
    section: 'Pipeline Hazards',
    order: 37,
    minutes: 14,
    content: blocks(
      p('Forwarding (bypassing) routes newly computed values to earlier stages before they are written back to the register file.'),
      code(
        `add x5, x1, x2
sub x6, x5, x3   # forward x5 from EX/MEM → ALU input`,
        'Forwarding case',
        'asm',
      ),
      h2('What forwarding cannot fix alone'),
      p('A load followed immediately by a use needs the memory stage result - typically still requires a one-cycle load-use stall plus forwarding.'),
      tip('Draw forwarding paths on your datapath diagram; exams love those arrows.'),
      tryIt('Show with a pipeline chart how forwarding removes a stall between add and sub.'),
      keypoints([
        'Forwarding feeds results early via muxes.',
        'Load-use hazards still need a stall bubble.',
        'Hazard detection logic controls forward selects + stalls.',
      ]),
    ),
  }),
  lesson({
    slug: 'stalls-and-bubbles',
    title: 'Pipeline Stalls & Bubbles',
    description:
      'Insert NOPs / freeze pipeline registers safely when forwarding is not enough.',
    level: 'intermediate',
    section: 'Pipeline Hazards',
    order: 38,
    minutes: 11,
    content: blocks(
      p('A stall holds younger instructions and inserts a bubble (NOP) into downstream stages so wrong data is not used.'),
      code(
        `lw  x5, 0(x10)
sub x6, x5, x7   # load-use: stall 1, then forward from MEM/WB`,
        'Load-use pattern',
        'asm',
      ),
      ul([
        'Freeze PC and IF/ID',
        'Inject bubble into ID/EX control',
        'Let EX/MEM/WB continue',
      ]),
      tryIt('Rewrite a pipeline chart for the load-use pair with exactly one bubble.'),
      keypoints([
        'Bubbles are intentional NOPs in the pipe.',
        'Stalls preserve correctness when data is not ready.',
        'Minimize stalls via scheduling and caching (later).',
      ]),
    ),
  }),
  lesson({
    slug: 'branch-prediction',
    title: 'Branch Prediction Basics',
    description:
      'Compare predict-not-taken, static predictors, and 1-bit/2-bit dynamic predictors.',
    level: 'intermediate',
    section: 'Pipeline Hazards',
    order: 39,
    minutes: 13,
    content: blocks(
      p('Branch predictors guess direction (and sometimes target) so the pipeline keeps fetching useful instructions.'),
      table(
        ['Strategy', 'Idea', 'Weakness'],
        [
          ['Predict not-taken', 'Always fall through', 'Loops hurt'],
          ['Predict taken', 'Good for many loops', 'Fails on rare exits'],
          ['1-bit', 'Remember last outcome', 'Mispredicts loop exit/entry twice'],
          ['2-bit saturating', 'Need two fails to flip', 'More stable for loops'],
        ],
      ),
      tip('BTFNT (backwards taken, forwards not-taken) is a strong static heuristic for compiled loops.'),
      tryIt('Simulate a 1-bit predictor on T,T,T,N for a loop. Count mispredicts.'),
      keypoints([
        'Prediction hides control hazard latency.',
        '2-bit predictors handle loop patterns better than 1-bit.',
        'Mispredicts flush speculative work.',
      ]),
    ),
  }),
  lesson({
    slug: 'bottleneck-audit-lab',
    title: 'Lab: The Bottleneck Audit',
    description:
      'Analyze assembly for stalls and reschedule instructions to improve throughput.',
    level: 'intermediate',
    section: 'Pipeline Hazards',
    order: 40,
    minutes: 15,
    content: blocks(
      p('Bottleneck Audit: find load-use pairs and long dependence chains, then reorder independent instructions to fill delay slots / reduce stalls.'),
      code(
        `# Before (load-use stall likely)
lw  t0, 0(a0)
add t1, t0, t2
lw  t3, 0(a1)
add t4, t3, t2

# After (independent lw scheduled earlier)
lw  t0, 0(a0)
lw  t3, 0(a1)
add t1, t0, t2
add t4, t3, t2`,
        'Instruction scheduling',
        'asm',
      ),
      tryIt('Take a 10-instruction block from your earlier loop and schedule it to minimize assumed load-use stalls.'),
      keypoints([
        'Compilers and humans both schedule around hazards.',
        'Independent instructions are gold between dependents.',
        'Measure success with fewer bubbles in your chart.',
      ]),
    ),
  }),
  lesson({
    slug: 'hazard-detector-project',
    title: 'Project: The Hazard Detector',
    description:
      'Design a module that scans assembly, flags dependencies, and proposes forwarding paths.',
    level: 'intermediate',
    section: 'Pipeline Hazards',
    order: 41,
    minutes: 18,
    content: blocks(
      p('Week 7 project: The Hazard Detector. Parse a simple assembly subset and report RAW pairs with recommended forwarding or stall.'),
      h2('Detector output example'),
      code(
        `[
  {"consumer": 3, "producer": 1, "reg": "x5",
   "distance": 2, "action": "forward:EX/MEM"},
  {"consumer": 5, "producer": 4, "reg": "x8",
   "distance": 1, "action": "stall:load-use + forward:MEM/WB"}
]`,
        'Sample diagnostic JSON',
        'json',
      ),
      ol([
        'Parse opcodes and destination/source regs',
        'For each instr, look back at prior destinations still in flight',
        'Emit action: forward path or stall',
      ]),
      tryIt('Hand-run your algorithm on a 6-line assembly snippet and produce the JSON list.'),
      keypoints([
        'Hazard detection is systematic dependence analysis.',
        'Distance in the pipe chooses forward vs stall.',
        'Document assumptions about stage timing.',
      ]),
    ),
  }),
  lesson({
    slug: 'principle-of-locality',
    title: 'Principle of Locality',
    description:
      'Explain temporal and spatial locality - the reason caches and hierarchies work.',
    level: 'intermediate',
    section: 'Memory Hierarchy',
    order: 42,
    minutes: 11,
    content: blocks(
      p('Programs do not access memory uniformly. They reuse recent data (temporal) and touch nearby addresses (spatial). Hierarchies exploit both.'),
      table(
        ['Locality', 'Meaning', 'Hardware help'],
        [
          ['Temporal', 'Reuse same address soon', 'Keep blocks in cache'],
          ['Spatial', 'Use nearby addresses soon', 'Fetch full cache lines'],
        ],
      ),
      tryIt('Name one loop in your past code with strong spatial locality and one with poor locality (random pointer chasing).'),
      keypoints([
        'Locality makes small fast memories effective.',
        'Cache lines capture spatial locality.',
        'Algorithms can be rewritten to improve locality.',
      ]),
    ),
  }),
  lesson({
    slug: 'cache-direct-mapped',
    title: 'Direct-Mapped Caches',
    description:
      'Map addresses to a single set: tag, index, offset - and compute hits/misses.',
    level: 'intermediate',
    section: 'Memory Hierarchy',
    order: 43,
    minutes: 14,
    content: blocks(
      p('In a direct-mapped cache, each block of main memory maps to exactly one cache line.'),
      code(
        `address bits → [ tag | index | block offset ]

Hit if valid && tag matches at index.`,
        'Address breakup',
        'text',
      ),
      h2('Conflict misses'),
      p('Two active blocks that map to the same index thrash each other - even if the cache is mostly empty. Associativity (next lesson) reduces this.'),
      tryIt('For an 8-line cache with 4-word blocks, find index/offset/tag bit counts for 32-bit addresses (word-addressed carefully - state assumptions).'),
      keypoints([
        'Direct-mapped: one place for each block.',
        'Index selects line; tag identifies identity.',
        'Conflicts cause misses despite free capacity.',
      ]),
    ),
  }),
  lesson({
    slug: 'associative-caches',
    title: 'Set-Associative & Fully Associative Caches',
    description:
      'Compare associativity levels, replacement policies, and the hit-rate vs hardware cost trade-off.',
    level: 'intermediate',
    section: 'Memory Hierarchy',
    order: 44,
    minutes: 13,
    content: blocks(
      p('An N-way set-associative cache lets a block live in any of N ways inside its set. Fully associative means one set with all lines as ways.'),
      table(
        ['Organization', 'Flexibility', 'Compare hardware'],
        [
          ['Direct-mapped', 'Lowest', '1 tag compare'],
          ['2/4-way set-assoc', 'Medium', 'N comparators'],
          ['Fully associative', 'Highest', 'Compare all tags'],
        ],
      ),
      tip('LRU, pseudo-LRU, and random are common replacement policies when a set is full.'),
      tryIt('Explain why increasing associativity often cuts conflict misses but may lengthen hit time.'),
      keypoints([
        'Associativity reduces conflict misses.',
        'More ways → more comparators / energy.',
        'Replacement policy matters when sets fill.',
      ]),
    ),
  }),
  lesson({
    slug: 'write-policies',
    title: 'Write-Through vs Write-Back',
    description:
      'Choose write policies and write-allocate vs no-write-allocate strategies with clear trade-offs.',
    level: 'intermediate',
    section: 'Memory Hierarchy',
    order: 45,
    minutes: 12,
    content: blocks(
      p('Stores must keep memory hierarchy consistent. Policy choices affect bandwidth, complexity, and AMAT.'),
      table(
        ['Policy', 'On hit write', 'Notes'],
        [
          ['Write-through', 'Update cache + lower level', 'Simpler; more memory traffic'],
          ['Write-back', 'Update cache; dirty bit', 'Write to memory on eviction'],
        ],
      ),
      ul([
        'Write-allocate - bring block in on write miss',
        'No-write-allocate - write around to lower level',
      ]),
      tryIt('Pick a write-back + write-allocate cache. Describe steps for a store miss.'),
      keypoints([
        'Write-through vs write-back trade traffic vs complexity.',
        'Dirty bits track write-back lines.',
        'Allocate policies change miss handling for stores.',
      ]),
    ),
  }),
  lesson({
    slug: 'amat-and-miss-rates',
    title: 'AMAT & Miss Rate Analysis',
    description:
      'Compute Average Memory Access Time from hit time, miss rate, and miss penalty - including multilevel caches.',
    level: 'intermediate',
    section: 'Memory Hierarchy',
    order: 46,
    minutes: 13,
    content: blocks(
      p('AMAT summarizes memory performance the way CPI summarizes processor performance.'),
      code(
        `AMAT = HitTime + MissRate × MissPenalty

Two-level:
AMAT = HT1 + MR1 × (HT2 + MR2 × PenaltyMem)`,
        'AMAT formulas',
        'text',
      ),
      warning('Miss rate ≠ miss penalty. A rare miss that costs 200 cycles can dominate.'),
      tryIt('HT=2, MR=5%, Penalty=100. Compute AMAT. Then cut MR to 2% and recompute.'),
      keypoints([
        'AMAT = hit time + miss rate × miss penalty.',
        'Multilevel caches nest the formula.',
        'Optimize the product, not one term blindly.',
      ]),
    ),
  }),
  lesson({
    slug: 'hit-or-miss-lab',
    title: 'Lab: Hit or Miss',
    description:
      'Walk address streams through a small cache, counting hits/misses and tracking line updates.',
    level: 'intermediate',
    section: 'Memory Hierarchy',
    order: 47,
    minutes: 15,
    content: blocks(
      p('Simulate a tiny direct-mapped cache by hand on a fixed address trace.'),
      h2('Setup'),
      code(
        `Cache: 4 lines, block size 1 word (word addresses)
Trace: 0, 1, 2, 3, 0, 4, 0, 1, 2, 8`,
        'Lab configuration',
        'text',
      ),
      ol([
        'For each address: compute index = addr mod 4, tag = floor(addr / 4)',
        'Record hit/miss and final tag in each line',
        'Compute miss rate',
      ]),
      tryIt('Complete the table for all 10 accesses. Circle compulsory vs conflict misses.'),
      keypoints([
        'Hand simulation cements cache mechanics.',
        'Classify compulsory, conflict, capacity misses (3 Cs).',
        'Traces reveal thrashing patterns.',
      ]),
    ),
  }),
  lesson({
    slug: 'cache-configurator-project',
    title: 'Project: The Cache Configurator',
    description:
      'Build an algorithmic cache simulator to sweep line size and associativity against AMAT.',
    level: 'intermediate',
    section: 'Memory Hierarchy',
    order: 48,
    minutes: 18,
    content: blocks(
      p('Week 8 project: The Cache Configurator. Parameterize capacity, block size, and associativity; run a trace; report hit rate and AMAT.'),
      h2('Parameters to sweep'),
      ul(['Total size', 'Block size', '1/2/4/8-way', 'Write policy (fix for V1)']),
      code(
        `for config in sweep:
  sim = Cache(config)
  for addr in trace:
    sim.access(addr)
  report(config, sim.hitRate, sim.amat(ht, penalty))`,
        'Sweep harness',
        'text',
      ),
      note('Include a short report: which config won and why (locality of your trace).'),
      tryIt('Define two configs and predict a winner before simulating. Then verify.'),
      keypoints([
        'Simulators quantify hierarchy trade-offs.',
        'Block size vs associativity interact with the trace.',
        'Always state hit time / penalty assumptions.',
      ]),
    ),
  }),
];

const advancedLessons = [
  lesson({
    slug: 'virtual-memory-and-page-tables',
    title: 'Virtual Memory & Page Tables',
    description:
      'Separate virtual from physical addresses and walk the role of page tables in translation.',
    level: 'advanced',
    section: 'Virtual Memory & I/O',
    order: 49,
    minutes: 14,
    content: blocks(
      p('Virtual memory gives each process a clean address space, enables isolation, and lets disks back infrequently used pages.'),
      h2('Core ideas'),
      ul([
        'Virtual page number (VPN) + page offset',
        'Page table maps VPN → physical frame (or fault)',
        'Page faults invoke OS to load from disk',
        'Protection bits: read/write/exec/user',
      ]),
      code(
        `virtual addr: [ VPN | offset ]
phys addr:    [ PFN | offset ]  # offset unchanged`,
        'Translation structure',
        'text',
      ),
      tryIt('For 4 KiB pages, how many offset bits? If VPN has 20 bits, how large is the virtual space?'),
      keypoints([
        'VM translates VPN to physical frame.',
        'Page tables store the mapping + permissions.',
        'Faults are expensive - locality still rules.',
      ]),
    ),
  }),
  lesson({
    slug: 'tlb-address-translation',
    title: 'TLBs & Fast Address Translation',
    description:
      'Use Translation Lookaside Buffers to avoid walking page tables on every access.',
    level: 'advanced',
    section: 'Virtual Memory & I/O',
    order: 50,
    minutes: 13,
    content: blocks(
      p('A TLB caches recent VPN→PFN translations. Hit: translate in ~1 cycle. Miss: walk tables (hardware or software), then refill.'),
      table(
        ['Event', 'Cost intuition'],
        [
          ['TLB hit', 'Cheap - almost like no VM'],
          ['TLB miss + PT hit in cache', 'Moderate'],
          ['Page fault to disk', 'Enormous (ms)'],
        ],
      ),
      tip('AMAT-style reasoning extends to TLB miss rates too.'),
      tryIt('Explain why large pages (e.g., 2 MiB) can raise TLB reach.'),
      keypoints([
        'TLBs make virtual memory practical.',
        'Misses invoke page-table walks.',
        'Page size affects TLB coverage.',
      ]),
    ),
  }),
  lesson({
    slug: 'memory-mapped-io',
    title: 'Memory-Mapped I/O',
    description:
      'Control devices by reading/writing reserved addresses - unify CPU access paths.',
    level: 'advanced',
    section: 'Virtual Memory & I/O',
    order: 51,
    minutes: 11,
    content: blocks(
      p('With memory-mapped I/O, device registers appear as addresses. Loads/stores become device control and status queries.'),
      code(
        `STORE #CMD_START → DEVICE_CMD_REG
LOAD  DEVICE_STATUS   # poll ready bit
LOAD  DEVICE_DATA`,
        'MMIO sketch',
        'text',
      ),
      note('Alternative: separate I/O instructions (port-mapped I/O). Many teaching systems emphasize MMIO.'),
      tryIt('List three fields you would place in a toy UART’s MMIO register map.'),
      keypoints([
        'MMIO reuses load/store for device control.',
        'Address decode steers CPU to devices vs memory.',
        'Ordering and volatility matter for device regs.',
      ]),
    ),
  }),
  lesson({
    slug: 'interrupts-vs-polling',
    title: 'Interrupts vs Polling',
    description:
      'Compare busy-wait device service with interrupt-driven I/O and when each is appropriate.',
    level: 'advanced',
    section: 'Virtual Memory & I/O',
    order: 52,
    minutes: 12,
    content: blocks(
      p('Polling repeatedly asks "ready yet?" Interrupts let devices signal the CPU when service is needed.'),
      table(
        ['Approach', 'CPU overhead', 'Latency predictability'],
        [
          ['Polling', 'High if frequent', 'Can be very responsive'],
          ['Interrupts', 'Low when idle', 'Handler + nesting complexity'],
        ],
      ),
      tip('Real systems mix both: poll in tight device drivers, interrupt for sparse events.'),
      tryIt('Describe a sensor sampling case where polling wins, and a keyboard case where interrupts win.'),
      keypoints([
        'Polling wastes cycles waiting.',
        'Interrupts free the CPU until events arrive.',
        'Handler design is part of system architecture.',
      ]),
    ),
  }),
  lesson({
    slug: 'direct-memory-access',
    title: 'Direct Memory Access (DMA)',
    description:
      'Let devices transfer bulk data to memory without per-word CPU babysitting.',
    level: 'advanced',
    section: 'Virtual Memory & I/O',
    order: 53,
    minutes: 13,
    content: blocks(
      p('DMA engines move blocks between devices and memory. The CPU sets up a transfer descriptor, then continues useful work until an interrupt signals completion.'),
      h2('Setup flow'),
      ol([
        'CPU programs source, destination, size, direction',
        'DMA requests the bus / memory',
        'Transfer proceeds (possibly stealing cycles)',
        'DMA interrupts CPU on completion / error',
      ]),
      warning('Cache coherence with DMA is a real hazard: memory may change under a cache. Systems flush/invalidate or use coherent interconnects.'),
      tryIt('Write a sequence diagram: CPU, DMA, device, memory for a 4 KiB disk read.'),
      keypoints([
        'DMA offloads bulk transfer from the CPU.',
        'Completion is usually interrupt-driven.',
        'Coherence and permissions must be designed carefully.',
      ]),
    ),
  }),
  lesson({
    slug: 'dma-controller-simulator',
    title: 'Project: DMA Controller Simulator',
    description:
      'Build an automated transfer module that models DMA setup, bus grant, and completion interrupt.',
    level: 'advanced',
    section: 'Virtual Memory & I/O',
    order: 54,
    minutes: 18,
    content: blocks(
      p('Week 9 project: The DMA Controller Simulator - show that bulk transfers need not poll every word in software.'),
      h2('Simulator entities'),
      ul(['CPU (program & interrupt)', 'DMA engine', 'Device buffer', 'Memory array', 'Simple bus arbiter']),
      code(
        `dma.program(src=dev, dst=mem+0x1000, n=1024)
dma.start()
# CPU continues other work
onInterrupt:
  assert memSliceEquals(devBuffer)`,
        'Acceptance test sketch',
        'text',
      ),
      tryIt('Define states: Idle, WaitBus, Transferring, Complete. List transitions.'),
      keypoints([
        'Model DMA as a state machine sharing the bus.',
        'Prove correctness with memory compares.',
        'Discuss CPU cycles saved vs polling.',
      ]),
    ),
  }),
  lesson({
    slug: 'amdahls-law',
    title: 'Amdahl\'s Law',
    description:
      'Quantify the speedup ceiling when only part of a workload can be parallelized.',
    level: 'advanced',
    section: 'Multicore & Parallelism',
    order: 55,
    minutes: 12,
    content: blocks(
      p('Amdahl\'s Law is the cold water for multicore dreams: serial fractions dominate the limit.'),
      code(
        `Speedup ≤ 1 / ( (1 - P) + P / N )

P = parallelizable fraction
N = number of processors`,
        'Amdahl',
        'text',
      ),
      h2('Example'),
      p('If 10% of runtime is serial, even infinite cores cannot beat 10× speedup.'),
      tryIt('Compute max speedup for P=0.8 with N=4 and N=64.'),
      keypoints([
        'Serial bottlenecks cap parallel speedup.',
        'Optimize the non-parallelizable part too.',
        'Use Amdahl before buying "more cores" as a strategy.',
      ]),
    ),
  }),
  lesson({
    slug: 'flynns-taxonomy',
    title: 'Flynn\'s Taxonomy',
    description:
      'Classify SISD, SIMD, MISD, and MIMD - and map them to CPUs, GPUs, and clusters.',
    level: 'advanced',
    section: 'Multicore & Parallelism',
    order: 56,
    minutes: 12,
    content: blocks(
      p('Flynn classified computers by instruction and data streams.'),
      table(
        ['Class', 'Instruction streams', 'Data streams', 'Examples'],
        [
          ['SISD', '1', '1', 'Classic uniprocessor'],
          ['SIMD', '1', 'Many', 'Vector units, GPUs (wide)'],
          ['MISD', 'Many', '1', 'Rare / specialized'],
          ['MIMD', 'Many', 'Many', 'Multicore CPUs, clusters'],
        ],
      ),
      tryIt('Label a 4-core phone CPU and a GPU warp/wavefront using Flynn classes.'),
      keypoints([
        'SISD/SIMD/MISD/MIMD organize parallel hardware.',
        'Modern chips mix classes (SIMD units inside MIMD cores).',
        'Pick algorithms that match the machine class.',
      ]),
    ),
  }),
  lesson({
    slug: 'simd-mimd-multicore',
    title: 'SIMD, MIMD & Multicore Processors',
    description:
      'Differentiate data-level parallelism from thread-level parallelism in practical terms.',
    level: 'advanced',
    section: 'Multicore & Parallelism',
    order: 57,
    minutes: 13,
    content: blocks(
      p('SIMD applies one operation to many data lanes. MIMD runs independent instruction streams - multicore CPUs are MIMD with shared memory.'),
      ul([
        'DLP - data-level parallelism (SIMD/vectors)',
        'TLP - thread-level parallelism (multicore/multi-thread)',
        'ILP - instruction-level parallelism (pipelines/superscalar)',
      ]),
      tip('Great software uses all three levels carefully - compilers for ILP/SIMD, OS/runtime for threads.'),
      tryIt('Give one workload best for SIMD and one best for MIMD threads.'),
      keypoints([
        'SIMD = same op, many data.',
        'MIMD = independent workers.',
        'Multicore sharing raises coherence questions next.',
      ]),
    ),
  }),
  lesson({
    slug: 'cache-coherence-msi-mesi',
    title: 'Cache Coherence: MSI & MESI',
    description:
      'Track shared line states across cores so every reader sees a consistent memory story.',
    level: 'advanced',
    section: 'Multicore & Parallelism',
    order: 58,
    minutes: 15,
    content: blocks(
      p('Private caches multiply the coherence problem: which core owns the latest value of a line?'),
      h2('MSI states'),
      ul([
        'M - Modified (dirty, unique)',
        'S - Shared (clean, may be multi-cached)',
        'I - Invalid',
      ]),
      h2('MESI adds Exclusive'),
      p('E - Exclusive clean unique. Allows silent upgrade to Modified without a bus upgrade in many protocols - an optimization over MSI.'),
      warning('Coherence ≠ synchronization. Atomics/locks still needed for higher-level races.'),
      tryIt('Walk a line from I → E → M → S across two cores with a read/write storyboard.'),
      keypoints([
        'MSI/MESI track ownership and sharing of cache lines.',
        'Exclusive state reduces upgrade traffic.',
        'Coherence protocols are the multicore memory backbone.',
      ]),
    ),
  }),
  lesson({
    slug: 'coherence-arbiter-project',
    title: 'Project: The Coherence Arbiter',
    description:
      'Simulate a multi-core environment tracking shared line state changes across processing cores.',
    level: 'advanced',
    section: 'Multicore & Parallelism',
    order: 59,
    minutes: 18,
    content: blocks(
      p('Week 10 project: The Coherence Arbiter. Model 2-4 cores, a shared bus or directory stub, and MESI transitions for one cache line.'),
      h2('Minimum events'),
      ul(['PrRd', 'PrWr', 'BusRd', 'BusRdX / BusUpgr', 'Flush']),
      code(
        `on(event, core):
  state[core] = transition(state[core], event)
  for other in cores:
    state[other] = snoop(state[other], event)
  log(cycle, states)`,
        'Arbiter loop',
        'text',
      ),
      tryIt('Simulate: Core0 read, Core1 read, Core0 write. Show states after each step.'),
      keypoints([
        'Coherence sims make protocol transitions concrete.',
        'Logging every bus event is part of the report.',
        'Extend later with more lines and false sharing demos.',
      ]),
    ),
  }),
  lesson({
    slug: 'hardware-software-co-design',
    title: 'Hardware-Software Co-Design',
    description:
      'Think jointly about ISA, compiler scheduling, and microarchitecture when chasing performance per watt.',
    level: 'advanced',
    section: 'Capstone & Exam Prep',
    order: 60,
    minutes: 12,
    content: blocks(
      p('CSE 203 ends where engineering begins: hardware and software must be designed together. Compilers schedule for pipelines; ISAs expose useful ops; microarchitects implement efficient paths.'),
      ul([
        'Software: algorithms, data layout, instruction scheduling',
        'ISA: dense vs simple ops, vector extensions',
        'Microarchitecture: caches, predictors, cores',
      ]),
      tryIt('Pick a slow loop you know. Propose one software change and one hardware feature that would each help.'),
      keypoints([
        'Performance is a co-design surface.',
        'Blaming only software or only hardware is incomplete.',
        'Document trade-offs like an engineer, not a tourist.',
      ]),
    ),
  }),
  lesson({
    slug: 'time-space-power-tradeoffs',
    title: 'Time-Space-Power Trade-offs',
    description:
      'Practice SIU engineering discipline: every design choice balances latency, area, and energy.',
    level: 'advanced',
    section: 'Capstone & Exam Prep',
    order: 61,
    minutes: 12,
    content: blocks(
      p('Architectural professionalism means justifying trade-offs. A CLA is faster than ripple-carry but costs gates and wire. A write-back cache saves bandwidth but needs dirty-bit logic.'),
      table(
        ['Knob', 'Pushing it up often…', 'Costs'],
        [
          ['Speed', 'Raises frequency / lowers CPI', 'Power, area, complexity'],
          ['Area', 'More ALUs, bigger caches', 'Chip cost, leakage'],
          ['Energy', 'Simpler paths, dark silicon strategies', 'May reduce peak performance'],
        ],
      ),
      tryIt('For your Custom ALU project, write a 5-line trade-off paragraph: what you optimized and what you sacrificed.'),
      keypoints([
        'No free lunch across time, space, and power.',
        'Reports must quantify or at least qualitatively justify trade-offs.',
        'This mindset is part of the CSE 203 CLO on engineering discipline.',
      ]),
    ),
  }),
  lesson({
    slug: 'grand-challenges-multicore',
    title: 'Grand Challenges in Multicore Scaling',
    description:
      'Tackle memory bus contention, synchronization overhead, and diminishing returns at scale.',
    level: 'advanced',
    section: 'Capstone & Exam Prep',
    order: 62,
    minutes: 13,
    content: blocks(
      p('More cores help only when work, memory bandwidth, and synchronization allow it. Bus contention and lock convoys can erase theoretical speedups.'),
      h2('Challenge prompts'),
      ol([
        'A workload with P=0.95 hits a memory bandwidth wall at N=16 - why?',
        'False sharing turns a parallel array update pathological - explain',
        'Where does Amdahl still bite a microservice fan-out on one chip?',
      ]),
      tryIt('Write a short “architecture memo” proposing one fix for false sharing (padding, privatization, …).'),
      keypoints([
        'Scaling limits are often memory and sync, not ALU count.',
        'False sharing is a coherence performance bug.',
        'Measure before celebrating core counts.',
      ]),
    ),
  }),
  lesson({
    slug: 'final-exam-assembly-review',
    title: 'Final Review: Assembly & Datapath',
    description:
      'Comprehensive drill on ISA encodings, hand translation, and single-cycle control before the final.',
    level: 'advanced',
    section: 'Capstone & Exam Prep',
    order: 63,
    minutes: 15,
    content: blocks(
      p('Final exams weave assembly abstractions with hardware metrics. Rehearse under time pressure.'),
      ul([
        'Disassemble one R and one I instruction from fields',
        'Translate a nested if/loop to assembly',
        'Fill control signals for lw/sw/beq/add',
        'Trace 10 instructions including a store and branch',
      ]),
      tryIt('Create a 45-minute mock exam from these bullets and take it cold.'),
      keypoints([
        'Finals reward fluent tracing and control tables.',
        'Connect assembly choices to datapath events.',
        'No emulator - paper discipline wins.',
      ]),
    ),
  }),
  lesson({
    slug: 'final-exam-pipeline-cache-review',
    title: 'Final Review: Pipelines, Hazards & Caches',
    description:
      'Drill hazard charts, forwarding, AMAT, and associativity questions for the comprehensive final.',
    level: 'advanced',
    section: 'Capstone & Exam Prep',
    order: 64,
    minutes: 16,
    content: blocks(
      p('Pipeline + memory questions dominate advanced finals. Mix charts with numeric AMAT.'),
      h2('Must-hit skills'),
      ol([
        'Draw a pipeline chart with one load-use stall and forwarding',
        'Identify RAW pairs and name forward paths',
        'Compute AMAT for 1- and 2-level caches',
        'Simulate 8 accesses on a small set-associative cache',
        'Explain MESI transition on a remote write',
      ]),
      tryIt('Score yourself /10 on the must-hit list. Restudy any item below 8.'),
      keypoints([
        'Charts + AMAT + coherence are high-value final topics.',
        'Show work: bitfields, indexes, tags.',
        'Explain why, not only what.',
      ]),
    ),
  }),
  lesson({
    slug: 'architecture-capstone-synthesis',
    title: 'Capstone: Architecture Synthesis',
    description:
      'Integrate ISA, datapath, pipeline, cache, and I/O into one coherent system narrative and portfolio packet.',
    level: 'advanced',
    section: 'Capstone & Exam Prep',
    order: 65,
    minutes: 20,
    content: blocks(
      p('Close the course by synthesizing every major artifact into one architectural story: a mini processor + memory system you can explain end-to-end.'),
      h2('Portfolio packet'),
      ol([
        'ISA subset + disassembler notes (Native Translator)',
        'ALU diagram + test vectors (Custom ALU)',
        'Single-cycle blueprint + control table',
        'Pipeline stage monitor frames + hazard detector sample',
        'Cache configurator results + AMAT commentary',
        'DMA or coherence sim highlight',
        'Trade-off essay (time/space/power) - 1 page',
      ]),
      tip('If you can teach your design to a peer without slides, you own it.'),
      note('Academic integrity reminder: every mux path, register assignment, and pipeline stage you claim must be understood and justifiable. Copying assembly or circuits without comprehension fails the engineering standard.'),
      tryIt('Record a 5-minute voice memo walking from an instruction fetch to a cache hit on your design. Listen for gaps.'),
      keypoints([
        'Synthesis proves the CLOs, not isolated facts.',
        'Your projects become the Hardware DNA portfolio.',
        'You now reason about how hardware executes - not only how code runs.',
      ]),
    ),
  }),
];

function emit(name, lessons) {
  const body = lessons
    .map((l) => {
      return `  ${JSON.stringify(l, null, 2).replace(/^/gm, '  ').trim()}`;
    })
    .join(',\n');
  // Better: use a TS emitter that keeps types
  const lines = [];
  lines.push(`import type { TutorialLesson } from '../types';`);
  lines.push('');
  lines.push(`export const ${name}: TutorialLesson[] = [`);
  for (const l of lessons) {
    lines.push('  {');
    lines.push(`    slug: ${JSON.stringify(l.slug)},`);
    lines.push(`    title: ${JSON.stringify(l.title)},`);
    lines.push(`    description: ${JSON.stringify(l.description)},`);
    lines.push(`    level: ${JSON.stringify(l.level)},`);
    lines.push(`    section: ${JSON.stringify(l.section)},`);
    lines.push(`    order: ${l.order},`);
    lines.push(`    minutes: ${l.minutes},`);
    lines.push('    content: [');
    for (const b of l.content) {
      lines.push(`      ${JSON.stringify(b)},`);
    }
    lines.push('    ],');
    lines.push('  },');
  }
  lines.push('];');
  lines.push('');
  return lines.join('\n');
}

writeFileSync(join(root, 'beginner.ts'), emit('beginnerLessons', beginnerLessons));
writeFileSync(join(root, 'intermediate.ts'), emit('intermediateLessons', intermediateLessons));
writeFileSync(join(root, 'advanced.ts'), emit('advancedLessons', advancedLessons));

console.log('Wrote lessons:', {
  beginner: beginnerLessons.length,
  intermediate: intermediateLessons.length,
  advanced: advancedLessons.length,
  total: beginnerLessons.length + intermediateLessons.length + advancedLessons.length,
});
