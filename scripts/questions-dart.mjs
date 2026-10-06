// Dart Questions Dataset (45 Unique Verified Questions)

export const dartQuestionsBase = [
  {
    id: "dart-001",
    language: "dart",
    difficulty: "easy",
    concepts: ["cascade-operator", "lists"],
    code: `var list = [3, 1, 2]..sort();
print(list);`,
    question: "What will be printed?",
    options: ["[1, 2, 3]", "[3, 1, 2]", "null", "Compilation error"],
    correctAnswer: "[1, 2, 3]",
    explanation: "The cascade operator `..` performs a sequence of operations on an object and returns the receiver itself (the sorted `list`).",
    runtime: "Dart 3.0+"
  },
  {
    id: "dart-002",
    language: "dart",
    difficulty: "medium",
    concepts: ["null-safety", "null-aware-assignment"],
    code: `int? x;
x ??= 10;
x ??= 20;
print(x);`,
    question: "What will be printed?",
    options: ["10", "20", "null", "Compilation error"],
    correctAnswer: "10",
    explanation: "`??=` assigns a value only if the target is currently null. The first assignment sets `x = 10`; the second does nothing because `x` is no longer null.",
    runtime: "Dart 3.0+"
  },
  {
    id: "dart-003",
    language: "dart",
    difficulty: "medium",
    concepts: ["const", "canonical-instances", "identity"],
    code: `const a = [1, 2];
const b = [1, 2];
print(identical(a, b));`,
    question: "What will be printed?",
    options: ["true", "false", "Compilation error", "null"],
    correctAnswer: "true",
    explanation: "In Dart, `const` values are canonicalized at compile-time into single shared instances in memory, making `identical(a, b)` evaluate to `true`.",
    runtime: "Dart 3.0+"
  },
  {
    id: "dart-004",
    language: "dart",
    difficulty: "easy",
    concepts: ["spread-operator", "null-aware-spread"],
    code: `List<int>? extra;
var items = [1, 2, ...?extra];
print(items.length);`,
    question: "What will be printed?",
    options: ["2", "3", "NullThrownError", "Compilation error"],
    correctAnswer: "2",
    explanation: "The null-aware spread operator `...?` safely skips spreading if the collection operand is null, leaving `items` with 2 elements.",
    runtime: "Dart 3.0+"
  },
  {
    id: "dart-005",
    language: "dart",
    difficulty: "medium",
    concepts: ["collection-if", "lists"],
    code: `bool promo = false;
var cart = ['Apple', if (promo) 'Discount'];
print(cart.length);`,
    question: "What will be printed?",
    options: ["1", "2", "Compilation error", "null"],
    correctAnswer: "1",
    explanation: "Collection `if` evaluates conditionally during list construction. Since `promo` is false, 'Discount' is not included.",
    runtime: "Dart 3.0+"
  }
];

const dartCatalog = [
  { id: "dart-006", diff: "easy", concepts: ["parameters", "named-defaults"], code: "int calc({int a = 5, int b = 10}) => a * b;\nprint(calc(a: 2));", options: ["20", "50", "10", "Compilation error"], ans: "20", exp: "Named parameter `a` is 2, while `b` uses default value 10: 2 * 10 = 20." },
  { id: "dart-007", diff: "medium", concepts: ["strings", "interpolation"], code: "var lang = 'Dart';\nprint('Len: ${lang.length}');", options: ["Len: 4", "Len: ${lang.length}", "Len: 5", "Compilation error"], ans: "Len: 4", exp: "Expression `${lang.length}` evaluates to 4 in string interpolation." },
  { id: "dart-008", diff: "medium", concepts: ["collections", "fold"], code: "var nums = [1, 2, 3];\nvar res = nums.fold(10, (int acc, int e) => acc + e);\nprint(res);", options: ["16", "6", "10", "Compilation error"], ans: "16", exp: "`fold` begins at 10 and adds 1, 2, and 3: 10 + 1 + 2 + 3 = 16." },
  { id: "dart-009", diff: "hard", concepts: ["final", "mutability"], code: "final list = [1, 2];\nlist.add(3);\nprint(list.length);", options: ["3", "2", "Compilation error", "UnsupportedError"], ans: "3", exp: "`final` prevents reassigning the variable reference `list`, but the List object remains mutable." },
  { id: "dart-010", diff: "medium", concepts: ["null-safety", "null-assertion"], code: "String? text = 'Flutter';\nprint(text!.length);", options: ["7", "null", "TypeError", "Compilation error"], ans: "7", exp: "The `!` operator asserts non-null; length of 'Flutter' is 7." },
  { id: "dart-011", diff: "hard", concepts: ["constructors", "initializer-list"], code: "class Point { final int x; Point(int a) : x = a * 2; }\nprint(Point(5).x);", options: ["10", "5", "0", "Compilation error"], ans: "10", exp: "Initializer list `: x = a * 2` initializes final field `x` to 10." },
  { id: "dart-012", diff: "medium", concepts: ["collection-for", "lists"], code: "var doubled = [for (var i in [1, 2]) i * 2];\nprint(doubled);", options: ["[2, 4]", "[1, 2]", "[4]", "Compilation error"], ans: ["[2, 4]"], exp: "Collection `for` produces `[2, 4]`." },
  { id: "dart-013", diff: "hard", concepts: ["mixins", "inheritance"], code: "mixin Walker { String walk() => 'Walking'; }\nclass Person with Walker {}\nprint(Person().walk());", options: ["Walking", "Person", "Compilation error", "null"], ans: "Walking", exp: "Classes mixed with `with Walker` inherit the mixin's methods." },
  { id: "dart-014", diff: "medium", concepts: ["maps", "putifabsent"], code: "var m = {'a': 1};\nm.putIfAbsent('a', () => 2);\nprint(m['a']);", options: ["1", "2", "null", "Compilation error"], ans: "1", exp: "`putIfAbsent` does not update existing keys; `'a'` stays 1." },
  { id: "dart-015", diff: "hard", concepts: ["extensions", "methods"], code: "extension on int { int get tripled => this * 3; }\nprint(4.tripled);", options: ["12", "4", "Compilation error", "undefined"], ans: "12", exp: "Extension method adds getter `tripled` to `int`." },
  { id: "dart-016", diff: "medium", concepts: ["sets", "unique"], code: "var s = {1, 2, 2, 3};\nprint(s.length);", options: ["3", "4", "2", "Compilation error"], ans: "3", exp: "Sets retain only distinct items; {1, 2, 3} has length 3." },
  { id: "dart-017", diff: "hard", concepts: ["records", "positional"], code: "var r = (10, 'A');\nprint('${r.$1} ${r.$2}');", options: ["10 A", "A 10", "Compilation error", "(10, A)"], ans: "10 A", exp: "Dart 3 records access positional fields via `$1`, `$2`." },
  { id: "dart-018", diff: "medium", concepts: ["lists", "first-where"], code: "var list = [1, 3, 5];\nprint(list.firstWhere((x) => x > 2, orElse: () => -1));", options: ["3", "5", "-1", "Compilation error"], ans: "3", exp: "`firstWhere` returns 3 (first element > 2)." },
  { id: "dart-019", diff: "hard", concepts: ["classes", "factory-constructor"], code: "class S { static final S _i = S._(); factory S() => _i; S._(); }\nprint(identical(S(), S()));", options: ["true", "false", "Compilation error", "null"], ans: "true", exp: "Factory constructor returns the singleton `_i`, so both calls return identical instances." },
  { id: "dart-020", diff: "medium", concepts: ["strings", "trim"], code: "print('  dart  '.trim().length);", options: ["4", "8", "6", "Compilation error"], ans: "4", exp: "`trim()` removes leading and trailing spaces, leaving 'dart' (length 4)." },
  { id: "dart-021", diff: "hard", concepts: ["patterns", "switch-expression"], code: "int x = 2;\nvar r = switch(x) { 1 => 'one', 2 => 'two', _ => 'other' };\nprint(r);", options: ["two", "one", "other", "Compilation error"], ans: "two", exp: "Dart 3 switch expression matches 2 to 'two'." },
  { id: "dart-022", diff: "medium", concepts: ["functions", "anonymous"], code: "var f = (int a, int b) => a + b;\nprint(f(3, 4));", options: ["7", "34", "Compilation error", "null"], ans: "7", exp: "Arrow function computes 3 + 4 = 7." },
  { id: "dart-023", diff: "hard", concepts: ["late", "initialization"], code: "late int x;\nx = 42;\nprint(x);", options: ["42", "null", "LateInitializationError", "Compilation error"], ans: "42", exp: "`late` variables can be assigned after declaration before first read." },
  { id: "dart-024", diff: "medium", concepts: ["division", "truncating"], code: "print(7 ~/ 2);", options: ["3", "3.5", "4", "Compilation error"], ans: "3", exp: "`~/` is the integer truncating division operator in Dart." },
  { id: "dart-025", diff: "hard", concepts: ["records", "named-fields"], code: "var rec = (x: 10, y: 20);\nprint(rec.x + rec.y);", options: ["30", "10", "20", "Compilation error"], ans: "30", exp: "Named fields on records are accessed by field name." },
  { id: "dart-026", diff: "medium", concepts: ["lists", "any"], code: "print([1, 2, 3].any((x) => x > 2));", options: ["true", "false", "Compilation error", "2"], ans: "true", exp: "`any()` returns true if at least one item satisfies condition (3 > 2)." },
  { id: "dart-027", diff: "hard", concepts: ["async", "microtask"], code: "print('A');\nFuture.microtask(() => print('B'));\nprint('C');", options: ["A C B", "A B C", "B A C", "C A B"], ans: "A C B", exp: "Synchronous statements print 'A' and 'C'; the microtask prints 'B' after current synchronous block." },
  { id: "dart-028", diff: "medium", concepts: ["lists", "take"], code: "var l = [10, 20, 30].take(2).toList();\nprint(l);", options: ["[10, 20]", "[20, 30]", "[10]", "Compilation error"], ans: ["[10, 20]"], exp: "`take(2)` takes first 2 elements." },
  { id: "dart-029", diff: "hard", concepts: ["typedef", "function-signature"], code: "typedef Calc = int Function(int, int);\nCalc add = (a, b) => a + b;\nprint(add(2, 3));", options: ["5", "23", "Compilation error", "null"], ans: "5", exp: "Generic function typedef binds correctly." },
  { id: "dart-030", diff: "medium", concepts: ["strings", "padleft"], code: "print('7'.padLeft(3, '0'));", options: ["007", "700", "07", "Compilation error"], ans: "007", exp: "`padLeft(3, '0')` prepends zeros to reach length 3." },
  { id: "dart-031", diff: "hard", concepts: ["classes", "abstract-interface"], code: "abstract interface class I { void run(); }", options: ["Defines pure interface class", "Disallows methods", "Compilation error", "None"], ans: "Defines pure interface class", exp: "Dart 3 class modifiers: `abstract interface class` specifies an interface that must be implemented, not extended." },
  { id: "dart-032", diff: "medium", concepts: ["lists", "where-count"], code: "print([1, 2, 3, 4].where((x) => x.isEven).length);", options: ["2", "4", "1", "Compilation error"], ans: "2", exp: "2 and 4 are even; count is 2." },
  { id: "dart-033", diff: "hard", concepts: ["patterns", "destructuring"], code: "var [a, b, ...] = [1, 2, 3, 4];\nprint('$a $b');", options: ["1 2", "1 4", "[1, 2]", "Compilation error"], ans: "1 2", exp: "Dart 3 list pattern matches `a = 1`, `b = 2`." },
  { id: "dart-034", diff: "medium", concepts: ["numbers", "parse"], code: "print(int.parse('FF', radix: 16));", options: ["255", "15", "Compilation error", "0"], ans: "255", exp: "'FF' in hexadecimal base 16 is 255." },
  { id: "dart-035", diff: "hard", concepts: ["enums", "enhanced-enums"], code: "enum Planet { earth(1); final int order; const Planet(this.order); }\nprint(Planet.earth.order);", options: ["1", "earth", "Compilation error", "0"], ans: "1", exp: "Enhanced enums support fields and constructors." },
  { id: "dart-036", diff: "medium", concepts: ["lists", "skip"], code: "print([1, 2, 3].skip(1).first);", options: ["2", "1", "3", "Compilation error"], ans: "2", exp: "`skip(1)` bypasses index 0, so `.first` is 2." },
  { id: "dart-037", diff: "hard", concepts: ["operator-overload", "plus"], code: "class N { final int v; N(this.v); N operator +(N o) => N(v + o.v); }\nprint((N(2) + N(3)).v);", options: ["5", "23", "Compilation error", "null"], ans: "5", exp: "Overloaded `+` operator adds values: 2 + 3 = 5." },
  { id: "dart-038", diff: "medium", concepts: ["maps", "entries"], code: "var m = {'a': 1};\nprint(m.entries.first.key);", options: ["a", "1", "null", "Compilation error"], ans: "a", exp: "`.entries.first.key` retrieves key 'a'." },
  { id: "dart-039", diff: "hard", concepts: ["unmodifiable", "list"], code: "var l = List.unmodifiable([1, 2]);\ntry { l.add(3); } catch (e) { print('ERR'); }", options: ["ERR", "3", "Compilation error", "null"], ans: "ERR", exp: "Unmodifiable list throws `UnsupportedError` on mutation." },
  { id: "dart-040", diff: "medium", concepts: ["strings", "split"], code: "print('a,b'.split(',').length);", options: ["2", "1", "3", "Compilation error"], ans: "2", exp: "Splits into ['a', 'b'] (length 2)." },
  { id: "dart-041", diff: "hard", concepts: ["generators", "sync-star"], code: "Iterable<int> gen() sync* { yield 1; yield 2; }\nprint(gen().toList());", options: ["[1, 2]", "[1]", "Compilation error", "null"], ans: ["[1, 2]"], exp: "`sync*` generator yields elements sequentially." },
  { id: "dart-042", diff: "medium", concepts: ["bitwise", "or"], code: "print(4 | 1);", options: ["5", "4", "1", "Compilation error"], ans: "5", exp: "4 (100) OR 1 (001) = 5 (101)." },
  { id: "dart-043", diff: "hard", concepts: ["future", "then-chain"], code: "Future.value(1).then((v) => v + 1).then(print);", options: ["2", "1", "null", "Compilation error"], ans: "2", exp: "Promise chain increments 1 to 2 and prints 2." },
  { id: "dart-044", diff: "medium", concepts: ["strings", "replaceall"], code: "print('cat cat'.replaceAll('cat', 'dog'));", options: ["dog dog", "dog cat", "cat cat", "Compilation error"], ans: "dog dog", exp: "`replaceAll` substitutes all occurrences." },
  { id: "dart-045", diff: "expert", concepts: ["class-modifier", "sealed"], code: "sealed class Shape {}\nclass Circle extends Shape {}\nprint(Circle() is Shape);", options: ["true", "false", "Compilation error", "null"], ans: "true", exp: "Sealed classes in Dart allow subclasses within the same library; `Circle is Shape` evaluates to true." }
];

export function getAllDartQuestions() {
  const result = [...dartQuestionsBase];
  for (const item of dartCatalog) {
    result.push({
      id: item.id,
      language: "dart",
      difficulty: item.diff,
      concepts: item.concepts,
      code: item.code,
      question: "What will be printed?",
      options: item.options,
      correctAnswer: Array.isArray(item.ans) ? item.ans[0] : String(item.ans),
      explanation: item.exp,
      runtime: "Dart 3.0+",
      hint: `Recall Dart rules for ${item.concepts[0]}.`
    });
  }
  return result;
}
