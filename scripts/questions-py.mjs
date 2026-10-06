// Python Questions Dataset (105 Unique Verified Questions)

export const pythonQuestionsBase = [
  {
    id: "py-001",
    language: "python",
    difficulty: "medium",
    concepts: ["functions", "default-arguments", "mutability"],
    code: `def add_item(val, items=[]):
    items.append(val)
    return items

add_item(1)
print(add_item(2))`,
    question: "What will be the output?",
    options: ["[2]", "[1, 2]", "[1]", "TypeError"],
    correctAnswer: "[1, 2]",
    explanation: "Default parameter values in Python are evaluated once when the function is defined, not each time it is called. The list `items` is retained and reused across calls.",
    runtime: "Python 3.10+",
    hint: "Are default arguments re-initialized on every invocation in Python?",
    walkthrough: [
      { step: 1, label: "Function definition", explanation: "`items` default list `[]` is created in memory once at function definition time.", highlightLine: 1 },
      { step: 2, label: "First call", explanation: "`add_item(1)` appends 1 to that single shared list.", highlightLine: 5 },
      { step: 3, label: "Second call", explanation: "`add_item(2)` appends 2 to the same list.", highlightLine: 6 },
      { step: 4, label: "Result", explanation: "Returns `[1, 2]`.", highlightLine: 6 }
    ]
  },
  {
    id: "py-002",
    language: "python",
    difficulty: "easy",
    concepts: ["strings", "slicing"],
    code: `s = "Python"
print(s[::-1])`,
    question: "What will be the output?",
    options: ["'nohtyP'", "'Python'", "'P'", "IndexError"],
    correctAnswer: "'nohtyP'",
    explanation: "A step of `-1` in extended slice notation `[start:stop:step]` reverses the sequence.",
    runtime: "Python 3.10+"
  },
  {
    id: "py-003",
    language: "python",
    difficulty: "medium",
    concepts: ["identity", "caching", "integers"],
    code: `a = 256
b = 256
c = 300
d = 300
print(a is b, c is d)`,
    question: "What will be the output in standard CPython REPL?",
    options: ["True False", "True True", "False False", "False True"],
    correctAnswer: "True False",
    explanation: "CPython pre-allocates and caches small integers in the range [-5, 256]. Thus `256 is 256` evaluates to `True`, but `300` creates separate heap objects in interactive evaluation.",
    runtime: "CPython 3"
  },
  {
    id: "py-004",
    language: "python",
    difficulty: "medium",
    concepts: ["lists", "multiplication", "shallow-copy"],
    code: `grid = [[0]] * 3
grid[0].append(1)
print(grid)`,
    question: "What will be the output?",
    options: ["[[0, 1], [0], [0]]", "[[0, 1], [0, 1], [0, 1]]", "[[0], [0], [0, 1]]", "IndexError"],
    correctAnswer: "[[0, 1], [0, 1], [0, 1]]",
    explanation: "List multiplication `[[0]] * 3` copies the inner list reference 3 times rather than creating deep copies. Mutating `grid[0]` reflects in all elements.",
    runtime: "Python 3.10+"
  },
  {
    id: "py-005",
    language: "python",
    difficulty: "easy",
    concepts: ["tuples", "syntax"],
    code: `x = (1)
y = (1,)
print(type(x) == type(y))`,
    question: "What will be the output?",
    options: ["False", "True", "TypeError", "SyntaxError"],
    correctAnswer: "False",
    explanation: "`x = (1)` is simply an integer in parentheses (type `int`). To create a single-element tuple, a trailing comma is required: `y = (1,)` (type `tuple`).",
    runtime: "Python 3.10+"
  },
  {
    id: "py-006",
    language: "python",
    difficulty: "easy",
    concepts: ["boolean", "operators"],
    code: `print(True + True * False)`,
    question: "What will be the output?",
    options: ["1", "0", "True", "False"],
    correctAnswer: "1",
    explanation: "In Python, `bool` inherits from `int`. `True == 1` and `False == 0`. By operator precedence: `True * False = 1 * 0 = 0`, then `True + 0 = 1 + 0 = 1`.",
    runtime: "Python 3.10+"
  },
  {
    id: "py-007",
    language: "python",
    difficulty: "medium",
    concepts: ["comparisons", "chaining"],
    code: `print(1 < 2 < 3, 3 > 2 > 1)`,
    question: "What will be the output?",
    options: ["True True", "True False", "False True", "False False"],
    correctAnswer: "True True",
    explanation: "Python supports chained comparisons. `1 < 2 < 3` expands to `1 < 2 and 2 < 3` (True). `3 > 2 > 1` expands to `3 > 2 and 2 > 1` (True).",
    runtime: "Python 3.10+"
  },
  {
    id: "py-008",
    language: "python",
    difficulty: "hard",
    concepts: ["scope", "LEGB", "unbound-local"],
    code: `x = 10
def f():
    print(x)
    x = 20

try:
    f()
except Exception as e:
    print(type(e).__name__)`,
    question: "What will be the output?",
    options: ["UnboundLocalError", "10", "NameError", "TypeError"],
    correctAnswer: "UnboundLocalError",
    explanation: "Because `x = 20` assigns to `x` inside `f()`, Python marks `x` as a local variable for the entire function scope. Reading `x` before assignment raises `UnboundLocalError`.",
    runtime: "Python 3.10+"
  },
  {
    id: "py-009",
    language: "python",
    difficulty: "medium",
    concepts: ["dictionaries", "comprehensions"],
    code: `d = {x: x**2 for x in [-1, 1, 2]}
print(len(d))`,
    question: "What will be the output?",
    options: ["3", "2", "1", "TypeError"],
    correctAnswer: "3",
    explanation: "The dictionary keys are `-1`, `1`, and `2`, which are all distinct integers. The dictionary contains 3 key-value pairs.",
    runtime: "Python 3.10+"
  },
  {
    id: "py-010",
    language: "python",
    difficulty: "hard",
    concepts: ["try-finally", "control-flow"],
    code: `def calc():
    try:
        return 1
    finally:
        return 2

print(calc())`,
    question: "What will be the output?",
    options: ["2", "1", "None", "SyntaxError"],
    correctAnswer: "2",
    explanation: "The `finally` clause executes whenever the `try` block leaves, and its return statement supersedes any prior return value.",
    runtime: "Python 3.10+"
  },
  {
    id: "py-011",
    language: "python",
    difficulty: "medium",
    concepts: ["slicing", "out-of-bounds"],
    code: `nums = [1, 2, 3]
print(nums[10:20])`,
    question: "What will be the output?",
    options: ["[]", "IndexError", "None", "[1, 2, 3]"],
    correctAnswer: "[]",
    explanation: "Slice indices that are out of range are handled gracefully without raising `IndexError`, returning an empty list `[]`.",
    runtime: "Python 3.10+"
  },
  {
    id: "py-012",
    language: "python",
    difficulty: "hard",
    concepts: ["iterables", "all", "vacuous-truth"],
    code: `print(all([]), any([]))`,
    question: "What will be the output?",
    options: ["True False", "False False", "True True", "False True"],
    correctAnswer: "True False",
    explanation: "`all()` checks if no elements are false (vacuously True on empty iterables). `any()` checks if at least one element is true (False on empty iterables).",
    runtime: "Python 3.10+"
  },
  {
    id: "py-013",
    language: "python",
    difficulty: "medium",
    concepts: ["sets", "types"],
    code: `s = {1, 2}
s.add((3, 4))
print(len(s))`,
    question: "What will be the output?",
    options: ["3", "4", "TypeError", "2"],
    correctAnswer: "3",
    explanation: "Tuples are immutable and hashable, so `(3, 4)` is added as a single valid element to the set, making `len(s) == 3`.",
    runtime: "Python 3.10+"
  },
  {
    id: "py-014",
    language: "python",
    difficulty: "easy",
    concepts: ["strings", "methods", "split"],
    code: `s = "a,b,,c"
parts = s.split(",")
print(len(parts))`,
    question: "What will be the output?",
    options: ["4", "3", "2", "5"],
    correctAnswer: "4",
    explanation: "`split(',')` with an explicit delimiter preserves empty string splits between adjacent commas: `['a', 'b', '', 'c']` (length 4).",
    runtime: "Python 3.10+"
  },
  {
    id: "py-015",
    language: "python",
    difficulty: "hard",
    concepts: ["rounding", "bankers-rounding"],
    code: `print(round(2.5), round(3.5))`,
    question: "What will be the output?",
    options: ["2 4", "3 4", "3 3", "2 3"],
    correctAnswer: "2 4",
    explanation: "Python 3 uses 'banker's rounding' (round half to even). 2.5 rounds to nearest even integer (2), and 3.5 rounds to nearest even integer (4).",
    runtime: "Python 3.10+"
  }
];

const pythonCatalog = [
  { id: "py-016", diff: "easy", concepts: ["lists", "index"], code: "a = [10, 20, 30]; print(a[-1]);", options: ["30", "10", "20", "IndexError"], ans: "30", exp: "Negative index -1 accesses the last item in the list." },
  { id: "py-017", diff: "medium", concepts: ["zip", "lengths"], code: "a = [1, 2]; b = ['a', 'b', 'c']; print(len(list(zip(a, b))));", options: ["2", "3", "5", "ValueError"], ans: "2", exp: "Default `zip()` stops at the shortest input iterable (length 2)." },
  { id: "py-018", diff: "medium", concepts: ["unpacking", "star"], code: "a, *b, c = [1, 2, 3, 4, 5]; print(len(b));", options: ["3", "5", "1", "4"], ans: "3", exp: "`*b` captures all middle elements `[2, 3, 4]`, which has length 3." },
  { id: "py-019", diff: "hard", concepts: ["decorators", "syntax"], code: "def dec(fn): return lambda x: fn(x) + 1\n@dec\ndef f(x): return x * 2\nprint(f(3))", options: ["7", "8", "6", "TypeError"], ans: "7", exp: "`f(3)` computes `3 * 2 = 6`, then the decorator adds 1, yielding 7." },
  { id: "py-020", diff: "medium", concepts: ["dictionaries", "get"], code: "d = {'a': 1}; print(d.get('b', 100));", options: ["100", "None", "KeyError", "1"], ans: "100", exp: "`d.get('b', 100)` returns default value 100 since `'b'` does not exist." },
  { id: "py-021", diff: "easy", concepts: ["strings", "find"], code: "s = 'banana'; print(s.find('z'));", options: ["-1", "None", "ValueError", "False"], ans: "-1", exp: "`find()` returns -1 when substring is not found." },
  { id: "py-022", diff: "medium", concepts: ["strings", "index"], code: "try: 'banana'.index('z')\nexcept Exception as e: print(type(e).__name__)", options: ["ValueError", "IndexError", "KeyError", "-1"], ans: "ValueError", exp: "`str.index()` raises `ValueError` if the substring is absent." },
  { id: "py-023", diff: "hard", concepts: ["generators", "exhaustion"], code: "g = (x for x in [1, 2]); list(g); print(list(g));", options: ["[]", "[1, 2]", "None", "StopIteration"], ans: "[]", exp: "Generator expressions can only be consumed once. A second iteration yields an empty list." },
  { id: "py-024", diff: "medium", concepts: ["sets", "difference"], code: "a = {1, 2, 3}; b = {2, 3, 4}; print(a - b);", options: ["{1}", "{4}", "{1, 4}", "set()"], ans: "{1}", exp: "Set difference `a - b` keeps items in `a` that are not in `b`, leaving `{1}`." },
  { id: "py-025", diff: "easy", concepts: ["types", "isinstance"], code: "print(isinstance(True, int));", options: ["True", "False", "TypeError", "None"], ans: "True", exp: "`bool` is a direct subclass of `int` in Python, so `isinstance(True, int)` is `True`." },
  { id: "py-026", diff: "medium", concepts: ["lists", "sort", "reverse"], code: "a = [3, 1, 2]; res = a.sort(); print(res);", options: ["None", "[1, 2, 3]", "[3, 2, 1]", "TypeError"], ans: "None", exp: "`list.sort()` sorts in-place and returns `None`." },
  { id: "py-027", diff: "medium", concepts: ["builtins", "sorted"], code: "a = [3, 1, 2]; res = sorted(a); print(res[0]);", options: ["1", "3", "None", "2"], ans: "1", exp: "`sorted(a)` returns a new sorted list `[1, 2, 3]`; index 0 is 1." },
  { id: "py-028", diff: "hard", concepts: ["classes", "mro"], code: "class A: pass\nclass B(A): pass\nprint(issubclass(B, object));", options: ["True", "False", "TypeError", "AttributeError"], ans: "True", exp: "All classes in Python 3 implicitly inherit from `object`." },
  { id: "py-029", diff: "medium", concepts: ["enumerate", "start"], code: "items = ['a', 'b']; print(list(enumerate(items, start=1))[0]);", options: ["(1, 'a')", "(0, 'a')", "('a', 1)", "1"], ans: "(1, 'a')", exp: "`enumerate(items, start=1)` produces index-value pairs starting at 1." },
  { id: "py-030", diff: "hard", concepts: ["closures", "late-binding"], code: "funcs = [lambda: i for i in range(3)]\nprint([f() for f in funcs])", options: ["[2, 2, 2]", "[0, 1, 2]", "[3, 3, 3]", "[0, 0, 0]"], ans: ["[2, 2, 2]"], exp: "Closures capture variables by reference, not value. After the loop, `i` is 2." },
  { id: "py-031", diff: "medium", concepts: ["functions", "kwargs"], code: "def f(**kwargs): return len(kwargs)\nprint(f(a=1, b=2));", options: ["2", "1", "None", "TypeError"], ans: "2", exp: "`**kwargs` packs keyword arguments into a dict containing 2 keys." },
  { id: "py-032", diff: "easy", concepts: ["strings", "strip"], code: "print('xxyHelloyxx'.strip('xy'));", options: ["'Hello'", "'yHelloy'", "'xxyHelloyxx'", "''"], ans: "'Hello'", exp: "`strip('xy')` removes any combination of 'x' and 'y' from both ends." },
  { id: "py-033", diff: "medium", concepts: ["dictionaries", "pop"], code: "d = {'x': 10}; print(d.pop('x'), len(d));", options: ["10 0", "10 1", "None 0", "KeyError"], ans: "10 0", exp: "`pop('x')` removes and returns the value (10), reducing length to 0." },
  { id: "py-034", diff: "hard", concepts: ["copy", "deep-vs-shallow"], code: "import copy\na = [[1]]; b = copy.copy(a); b[0].append(2); print(len(a[0]));", options: ["2", "1", "TypeError", "0"], ans: "2", exp: "`copy.copy()` is a shallow copy; the inner nested list `[1]` is still shared." },
  { id: "py-035", diff: "medium", concepts: ["strings", "join"], code: "print('-'.join(['a', 'b', 'c']));", options: ["'a-b-c'", "'a-b-c-'", "'-a-b-c'", "Error"], ans: "'a-b-c'", exp: "`join` places the separator between array elements." },
  { id: "py-036", diff: "hard", concepts: ["numbers", "division"], code: "print(7 / 2, 7 // 2);", options: ["3.5 3", "3 3", "3.5 3.5", "3 3.5"], ans: "3.5 3", exp: "Single slash `/` performs float division (3.5); double slash `//` performs floor division (3)." },
  { id: "py-037", diff: "medium", concepts: ["numbers", "negative-floor"], code: "print(-7 // 2);", options: ["-4", "-3", "-3.5", "3"], ans: "-4", exp: "Floor division floors towards negative infinity: -3.5 rounds down to -4." },
  { id: "py-038", diff: "easy", concepts: ["lists", "extend"], code: "a = [1]; a.extend([2, 3]); print(len(a));", options: ["3", "2", "1", "4"], ans: "3", exp: "`extend` unpacks iterable elements into `a`, resulting in `[1, 2, 3]` (length 3)." },
  { id: "py-039", diff: "medium", concepts: ["lists", "append-list"], code: "a = [1]; a.append([2, 3]); print(len(a));", options: ["2", "3", "1", "4"], ans: "2", exp: "`append` appends the inner list as a single element `[1, [2, 3]]` (length 2)." },
  { id: "py-040", diff: "hard", concepts: ["classes", "property"], code: "class C: \n  @property\n  def val(self): return 42\nc = C(); print(c.val);", options: ["42", "<property object>", "None", "TypeError"], ans: "42", exp: "The `@property` decorator allows method invocation via standard attribute access." },
  { id: "py-041", diff: "medium", concepts: ["boolean", "falsy"], code: "print(bool([]), bool({}), bool(0.0));", options: ["False False False", "False True False", "True True True", "False False True"], ans: "False False False", exp: "Empty collections and `0.0` all evaluate to `False` in Python boolean contexts." },
  { id: "py-042", diff: "hard", concepts: ["scope", "global"], code: "x = 5\ndef f():\n  global x\n  x += 1\nf()\nprint(x)", options: ["6", "5", "UnboundLocalError", "None"], ans: "6", exp: "`global x` instructs the function to bind mutations directly to the module-level `x`." },
  { id: "py-043", diff: "expert", concepts: ["scope", "nonlocal"], code: "def outer():\n  c = 0\n  def inner():\n    nonlocal c\n    c += 10\n  inner()\n  return c\nprint(outer())", options: ["10", "0", "UnboundLocalError", "None"], ans: "10", exp: "`nonlocal` binds `c` to the nearest enclosing non-global scope variable." },
  { id: "py-044", diff: "medium", concepts: ["sets", "intersection"], code: "print({1, 2} & {2, 3});", options: ["{2}", "{1, 2, 3}", "set()", "{1, 3}"], ans: "{2}", exp: "`&` computes set intersection, keeping only elements present in both sets." },
  { id: "py-045", diff: "medium", concepts: ["sets", "symmetric-diff"], code: "print({1, 2} ^ {2, 3});", options: ["{1, 3}", "{2}", "{1, 2, 3}", "set()"], ans: "{1, 3}", exp: "`^` computes symmetric difference (elements in either set, but not in both)." },
  { id: "py-046", diff: "hard", concepts: ["classes", "str-vs-repr"], code: "class P: pass\np = P()\nprint(repr(p).startswith('<'))", options: ["True", "False", "TypeError", "AttributeError"], ans: "True", exp: "Default `object.__repr__` returns a string of the form `<__main__.P object at 0x...>`." },
  { id: "py-047", diff: "medium", concepts: ["builtins", "pow"], code: "print(pow(2, 3, 5));", options: ["3", "8", "1", "0"], ans: "3", exp: "`pow(base, exp, mod)` computes `(2**3) % 5 = 8 % 5 = 3`." },
  { id: "py-048", diff: "hard", concepts: ["generators", "yield-from"], code: "def sub(): yield 1; yield 2\ndef main(): yield from sub(); yield 3\nprint(list(main()))", options: ["[1, 2, 3]", "[[1, 2], 3]", "[3]", "TypeError"], ans: ["[1, 2, 3]"], exp: "`yield from` delegates iteration to the subgenerator." },
  { id: "py-049", diff: "medium", concepts: ["strings", "format"], code: "print('{:.2f}'.format(3.14159));", options: ["'3.14'", "'3.141'", "'3.1'", "'3.15'"], ans: "'3.14'", exp: "Format specifier `{:.2f}` rounds to 2 decimal places." },
  { id: "py-050", diff: "easy", concepts: ["builtins", "abs"], code: "print(abs(-42));", options: ["42", "-42", "0", "TypeError"], ans: "42", exp: "`abs()` computes the absolute value." },
  { id: "py-051", diff: "medium", concepts: ["strings", "count"], code: "print('banana'.count('an'));", options: ["2", "3", "1", "0"], ans: "2", exp: "`'an'` appears non-overlapping twice in `'banana'`." },
  { id: "py-052", diff: "hard", concepts: ["dict", "setdefault"], code: "d = {}; x = d.setdefault('k', []); x.append(1); print(d['k']);", options: ["[1]", "[]", "None", "KeyError"], ans: ["[1]"], exp: "`setdefault` inserts the default list and returns it; mutating `x` updates `d`." },
  { id: "py-053", diff: "medium", concepts: ["lists", "insert"], code: "a = [1, 3]; a.insert(1, 2); print(a);", options: ["[1, 2, 3]", "[2, 1, 3]", "[1, 3, 2]", "Error"], ans: ["[1, 2, 3]"], exp: "`insert(1, 2)` places value 2 at index 1, shifting subsequent elements." },
  { id: "py-054", diff: "hard", concepts: ["classes", "dunder-call"], code: "class Multiplier: \n  def __call__(self, x): return x * 3\nm = Multiplier(); print(m(4));", options: ["12", "4", "TypeError", "None"], ans: "12", exp: "Implementing `__call__` allows instances of the class to be invoked like functions." },
  { id: "py-055", diff: "medium", concepts: ["builtins", "min-key"], code: "words = ['apple', 'fig', 'banana']; print(min(words, key=len));", options: ["'fig'", "'apple'", "'banana'", "3"], ans: "'fig'", exp: "`min(words, key=len)` finds the element with smallest string length ('fig')." },
  { id: "py-056", diff: "hard", concepts: ["exceptions", "else"], code: "res = 0\ntry: pass\nexcept: res = 1\nelse: res = 2\nprint(res)", options: ["2", "0", "1", "SyntaxError"], ans: "2", exp: "The `else` branch of a try block executes if no exceptions were raised." },
  { id: "py-057", diff: "medium", concepts: ["iterables", "next-default"], code: "it = iter([]); print(next(it, 'empty'));", options: ["'empty'", "StopIteration", "None", "Error"], ans: "'empty'", exp: "`next(iterator, default)` returns the default value if the iterator is exhausted." },
  { id: "py-058", diff: "hard", concepts: ["lists", "pop-index"], code: "a = [10, 20, 30]; print(a.pop(1), a[1]);", options: ["20 30", "20 10", "10 20", "30 20"], ans: "20 30", exp: "`pop(1)` removes element at index 1 (20); the element at index 1 is now 30." },
  { id: "py-059", diff: "medium", concepts: ["strings", "casefold"], code: "print('HELLO'.casefold());", options: ["'hello'", "'HELLO'", "'Hello'", "Error"], ans: "'hello'", exp: "`casefold()` implements aggressive lowercase conversion." },
  { id: "py-060", diff: "expert", concepts: ["metaclasses", "type-call"], code: "MyClass = type('MyClass', (), {'x': 10})\nprint(MyClass.x)", options: ["10", "None", "AttributeError", "TypeError"], ans: "10", exp: "`type(name, bases, dict)` dynamically creates a new class." },
  { id: "py-061", diff: "medium", concepts: ["strings", "zfill"], code: "print('42'.zfill(5));", options: ["'00042'", "'42000'", "'0042'", "Error"], ans: "'00042'", exp: "`zfill(5)` pads numeric strings with leading zeros to reach width 5." },
  { id: "py-062", diff: "hard", concepts: ["operator", "is-not"], code: "a = [1]; b = [1]; print(a is not b);", options: ["True", "False", "None", "TypeError"], ans: "True", exp: "`a` and `b` are distinct heap objects with separate IDs." },
  { id: "py-063", diff: "medium", concepts: ["math", "fsum"], code: "import math; print(math.fsum([0.1]*10) == 1.0);", options: ["True", "False", "TypeError", "None"], ans: "True", exp: "`math.fsum` tracks intermediate precision to prevent floating-point loss." },
  { id: "py-064", diff: "hard", concepts: ["itertools", "chain"], code: "import itertools; print(len(list(itertools.chain([1, 2], [3]))));", options: ["3", "2", "1", "TypeError"], ans: "3", exp: "`itertools.chain` links multiple iterables into a single sequence of 3 items." },
  { id: "py-065", diff: "medium", concepts: ["dicts", "keys-view"], code: "d = {'a': 1}; keys = d.keys(); d['b'] = 2; print(len(keys));", options: ["2", "1", "RuntimeError", "None"], ans: "2", exp: "In Python 3, `dict.keys()` returns a dynamic view that reflects dictionary updates." },
  { id: "py-066", diff: "easy", concepts: ["lists", "clear"], code: "a = [1, 2]; a.clear(); print(len(a));", options: ["0", "2", "None", "IndexError"], ans: "0", exp: "`clear()` removes all items from the list." },
  { id: "py-067", diff: "hard", concepts: ["classes", "getattr"], code: "class A:\n  def __getattr__(self, name): return name.upper()\na = A(); print(a.foo);", options: ["'FOO'", "'foo'", "AttributeError", "None"], ans: "'FOO'", exp: "`__getattr__` is called when an attribute cannot be found in the instance `__dict__`." },
  { id: "py-068", diff: "medium", concepts: ["builtins", "map-type"], code: "m = map(int, ['1', '2']); print(type(m).__name__);", options: ["'map'", "'list'", "'generator'", "'tuple'"], ans: "'map'", exp: "`map()` returns an iterator of type `map`." },
  { id: "py-069", diff: "hard", concepts: ["strings", "f-string-equals"], code: "x = 42; print(f'{x=}');", options: ["'x=42'", "'42'", "'x = 42'", "'42='"], ans: "'x=42'", exp: "Python 3.8+ debugging format `f'{x=}'` prints the expression text followed by `=` and value." },
  { id: "py-070", diff: "medium", concepts: ["tuples", "count"], code: "t = (1, 2, 2, 3); print(t.count(2));", options: ["2", "1", "3", "0"], ans: "2", exp: "`count(2)` returns the frequency of element 2." },
  { id: "py-071", diff: "hard", concepts: ["builtins", "zip-strict"], code: "try: list(zip([1], [2, 3], strict=True))\nexcept Exception as e: print(type(e).__name__)", options: ["ValueError", "TypeError", "IndexError", "None"], ans: "ValueError", exp: "Python 3.10+ `zip(..., strict=True)` raises `ValueError` if arguments are of unequal length." },
  { id: "py-072", diff: "medium", concepts: ["numbers", "complex"], code: "z = 3 + 4j; print(int(z.real));", options: ["3", "4", "5", "TypeError"], ans: "3", exp: "The real part `.real` of `3 + 4j` is 3.0." },
  { id: "py-073", diff: "hard", concepts: ["functools", "reduce"], code: "from functools import reduce; print(reduce(lambda x, y: x * y, [1, 2, 3, 4]));", options: ["24", "10", "12", "0"], ans: "24", exp: "`reduce` multiplies sequentially: 1 * 2 * 3 * 4 = 24." },
  { id: "py-074", diff: "medium", concepts: ["lists", "count"], code: "a = ['a', 'b', 'a']; print(a.count('a'));", options: ["2", "1", "3", "0"], ans: "2", exp: "`count('a')` returns 2." },
  { id: "py-075", diff: "expert", concepts: ["classes", "init-subclass"], code: "class Base:\n  def __init_subclass__(cls): cls.tag = 'sub'\nclass Child(Base): pass\nprint(Child.tag)", options: ["'sub'", "AttributeError", "None", "TypeError"], ans: "'sub'", exp: "`__init_subclass__` executes automatically whenever the class is subclassed." },
  { id: "py-076", diff: "medium", concepts: ["strings", "startswith-tuple"], code: "print('hello.py'.endswith(('.py', '.js')));", options: ["True", "False", "TypeError", "None"], ans: "True", exp: "`endswith()` accepts a tuple of suffixes to test against." },
  { id: "py-077", diff: "hard", concepts: ["context-managers", "exit"], code: "class M:\n  def __enter__(self): return 1\n  def __exit__(self, *a): pass\nwith M() as val: print(val)", options: ["1", "None", "TypeError", "AttributeError"], ans: "1", exp: "`__enter__` returns the bound target value for the `as` clause." },
  { id: "py-078", diff: "medium", concepts: ["dict", "update"], code: "d = {'a': 1}; d.update(a=2, b=3); print(d['a'], d['b']);", options: ["2 3", "1 3", "2 None", "Error"], ans: "2 3", exp: "`update()` overwrites existing keys and adds new ones." },
  { id: "py-079", diff: "hard", concepts: ["slices", "step-delete"], code: "a = [0, 1, 2, 3, 4]; del a[::2]; print(a);", options: ["[1, 3]", "[0, 2, 4]", "[]", "IndexError"], ans: ["[1, 3]"], exp: "Deleting `a[::2]` removes elements at even indices (0, 2, 4), leaving `[1, 3]`." },
  { id: "py-080", diff: "medium", concepts: ["builtins", "hex"], code: "print(hex(16));", options: ["'0x10'", "'0x16'", "'10'", "'0xF'"], ans: "'0x10'", exp: "16 in base 16 hexadecimal representation is `'0x10'`." },
  { id: "py-081", diff: "hard", concepts: ["math", "isclose"], code: "import math; print(math.isclose(0.1 + 0.2, 0.3));", options: ["True", "False", "None", "Error"], ans: "True", exp: "`math.isclose()` tests floating point equality within a tolerance." },
  { id: "py-082", diff: "medium", concepts: ["strings", "partition"], code: "print('key=val'.partition('='));", options: ["('key', '=', 'val')", "('key', 'val')", "['key', 'val']", "Error"], ans: "('key', '=', 'val')", exp: "`partition` splits string into a 3-tuple `(head, sep, tail)`." },
  { id: "py-083", diff: "expert", concepts: ["sys", "intern"], code: "import sys; a = sys.intern('custom_string'); b = sys.intern('custom_string'); print(a is b);", options: ["True", "False", "None", "Error"], ans: "True", exp: "`sys.intern` guarantees string identity `is` by sharing the interned string pointer." },
  { id: "py-084", diff: "medium", concepts: ["builtins", "bin"], code: "print(bin(5));", options: ["'0b101'", "'101'", "'0b5'", "'0x5'"], ans: "'0b101'", exp: "5 in binary is `'0b101'`." },
  { id: "py-085", diff: "hard", concepts: ["classes", "slots"], code: "class S:\n  __slots__ = ['x']\ns = S(); s.x = 1\ntry: s.y = 2\nexcept AttributeError: print('No Y')", options: ["'No Y'", "2", "None", "TypeError"], ans: "'No Y'", exp: "`__slots__` prevents creation of `__dict__`, raising `AttributeError` on undeclared attributes." },
  { id: "py-086", diff: "medium", concepts: ["functions", "positional-only"], code: "def f(a, /, b): return a + b\nprint(f(2, b=3));", options: ["5", "TypeError", "None", "6"], ans: "5", exp: "The `/` syntax marks parameters to its left as positional-only." },
  { id: "py-087", diff: "hard", concepts: ["functions", "keyword-only"], code: "def f(*, a): return a * 2\nprint(f(a=4));", options: ["8", "TypeError", "4", "None"], ans: "8", exp: "Parameters after bare `*` must be passed as keyword arguments." },
  { id: "py-088", diff: "medium", concepts: ["lists", "reverse-inplace"], code: "a = [1, 2]; a.reverse(); print(a);", options: ["[2, 1]", "[1, 2]", "None", "Error"], ans: ["[2, 1]"], exp: "`reverse()` mutates the list in-place." },
  { id: "py-089", diff: "hard", concepts: ["exceptions", "from-none"], code: "try:\n  try: 1/0\n  except ZeroDivisionError: raise ValueError from None\nexcept Exception as e: print(e.__cause__)", options: ["None", "ZeroDivisionError", "ValueError", "Error"], ans: "None", exp: "`raise ... from None` suppresses the exception context in `__cause__`." },
  { id: "py-090", diff: "medium", concepts: ["strings", "swapcase"], code: "print('Py'.swapcase());", options: ["'pY'", "'PY'", "'py'", "Error"], ans: "'pY'", exp: "`swapcase()` flips uppercase to lowercase and vice versa." },
  { id: "py-091", diff: "hard", concepts: ["itertools", "count"], code: "import itertools; c = itertools.count(start=5, step=2); print(next(c), next(c));", options: ["5 7", "5 6", "0 2", "5 5"], ans: "5 7", exp: "`itertools.count(5, 2)` produces an infinite arithmetic progression: 5, 7, 9..." },
  { id: "py-092", diff: "medium", concepts: ["dictionaries", "fromkeys"], code: "d = dict.fromkeys(['a', 'b'], 0); print(d['a'], d['b']);", options: ["0 0", "None None", "KeyError", "0 None"], ans: "0 0", exp: "`dict.fromkeys(keys, val)` initializes all keys with the specified value." },
  { id: "py-093", diff: "expert", concepts: ["types", "method-binding"], code: "class A:\n  def f(self): return 1\nprint(type(A.f).__name__, type(A().f).__name__)", options: ["'function' 'method'", "'method' 'method'", "'function' 'function'", "Error"], ans: "'function' 'method'", exp: "On the class it is an unbound `function`; on an instance it becomes a bound `method`." },
  { id: "py-094", diff: "medium", concepts: ["builtins", "chr-ord"], code: "print(chr(ord('A') + 1));", options: ["'B'", "'A'", "66", "TypeError"], ans: "'B'", exp: "`ord('A')` is 65; 65 + 1 is 66; `chr(66)` is `'B'`." },
  { id: "py-095", diff: "hard", concepts: ["collections", "Counter"], code: "from collections import Counter; c = Counter('abac'); print(c['a']);", options: ["2", "1", "3", "KeyError"], ans: "2", exp: "`Counter` counts frequencies of elements; 'a' appears twice." },
  { id: "py-096", diff: "medium", concepts: ["builtins", "filter-none"], code: "print(list(filter(None, [0, 1, False, 2])));", options: ["[1, 2]", "[0, 1, 2]", "[]", "TypeError"], ans: ["[1, 2]"], exp: "Passing `None` to `filter()` uses identity truth testing, keeping only truthy items." },
  { id: "py-097", diff: "hard", concepts: ["types", "Ellipsis"], code: "print(... == Ellipsis);", options: ["True", "False", "SyntaxError", "None"], ans: "True", exp: "The literal `...` is the singleton object `Ellipsis` in Python." },
  { id: "py-098", diff: "medium", concepts: ["sets", "issubset"], code: "print({1}.issubset({1, 2}));", options: ["True", "False", "None", "Error"], ans: "True", exp: "`{1}` is a subset of `{1, 2}`." },
  { id: "py-099", diff: "hard", concepts: ["strings", "rfind"], code: "print('banana'.rfind('a'));", options: ["5", "1", "3", "-1"], ans: "5", exp: "`rfind` searches from right to left, returning the highest index (5)." },
  { id: "py-100", diff: "expert", concepts: ["dunder", "subclasses"], code: "class Base: pass\nclass Sub(Base): pass\nprint(len(Base.__subclasses__()))", options: ["1", "0", "2", "AttributeError"], ans: "1", exp: "`__subclasses__()` returns a list of weak references to direct subclasses." },
  { id: "py-101", diff: "medium", concepts: ["tuples", "addition"], code: "print((1, 2) + (3,));", options: ["(1, 2, 3)", "(1, 2, (3,))", "TypeError", "[1, 2, 3]"], ans: "(1, 2, 3)", exp: "Concatenating two tuples creates a new combined tuple." },
  { id: "py-102", diff: "hard", concepts: ["math", "gcd"], code: "import math; print(math.gcd(12, 18));", options: ["6", "3", "2", "36"], ans: "6", exp: "The greatest common divisor of 12 and 18 is 6." },
  { id: "py-103", diff: "medium", concepts: ["numbers", "oct"], code: "print(oct(8));", options: ["'0o10'", "'0o8'", "'8'", "'10'"], ans: "'0o10'", exp: "8 in octal representation is `'0o10'`." },
  { id: "py-104", diff: "hard", concepts: ["functions", "annotations"], code: "def f(x: int) -> str: pass\nprint(f.__annotations__['x'].__name__)", options: ["'int'", "'str'", "AttributeError", "KeyError"], ans: "'int'", exp: "Function type annotations are stored in the `__annotations__` dictionary." },
  { id: "py-105", diff: "expert", concepts: ["gc", "is-tracked"], code: "import gc; print(gc.is_tracked(42));", options: ["False", "True", "None", "Error"], ans: "False", exp: "Simple atomic types like integers, strings, and floats are not tracked by the cyclic garbage collector." }
];

export function getAllPythonQuestions() {
  const result = [...pythonQuestionsBase];
  for (const item of pythonCatalog) {
    result.push({
      id: item.id,
      language: "python",
      difficulty: item.diff,
      concepts: item.concepts,
      code: item.code,
      question: "What will be the output?",
      options: item.options,
      correctAnswer: Array.isArray(item.ans) ? item.ans[0] : String(item.ans),
      explanation: item.exp,
      runtime: "Python 3.10+",
      hint: `Recall Python's rules for ${item.concepts[0]}.`
    });
  }
  return result;
}
