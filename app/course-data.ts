export type Lab = {
  level: "easy" | "medium" | "hard";
  title: string;
  task: string;
  hint: string;
};

export type Reading = {
  source: string;
  section: string;
  url: string;
};

export type Lesson = {
  id: string;
  number: number;
  part: string;
  title: string;
  prompt: string;
  minutes: number;
  xp: number;
  objective: string;
  explanation: string[];
  mentalModel: string;
  concepts: { label: string; detail: string }[];
  code: string;
  codeNotes: string[];
  labs: Lab[];
  quiz: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  readings: Reading[];
  videoIds: string[];
};

export type Video = {
  id: string;
  title: string;
  creator: string;
  duration: string;
  focus: string;
  url: string;
};

export const videos: Video[] = [
  {
    id: "shell-overview",
    title: "Course Overview + The Shell",
    creator: "MIT Missing Semester",
    duration: "48 min",
    focus: "shell, paths, permissions, pipes",
    url: "https://www.youtube.com/watch?v=Z56Jmr9Z34Q",
  },
  {
    id: "shell-tools",
    title: "Shell Tools and Scripting",
    creator: "MIT Missing Semester",
    duration: "64 min",
    focus: "variables, control flow, find, grep",
    url: "https://www.youtube.com/watch?v=kgII-YWo3Zw",
  },
  {
    id: "bash-course",
    title: "Bash Scripting Full Course",
    creator: "linuxhint",
    duration: "3 hr",
    focus: "complete scripting walkthrough",
    url: "https://www.youtube.com/watch?v=e7BufAVwDiM",
  },
  {
    id: "bash-guide",
    title: "How to Write Bash Scripts — Part 1",
    creator: "Learn Linux TV",
    duration: "24 min",
    focus: "beginner-friendly script construction",
    url: "https://www.youtube.com/watch?v=2733cRPudvI",
  },
  {
    id: "five-programs",
    title: "Learn Bash by Building Five Programs",
    creator: "freeCodeCamp.org",
    duration: "4 hr",
    focus: "project-based Bash practice",
    url: "https://www.youtube.com/watch?v=TSQ1ed9jFtY",
  },
];

const tlcl = "https://linuxcommand.org/tlcl.php";
const bash = "https://www.gnu.org/software/bash/manual/bash.html";
const posix = "https://pubs.opengroup.org/onlinepubs/9799919799/";
const coreutils = "https://www.gnu.org/software/coreutils/manual/coreutils.html";
const manpages = "https://man7.org/linux/man-pages/";
const systemd = "https://systemd.io/";

export const lessons: Lesson[] = [
  {
    id: "mental-model",
    number: 1,
    part: "01 / Foundations",
    title: "Why commands look impossible",
    prompt: "kernel != shell != terminal",
    minutes: 22,
    xp: 100,
    objective:
      "Separate the terminal, shell, utilities, kernel, and scripts—and read command lines as small programs instead of magic phrases.",
    explanation: [
      "A terminal session feels like one object, but it is a stack. The terminal displays characters and sends keystrokes. The shell parses a language. Utilities such as grep and find perform focused work. The kernel supplies processes, files, memory, and networking. A script saves the shell-language program for reuse.",
      "Short Unix names are historical, but terseness is not the real difficulty. Visual compression is. Once you separate command vocabulary from shell grammar, a dense one-liner becomes a sentence with verbs, objects, data flow, and decisions.",
    ],
    mentalModel:
      "The terminal is the desk, the shell is the interpreter, utilities are tools, and the kernel is the machinery behind the wall.",
    concepts: [
      { label: "terminal", detail: "Displays text and transports input; it does not parse Bash grammar." },
      { label: "shell", detail: "Expands syntax, redirects streams, and launches builtins or programs." },
      { label: "utility", detail: "Receives an argument vector and implements meanings such as grep -i." },
      { label: "kernel", detail: "Provides system calls and manages processes, filesystems, devices, and networks." },
    ],
    code: "ps aux | grep nginx || printf 'nginx not found\\n'",
    codeNotes: [
      "ps produces a process snapshot.",
      "| sends stdout to grep's stdin.",
      "|| runs the fallback only when the pipeline reports failure.",
    ],
    labs: [
      { level: "easy", title: "Identify the layers", task: "Run type cd, type ls, and type printf. Record which names are builtins, aliases, or external files.", hint: "type asks the shell how it would resolve a name." },
      { level: "medium", title: "Narrate a pipeline", task: "Explain find . -type f -name '*.txt' | wc -l in ordinary language, including what crosses the pipe.", hint: "Separate shell operators from arguments passed to each program." },
      { level: "hard", title: "Locate responsibility", task: "Compare echo *.log with echo '*.log'. Decide which component expands the asterisk.", hint: "Quoting prevents pathname expansion." },
    ],
    quiz: {
      question: "Who normally expands *.log before grep starts?",
      options: ["The terminal", "The shell", "grep", "The filesystem driver"],
      correct: 1,
      explanation: "Pathname expansion is shell grammar. grep receives the resulting names as separate arguments.",
    },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 1–3: shell, navigation, exploring the system", url: tlcl },
      { source: "Bash Reference Manual", section: "§1 Introduction; §3 Basic Shell Features", url: bash },
    ],
    videoIds: ["shell-overview"],
  },
  {
    id: "command-anatomy",
    number: 2,
    part: "01 / Foundations",
    title: "Command anatomy & execution",
    prompt: "command [options] [operands]",
    minutes: 26,
    xp: 100,
    objective:
      "Read a manual synopsis, separate options from operands, inspect name resolution, and treat exit status as a command's second output channel.",
    explanation: [
      "For a simple command, the shell ultimately creates a list of strings. The program sees values conventionally named argv[0], argv[1], and so on. The shell knows that -l is a word; ls decides that it means long format.",
      "Options are conventions, not universal shell rules. Many tools use -- to end option parsing so a later word beginning with a hyphen is treated as data. Exit status is equally important: zero conventionally means success, while each program documents the meaning of nonzero values.",
    ],
    mentalModel:
      "The shell manufactures the argument list; the receiving command assigns meaning to those arguments.",
    concepts: [
      { label: "argv", detail: "The exact ordered strings delivered to a program after shell expansion." },
      { label: "--", detail: "A widespread utility convention that ends option parsing." },
      { label: "resolution", detail: "type -a reveals aliases, functions, builtins, and executable paths." },
      { label: "status", detail: "A small integer result used by if, &&, ||, and callers." },
    ],
    code: "grep -q 'error' sample.txt\nstatus=$?\nprintf 'status=%s\\n' \"$status\"",
    codeNotes: [
      "-q suppresses normal matching output; status carries the answer.",
      "$? must be copied immediately because the next command replaces it.",
      "For grep: 0 means match, 1 means no match, and values above 1 mean an operational error.",
    ],
    labs: [
      { level: "easy", title: "Resolve names", task: "Compare type -a echo, test, ls, and command -v sh.", hint: "One name can have both a builtin and an external implementation." },
      { level: "medium", title: "End option parsing", task: "In a lab directory, create a file named -draft and safely list and remove it using --.", hint: "Use touch -- -draft and rm -- -draft only in your practice folder." },
      { level: "hard", title: "Status protocol", task: "Test grep with a match, no match, and missing input. Capture each status immediately.", hint: "Do not insert printf before status=$?." },
    ],
    quiz: {
      question: "Which sequence reliably stores the status of build?",
      options: ["build; printf x; s=$?", "build; s=$?", "s=$?; build", "build & s=$?"],
      correct: 1,
      explanation: "Status is replaced by the next foreground command, so it must be copied immediately.",
    },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 5: Working with Commands", url: tlcl },
      { source: "POSIX Shell & Utilities", section: "Utility syntax guidelines and exit status", url: posix },
    ],
    videoIds: ["shell-overview"],
  },
  {
    id: "quoting-expansion",
    number: 3,
    part: "02 / Shell Grammar",
    title: "Tokens, quoting & expansion",
    prompt: "parse → expand → redirect → execute",
    minutes: 34,
    xp: 120,
    objective:
      "Predict Bash expansion, choose the right quotation tool, distinguish globs from regex, and handle unusual filenames without ambiguity.",
    explanation: [
      "Bash first recognizes syntax and quotes, parses a command structure, performs expansions, applies word splitting and pathname expansion in the contexts where they are allowed, removes quote characters, prepares redirections, and finally executes. Tiny quotation changes can therefore change the argument vector before a utility ever runs.",
      "Single quotes preserve literal text. Double quotes preserve each expanded value as one word while allowing parameter and command substitution. An unquoted parameter expansion can split into several words and then trigger pathname expansion—usually an accident. The durable default is: quote expansions unless splitting or globbing is the intended operation.",
    ],
    mentalModel:
      "Quotes are instructions to the shell parser, not decorative punctuation passed to the command.",
    concepts: [
      { label: "single quotes", detail: "Make everything inside literal; a literal single quote needs a deliberate boundary." },
      { label: "double quotes", detail: "Allow selected expansions while preventing ordinary splitting and globbing." },
      { label: "parameter", detail: "${name:-default}, ${#name}, and prefix/suffix removal transform shell values." },
      { label: "NUL records", detail: "find -print0 and xargs -0 safely preserve filenames containing whitespace or newlines." },
    ],
    code: "name='Ada Lovelace'\nprintf '<%s>\\n' \"$name\"\nprintf '<%s>\\n' $name",
    codeNotes: [
      "The quoted expansion supplies one data argument: Ada Lovelace.",
      "The unquoted expansion normally splits into two words.",
      "The same visual value can therefore produce different argv structures.",
    ],
    labs: [
      { level: "easy", title: "Count arguments", task: "Set x='one two' and compare quoted versus unquoted printf calls.", hint: "Wrap output in angle brackets so argument boundaries become visible." },
      { level: "medium", title: "Decompose a path", task: "Use parameter expansion to split /srv/app/archive.tar.gz into basename and suffix-free forms.", hint: "Try ${path##*/} and ${base%.*}." },
      { level: "hard", title: "Hostile filenames", task: "Create practice filenames with spaces and a leading hyphen; hash them through a NUL-delimited find pipeline.", hint: "Pair find -print0 with xargs -0 -- sha256sum." },
    ],
    quiz: {
      question: "If x='a b', what does printf '<%s>\\n' \"$x\" receive as data?",
      options: ["Two arguments: a and b", "One argument containing a b", "The literal characters $x", "No argument"],
      correct: 1,
      explanation: "Double quotes preserve the expanded value as one word while still allowing parameter expansion.",
    },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 7–8: Seeing the World as the Shell Sees It; Advanced Keyboard Tricks", url: tlcl },
      { source: "Bash Reference Manual", section: "§3.1.2 Quoting; §3.5 Shell Expansions", url: bash },
      { source: "POSIX Shell Command Language", section: "Token recognition, quoting, and word expansions", url: posix },
    ],
    videoIds: ["shell-tools"],
  },
  {
    id: "streams-pipelines",
    number: 4,
    part: "02 / Shell Grammar",
    title: "Streams, pipes & control lists",
    prompt: "0 stdin · 1 stdout · 2 stderr",
    minutes: 38,
    xp: 140,
    objective:
      "Track file descriptors, apply redirections left-to-right, distinguish data flow from control flow, and reason about pipeline status.",
    explanation: [
      "A process normally begins with three open file descriptors: standard input 0, standard output 1, and standard error 2. Redirection rewires one of those numbered handles. A pipeline connects descriptor 1 of one process to descriptor 0 of the next; diagnostics stay separate unless you redirect them.",
      "Redirections are processed left-to-right. In task >run.log 2>&1, stdout first points to the file and stderr then duplicates that destination. Reversing the tokens produces a different graph. Pipelines move bytes; && and || make decisions from status. These are separate dimensions of composition.",
    ],
    mentalModel:
      "Draw three labeled wires. Redirection moves a wire; a pipe joins stdout to the next stdin; status decides which branch runs.",
    concepts: [
      { label: "stdin / 0", detail: "The conventional input stream, often a keyboard, file, or upstream pipe." },
      { label: "stdout / 1", detail: "Normal result data, suitable for files or downstream processing." },
      { label: "stderr / 2", detail: "Diagnostics kept separate so data pipelines remain clean." },
      { label: "pipefail", detail: "A Bash option that makes a pipeline reflect a failed stage instead of only the final stage." },
    ],
    code: "ss -ltnp | grep -q ':8091' || printf '8091 is free\\n'",
    codeNotes: [
      "ss observes listening TCP sockets using numeric addresses and optional process details.",
      "grep -q turns matching into status without normal output.",
      "The fallback observes current state; it does not reserve the port against a race.",
    ],
    labs: [
      { level: "easy", title: "Split the streams", task: "Name one existing and one missing path, redirecting stdout and stderr to different files.", hint: "Use >out.log 2>err.log." },
      { level: "medium", title: "Order matters", task: "Compare >all.log 2>&1 with 2>&1 >out.log by drawing descriptors after each token.", hint: "Duplication copies the destination as it exists at that moment." },
      { level: "hard", title: "Pipeline truth", task: "Create a pipeline whose early stage fails and final stage succeeds. Compare default status, pipefail, and PIPESTATUS.", hint: "Copy PIPESTATUS immediately into an array." },
    ],
    quiz: {
      question: "What does task >run.log 2>&1 do?",
      options: ["Only stderr goes to the file", "Both stdout and stderr go to the file", "stderr becomes input", "The task runs twice"],
      correct: 1,
      explanation: "stdout is redirected first; stderr then duplicates stdout's current destination.",
    },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 6: Redirection", url: tlcl },
      { source: "Bash Reference Manual", section: "§3.2 Pipelines/Lists; §3.6 Redirections", url: bash },
      { source: "POSIX Shell Command Language", section: "Pipelines, AND-OR lists, and redirection", url: posix },
    ],
    videoIds: ["shell-overview", "shell-tools"],
  },
  {
    id: "filesystem-tree",
    number: 5,
    part: "03 / Files & Search",
    title: "The filesystem as a tree",
    prompt: "/ is one rooted namespace",
    minutes: 29,
    xp: 110,
    objective: "Navigate with explicit invariants, interpret paths and ls metadata, and distinguish names, links, objects, filesystems, and mount points.",
    explanation: [
      "Linux exposes files and directories through a single tree rooted at /. Separate disks and remote filesystems are normally attached at directories called mount points. An absolute path starts at /; a relative path starts at the shell's current working directory. The meaning of a relative path therefore depends on process state.",
      "A directory entry maps a name to an underlying filesystem object. Hard links can give one object several names, while symbolic links store another path to follow. That distinction explains why deleting one name does not necessarily remove the object and why a broken symbolic link can still exist as an entry.",
    ],
    mentalModel: "A path is a route through a namespace, not the file itself. Always separate the name, the directory entry, the target object, and the mounted filesystem.",
    concepts: [
      { label: "absolute path", detail: "Starts at / and does not depend on the process working directory." },
      { label: "relative path", detail: "Resolves from the current working directory; . and .. are explicit navigation nodes." },
      { label: "symlink", detail: "A small object containing another path, which may later resolve or become broken." },
      { label: "mount point", detail: "A directory where another filesystem is attached to the rooted namespace." },
    ],
    code: "pwd\ncd /var/log\nprintf '%s\\n' \"$PWD\"\ncd -",
    codeNotes: ["pwd makes the current location observable.", "cd changes shell state, so it is normally a builtin rather than a child utility.", "cd - returns to the previous Bash working directory."],
    labs: [
      { level: "easy", title: "Navigation invariants", task: "Predict and verify pwd after moving through /, ., .., and a known absolute path.", hint: "Say the expected absolute path before each cd." },
      { level: "medium", title: "Read a long listing", task: "Choose one harmless directory entry and label file type, mode, link count, owner, group, size, and timestamp from ls -l.", hint: "The first character is type; the next nine are permission bits." },
      { level: "hard", title: "Name versus object", task: "In a practice directory, create a file, a hard link, and a symbolic link. Compare ls -li before and after removing one name.", hint: "The inode column helps reveal shared underlying identity on one filesystem." },
    ],
    quiz: { question: "What is a mount point?", options: ["A Windows drive letter", "A directory where a filesystem joins the tree", "A Bash alias", "A file descriptor"], correct: 1, explanation: "Linux presents mounted filesystems through directories inside one rooted namespace." },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 2–3: Navigation and Exploring the System", url: tlcl },
      { source: "GNU Coreutils Manual", section: "File name manipulation and directory listing", url: coreutils },
    ],
    videoIds: ["shell-overview"],
  },
  {
    id: "file-operations",
    number: 6,
    part: "03 / Files & Search",
    title: "Copy, move, delete & archive",
    prompt: "preview → act → verify",
    minutes: 36,
    xp: 140,
    objective: "Predict file-operation semantics, protect destructive operands, understand archive layers, and verify bytes without confusing consistency with trust.",
    explanation: [
      "File commands are compact interfaces with context-sensitive destinations. cp source destination may create a new name or copy inside a directory; mv may be a cheap rename on one filesystem or a copy-and-remove sequence across filesystems. A trailing slash in rsync can change whether you mean a directory itself or its contents.",
      "Deletion has no universal undo. Build selections with find or printf, inspect them, then apply the smallest intended change in a dedicated lab. Archives bundle names and metadata; compression transforms the byte stream. A checksum can show that bytes match an expected digest, but authenticity needs an independently trusted digest or signature.",
    ],
    mentalModel: "Before mutation, freeze five facts: source, destination, object type, overwrite policy, and filesystem boundary. Then preview and verify.",
    concepts: [
      { label: "cp", detail: "Creates a copy; preservation, links, recursion, and overwrite behavior depend on explicit options." },
      { label: "mv", detail: "Renames or relocates; crossing filesystems introduces copy/remove partial-failure cases." },
      { label: "rm --", detail: "Ends option parsing so a leading-hyphen filename is treated as an operand." },
      { label: "tar + gzip", detail: "tar archives a tree; gzip compresses a byte stream. They solve different layers." },
    ],
    code: "tar -czf lab-backup.tar.gz practice/\ntar -tzf lab-backup.tar.gz\nsha256sum lab-backup.tar.gz",
    codeNotes: ["-c creates, -z adds gzip compression, and -f names the archive file.", "Listing with -t inspects membership without extraction.", "The digest supports later byte comparison only when the expected value is trustworthy."],
    labs: [
      { level: "easy", title: "Destination semantics", task: "Copy one practice file to a new filename, then into an existing directory. Narrate the resulting paths.", hint: "Inspect with find before and after." },
      { level: "medium", title: "Dry-run synchronization", task: "Compare rsync -a --dry-run source/ destination/ with the form lacking the source slash.", hint: "Do not add --delete; focus on the destination layout." },
      { level: "hard", title: "Archive round trip", task: "Archive a practice tree, list it, hash it, extract into a new directory, and compare the two trees.", hint: "Use diff -r for a simple content comparison in the lab." },
    ],
    quiz: { question: "What does a matching SHA-256 digest prove by itself?", options: ["Publisher identity", "Byte consistency with the supplied digest", "Absence of vulnerabilities", "That transport was encrypted"], correct: 1, explanation: "A digest comparison establishes consistency; trust requires an independent authentic source for the expected digest." },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 4 and 18: Manipulating Files; Archiving and Backup", url: tlcl },
      { source: "GNU Coreutils Manual", section: "cp, mv, rm, link, and checksum utilities", url: coreutils },
    ],
    videoIds: ["shell-overview"],
  },
  {
    id: "permissions",
    number: 7,
    part: "03 / Files & Search",
    title: "Permissions & least privilege",
    prompt: "identity × ownership × mode × path",
    minutes: 38,
    xp: 150,
    objective: "Decode mode bits, distinguish file and directory permissions, calculate symbolic and octal changes, understand umask, and avoid reflexive elevation.",
    explanation: [
      "Traditional Unix access checks combine the process's effective user and groups with object ownership and mode bits. The kernel selects one class—owner, group, or other—and checks the requested operation. ACLs, SELinux, AppArmor, capabilities, containers, and mount options can add policy beyond these nine familiar bits.",
      "Permission letters change meaning by object type. Read on a file permits reading data; read on a directory permits listing names. Execute on a file permits program execution when other conditions allow it; execute on a directory permits traversal and lookup. sudo changes identity for a command but does not make the surrounding shell's redirections privileged.",
    ],
    mentalModel: "Permissions answer a question about an attempted operation by a process along an entire path—not a permanent label saying a file is simply accessible.",
    concepts: [
      { label: "u g o", detail: "Owner, owning group, and everyone else are three mode classes." },
      { label: "directory x", detail: "Search/traverse permission: resolve names inside when parent paths also allow it." },
      { label: "umask", detail: "Removes requested default bits at creation; it is not a permission template to add." },
      { label: "least privilege", detail: "Use only the identity and permissions required for the specific operation." },
    ],
    code: "stat -c '%A %a %U:%G %n' ./practice.txt\nchmod u=rw,go=r ./practice.txt",
    codeNotes: ["stat reports symbolic and octal modes with ownership.", "The symbolic chmod form states the complete intended permissions per class.", "0644 means owner read/write and group/other read, not a universal safe setting for every object."],
    labs: [
      { level: "easy", title: "Decode the mode", task: "Translate -rw-r----- into permissions for owner, group, and other.", hint: "Read three triplets after the file-type character." },
      { level: "medium", title: "Directory semantics", task: "In a practice tree, vary read and execute on one directory and observe listing versus traversal.", hint: "Keep another terminal open and restore permissions immediately after each observation." },
      { level: "hard", title: "Explain a denial", task: "Use namei -l or repeated ls -ld to inspect every component of a deliberately inaccessible practice path.", hint: "Access can fail at any parent directory, not only the final file." },
    ],
    quiz: { question: "What does execute permission on a directory primarily allow?", options: ["Running every file inside", "Traversing it and looking up contained names", "Compressing the directory", "Changing its owner"], correct: 1, explanation: "Directory execute is search/traversal permission; listing names is associated with directory read." },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 9: Permissions", url: tlcl },
      { source: "GNU Coreutils Manual", section: "Mode structure, chmod, chown, and umask-related behavior", url: coreutils },
    ],
    videoIds: ["shell-overview"],
  },
  {
    id: "find-metadata",
    number: 8,
    part: "03 / Files & Search",
    title: "Finding files & metadata",
    prompt: "start points + expression + action",
    minutes: 40,
    xp: 150,
    objective: "Choose the right discovery index, build find expressions deliberately, use safe actions, and inspect type, size, time, and filesystem capacity.",
    explanation: [
      "Discovery tools answer different questions. type and command -v explain shell command resolution. locate searches a periodically built name database. find walks current directory trees and evaluates an expression against each entry. whereis searches conventional program locations. Pick the system whose data and freshness match the question.",
      "find is best read as start points followed by an expression. Tests such as -type and -name produce truth values; operators combine them; actions such as -print or -exec produce effects. Quote patterns so the shell does not expand them too early, and group OR expressions with escaped parentheses.",
    ],
    mentalModel: "find is a small predicate language evaluated once per directory entry. Build the set first, print it, then attach a narrowly scoped action.",
    concepts: [
      { label: "start point", detail: "The directory roots find will walk; use the narrowest useful scope." },
      { label: "tests", detail: "Predicates such as -type f, -name, -size, and -mtime filter entries." },
      { label: "-exec … {} +", detail: "Passes batches of matched paths as arguments without line-based reparsing." },
      { label: "stat / file", detail: "stat reports metadata; file infers content type from data rather than extension alone." },
    ],
    code: "find ./src -type f -name '*.sh' -print\nfind ./src -type f -name '*.sh' -exec shellcheck -- {} +",
    codeNotes: ["./src is the bounded start point.", "The quoted glob is delivered to find instead of expanded by the shell.", "Print and review first; -exec … + then batches exact path arguments."],
    labs: [
      { level: "easy", title: "Tool selection", task: "For five questions, choose among type, command -v, locate, find, and whereis, and explain freshness and scope.", hint: "Ask whether you need shell semantics, a database, or a live tree walk." },
      { level: "medium", title: "Expression grammar", task: "Find regular .log files larger than a small threshold in a lab tree, printing path and size.", hint: "Use -type f, -name, -size, and -printf where GNU find is available." },
      { level: "hard", title: "Safe batching", task: "Use -exec … {} + to hash selected practice files without parsing newline-delimited names.", hint: "Add -- before path operands if the consumer supports it." },
    ],
    quiz: { question: "Why quote '*.log' in a find expression?", options: ["To encrypt it", "To prevent the shell expanding it before find receives the pattern", "To make find recursive", "To enable regex mode"], correct: 1, explanation: "The pattern belongs to find's -name test; quoting keeps the shell from performing pathname expansion first." },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 17: Searching for Files", url: tlcl },
      { source: "GNU Findutils Manual", section: "Finding Files: tests, operators, actions, and security considerations", url: "https://www.gnu.org/software/findutils/manual/html_mono/find.html" },
    ],
    videoIds: ["shell-tools"],
  },
  {
    id: "text-regex",
    number: 9,
    part: "04 / Text Interface",
    title: "Text, records & regex",
    prompt: "bytes → characters → records → fields",
    minutes: 37,
    xp: 140,
    objective: "Reason about records, delimiters, encodings, locale, and the differences between shell globs, basic regex, and extended regex.",
    explanation: [
      "Unix tools compose because they agree on streams of bytes and common record conventions, usually newline-separated text. That simplicity is powerful but not magical: a byte is not always a complete character, a line is not always a business record, and whitespace is not always a safe field delimiter. Locale can change character classes, collation, and case behavior.",
      "Three pattern languages often share symbols but have different parsers. Shell globs select pathnames before a command runs. Basic and extended regular expressions are interpreted by tools such as grep, sed, and awk; extended regex changes which operators need escaping. Use fixed-string mode when the requirement is literal text.",
    ],
    mentalModel: "Before matching, name the layer: filename pattern, regular expression, or program syntax. Then name the record and field boundaries.",
    concepts: [
      { label: "record", detail: "The unit processed at a time—often a line, but sometimes NUL, CSV, JSON, or another structure." },
      { label: "locale", detail: "Rules that can affect collation, character classes, ranges, and case conversion." },
      { label: "BRE / ERE", detail: "Two regex dialects with different escaping rules for grouping, alternation, and repetition." },
      { label: "fixed string", detail: "Literal matching that avoids regex metacharacter interpretation, commonly grep -F." },
    ],
    code: "LC_ALL=C grep -E '^[[:digit:]]{3}:' codes.txt",
    codeNotes: ["LC_ALL=C requests predictable bytewise locale behavior for this command.", "-E selects extended regular expressions.", "Anchors require exactly three digits followed by a colon at the beginning of a line."],
    labs: [
      { level: "easy", title: "Name the language", task: "Classify *.log, ^ERROR, and awk '$2 > 5' by parser and pattern language.", hint: "Ask which program receives the text and at what stage." },
      { level: "medium", title: "Literal versus regex", task: "Search a practice file for a.b as both regex and fixed text, explaining the result difference.", hint: "Compare grep and grep -F." },
      { level: "hard", title: "Locale experiment", task: "Sort a small multilingual practice list under your normal locale and LC_ALL=C, recording the changed contract.", hint: "Do not claim one is universally correct; each encodes a different ordering policy." },
    ],
    quiz: { question: "Which tool usually expands *.log in grep ERROR *.log?", options: ["grep's regex engine", "The shell's pathname expansion", "The terminal", "The locale database"], correct: 1, explanation: "An unquoted glob is expanded by the shell before grep is executed; grep's regex engine handles ERROR separately." },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 19: Regular Expressions", url: tlcl },
      { source: "POSIX", section: "Regular Expressions and internationalization environment", url: posix },
    ],
    videoIds: ["shell-tools"],
  },
  {
    id: "grep-selection",
    number: 10,
    part: "04 / Text Interface",
    title: "Selection with grep",
    prompt: "pattern × scope × evidence × status",
    minutes: 35,
    xp: 140,
    objective: "Design precise searches, interpret grep's three-way status contract, recurse within boundaries, count the intended unit, and retain useful context.",
    explanation: [
      "grep is a selector: it reads records and emits those matching a pattern. A trustworthy search defines the pattern dialect, input scope, case policy, binary-file policy, recursion boundaries, and desired evidence. Flags are compressed answers to those design questions—not facts to memorize independently.",
      "Status is a three-way interface. Zero means at least one selected line, one means no selected line, and values above one indicate an operational problem. Treating all nonzero values as 'not found' can hide unreadable files or invalid patterns. Counting also needs a noun: matching lines, matching files, or occurrences are different results.",
    ],
    mentalModel: "A grep invocation is a query plan. Define corpus, pattern language, selection unit, evidence format, and failure handling before choosing flags.",
    concepts: [
      { label: "-F / -E", detail: "Select literal fixed strings or extended regular expressions explicitly." },
      { label: "-q", detail: "Suppresses normal output when only status is needed." },
      { label: "-r boundaries", detail: "Recursive search needs deliberate roots, include/exclude rules, symlink policy, and secret awareness." },
      { label: "context", detail: "-A, -B, and -C retain neighboring records needed to interpret a match." },
    ],
    code: "if grep -qF -- 'READY' service.log; then\n  printf 'ready\\n'\nelse\n  status=$?\n  (( status == 1 )) || exit \"$status\"\nfi",
    codeNotes: ["-F treats READY literally and -- ends option parsing.", "The if consumes success without an extra $?.", "The else branch distinguishes an ordinary no-match from a real grep error."],
    labs: [
      { level: "easy", title: "Design the query", task: "Search a lab log for a literal token, showing line numbers and two lines of context.", hint: "Use -F, -n, and -C 2." },
      { level: "medium", title: "Three statuses", task: "Write a condition that distinguishes match, no match, and missing input.", hint: "Capture status as the first command in the else branch." },
      { level: "hard", title: "Bound recursive scope", task: "Search only .sh files under src while excluding a generated directory; state every encoded boundary.", hint: "Use a narrow start path plus --include and --exclude-dir." },
    ],
    quiz: { question: "What does grep status 1 normally mean?", options: ["At least one selected line", "No selected line", "The pattern was always invalid", "The shell could not start"], correct: 1, explanation: "grep reserves status 1 for a valid search with no selected lines; operational errors use higher values." },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 19–20: Regular Expressions and Text Processing", url: tlcl },
      { source: "GNU grep Manual", section: "Matching control, output control, file selection, and exit status", url: "https://www.gnu.org/software/grep/manual/grep.html" },
    ],
    videoIds: ["shell-tools"],
  },
  {
    id: "filter-toolkit",
    number: 11,
    part: "04 / Text Interface",
    title: "The core filter toolkit",
    prompt: "select → transform → aggregate",
    minutes: 42,
    xp: 160,
    objective: "Compose sort, uniq, cut, paste, tr, tee, wc, and xargs by stating each program's input/output contract and record assumptions.",
    explanation: [
      "Small filters are useful because each transforms a clearly described stream. sort orders records according to keys and locale; uniq compares adjacent records only; cut extracts delimiter-defined fields; tr maps or deletes characters; paste combines corresponding records; wc counts a chosen unit; tee copies a stream to a file and onward.",
      "Correct composition requires compatible boundaries. sort | uniq -c works because sorting makes equal records adjacent. xargs converts a serialized stream into argument vectors, so its delimiter policy must match the producer. For arbitrary filenames, use a NUL-producing command and xargs -0 rather than trusting newlines or whitespace.",
    ],
    mentalModel: "Annotate every pipe with a data type: 'newline-delimited lines', 'tab fields', or 'NUL-delimited paths'. If adjacent contracts disagree, the pipeline is wrong.",
    concepts: [
      { label: "sort | uniq", detail: "uniq removes adjacent duplicates; sorting is what groups equal records globally." },
      { label: "cut", detail: "Extracts fields by a simple delimiter contract; it is not a full CSV parser." },
      { label: "tee", detail: "Forks one input stream to stdout and files so observation can continue downstream." },
      { label: "xargs", detail: "Builds command argument vectors from serialized input; delimiter and batching rules are part of correctness." },
    ],
    code: "cut -d: -f7 /etc/passwd | sort | uniq -c | sort -nr",
    codeNotes: ["cut selects field 7 from colon-delimited records.", "The first sort groups identical shell paths so uniq -c can count adjacent values.", "The final numeric reverse sort ranks counts from largest to smallest."],
    labs: [
      { level: "easy", title: "Explain every pipe", task: "Narrate the example pipeline and label the record format crossing each pipe.", hint: "Do not say only 'filters data'; name the exact transformation." },
      { level: "medium", title: "Observe and continue", task: "Insert tee into a practice pipeline so an intermediate sorted stream is saved without preventing later counting.", hint: "tee emits the same stream it writes." },
      { level: "hard", title: "Filename protocol", task: "Connect find -print0 to an xargs -0 consumer and explain why ordinary xargs is ambiguous.", hint: "Spaces and newlines can occur in one pathname." },
    ],
    quiz: { question: "Why is sort commonly placed before uniq -c?", options: ["uniq understands only numbers", "uniq compares adjacent records", "sort converts text to binary", "Pipes require alphabetical data"], correct: 1, explanation: "Sorting makes equal records adjacent, allowing uniq to combine and count all identical values." },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 20–21: Text Processing and Formatting Output", url: tlcl },
      { source: "GNU Coreutils Manual", section: "sort, uniq, cut, paste, tr, tee, and wc", url: coreutils },
    ],
    videoIds: ["shell-tools"],
  },
  {
    id: "sed-awk",
    number: 12,
    part: "04 / Text Interface",
    title: "Transforming with sed & awk",
    prompt: "sed edits streams · awk processes records",
    minutes: 46,
    xp: 170,
    objective: "Choose between stream editing and record processing, write readable transformations, pass shell values as data, and know when structured parsers are required.",
    explanation: [
      "sed applies editing commands to an input stream: substitution, selection by address, deletion, insertion, and controlled output. awk is a record-processing language: split each record into fields, test a pattern, run an action, and maintain state across records. Their concise syntax is best when the data contract is simple and explicit.",
      "Shell quotation and the inner language are separate parsers. Keep static sed or awk programs in single quotes. Pass changing shell values through defined data interfaces such as awk -v rather than concatenating them into program source. Once the input is CSV with quoting, JSON, XML, or another structured format, use a parser that understands that grammar.",
    ],
    mentalModel: "sed is a programmable editing conveyor belt; awk is a tiny report language with records, fields, conditions, actions, and state.",
    concepts: [
      { label: "sed address", detail: "Restricts an editing command to selected line numbers or matching records." },
      { label: "s/old/new/g", detail: "Substitutes all matches on each selected pattern space, with delimiter and escaping rules." },
      { label: "awk -v", detail: "Passes a shell value as data before program execution instead of inserting source code." },
      { label: "FS / OFS", detail: "Awk input and output field separator contracts; whitespace default has special behavior." },
    ],
    code: "threshold=80\nawk -v min=\"$threshold\" '$2 >= min { printf \"%s %d\\n\", $1, $2 }' scores.txt",
    codeNotes: ["The shell expands threshold into one -v argument.", "Inside single quotes, $1 and $2 belong to awk, not the shell.", "The pattern selects records; the action prints a controlled report format."],
    labs: [
      { level: "easy", title: "Safe preview edit", task: "Use sed to replace a literal token in displayed output without changing the source file.", hint: "Avoid -i until output has been reviewed." },
      { level: "medium", title: "Aggregate fields", task: "Use awk to sum one numeric field by a simple category and print totals in END.", hint: "An associative array can map category names to running totals." },
      { level: "hard", title: "Code versus data", task: "Pass a value containing spaces to awk with -v and explain why source concatenation would be fragile.", hint: "Count parser layers and metacharacters in both languages." },
    ],
    quiz: { question: "Why prefer awk -v limit=\"$limit\" '...' to inserting the value into awk source?", options: ["It passes the value as data across the parser boundary", "It disables fields", "It always makes awk POSIX-incompatible", "It encrypts the value"], correct: 0, explanation: "-v keeps dynamic data out of program-source construction, reducing quoting errors and injection risk." },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 20: Text Processing", url: tlcl },
      { source: "GNU sed and GNU awk Manuals", section: "Addresses/substitution; records/fields/actions/variables", url: "https://www.gnu.org/software/gawk/manual/gawk.html" },
    ],
    videoIds: ["shell-tools"],
  },
  {
    id: "processes-signals",
    number: 13,
    part: "05 / Running Systems",
    title: "Processes, jobs & signals",
    prompt: "program + state = process",
    minutes: 39,
    xp: 150,
    objective: "Inspect process relationships, distinguish processes from shell jobs, interpret changing resource samples, and request termination with the least disruptive signal.",
    explanation: [
      "A program file becomes a process when executed. The process has a PID, parent, credentials, environment, working directory, open descriptors, memory mappings, and scheduling state. A shell job is the interactive shell's grouping of one or more pipeline processes; job IDs such as %1 are not operating-system PIDs.",
      "Tools such as ps give snapshots, while top and htop repeatedly sample. CPU and memory columns require context: interval, core count, resident versus virtual memory, caches, and tool convention. Signals are asynchronous requests. SIGTERM asks a process to shut down cleanly; SIGKILL cannot be handled and should be a last resort after evidence and escalation.",
    ],
    mentalModel: "A process is a live resource-owning execution context. Observe identity and relationships first; change it only with the gentlest effective control.",
    concepts: [
      { label: "PID / PPID", detail: "A process identifier and the parent process that created it." },
      { label: "job control", detail: "Shell-local foreground/background grouping managed with jobs, fg, bg, and Ctrl-Z." },
      { label: "SIGTERM", detail: "A catchable request for orderly termination and cleanup." },
      { label: "wait", detail: "Lets a shell collect a child process status and avoid leaving a completed child unreaped." },
    ],
    code: "ps -eo pid,ppid,user,state,etime,cmd --sort=ppid | head\nprintf 'shell pid=%s\\n' \"$$\"",
    codeNotes: ["ps selects explicit evidence columns instead of relying on a memorized default view.", "Sorting by parent helps reveal families of processes.", "$$ reports a shell-associated PID; pipeline and subshell contexts need careful interpretation."],
    labs: [
      { level: "easy", title: "Build a process tree", task: "Find your shell PID and trace its parent chain with ps, without changing any process.", hint: "Use ps -o pid,ppid,cmd -p PID repeatedly or pstree when installed." },
      { level: "medium", title: "Job versus process", task: "Start a harmless sleep in the background and compare jobs -l with ps evidence; then wait for it.", hint: "The job ID and PID are distinct namespaces." },
      { level: "hard", title: "Signal ladder", task: "In a dedicated lab, trap TERM in a tiny script, observe cleanup, and explain why KILL prevents that handler.", hint: "Use only your own short-lived practice process." },
    ],
    quiz: { question: "Why prefer SIGTERM before SIGKILL?", options: ["TERM can allow orderly cleanup", "TERM always restarts the process", "KILL is a shell alias", "KILL changes file ownership"], correct: 0, explanation: "SIGTERM can be handled for cleanup; SIGKILL stops the process without giving it that opportunity." },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 10: Processes", url: tlcl },
      { source: "Linux man-pages", section: "signal(7), kill(2), wait(2), and proc(5)", url: manpages },
    ],
    videoIds: ["shell-overview"],
  },
  {
    id: "systemd-logs",
    number: 14,
    part: "05 / Running Systems",
    title: "Services & logs with systemd",
    prompt: "unit state + journal evidence",
    minutes: 41,
    xp: 160,
    objective: "Inspect units, distinguish runtime activity from enablement, query journal evidence precisely, and use machine-oriented properties in automation.",
    explanation: [
      "On many Linux distributions, systemd manages units such as services, sockets, timers, mounts, paths, and targets. A service can be active now without being enabled for a future boot, or enabled while currently inactive. Load state, active state, substate, result, and enablement answer different questions.",
      "systemctl status is designed for humans and may abbreviate details. systemctl show exposes named properties for scripts. journalctl queries structured records by unit, time, boot, priority, and fields. A disciplined diagnosis moves from unit identity and state to recent logs, dependencies, configuration checks, resources, and only then a narrowly justified state change.",
    ],
    mentalModel: "Service diagnosis is an evidence bundle: unit definition, current state, recent transition result, related logs, dependencies, and resources.",
    concepts: [
      { label: "active", detail: "Runtime state now; it does not answer whether the unit starts automatically later." },
      { label: "enabled", detail: "Installation of startup relationships, separate from current activity." },
      { label: "systemctl show", detail: "Machine-oriented key/value properties safer than parsing human status text." },
      { label: "journal fields", detail: "Structured metadata enabling queries by unit, boot, priority, PID, time, and more." },
    ],
    code: "systemctl show ssh.service -p LoadState -p ActiveState -p SubState -p Result\njournalctl -u ssh.service -b --since '30 min ago' --no-pager",
    codeNotes: ["show requests explicit properties for stable inspection.", "-u scopes logs to a unit and -b to the current boot.", "The time bound prevents an unreviewable dump and keeps evidence relevant."],
    labs: [
      { level: "easy", title: "Read-only unit evidence", task: "Choose a known local unit and compare is-active, is-enabled, status, and selected show properties.", hint: "Do not start, stop, or enable anything for this observation." },
      { level: "medium", title: "Bound the journal", task: "Query one unit for the current boot and a short time window, then add a priority boundary.", hint: "Use journalctl's --since and -p options." },
      { level: "hard", title: "Diagnosis narrative", task: "Create a read-only evidence checklist for an inactive practice or harmless unit, separating facts from hypotheses.", hint: "State which command supports each claim." },
    ],
    quiz: { question: "Which statement is correct?", options: ["Enabled always means active now", "Active and enabled describe different dimensions", "status is a kernel system call", "journalctl can only show the current minute"], correct: 1, explanation: "Activity is runtime state; enablement describes configured startup relationships." },
    readings: [
      { source: "systemd Documentation", section: "systemctl, systemd.unit, systemd.service, and journalctl manual pages", url: systemd },
      { source: "The Linux Command Line", section: "Ch. 10 and Ch. 16 context: processes and networking services", url: tlcl },
    ],
    videoIds: [],
  },
  {
    id: "networking-cli",
    number: 15,
    part: "05 / Running Systems",
    title: "Networking from the CLI",
    prompt: "link → address → route → DNS → transport → app",
    minutes: 44,
    xp: 170,
    objective: "Troubleshoot by layers, inspect local sockets, test name resolution and routes, examine HTTP/TLS exchanges, and use SSH with verification-aware defaults.",
    explanation: [
      "Network failures become tractable when tested from the bottom up. Confirm interface/link state, local addresses, routing decisions, name resolution, transport reachability, and finally the application protocol. A successful DNS lookup does not prove the service is listening; a listening socket does not prove a firewall path; an HTTP response does not prove the content is correct.",
      "ss inspects local socket state. ip shows addresses and routes. getent or dig asks name-resolution questions. curl exposes HTTP request/response details and TLS validation. SSH combines encrypted transport, server identity verification, and user authentication; host-key warnings are security evidence to investigate, not prompts to bypass.",
    ],
    mentalModel: "Test one layer at a time and stop at the first failed contract. Record the exact target, namespace, address family, port, and evidence.",
    concepts: [
      { label: "listening socket", detail: "A local endpoint waiting for connections; address binding determines its reachable interfaces." },
      { label: "DNS", detail: "Maps names to data such as addresses; it is separate from connection and application success." },
      { label: "curl -v", detail: "Shows connection, TLS, and HTTP exchange details while keeping response data distinct." },
      { label: "SSH host key", detail: "Evidence of server identity that should be verified when new or changed." },
    ],
    code: "ss -ltnp\nip route get 1.1.1.1\ngetent ahosts example.com\ncurl --fail --show-error --location --head https://example.com/",
    codeNotes: ["ss observes listening TCP sockets numerically and may show processes when permitted.", "ip route get asks the kernel which route it would use without sending application data.", "curl checks an HTTP endpoint with TLS validation and explicit failure reporting."],
    labs: [
      { level: "easy", title: "Local socket inventory", task: "Inspect listening TCP sockets and explain local address, port, state, and any visible process ownership.", hint: "Read-only ss output may omit process details you lack permission to see." },
      { level: "medium", title: "Layered endpoint check", task: "For a public documentation site, record DNS results, route choice, and HTTP headers as separate evidence.", hint: "Do not combine these into one vague 'network works' conclusion." },
      { level: "hard", title: "Port probe limits", task: "Explain why ss -ltn | grep ':8091' observes current local state but cannot reserve a port or cover every namespace.", hint: "Think about races, permissions, IPv4/IPv6, and network namespaces." },
    ],
    quiz: { question: "What does a successful DNS lookup prove?", options: ["The application returned correct data", "The name resolved according to the queried resolver path", "A TCP port is open", "The host key is trusted"], correct: 1, explanation: "DNS success establishes name-resolution evidence only; transport and application layers require separate tests." },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 16: Networking", url: tlcl },
      { source: "Linux man-pages", section: "ip(8), ss(8), resolver(3), and socket(7)", url: manpages },
    ],
    videoIds: [],
  },
  {
    id: "storage-packages",
    number: 16,
    part: "05 / Running Systems",
    title: "Storage, packages & system facts",
    prompt: "inspect layers before changing state",
    minutes: 39,
    xp: 150,
    objective: "Map block devices to filesystems and mount points read-only, distinguish space from inode exhaustion, understand package-manager families, and collect reproducible system facts.",
    explanation: [
      "Storage is layered: a physical or virtual device may contain a partition table, partitions, encryption, volume management, filesystems, and mount points. df reports mounted filesystem capacity, du walks directory entries, lsblk maps block topology, and findmnt describes mounted relationships. Their numbers differ because they answer different questions.",
      "Package tools also have layers: repositories and high-level dependency resolution, lower-level package databases, and installed files. Command ownership can be queried through the distribution's database. System reports should capture distribution release, kernel, shell, locale, architecture, and exact tool versions rather than relying on uname -a alone.",
    ],
    mentalModel: "Build a read-only map from path → mount point → filesystem → block or virtual source before interpreting capacity or considering any mutation.",
    concepts: [
      { label: "df versus du", detail: "df reports filesystem allocation; du sums reachable directory entries. Open-deleted files and metadata can explain differences." },
      { label: "inodes", detail: "A filesystem can run out of metadata entries even while byte capacity remains." },
      { label: "package owner", detail: "The installed package database can identify which package supplied a command path." },
      { label: "system facts", detail: "A reproducible report names OS release, kernel, architecture, shell, locale, and tool versions." },
    ],
    code: "findmnt -T .\ndf -hT .\ndf -i .\nlsblk -o NAME,TYPE,FSTYPE,SIZE,MOUNTPOINTS",
    codeNotes: ["findmnt -T maps the current path to its mount record.", "df -hT and df -i separate byte capacity from inode capacity.", "lsblk provides read-only topology; it does not by itself identify the distribution release."],
    labs: [
      { level: "easy", title: "Map the lab path", task: "Map your practice directory to its mount point and filesystem type using findmnt and df.", hint: "Use the path itself as the query target." },
      { level: "medium", title: "Explain capacity tools", task: "Compare df for a filesystem with du for one directory and list reasons the totals answer different questions.", hint: "Scope, open-deleted files, sparse files, hard links, and metadata matter." },
      { level: "hard", title: "Reproducible fact report", task: "Print timestamp, OS release, kernel, shell version, locale, and versions of core text tools without exposing secrets.", hint: "Use /etc/os-release and each tool's documented version interface." },
    ],
    quiz: { question: "Why is uname -a insufficient to identify a Linux distribution release?", options: ["It primarily reports kernel/system information", "It deletes the release name", "It only works on Windows", "It always prints package versions"], correct: 0, explanation: "Distribution identity and release metadata normally come from sources such as /etc/os-release, while uname focuses on kernel/system facts." },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 14–15: Package Management and Storage Media", url: tlcl },
      { source: "GNU Coreutils and util-linux manuals", section: "df, du, uname, lsblk, and findmnt", url: coreutils },
    ],
    videoIds: [],
  },
  {
    id: "script-fundamentals",
    number: 17,
    part: "06 / Bash Programs",
    title: "Script fundamentals & data",
    prompt: "interpreter + inputs + outputs + status",
    minutes: 45,
    xp: 170,
    objective: "Choose an interpreter deliberately, validate arguments, use parameters and arrays safely, read input without damaging it, and separate configuration from code.",
    explanation: [
      "A shell script is a program with an interpreter promise. #!/usr/bin/env bash promises Bash semantics through PATH; #!/bin/sh promises the system's POSIX-style sh. Running sh script ignores a Bash shebang and asks sh to parse the file, so Bash-only arrays, [[ ]], process substitution, and other extensions may fail.",
      "Inputs need explicit contracts. Positional parameters describe invocation, $@ preserves all arguments as distinct words when double-quoted, and $# reports their count. Bash arrays represent lists without flattening boundaries into one space-separated string. Configuration can follow a clear precedence such as command option over environment over default.",
    ],
    mentalModel: "A script is a command you are designing for someone else: document its grammar, channels, statuses, interpreter, and side effects.",
    concepts: [
      { label: "shebang", detail: "Kernel-facing interpreter directive used when the executable script path is invoked directly." },
      { label: "\"$@\"", detail: "Expands positional parameters as separate preserved arguments inside double quotes." },
      { label: "arrays", detail: "Bash-native lists that preserve element boundaries, including spaces and empty values." },
      { label: "read -r", detail: "Reads a record without treating backslashes as escape characters; IFS controls splitting." },
    ],
    code: "#!/usr/bin/env bash\nset -u\n(( $# == 2 )) || { printf 'usage: %s SOURCE DEST\\n' \"$0\" >&2; exit 64; }\nsource_path=$1\ndestination=$2",
    codeNotes: ["The shebang declares Bash for direct execution.", "The argument count is validated before positional parameters are used.", "Usage is diagnostic output on stderr, and status 64 documents an invocation error."],
    labs: [
      { level: "easy", title: "Interpreter promise", task: "Write a tiny Bash script that prints its version and explain direct execution versus bash script.", hint: "Check execute permission and keep the shebang on the first line." },
      { level: "medium", title: "Argument contract", task: "Accept exactly two practice paths, reject a missing source and existing destination, and print clear stderr diagnostics.", hint: "Validate before changing any file." },
      { level: "hard", title: "Precedence design", task: "Implement option > environment > default precedence for a harmless report label and print which source won.", hint: "Never print secret values; use a non-sensitive lab variable." },
    ],
    quiz: { question: "What happens when sh script runs a file containing Bash-only syntax?", options: ["The shebang forces Bash", "The explicitly invoked sh parses it and may reject the syntax", "The kernel translates the syntax", "Arguments disappear"], correct: 1, explanation: "An explicit interpreter invocation controls parsing; the script's shebang is not used in that form." },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 24–26 and 32: First Script, Project Design, Positional Parameters", url: tlcl },
      { source: "Bash Reference Manual", section: "§3.4 Shell Parameters; §6.7 Arrays; §3.2 Shell Commands", url: bash },
    ],
    videoIds: ["bash-guide", "bash-course", "five-programs"],
  },
  {
    id: "decisions-loops",
    number: 18,
    part: "06 / Bash Programs",
    title: "Tests, loops & functions",
    prompt: "commands are conditions",
    minutes: 48,
    xp: 180,
    objective: "Write readable conditions, distinguish test syntaxes, iterate without splitting bugs, dispatch with case, and design functions with explicit return channels.",
    explanation: [
      "Shell control flow tests command status, not a special Boolean type. if command; then runs the branch when command returns zero. [ is a command-like builtin whose closing ] is an argument; [[ is a Bash compound command with safer ordinary expansion behavior and pattern features; (( )) evaluates arithmetic where a nonzero expression is successful.",
      "Loops must preserve data boundaries. for file in \"$@\" iterates original arguments safely; for file in $files reparses a string through splitting and globbing. A while read loop fed by a pipeline may run in a subshell, so state changed inside can disappear. Functions should use local variables, return status through return, data through documented stdout, and diagnostics through stderr.",
    ],
    mentalModel: "In shell, every command is a question whose answer is its exit status. Control structures organize those questions and preserve data boundaries.",
    concepts: [
      { label: "[ ] / [[ ]]", detail: "Portable test command syntax versus Bash conditional grammar with different expansion and pattern rules." },
      { label: "(( ))", detail: "Arithmetic context where zero expression means status 1 and nonzero means status 0." },
      { label: "case", detail: "Readable pattern-based dispatch that makes input grammar branches explicit." },
      { label: "local", detail: "Bash function variable scope that prevents accidental mutation of unrelated globals." },
    ],
    code: "for file in \"$@\"; do\n  if [[ -r $file ]]; then\n    printf '%s\\n' \"$file\"\n  else\n    printf 'unreadable: %s\\n' \"$file\" >&2\n  fi\ndone",
    codeNotes: ["Quoted $@ preserves each original argument as one loop item.", "[[ -r $file ]] tests readability without ordinary splitting or globbing of the expansion.", "Data goes to stdout and diagnostics to stderr so callers can compose the script."],
    labs: [
      { level: "easy", title: "Status as condition", task: "Use if grep -qF to branch on a practice file without reading $? separately.", hint: "Put grep directly in the if condition." },
      { level: "medium", title: "Pattern dispatch", task: "Use case to accept start, stop, or status as harmless words and reject everything else with usage text.", hint: "This is a parser exercise; do not control a real service." },
      { level: "hard", title: "Pipeline state", task: "Count input records with a piped while loop and then with process-substitution input; explain variable persistence.", hint: "Observe which loop runs in the current shell context." },
    ],
    quiz: { question: "Why can a variable changed inside producer | while read ... appear unchanged later?", options: ["The loop may run in a subshell", "Bash variables are immutable", "read deletes names", "Pipes support only numbers"], correct: 0, explanation: "Bash commonly executes pipeline components in subshell environments, isolating changes from the parent shell." },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 27–33: if, input, loops, troubleshooting, case, parameters, for", url: tlcl },
      { source: "Bash Reference Manual", section: "Conditional Constructs, Looping Constructs, Shell Functions", url: bash },
    ],
    videoIds: ["shell-tools", "bash-course", "five-programs"],
  },
  {
    id: "reliable-scripts",
    number: 19,
    part: "06 / Bash Programs",
    title: "Reliable scripts & boundaries",
    prompt: "errors are designed, not wished away",
    minutes: 52,
    xp: 200,
    objective: "Design explicit failure behavior, understand strict-mode limits, create temporary resources safely, clean up with traps, avoid code/data confusion, and replace outputs atomically.",
    explanation: [
      "set -euo pipefail is a useful policy bundle, not an exception system. -e has grammar-dependent exceptions, -u makes some unset parameters errors, and pipefail changes pipeline status. Expected failures still deserve explicit if or case handling. Reliability begins with documented inputs, outputs, statuses, side effects, cleanup, concurrency assumptions, and recovery behavior.",
      "Temporary resources should be created with mktemp in a safe directory and removed by a trap. Update important files by writing a complete temporary file in the same destination directory, validating it, then renaming it into place. Keep untrusted filenames, environment values, and network responses as data: quote expansions, use arrays for commands, validate allowed forms, and avoid eval.",
    ],
    mentalModel: "A reliable script makes partial failure boring: every resource has an owner, every side effect has a boundary, and every expected error has an explicit branch.",
    concepts: [
      { label: "strict mode", detail: "A policy aid with documented exceptions; it does not automatically make arbitrary code safe." },
      { label: "trap", detail: "Registers cleanup or signal handling, commonly EXIT for owned temporary resources." },
      { label: "mktemp", detail: "Creates a unique file or directory without predictable-name races." },
      { label: "atomic rename", detail: "Within one filesystem, replace a destination name only after a complete validated temporary output exists." },
    ],
    code: "#!/usr/bin/env bash\nset -Eeuo pipefail\ntmp=$(mktemp \"${TMPDIR:-/tmp}/report.XXXXXX\")\ntrap 'rm -f -- \"$tmp\"' EXIT\ngenerate_report >\"$tmp\"\nvalidate_report \"$tmp\"\nmv -- \"$tmp\" report.txt\ntrap - EXIT",
    codeNotes: ["mktemp owns unique creation; the variable is always quoted and protected with --.", "EXIT cleanup handles early failure before replacement.", "Validation happens before same-filesystem rename, then the trap is cleared because ownership moved."],
    labs: [
      { level: "easy", title: "Expected failure", task: "Wrap a deliberately missing optional practice file in an explicit if branch and print a useful diagnostic.", hint: "Do not rely on set -e to explain the error." },
      { level: "medium", title: "Temporary cleanup", task: "Create a temporary directory, trap EXIT, place a marker inside, and verify cleanup after normal and error exits.", hint: "Print only the lab path and keep every operation inside it." },
      { level: "hard", title: "Atomic report", task: "Generate and validate a harmless report in a temporary sibling file before renaming it over the destination.", hint: "A different filesystem can break atomic rename assumptions." },
    ],
    quiz: { question: "Which is the safest normal way to build a Bash command with optional arguments?", options: ["Concatenate one command string and eval it", "Use an array with one element per argument", "Store it in a space-separated variable", "Remove all quotes"], correct: 1, explanation: "A Bash array preserves argument boundaries and keeps data out of shell-source evaluation." },
    readings: [
      { source: "Bash Reference Manual", section: "The Set Builtin, Bourne Shell Builtins, Signals, and Arrays", url: bash },
      { source: "The Linux Command Line", section: "Ch. 30 and 36: Troubleshooting and Exotica", url: tlcl },
    ],
    videoIds: ["bash-course", "bash-guide", "five-programs"],
  },
  {
    id: "fluency-system",
    number: 20,
    part: "06 / Bash Programs",
    title: "Discovery, debugging & fluency",
    prompt: "observe → hypothesize → test → transfer",
    minutes: 43,
    xp: 220,
    objective: "Discover unfamiliar commands, debug from evidence, choose an automation mechanism, and run a challenge-based practice loop that turns syntax into durable fluency.",
    explanation: [
      "Fluency is not recalling every flag. It is moving efficiently through a documentation ladder: type and help for resolution and builtins, --help for a compact interface, man for the installed contract, info for GNU depth, apropos for discovery, and authoritative project documentation for version-specific behavior. The local manual wins when the installed version differs from a web example.",
      "Debugging is experimental. Reduce the failing input, state a prediction, reveal arguments and streams, capture statuses immediately, and change one variable at a time. Shell tracing can expose secrets, so use it on sanitized labs and narrow regions. For practice, alternate explanation, prediction, execution, and reflection; record the transferable rule rather than only the successful command string.",
    ],
    mentalModel: "Experts do not carry every command in memory. They carry a grammar, a search strategy, a testing loop, and a habit of preserving evidence.",
    concepts: [
      { label: "documentation ladder", detail: "Move from quick local syntax to installed manuals and authoritative version-specific references." },
      { label: "minimal reproducer", detail: "The smallest input and environment that still demonstrates the surprising behavior." },
      { label: "set -x", detail: "Tracing that reveals expanded commands and may leak sensitive data; scope and sanitize it." },
      { label: "spaced practice", detail: "Revisit concepts over time through prediction and retrieval, not passive rereading alone." },
    ],
    code: "type -a grep\ngrep --help | less\nman grep\napropos 'search text'\nprintf 'status=%s\\n' \"$?\"",
    codeNotes: ["type identifies how the shell resolves the name.", "Help and the installed manual describe the interface actually present.", "apropos searches manual descriptions when you know the task but not the command name."],
    labs: [
      { level: "easy", title: "Documentation ladder", task: "Choose an unfamiliar harmless utility and record what type, --help, man, and apropos each contribute.", hint: "Do not read everything; answer one precise interface question." },
      { level: "medium", title: "Scientific debug", task: "Create a quotation bug in a lab script, predict argv, use printf or a narrow trace to reveal it, then write the transferable rule.", hint: "Sanitize values before tracing." },
      { level: "hard", title: "Four-week loop", task: "Create a schedule that alternates chapter retrieval, one safe lab, one explanation, and one review of missed quiz reasoning.", hint: "Short repeated sessions beat one giant passive reading session." },
    ],
    quiz: { question: "What is the most durable response to an unfamiliar command?", options: ["Memorize the whole line immediately", "Parse its grammar, consult the installed contract, test safely, and record the rule", "Run it with sudo", "Ignore exit status"], correct: 1, explanation: "Transferable fluency comes from grammar, authoritative discovery, controlled experiments, and reflection." },
    readings: [
      { source: "The Linux Command Line", section: "Ch. 5, 30, and the shell-scripting project chapters", url: tlcl },
      { source: "GNU Bash Reference Manual", section: "Bash Builtins, Invoking Bash, and debugging-related options", url: bash },
      { source: "OverTheWire Bandit", section: "Beginner challenge loop for evidence-driven command discovery", url: "https://overthewire.org/wargames/bandit/" },
    ],
    videoIds: ["shell-tools", "five-programs"],
  },
];
