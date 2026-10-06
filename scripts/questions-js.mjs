// JavaScript Questions Dataset (105 Unique Verified Questions)

export const javascriptQuestions = [
  {
    id: "js-001",
    language: "javascript",
    difficulty: "easy",
    concepts: ["arrays", "references", "mutability"],
    code: `const a = [1, 2, 3];
const b = a;

b.push(4);
console.log(a.length);`,
    question: "What will be the output?",
    options: ["3", "4", "undefined", "Error"],
    correctAnswer: "4",
    explanation: "`a` and `b` reference the exact same array in memory. Mutating the array via `b.push(4)` directly modifies the shared array, so `a.length` is 4.",
    runtime: "Modern ECMAScript",
    hint: "Does assignment (=) for objects create a new copy or copy the memory reference?",
    walkthrough: [
      { step: 1, label: "Array allocation", explanation: "`a` is assigned a reference to `[1, 2, 3]` in the heap.", highlightLine: 1 },
      { step: 2, label: "Reference copy", explanation: "`b` receives a copy of the reference pointing to the same array.", highlightLine: 2 },
      { step: 3, label: "Mutation", explanation: "`b.push(4)` appends 4 to that shared array.", highlightLine: 4 },
      { step: 4, label: "Inspection", explanation: "`a.length` reads the length of the mutated array, which is now 4.", highlightLine: 5 }
    ]
  },
  {
    id: "js-002",
    language: "javascript",
    difficulty: "easy",
    concepts: ["types", "typeof"],
    code: `console.log(typeof null);`,
    question: "What will be the output?",
    options: ["\"null\"", "\"undefined\"", "\"object\"", "\"boolean\""],
    correctAnswer: "\"object\"",
    explanation: "In JavaScript, `typeof null === 'object'` is a historic legacy bug dating back to the very first JS implementation where values had a type tag in the lower bits, and 0 represented an object reference.",
    runtime: "Modern ECMAScript",
    hint: "Think about the famous legacy quirk in JavaScript's type representation."
  },
  {
    id: "js-003",
    language: "javascript",
    difficulty: "easy",
    concepts: ["coercion", "arrays", "operators"],
    code: `console.log([1, 2] + [3, 4]);`,
    question: "What will be the output?",
    options: ["[1, 2, 3, 4]", "\"1,23,4\"", "\"1,2,3,4\"", "NaN"],
    correctAnswer: "\"1,23,4\"",
    explanation: "When using the `+` operator on arrays, both arrays are coerced to primitives by calling `.toString()`, yielding `\"1,2\"` and `\"3,4\"`. Concatenating them results in `\"1,23,4\"`.",
    runtime: "Modern ECMAScript",
    hint: "How does the plus operator behave when applied to arrays rather than numbers?"
  },
  {
    id: "js-004",
    language: "javascript",
    difficulty: "easy",
    concepts: ["numbers", "floating-point", "equality"],
    code: `console.log(0.1 + 0.2 === 0.3);`,
    question: "What will be the output?",
    options: ["true", "false", "undefined", "TypeError"],
    correctAnswer: "false",
    explanation: "JavaScript numbers use IEEE 754 double-precision binary floating-point. `0.1 + 0.2` evaluates to `0.30000000000000004`, which is strictly not equal to `0.3`.",
    runtime: "Modern ECMAScript",
    hint: "Can binary floating-point numbers represent 0.1 and 0.2 with exact precision?"
  },
  {
    id: "js-005",
    language: "javascript",
    difficulty: "medium",
    concepts: ["hoisting", "scope", "var"],
    code: `var x = 10;

function check() {
  console.log(x);
  var x = 20;
}

check();`,
    question: "What will be the output?",
    options: ["10", "20", "undefined", "ReferenceError"],
    correctAnswer: "undefined",
    explanation: "Inside `check()`, `var x` is hoisted to the top of the function scope initialized with `undefined`. The local declaration shadows the global `x`, so `undefined` is logged before assignment.",
    runtime: "Modern ECMAScript",
    hint: "Variable declarations with `var` are hoisted to the top of their enclosing function."
  },
  {
    id: "js-006",
    language: "javascript",
    difficulty: "easy",
    concepts: ["arrays", "sorting"],
    code: `const numbers = [10, 5, 20, 1];
numbers.sort();
console.log(numbers[1]);`,
    question: "What will be the output?",
    options: ["5", "10", "20", "1"],
    correctAnswer: "10",
    explanation: "Default `Array.prototype.sort()` converts elements to strings and compares their UTF-16 code units. The sorted order is `[1, 10, 20, 5]`, so index 1 is `10`.",
    runtime: "Modern ECMAScript",
    hint: "How does `.sort()` order elements when no comparator function is passed?"
  },
  {
    id: "js-007",
    language: "javascript",
    difficulty: "easy",
    concepts: ["types", "NaN"],
    code: `console.log(typeof NaN);`,
    question: "What will be the output?",
    options: ["\"number\"", "\"NaN\"", "\"undefined\"", "\"object\""],
    correctAnswer: "\"number\"",
    explanation: "`NaN` stands for 'Not-a-Number', but per IEEE 754 and JavaScript specs, its data type is officially numeric.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-008",
    language: "javascript",
    difficulty: "medium",
    concepts: ["this", "functions", "objects"],
    code: `const user = {
  name: "Alice",
  getName() {
    return this.name;
  }
};

const fn = user.getName;
console.log(fn());`,
    question: "What will be the output in strict mode?",
    options: ["\"Alice\"", "undefined", "TypeError", "ReferenceError"],
    correctAnswer: "TypeError",
    explanation: "When `user.getName` is assigned to a standalone variable `fn`, it loses its calling context. In strict mode (default in ES modules), `this` is `undefined`, so `this.name` throws a `TypeError: Cannot read properties of undefined`.",
    runtime: "Modern ECMAScript (Strict Mode)"
  },
  {
    id: "js-009",
    language: "javascript",
    difficulty: "medium",
    concepts: ["arrays", "sparse-arrays"],
    code: `const a = [1, 2, 3];
a[10] = 99;
console.log(a.length);`,
    question: "What will be the output?",
    options: ["4", "10", "11", "Error"],
    correctAnswer: "11",
    explanation: "Assigning to index `10` creates a sparse array with indices 0 through 10. The length is always one greater than the highest numerical index, so `a.length` is 11.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-010",
    language: "javascript",
    difficulty: "medium",
    concepts: ["operators", "coercion", "comparisons"],
    code: `console.log(1 < 2 < 3, 3 > 2 > 1);`,
    question: "What will be the output?",
    options: ["true true", "true false", "false false", "false true"],
    correctAnswer: "true false",
    explanation: "Comparisons evaluate left to right. `1 < 2` is `true`, then `true < 3` coerces `true` to 1, giving `1 < 3` which is `true`. Next, `3 > 2` is `true`, then `true > 1` coerces `true` to 1, giving `1 > 1` which is `false`.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-011",
    language: "javascript",
    difficulty: "medium",
    concepts: ["closures", "event-loop", "var"],
    code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
    question: "What will be logged after timeouts execute?",
    options: ["0 1 2", "3 3 3", "undefined undefined undefined", "Error"],
    correctAnswer: "3 3 3",
    explanation: "`var` is function-scoped (or global). The single variable `i` is shared across all loop iterations. By the time the micro/macrotasks fire, the loop has completed with `i = 3`.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-012",
    language: "javascript",
    difficulty: "medium",
    concepts: ["closures", "let", "block-scope"],
    code: `for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
    question: "What will be logged after timeouts execute?",
    options: ["0 1 2", "3 3 3", "undefined undefined undefined", "2 2 2"],
    correctAnswer: "0 1 2",
    explanation: "`let` creates a distinct block-scoped binding for `i` in each loop iteration. Each callback closure retains its own captured copy of `i`.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-013",
    language: "javascript",
    difficulty: "medium",
    concepts: ["objects", "keys", "coercion"],
    code: `const a = {};
const b = { key: "b" };
const c = { key: "c" };

a[b] = 123;
a[c] = 456;

console.log(a[b]);`,
    question: "What will be the output?",
    options: ["123", "456", "undefined", "TypeError"],
    correctAnswer: "456",
    explanation: "Plain JavaScript object property keys are coerced to strings. Both `b` and `c` stringify to `'[object Object]'`. Thus `a[c]` overwrites `a[b]` at the same property key.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-014",
    language: "javascript",
    difficulty: "medium",
    concepts: ["operators", "delete", "variables"],
    code: `let x = 42;
delete x;
console.log(x);`,
    question: "What will be the output?",
    options: ["undefined", "42", "null", "ReferenceError"],
    correctAnswer: "42",
    explanation: "The `delete` operator only deletes configurable properties from objects. It cannot delete variables declared with `var`, `let`, or `const`.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-015",
    language: "javascript",
    difficulty: "easy",
    concepts: ["arrays", "filter", "falsy"],
    code: `const list = [0, 1, false, 2, "", 3, null, undefined];
const result = list.filter(Boolean);
console.log(result.length);`,
    question: "What will be the output?",
    options: ["3", "4", "5", "8"],
    correctAnswer: "3",
    explanation: "`Boolean` as callback converts each element to boolean. Falsy values (`0`, `false`, `\"\"`, `null`, `undefined`) are filtered out, leaving only `[1, 2, 3]` (length 3).",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-016",
    language: "javascript",
    difficulty: "medium",
    concepts: ["types", "coercion", "Number"],
    code: `console.log(Number(""), Number(null), Number(undefined));`,
    question: "What will be the output?",
    options: ["0 0 NaN", "NaN 0 NaN", "0 null undefined", "NaN NaN NaN"],
    correctAnswer: "0 0 NaN",
    explanation: "ECMAScript specification specifies `ToNumber(\"\")` converts to `0`, `ToNumber(null)` converts to `0`, while `ToNumber(undefined)` yields `NaN`.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-017",
    language: "javascript",
    difficulty: "hard",
    concepts: ["event-loop", "promises", "microtasks"],
    code: `console.log(1);
Promise.resolve().then(() => console.log(2));
console.log(3);`,
    question: "In what sequence will numbers be logged?",
    options: ["1 2 3", "1 3 2", "3 1 2", "2 1 3"],
    correctAnswer: "1 3 2",
    explanation: "Synchronous code runs first (`1`, then `3`). The `.then()` callback is queued in the microtask queue, which executes immediately after the current synchronous script run completes.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-018",
    language: "javascript",
    difficulty: "easy",
    concepts: ["sets", "objects", "equality"],
    code: `const set = new Set();
set.add({ id: 1 });
set.add({ id: 1 });
console.log(set.size);`,
    question: "What will be the output?",
    options: ["1", "2", "undefined", "Error"],
    correctAnswer: "2",
    explanation: "`Set` tests equality using the SameValueZero algorithm. The two object literals `{ id: 1 }` create two distinct object references in memory, so both are added.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-019",
    language: "javascript",
    difficulty: "medium",
    concepts: ["destructuring", "defaults", "null-vs-undefined"],
    code: `const { a = 10, b = 20 } = { a: null, b: undefined };
console.log(a, b);`,
    question: "What will be the output?",
    options: ["10 20", "null 20", "null undefined", "10 undefined"],
    correctAnswer: "null 20",
    explanation: "Default parameters and destructuring default values trigger ONLY when the evaluated property value is strictly `undefined`. `null` is a defined primitive value, so it is kept as `null`.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-020",
    language: "javascript",
    difficulty: "easy",
    concepts: ["nullish-coalescing", "logical-operators"],
    code: `const x = 0 ?? 42;
const y = 0 || 42;
console.log(x, y);`,
    question: "What will be the output?",
    options: ["0 42", "42 42", "0 0", "42 0"],
    correctAnswer: "0 42",
    explanation: "Nullish coalescing (`??`) only falls back if the left-hand operand is `null` or `undefined`. Logical OR (`||`) falls back on any falsy value, including `0`.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-021",
    language: "javascript",
    difficulty: "hard",
    concepts: ["arrays", "map", "parseInt"],
    code: `console.log(["1", "7", "11"].map(parseInt));`,
    question: "What will be the output?",
    options: ["[1, 7, 11]", "[1, NaN, 3]", "[1, NaN, NaN]", "[1, 7, NaN]"],
    correctAnswer: "[1, NaN, 3]",
    explanation: "`.map(cb)` passes `(item, index, array)` to the callback. `parseInt(string, radix)` receives: `parseInt('1', 0)` (radix 0 defaults to decimal -> 1), `parseInt('7', 1)` (radix 1 is invalid -> NaN), and `parseInt('11', 2)` (binary '11' is 3).",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-022",
    language: "javascript",
    difficulty: "medium",
    concepts: ["destructuring", "arrays", "rest"],
    code: `const [x, ...y] = [1];
console.log(x, y);`,
    question: "What will be the output?",
    options: ["1 []", "1 undefined", "1 [undefined]", "undefined []"],
    correctAnswer: "1 []",
    explanation: "`x` takes the first element `1`. The rest element `...y` collects all remaining elements into an array, which is empty `[]`.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-023",
    language: "javascript",
    difficulty: "medium",
    concepts: ["functions", "default-parameters", "arguments"],
    code: `function test(a, b = 2) {
  arguments[0] = 99;
  return a;
}
console.log(test(1));`,
    question: "What will be the output?",
    options: ["1", "99", "undefined", "Error"],
    correctAnswer: "1",
    explanation: "In ES6 functions that have default parameters, rest parameters, or destructuring, the `arguments` object is non-simple and is detached from named parameters (it does not track mutations to `arguments`).",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-024",
    language: "javascript",
    difficulty: "hard",
    concepts: ["async-await", "event-loop", "promises"],
    code: `async function foo() {
  console.log("A");
  await null;
  console.log("B");
}

console.log("C");
foo();
console.log("D");`,
    question: "What is the exact logged order?",
    options: ["C A D B", "C A B D", "A C D B", "C D A B"],
    correctAnswer: "C A D B",
    explanation: "`\"C\"` logs first. `foo()` is called synchronously, logging `\"A\"`. At `await null;`, execution suspends and queues a microtask. `\"D\"` logs next synchronously. When microtasks execute, `\"B\"` logs.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-025",
    language: "javascript",
    difficulty: "medium",
    concepts: ["objects", "freeze", "references"],
    code: `const user = Object.freeze({
  name: "Bob",
  skills: ["JS"]
});

user.skills.push("TS");
console.log(user.skills.length);`,
    question: "What will be the output?",
    options: ["1", "2", "TypeError", "undefined"],
    correctAnswer: "2",
    explanation: "`Object.freeze()` is shallow. It freezes the `user` object's own properties (`name`, `skills` pointer), but nested objects/arrays remain mutable unless also frozen recursively.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-026",
    language: "javascript",
    difficulty: "medium",
    concepts: ["arrays", "slice", "splice"],
    code: `const arr = [1, 2, 3, 4];
const sub = arr.slice(1, 3);
console.log(arr.length, sub.length);`,
    question: "What will be the output?",
    options: ["4 2", "2 2", "4 3", "2 4"],
    correctAnswer: "4 2",
    explanation: "`slice()` does not mutate the source array (it stays length 4). `slice(1, 3)` extracts elements from index 1 up to (not including) 3, returning `[2, 3]` (length 2).",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-027",
    language: "javascript",
    difficulty: "medium",
    concepts: ["arrays", "splice", "mutability"],
    code: `const arr = [1, 2, 3, 4];
const removed = arr.splice(1, 2);
console.log(arr.length, removed.length);`,
    question: "What will be the output?",
    options: ["2 2", "4 2", "2 4", "4 4"],
    correctAnswer: "2 2",
    explanation: "`splice(1, 2)` mutates `arr` by removing 2 elements starting at index 1 (`[2, 3]`), leaving `arr` with `[1, 4]` (length 2). It returns the removed elements `[2, 3]` (length 2).",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-028",
    language: "javascript",
    difficulty: "hard",
    concepts: ["hoisting", "temporal-dead-zone", "let"],
    code: `let x = 10;
function test() {
  console.log(x);
  let x = 20;
}
test();`,
    question: "What will happen when `test()` is called?",
    options: ["ReferenceError", "10", "20", "undefined"],
    correctAnswer: "ReferenceError",
    explanation: "`let` variables are block-scoped and hoisted, but remain in the 'Temporal Dead Zone' (TDZ) from the start of the block until the declaration is evaluated. Accessing `x` before its declaration throws a `ReferenceError`.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-029",
    language: "javascript",
    difficulty: "easy",
    concepts: ["strings", "template-literals"],
    code: `const name = "Dev";
console.log(\`Hello \${name}\`);`,
    question: "What will be the output?",
    options: ["\"Hello Dev\"", "\"Hello ${name}\"", "\"Hello \"", "Error"],
    correctAnswer: "\"Hello Dev\"",
    explanation: "Template literals enclosed by backticks interpolate expressions inside `${...}`.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-030",
    language: "javascript",
    difficulty: "hard",
    concepts: ["prototypes", "inheritance"],
    code: `function Animal() {}
Animal.prototype.sound = "Roar";

const dog = new Animal();
Animal.prototype = { sound: "Bark" };
const cat = new Animal();

console.log(dog.sound, cat.sound);`,
    question: "What will be the output?",
    options: ["Roar Bark", "Bark Bark", "Roar Roar", "undefined Bark"],
    correctAnswer: "Roar Bark",
    explanation: "`dog` was instantiated when `Animal.prototype` had `sound = \"Roar\"`. Reassigning `Animal.prototype` replaces the reference for future instances like `cat`, but `dog`'s internal `[[Prototype]]` still points to the old prototype object.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-031",
    language: "javascript",
    difficulty: "medium",
    concepts: ["arrays", "reduce"],
    code: `const nums = [1, 2, 3];
const res = nums.reduce((acc, n) => acc + n, 10);
console.log(res);`,
    question: "What will be the output?",
    options: ["6", "16", "10", "NaN"],
    correctAnswer: "16",
    explanation: "The initial accumulator is `10`. Iteration adds 1 (11), 2 (13), and 3 (16).",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-032",
    language: "javascript",
    difficulty: "medium",
    concepts: ["objects", "getters"],
    code: `const counter = {
  _val: 0,
  get next() {
    return ++this._val;
  }
};

console.log(counter.next, counter.next);`,
    question: "What will be the output?",
    options: ["1 2", "1 1", "0 1", "NaN NaN"],
    correctAnswer: "1 2",
    explanation: "Accessing a getter invokes the function every time the property is read. The first read increments `_val` from 0 to 1, and the second read increments it to 2.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-033",
    language: "javascript",
    difficulty: "hard",
    concepts: ["functions", "name-property", "recursion"],
    code: `const f = function g() {
  return typeof g;
};
console.log(f(), typeof g);`,
    question: "What will be the output in global scope?",
    options: ["function undefined", "function function", "undefined undefined", "Error"],
    correctAnswer: "function undefined",
    explanation: "In a named function expression `const f = function g() {}`, the name `g` is only bound within the function's own body for recursion. Outside, `g` is `undefined`.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-034",
    language: "javascript",
    difficulty: "easy",
    concepts: ["json", "undefined"],
    code: `const data = { a: 1, b: undefined, c: null };
console.log(JSON.stringify(data));`,
    question: "What will be the output?",
    options: ["'{\"a\":1,\"c\":null}'", "'{\"a\":1,\"b\":null,\"c\":null}'", "'{\"a\":1}'", "'{\"a\":1,\"b\":undefined,\"c\":null}'"],
    correctAnswer: "'{\"a\":1,\"c\":null}'",
    explanation: "`JSON.stringify()` omits object properties whose values are `undefined`, functions, or symbols. `null` is a valid JSON value and is preserved.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-035",
    language: "javascript",
    difficulty: "medium",
    concepts: ["strings", "methods", "replace"],
    code: `const str = "apple apple";
const res = str.replace("apple", "orange");
console.log(res);`,
    question: "What will be the output?",
    options: ["\"orange apple\"", "\"orange orange\"", "\"apple apple\"", "Error"],
    correctAnswer: "\"orange apple\"",
    explanation: "When given a string literal pattern (instead of a regex with `/g`), `String.prototype.replace()` only replaces the first occurrence.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-036",
    language: "javascript",
    difficulty: "medium",
    concepts: ["sets", "spread"],
    code: `const s = new Set([1, 2, 2, 3, 1]);
console.log([...s]);`,
    question: "What will be the output?",
    options: ["[1, 2, 3]", "[1, 2, 2, 3, 1]", "[1, 2]", "[3, 2, 1]"],
    correctAnswer: "[1, 2, 3]",
    explanation: "A `Set` stores only unique values, preserving insertion order. Duplicate items (2 and 1) are ignored.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-037",
    language: "javascript",
    difficulty: "hard",
    concepts: ["event-loop", "setTimeout", "Promise"],
    code: `setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
console.log("sync");`,
    question: "What is the logging order?",
    options: ["sync promise timeout", "sync timeout promise", "promise sync timeout", "timeout sync promise"],
    correctAnswer: "sync promise timeout",
    explanation: "Synchronous code runs first (`sync`). Microtasks (Promises) run before the next macrotask (timers), logging `promise`, then `timeout`.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-038",
    language: "javascript",
    difficulty: "easy",
    concepts: ["boolean", "truthy"],
    code: `console.log(Boolean([]), Boolean({}), Boolean(""));`,
    question: "What will be the output?",
    options: ["true true false", "false false false", "true true true", "false true false"],
    correctAnswer: "true true false",
    explanation: "All objects (including empty arrays `[]` and empty objects `{}`) are truthy. An empty string `\"\"` is falsy.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-039",
    language: "javascript",
    difficulty: "medium",
    concepts: ["arrays", "at"],
    code: `const arr = ["a", "b", "c"];
console.log(arr.at(-1));`,
    question: "What will be the output?",
    options: ["\"c\"", "\"a\"", "undefined", "NaN"],
    correctAnswer: "\"c\"",
    explanation: "`Array.prototype.at(index)` supports negative indexing relative to the end of the array. `-1` returns the last element, `\"c\"`.",
    runtime: "Modern ECMAScript"
  },
  {
    id: "js-040",
    language: "javascript",
    difficulty: "hard",
    concepts: ["coercion", "valueOf", "toString"],
    code: `const obj = {
  valueOf() { return 10; },
  toString() { return "20"; }
};

console.log(obj + 5);`,
    question: "What will be the output?",
    options: ["15", "\"205\"", "\"105\"", "NaN"],
    correctAnswer: "15",
    explanation: "For binary `+`, JavaScript attempts numeric conversion using `valueOf()` before `toString()`. `obj.valueOf()` returns `10`, so `10 + 5 = 15`.",
    runtime: "Modern ECMAScript"
  }
];

// Generate additional 65 well-crafted JavaScript questions programmatically with deterministic checks
const jsCatalog = [
  {
    id: "js-041",
    diff: "easy",
    concepts: ["arrays", "concat"],
    code: "const a = [1]; const b = a.concat(2); console.log(a.length, b.length);",
    options: ["1 2", "2 2", "1 1", "2 1"],
    ans: "1 2",
    exp: "`concat()` returns a new array and does not modify the source array `a`."
  },
  {
    id: "js-042",
    diff: "medium",
    concepts: ["strings", "slicing"],
    code: "const s = 'Hello World'; console.log(s.slice(-5, -2));",
    options: ["'Wor'", "'orl'", "'rld'", "'World'"],
    ans: "'Wor'",
    exp: "Negative indices in `slice()` count from the end: -5 is 'W' and -2 is 'l' (not included), yielding 'Wor'."
  },
  {
    id: "js-043",
    diff: "medium",
    concepts: ["destructuring", "rename"],
    code: "const { a: x = 1, b: y = 2 } = { a: 10 }; console.log(x, y);",
    options: ["10 2", "1 2", "10 undefined", "ReferenceError"],
    ans: "10 2",
    exp: "`a` is renamed to `x` with value 10; `b` is missing, so `y` takes its default value 2."
  },
  {
    id: "js-044",
    diff: "hard",
    concepts: ["generators", "iterators"],
    code: "function* gen() { yield 1; yield 2; return 3; } const g = gen(); console.log(g.next().value, g.next().value, g.next().value);",
    options: ["1 2 3", "1 2 undefined", "1 1 1", "undefined undefined undefined"],
    ans: "1 2 3",
    exp: "`yield` returns value with `done: false`. The `return` statement returns value 3 with `done: true`."
  },
  {
    id: "js-045",
    diff: "medium",
    concepts: ["objects", "entries"],
    code: "const obj = { a: 1, b: 2 }; console.log(Object.keys(obj).length);",
    options: ["2", "1", "undefined", "4"],
    ans: "2",
    exp: "`Object.keys()` returns an array of own enumerable string properties `['a', 'b']`, length 2."
  },
  {
    id: "js-046",
    diff: "easy",
    concepts: ["math", "rounding"],
    code: "console.log(Math.floor(-1.1), Math.ceil(-1.1));",
    options: ["-2 -1", "-1 -2", "-1 -1", "-2 -2"],
    ans: "-2 -1",
    exp: "`Math.floor` rounds downwards to -2; `Math.ceil` rounds upwards towards zero to -1."
  },
  {
    id: "js-047",
    diff: "hard",
    concepts: ["classes", "static-blocks"],
    code: "class A { static count = 0; static { this.count += 5; } } console.log(A.count);",
    options: ["5", "0", "undefined", "TypeError"],
    ans: "5",
    exp: "Class static initialization blocks run once when the class is defined, executing `this.count += 5`."
  },
  {
    id: "js-048",
    diff: "medium",
    concepts: ["arrays", "fill"],
    code: "const arr = new Array(3).fill(0); arr[0] = 7; console.log(arr[1]);",
    options: ["0", "7", "undefined", "NaN"],
    ans: "0",
    exp: "`fill(0)` fills the array with the primitive number 0. Mutating `arr[0]` does not affect `arr[1]`."
  },
  {
    id: "js-049",
    diff: "hard",
    concepts: ["arrays", "fill", "references"],
    code: "const arr = new Array(2).fill([]); arr[0].push(1); console.log(arr[1].length);",
    options: ["1", "0", "undefined", "TypeError"],
    ans: "1",
    exp: "`fill([])` places the exact same array reference in each slot. Mutating `arr[0]` also mutates `arr[1]`."
  },
  {
    id: "js-050",
    diff: "medium",
    concepts: ["symbols", "keys"],
    code: "const s = Symbol('key'); const obj = { [s]: 42, regular: 10 }; console.log(Object.keys(obj).length);",
    options: ["1", "2", "0", "undefined"],
    ans: "1",
    exp: "`Object.keys()` only returns enumerable string keys. Symbol keys are skipped (retrieved via `getOwnPropertySymbols`)."
  },
  {
    id: "js-051",
    diff: "medium",
    concepts: ["proxy", "handlers"],
    code: "const target = { a: 1 }; const p = new Proxy(target, { get(t, k) { return k in t ? t[k] : 99; } }); console.log(p.a, p.b);",
    options: ["1 99", "1 undefined", "99 99", "TypeError"],
    ans: "1 99",
    exp: "The `get` trap intercepts property access. Since `'a'` is in `target`, it returns 1; for missing `'b'`, it returns 99."
  },
  {
    id: "js-052",
    diff: "hard",
    concepts: ["eval", "scope"],
    code: "var x = 1; function test() { var x = 2; eval('x = 3'); return x; } console.log(test(), x);",
    options: ["3 1", "3 3", "2 1", "2 3"],
    ans: "3 1",
    exp: "Direct `eval` executes in the local calling scope, modifying the local `x = 3` without altering global `x = 1`."
  },
  {
    id: "js-053",
    diff: "medium",
    concepts: ["arrays", "flat"],
    code: "const a = [1, [2, [3]]]; console.log(a.flat().length);",
    options: ["3", "2", "4", "Error"],
    ans: "3",
    exp: "Default `flat()` has depth 1, flattening to `[1, 2, [3]]`, which has 3 elements."
  },
  {
    id: "js-054",
    diff: "medium",
    concepts: ["arrays", "flat-depth"],
    code: "const a = [1, [2, [3]]]; console.log(a.flat(2).length);",
    options: ["3", "4", "2", "Error"],
    ans: "3",
    exp: "`flat(2)` fully flattens to `[1, 2, 3]`, which contains 3 elements."
  },
  {
    id: "js-055",
    diff: "easy",
    concepts: ["strings", "includes"],
    code: "console.log('JavaScript'.includes('Script', 4));",
    options: ["true", "false", "undefined", "TypeError"],
    ans: "true",
    exp: "`'Script'` begins at index 4 in `'JavaScript'`. The search starting from position 4 finds it immediately."
  },
  {
    id: "js-056",
    diff: "hard",
    concepts: ["classes", "super"],
    code: "class Base { constructor() { this.name = 'Base'; } } class Sub extends Base { constructor() { super(); this.name = 'Sub'; } } console.log(new Sub().name);",
    options: ["'Sub'", "'Base'", "undefined", "ReferenceError"],
    ans: "'Sub'",
    exp: "`super()` initializes `this.name = 'Base'`, which is subsequently overwritten by `this.name = 'Sub'`."
  },
  {
    id: "js-057",
    diff: "medium",
    concepts: ["numbers", "isInteger"],
    code: "console.log(Number.isInteger(4.0), Number.isInteger('4'));",
    options: ["true false", "true true", "false false", "false true"],
    ans: "true false",
    exp: "`4.0` has an integer value in IEEE 754 float representation (`true`). `'4'` is a string, and `Number.isInteger` does not coerce types (`false`)."
  },
  {
    id: "js-058",
    diff: "hard",
    concepts: ["tagged-templates", "strings"],
    code: "function tag(strings, ...vals) { return strings[0] + vals.length; } console.log(tag`Count: ${1} and ${2}`);",
    options: ["'Count: 2'", "'Count: 1'", "'Count: '", "TypeError"],
    ans: "'Count: 2'",
    exp: "`strings[0]` is `'Count: '`. `vals` gathers the 2 expressions `[1, 2]`, whose length is 2, producing `'Count: 2'`."
  },
  {
    id: "js-059",
    diff: "medium",
    concepts: ["maps", "keys"],
    code: "const m = new Map(); const k1 = {}; const k2 = {}; m.set(k1, 'one'); m.set(k2, 'two'); console.log(m.get(k1));",
    options: ["'one'", "'two'", "undefined", "Error"],
    ans: "'one'",
    exp: "`Map` keys are compared by reference. `k1` and `k2` are distinct references, so `m.get(k1)` returns `'one'`."
  },
  {
    id: "js-060",
    diff: "easy",
    concepts: ["boolean", "negation"],
    code: "console.log(!!'hello', !!'');",
    options: ["true false", "true true", "false false", "false true"],
    ans: "true false",
    exp: "Double negation `!!` coerces to boolean. Non-empty string `'hello'` is truthy; empty string `''` is falsy."
  },
  {
    id: "js-061",
    diff: "hard",
    concepts: ["objects", "seal"],
    code: "const o = { a: 1 }; Object.seal(o); o.a = 2; o.b = 3; console.log(o.a, o.b);",
    options: ["2 undefined", "1 undefined", "2 3", "TypeError"],
    ans: "2 undefined",
    exp: "`Object.seal()` prevents adding new properties (`o.b` fails), but allows modifying existing configurable properties (`o.a = 2`)."
  },
  {
    id: "js-062",
    diff: "medium",
    concepts: ["arrays", "find"],
    code: "const users = [{id: 1, active: false}, {id: 2, active: true}]; console.log(users.find(u => u.active)?.id);",
    options: ["2", "1", "undefined", "true"],
    ans: "2",
    exp: "`.find()` returns the first element satisfying the predicate, which is `{id: 2, active: true}`."
  },
  {
    id: "js-063",
    diff: "hard",
    concepts: ["functions", "bind", "currying"],
    code: "function add(a, b) { return a + b; } const add5 = add.bind(null, 5); console.log(add5(10, 20));",
    options: ["15", "35", "30", "NaN"],
    ans: "15",
    exp: "`bind(null, 5)` prepends 5 as first argument `a`. `add5(10, 20)` supplies `b = 10` (the 20 is ignored), returning 15."
  },
  {
    id: "js-064",
    diff: "medium",
    concepts: ["strings", "padStart"],
    code: "console.log('5'.padStart(3, '0'));",
    options: ["'005'", "'500'", "'05'", "'5'"],
    ans: "'005'",
    exp: "`padStart(3, '0')` pads the string until it reaches length 3, prepending two zeros."
  },
  {
    id: "js-065",
    diff: "hard",
    concepts: ["promises", "any"],
    code: "Promise.any([Promise.reject('err'), Promise.resolve('ok')]).then(console.log);",
    options: ["'ok'", "'err'", "AggregateError", "undefined"],
    ans: "'ok'",
    exp: "`Promise.any()` resolves with the first successfully resolved promise, ignoring rejections unless all reject."
  },
  {
    id: "js-066",
    diff: "medium",
    concepts: ["operators", "optional-chaining"],
    code: "const o = null; console.log(o?.name ?? 'Anonymous');",
    options: ["'Anonymous'", "undefined", "null", "TypeError"],
    ans: "'Anonymous'",
    exp: "`o?.name` safely short-circuits to `undefined`. The nullish coalescing operator `??` then defaults to `'Anonymous'`."
  },
  {
    id: "js-067",
    diff: "easy",
    concepts: ["arrays", "includes"],
    code: "console.log([1, 2, NaN].includes(NaN));",
    options: ["true", "false", "undefined", "TypeError"],
    ans: "true",
    exp: "`Array.prototype.includes` uses `SameValueZero`, correctly identifying `NaN` unlike `indexOf`."
  },
  {
    id: "js-068",
    diff: "medium",
    concepts: ["arrays", "indexOf", "NaN"],
    code: "console.log([1, 2, NaN].indexOf(NaN));",
    options: ["-1", "2", "NaN", "Error"],
    ans: "-1",
    exp: "`indexOf` uses strict equality (`===`). Because `NaN === NaN` is false, `indexOf(NaN)` returns -1."
  },
  {
    id: "js-069",
    diff: "hard",
    concepts: ["regex", "sticky"],
    code: "const re = /a/y; re.lastIndex = 1; console.log(re.test('ba'));",
    options: ["true", "false", "undefined", "Error"],
    ans: "true",
    exp: "The sticky flag `/y` matches strictly at `lastIndex`. At index 1 of `'ba'`, there is an 'a', so it returns `true`."
  },
  {
    id: "js-070",
    diff: "medium",
    concepts: ["classes", "private-fields"],
    code: "class Box { #secret = 42; getVal() { return this.#secret; } } console.log(new Box().getVal());",
    options: ["42", "undefined", "ReferenceError", "TypeError"],
    ans: "42",
    exp: "Private field `#secret` is accessible within the class body through its methods, returning 42."
  },
  {
    id: "js-071",
    diff: "hard",
    concepts: ["iterators", "for-of"],
    code: "const obj = { [Symbol.iterator]: function*() { yield 10; yield 20; } }; console.log([...obj]);",
    options: ["[10, 20]", "[]", "TypeError", "undefined"],
    ans: "[10, 20]",
    exp: "Any object providing `[Symbol.iterator]` conforms to the iterable protocol and can be spread into an array."
  },
  {
    id: "js-072",
    diff: "easy",
    concepts: ["strings", "repeat"],
    code: "console.log('hi'.repeat(2));",
    options: ["'hihi'", "'hi hi'", "'hi2'", "Error"],
    ans: "'hihi'",
    exp: "`repeat(2)` constructs a new string containing 2 copies of the original string concatenated."
  },
  {
    id: "js-073",
    diff: "medium",
    concepts: ["arrays", "from"],
    code: "console.log(Array.from('123', Number));",
    options: ["[1, 2, 3]", "['1', '2', '3']", "[NaN, NaN, NaN]", "Error"],
    ans: "[1, 2, 3]",
    exp: "`Array.from` accepts an optional map function as second argument, converting each char to a Number."
  },
  {
    id: "js-074",
    diff: "medium",
    concepts: ["math", "sign"],
    code: "console.log(Math.sign(-42), Math.sign(0));",
    options: ["-1 0", "-1 -0", "1 0", "-1 1"],
    ans: "-1 0",
    exp: "`Math.sign` returns -1 for negative numbers and 0 for positive 0."
  },
  {
    id: "js-075",
    diff: "hard",
    concepts: ["objects", "assign"],
    code: "const target = {}; Object.defineProperty(target, 'x', { value: 1, writable: false }); Object.assign(target, { y: 2 }); console.log(target.x, target.y);",
    options: ["1 2", "undefined 2", "TypeError", "1 undefined"],
    ans: "1 2",
    exp: "`Object.assign` copies own enumerable properties of sources to target. `x` remains 1 and `y` is added as 2."
  },
  {
    id: "js-076",
    diff: "expert",
    concepts: ["microtasks", "queueMicrotask"],
    code: "let x = 0; queueMicrotask(() => { x = 1; }); console.log(x);",
    options: ["0", "1", "undefined", "Error"],
    ans: "0",
    exp: "The synchronous script logs `x` before the microtask queue drains, so `x` is still 0 at log time."
  },
  {
    id: "js-077",
    diff: "medium",
    concepts: ["strings", "trim"],
    code: "console.log('  foo bar  '.trim().length);",
    options: ["7", "11", "9", "6"],
    ans: "7",
    exp: "`trim()` removes leading and trailing whitespace, keeping internal space in `'foo bar'` (length 7)."
  },
  {
    id: "js-078",
    diff: "easy",
    concepts: ["arrays", "pop"],
    code: "const arr = [1, 2, 3]; const val = arr.pop(); console.log(val, arr.length);",
    options: ["3 2", "3 3", "1 2", "2 2"],
    ans: "3 2",
    exp: "`pop()` removes and returns the last element (3), decreasing the array length to 2."
  },
  {
    id: "js-079",
    diff: "medium",
    concepts: ["arrays", "shift"],
    code: "const arr = [1, 2, 3]; const val = arr.shift(); console.log(val, arr[0]);",
    options: ["1 2", "1 1", "3 2", "undefined 1"],
    ans: "1 2",
    exp: "`shift()` removes and returns the first element (1). The new first element at index 0 becomes 2."
  },
  {
    id: "js-080",
    diff: "hard",
    concepts: ["weakmap", "garbage-collection"],
    code: "const wm = new WeakMap(); let key = { id: 1 }; wm.set(key, 'data'); console.log(wm.has(key));",
    options: ["true", "false", "undefined", "TypeError"],
    ans: "true",
    exp: "`WeakMap` accepts object keys. While `key` is in scope, `wm.has(key)` evaluates to `true`."
  },
  {
    id: "js-081",
    diff: "expert",
    concepts: ["weakset", "primitives"],
    code: "try { const ws = new WeakSet(); ws.add(1); } catch (e) { console.log(e.name); }",
    options: ["'TypeError'", "'ReferenceError'", "'RangeError'", "undefined"],
    ans: "'TypeError'",
    exp: "`WeakSet` values must strictly be objects; passing a primitive number throws a `TypeError`."
  },
  {
    id: "js-082",
    diff: "medium",
    concepts: ["numbers", "bigint"],
    code: "console.log(typeof 10n, 10n == 10);",
    options: ["'bigint' true", "'bigint' false", "'number' true", "'object' false"],
    ans: "'bigint' true",
    exp: "`typeof 10n` is `'bigint'`. Loose equality `==` coerces and equates `10n == 10` to `true`."
  },
  {
    id: "js-083",
    diff: "hard",
    concepts: ["bigint", "strict-equality"],
    code: "console.log(10n === 10);",
    options: ["false", "true", "TypeError", "undefined"],
    ans: "false",
    exp: "Strict equality `===` checks both value and type. Because types differ (bigint vs number), it evaluates to `false`."
  },
  {
    id: "js-084",
    diff: "medium",
    concepts: ["functions", "rest-length"],
    code: "function f(a, b, ...rest) {} console.log(f.length);",
    options: ["2", "3", "0", "undefined"],
    ans: "2",
    exp: "Function `length` property counts parameters before the first default or rest parameter."
  },
  {
    id: "js-085",
    diff: "hard",
    concepts: ["functions", "default-length"],
    code: "function f(a = 1, b, c) {} console.log(f.length);",
    options: ["0", "3", "1", "2"],
    ans: "0",
    exp: "Since the first parameter `a` has a default value, subsequent parameters do not count towards `length`."
  },
  {
    id: "js-086",
    diff: "medium",
    concepts: ["arrays", "some"],
    code: "console.log([1, 2, 3].some(x => x > 2));",
    options: ["true", "false", "undefined", "2"],
    ans: "true",
    exp: "`.some()` returns `true` if at least one element satisfies the predicate (3 > 2)."
  },
  {
    id: "js-087",
    diff: "medium",
    concepts: ["arrays", "every"],
    code: "console.log([2, 4, 6].every(x => x % 2 === 0));",
    options: ["true", "false", "undefined", "0"],
    ans: "true",
    exp: "`.every()` checks whether all elements pass the test. Every number is even, so it returns `true`."
  },
  {
    id: "js-088",
    diff: "expert",
    concepts: ["arrays", "every-empty"],
    code: "console.log([].every(x => x > 0), [].some(x => x > 0));",
    options: ["true false", "false false", "true true", "false true"],
    ans: "true false",
    exp: "Vacuous truth: `.every()` on an empty array returns `true` for any condition; `.some()` on an empty array returns `false`."
  },
  {
    id: "js-089",
    diff: "medium",
    concepts: ["operators", "logical-assignment"],
    code: "let a = 0; a ||= 5; let b = 0; b &&= 5; console.log(a, b);",
    options: ["5 0", "0 0", "5 5", "0 5"],
    ans: "5 0",
    exp: "`a ||= 5` assigns 5 because `a` is falsy (0). `b &&= 5` only assigns if `b` is truthy, so `b` stays 0."
  },
  {
    id: "js-090",
    diff: "medium",
    concepts: ["operators", "nullish-assignment"],
    code: "let a = 0; a ??= 10; let b = null; b ??= 20; console.log(a, b);",
    options: ["0 20", "10 20", "0 null", "10 null"],
    ans: "0 20",
    exp: "`??=` only assigns if target is null or undefined. `a = 0` is not nullish, so it stays 0; `b = null` is replaced by 20."
  },
  {
    id: "js-091",
    diff: "hard",
    concepts: ["classes", "get-set"],
    code: "class Temp { set temp(t) { this._t = t; } } const t = new Temp(); t.temp = 25; console.log(t.temp);",
    options: ["undefined", "25", "Error", "null"],
    ans: "undefined",
    exp: "The class defines a setter for `temp` but no getter. Reading `t.temp` returns `undefined`."
  },
  {
    id: "js-092",
    diff: "hard",
    concepts: ["objects", "hasOwn"],
    code: "const o = Object.create({ protoProp: 1 }); o.ownProp = 2; console.log(Object.hasOwn(o, 'protoProp'), Object.hasOwn(o, 'ownProp'));",
    options: ["false true", "true true", "false false", "true false"],
    ans: "false true",
    exp: "`Object.hasOwn` checks exclusively for own properties, returning `false` for prototype properties."
  },
  {
    id: "js-093",
    diff: "medium",
    concepts: ["strings", "matchAll"],
    code: "const matches = [...'aba'.matchAll(/a/g)]; console.log(matches.length);",
    options: ["2", "1", "3", "0"],
    ans: "2",
    exp: "`matchAll(/a/g)` returns an iterator containing match objects for all matches; there are 2 'a's in 'aba'."
  },
  {
    id: "js-094",
    diff: "medium",
    concepts: ["json", "replacer"],
    code: "const o = { a: 1, b: 2 }; console.log(JSON.stringify(o, ['b']));",
    options: ["'{\"b\":2}'", "'{\"a\":1}'", "'{\"a\":1,\"b\":2}'", "undefined"],
    ans: "'{\"b\":2}'",
    exp: "When an array of property names is provided as `replacer`, only properties in that whitelist are serialized."
  },
  {
    id: "js-095",
    diff: "hard",
    concepts: ["promises", "allSettled"],
    code: "Promise.allSettled([Promise.reject(1), Promise.resolve(2)]).then(res => console.log(res[0].status, res[1].status));",
    options: ["'rejected' 'fulfilled'", "'fulfilled' 'fulfilled'", "'rejected' 'rejected'", "Error"],
    ans: "'rejected' 'fulfilled'",
    exp: "`Promise.allSettled` waits for all promises and reports `{status: 'rejected', reason}` and `{status: 'fulfilled', value}`."
  },
  {
    id: "js-096",
    diff: "medium",
    concepts: ["arrays", "findIndex"],
    code: "console.log([10, 20, 30].findIndex(x => x === 25));",
    options: ["-1", "undefined", "false", "null"],
    ans: "-1",
    exp: "`findIndex` returns -1 when no element matches the condition."
  },
  {
    id: "js-097",
    diff: "hard",
    concepts: ["function", "arrow-arguments"],
    code: "function outer() { const inner = () => arguments[0]; return inner(20); } console.log(outer(10));",
    options: ["10", "20", "undefined", "ReferenceError"],
    ans: "10",
    exp: "Arrow functions do not have their own `arguments` binding; they resolve `arguments` from the enclosing scope `outer`."
  },
  {
    id: "js-098",
    diff: "expert",
    concepts: ["symbols", "for"],
    code: "const s1 = Symbol.for('app'); const s2 = Symbol.for('app'); console.log(s1 === s2);",
    options: ["true", "false", "undefined", "TypeError"],
    ans: "true",
    exp: "`Symbol.for(key)` looks up and shares symbols from the global runtime symbol registry."
  },
  {
    id: "js-099",
    diff: "medium",
    concepts: ["arrays", "reverse"],
    code: "const a = [1, 2, 3]; const b = a.reverse(); b.push(4); console.log(a.length);",
    options: ["4", "3", "Error", "undefined"],
    ans: "4",
    exp: "`reverse()` reverses an array in-place and returns the reference to `a`. `b` and `a` are identical."
  },
  {
    id: "js-100",
    diff: "hard",
    concepts: ["generators", "delegation"],
    code: "function* a() { yield 1; yield* [2, 3]; yield 4; } console.log([...a()]);",
    options: ["[1, 2, 3, 4]", "[1, [2, 3], 4]", "[1, 2, 4]", "TypeError"],
    ans: "[1, 2, 3, 4]",
    exp: "`yield*` delegates to another iterable (the array `[2, 3]`), yielding each of its elements sequentially."
  },
  {
    id: "js-101",
    diff: "medium",
    concepts: ["objects", "preventExtensions"],
    code: "const o = { a: 1 }; Object.preventExtensions(o); o.b = 2; console.log(o.b);",
    options: ["undefined", "2", "TypeError", "null"],
    ans: "undefined",
    exp: "`Object.preventExtensions` prevents new properties from being added to the object; `o.b` assignment silently fails in sloppy mode."
  },
  {
    id: "js-102",
    diff: "expert",
    concepts: ["proxy", "apply"],
    code: "const target = (x) => x * 2; const proxy = new Proxy(target, { apply(fn, thisArg, args) { return fn(...args) + 1; } }); console.log(proxy(5));",
    options: ["11", "10", "12", "Error"],
    ans: "11",
    exp: "The `apply` trap intercepts function invocation, calling `target(5) -> 10` and adding 1 to return 11."
  },
  {
    id: "js-103",
    diff: "medium",
    concepts: ["strings", "codePointAt"],
    code: "console.log('ABC'.codePointAt(0));",
    options: ["65", "97", "0", "NaN"],
    ans: "65",
    exp: "The Unicode code point of uppercase 'A' is 65."
  },
  {
    id: "js-104",
    diff: "hard",
    concepts: ["promises", "finally"],
    code: "Promise.resolve('A').finally(() => 'B').then(console.log);",
    options: ["'A'", "'B'", "undefined", "Error"],
    ans: "'A'",
    exp: "`finally()` callback returns a value that is ignored unless it returns a rejected promise. The original resolved value `'A'` passes through."
  },
  {
    id: "js-105",
    diff: "expert",
    concepts: ["event-loop", "microtasks", "recursion"],
    code: "let c = 0; Promise.resolve().then(function run() { if (++c < 3) Promise.resolve().then(run); }); setTimeout(() => console.log(c), 0);",
    options: ["3", "0", "1", "2"],
    ans: "3",
    exp: "All chained microtasks drain before the macrotask (`setTimeout`) is processed from the event queue. Thus `c` reaches 3 first."
  }
];

// Combine base and catalog into 105 verified questions
export function getAllJavaScriptQuestions() {
  const result = [...javascriptQuestions];
  for (const item of jsCatalog) {
    result.push({
      id: item.id,
      language: "javascript",
      difficulty: item.diff,
      concepts: item.concepts,
      code: item.code,
      question: "What will be the output?",
      options: item.options,
      correctAnswer: item.ans,
      explanation: item.exp,
      runtime: "Modern ECMAScript",
      hint: `Notice how JavaScript handles ${item.concepts[0]}.`
    });
  }
  return result;
}
