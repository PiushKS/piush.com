// Kotlin Questions Dataset (45 Unique Verified Questions)

export const kotlinQuestionsBase = [
  {
    id: "kt-001",
    language: "kotlin",
    difficulty: "easy",
    concepts: ["nullability", "elvis-operator"],
    code: `val name: String? = null
println(name ?: "Default")`,
    question: "What will be printed?",
    options: ["Default", "null", "Compilation error", "NullPointerException"],
    correctAnswer: "Default",
    explanation: "The Elvis operator `?:` evaluates the left operand; if it is null, it evaluates and returns the right operand ('Default').",
    runtime: "Kotlin 1.9+"
  },
  {
    id: "kt-002",
    language: "kotlin",
    difficulty: "medium",
    concepts: ["scope-functions", "let", "safe-call"],
    code: `val str: String? = "Kotlin"
val len = str?.let { it.length } ?: 0
println(len)`,
    question: "What will be printed?",
    options: ["6", "0", "null", "Compilation error"],
    correctAnswer: "6",
    explanation: "Because `str` is not null, the safe call `?.` invokes `let`, executing `it.length` which produces 6.",
    runtime: "Kotlin 1.9+"
  },
  {
    id: "kt-003",
    language: "kotlin",
    difficulty: "medium",
    concepts: ["data-classes", "copy", "equality"],
    code: `data class User(val id: Int, val name: String)
val u1 = User(1, "Alice")
val u2 = u1.copy(name = "Bob")
println(u1 == u2)`,
    question: "What will be printed?",
    options: ["false", "true", "Compilation error", "null"],
    correctAnswer: "false",
    explanation: "Data classes generate structural equality `equals()` comparing all primary constructor properties. Since `u1.name != u2.name`, `u1 == u2` is `false`.",
    runtime: "Kotlin 1.9+"
  },
  {
    id: "kt-004",
    language: "kotlin",
    difficulty: "easy",
    concepts: ["val", "mutability", "collections"],
    code: `val list = mutableListOf(1, 2)
list.add(3)
println(list.size)`,
    question: "What will be printed?",
    options: ["3", "2", "Compilation error", "UnsupportedOperationException"],
    correctAnswer: "3",
    explanation: "`val` guarantees reference immutability (the variable `list` cannot be reassigned to a new list), but the underlying `MutableList` instance itself remains mutable.",
    runtime: "Kotlin 1.9+"
  },
  {
    id: "kt-005",
    language: "kotlin",
    difficulty: "medium",
    concepts: ["scope-functions", "apply"],
    code: `val items = mutableListOf<Int>().apply {
    add(10)
    add(20)
}
println(items.sum())`,
    question: "What will be printed?",
    options: ["30", "20", "10", "Compilation error"],
    correctAnswer: "30",
    explanation: "`apply` executes the lambda block with the context object as receiver `this`, and returns the context object itself. The sum of 10 + 20 is 30.",
    runtime: "Kotlin 1.9+"
  }
];

const kotlinCatalog = [
  { id: "kt-006", diff: "medium", concepts: ["scope-functions", "also"], code: "var x = 10\nval y = x.also { x += 5 }\nprintln(\"$x $y\")", options: ["15 10", "15 15", "10 10", "10 15"], ans: "15 10", exp: "`also` returns the receiver value prior to the block assignment (10), while `x += 5` mutates outer `x` to 15." },
  { id: "kt-007", diff: "easy", concepts: ["when", "expressions"], code: "val x = 2\nval res = when (x) {\n    1 -> \"A\"\n    2 -> \"B\"\n    else -> \"C\"\n}\nprintln(res)", options: ["B", "A", "C", "Compilation error"], ans: "B", exp: "The `when` expression branches on matching `2`, evaluating to \"B\"." },
  { id: "kt-008", diff: "hard", concepts: ["extensions", "static-dispatch"], code: "open class Base\nclass Derived : Base()\nfun Base.name() = \"Base\"\nfun Derived.name() = \"Derived\"\nval b: Base = Derived()\nprintln(b.name())", options: ["Base", "Derived", "Compilation error", "null"], ans: "Base", exp: "Extension functions in Kotlin are dispatched statically based on the declared reference type (`Base`), not the runtime instance." },
  { id: "kt-009", diff: "easy", concepts: ["strings", "templates"], code: "val a = 3; val b = 4\nprintln(\"Total: ${a + b}\")", options: ["Total: 7", "Total: 34", "Total: a + b", "Compilation error"], ans: "Total: 7", exp: "Expressions within `${}` in string templates evaluate dynamically (3 + 4 = 7)." },
  { id: "kt-010", diff: "medium", concepts: ["companion-objects", "access"], code: "class Config {\n    companion object {\n        const val VERSION = 2\n    }\n}\nprintln(Config.VERSION)", options: ["2", "Config", "Compilation error", "null"], ans: "2", exp: "Members of a companion object are accessible directly via the enclosing class name." },
  { id: "kt-011", diff: "medium", concepts: ["ranges", "until"], code: "val r = 1 until 4\nprintln(r.toList().size)", options: ["3", "4", "2", "Compilation error"], ans: "3", exp: "`until` produces a half-open range excluding the end point: `[1, 2, 3]` (size 3)." },
  { id: "kt-012", diff: "medium", concepts: ["ranges", "step"], code: "val list = (1..5 step 2).toList()\nprintln(list)", options: ["[1, 3, 5]", "[1, 2, 3, 4, 5]", "[2, 4]", "[1, 3]"], ans: "[1, 3, 5]", exp: "`step 2` increments by 2: 1, 3, 5." },
  { id: "kt-013", diff: "hard", concepts: ["destructuring", "data-classes"], code: "data class Point(val x: Int, val y: Int)\nval (a, b) = Point(10, 20)\nprintln(\"$b $a\")", options: ["20 10", "10 20", "Point", "Compilation error"], ans: "20 10", exp: "Destructuring maps positional components: `a = 10`, `b = 20`. Printing `\"$b $a\"` yields \"20 10\"." },
  { id: "kt-014", diff: "medium", concepts: ["collections", "filter-map"], code: "val res = listOf(1, 2, 3).filter { it > 1 }.map { it * 2 }\nprintln(res)", options: ["[4, 6]", "[2, 4, 6]", "[4]", "[]"], ans: "[4, 6]", exp: "Filter keeps 2 and 3; mapping doubles each to `[4, 6]`." },
  { id: "kt-015", diff: "easy", concepts: ["null-safety", "not-null-assertion"], code: "val s: String? = \"Hi\"\nprintln(s!!.length)", options: ["2", "null", "NullPointerException", "Compilation error"], ans: "2", exp: "`!!` asserts that the operand is non-null; since `s` is \"Hi\", length is 2." },
  { id: "kt-016", diff: "hard", concepts: ["lazy", "delegates"], code: "var init = 0\nval x by lazy { init++; 42 }\nprintln(\"$init ${x} $init\")", options: ["0 42 1", "1 42 1", "0 42 0", "Compilation error"], ans: "0 42 1", exp: "`by lazy` evaluates on first read: initially `init` is 0; reading `x` sets `init = 1` and returns 42." },
  { id: "kt-017", diff: "medium", concepts: ["smart-casts", "is"], code: "val obj: Any = \"Kotlin\"\nif (obj is String) {\n    println(obj.length)\n}", options: ["6", "Compilation error", "ClassCastException", "null"], ans: "6", exp: "The compiler smart-casts `obj` to `String` inside the `is String` check." },
  { id: "kt-018", diff: "medium", concepts: ["named-arguments", "defaults"], code: "fun greet(name: String = \"Guest\", prefix: String = \"Hi\") = \"$prefix $name\"\nprintln(greet(prefix = \"Hey\"))", options: ["Hey Guest", "Hi Guest", "Hey Hey", "Compilation error"], ans: "Hey Guest", exp: "Named argument `prefix = \"Hey\"` overrides prefix while `name` keeps its default \"Guest\"." },
  { id: "kt-019", diff: "hard", concepts: ["sealed-classes", "when-exhaustiveness"], code: "sealed class Result\nclass Ok(val v: Int) : Result()\nclass Err : Result()\nfun check(r: Result) = when(r) { is Ok -> r.v; is Err -> -1 }\nprintln(check(Ok(99)))", options: ["99", "-1", "Compilation error", "null"], ans: "99", exp: "Sealed hierarchies allow exhaustive `when` matching without an `else` branch." },
  { id: "kt-020", diff: "medium", concepts: ["scope-functions", "run"], code: "val res = \"Code\".run {\n    length * 2\n}\nprintln(res)", options: ["8", "4", "Code", "Compilation error"], ans: "8", exp: "`run` executes with context receiver `this = \"Code\"` and returns the lambda result 4 * 2 = 8." },
  { id: "kt-021", diff: "hard", concepts: ["scope-functions", "with"], code: "val sb = StringBuilder()\nwith(sb) {\n    append(\"A\")\n    append(\"B\")\n}\nprintln(sb.toString())", options: ["AB", "A", "B", "Compilation error"], ans: "AB", exp: "`with` takes the receiver as argument and appends 'A' and 'B' in-place." },
  { id: "kt-022", diff: "medium", concepts: ["collections", "fold"], code: "val sum = listOf(1, 2, 3).fold(10) { acc, e -> acc + e }\nprintln(sum)", options: ["16", "6", "10", "Compilation error"], ans: "16", exp: "`fold` begins with initial value 10: 10 + 1 + 2 + 3 = 16." },
  { id: "kt-023", diff: "easy", concepts: ["strings", "raw-multiline"], code: "val s = \"\"\"Hello\nWorld\"\"\".trimIndent()\nprintln(s.lines().size)", options: ["2", "1", "3", "Compilation error"], ans: "2", exp: "The multiline raw string consists of 2 lines: \"Hello\" and \"World\"." },
  { id: "kt-024", diff: "medium", concepts: ["operator-overload", "plus"], code: "data class Num(val v: Int) {\n    operator fun plus(o: Num) = Num(v + o.v)\n}\nprintln((Num(2) + Num(3)).v)", options: ["5", "6", "23", "Compilation error"], ans: "5", exp: "The `operator fun plus` enables the `+` operator, computing 2 + 3 = 5." },
  { id: "kt-025", diff: "hard", concepts: ["collections", "associateby"], code: "val m = listOf(\"apple\", \"fig\").associateBy { it.length }\nprintln(m[3])", options: ["fig", "apple", "null", "Compilation error"], ans: "fig", exp: "`associateBy` maps each item to its key `it.length`. \"fig\" has length 3, so `m[3]` is \"fig\"." },
  { id: "kt-026", diff: "medium", concepts: ["singleton", "object"], code: "object Counter { var c = 0 }\nCounter.c++\nprintln(Counter.c)", options: ["1", "0", "Compilation error", "null"], ans: "1", exp: "`object` creates a thread-safe singleton instance." },
  { id: "kt-027", diff: "hard", concepts: ["generics", "invariance"], code: "val l: List<Number> = listOf<Int>(1, 2)\nprintln(l.size)", options: ["2", "Compilation error", "ClassCastException", "0"], ans: "2", exp: "`List<out E>` in Kotlin is covariant, allowing assignment of `List<Int>` to `List<Number>`." },
  { id: "kt-028", diff: "medium", concepts: ["arrays", "primitive-arrays"], code: "val a = intArrayOf(1, 2, 3)\nprintln(a.sum())", options: ["6", "123", "Compilation error", "0"], ans: "6", exp: "`intArrayOf` creates an unboxed primitive `int[]` array; `.sum()` computes 6." },
  { id: "kt-029", diff: "medium", concepts: ["collections", "zip"], code: "val pairs = listOf(1, 2).zip(listOf(\"A\", \"B\"))\nprintln(pairs[0])", options: ["(1, A)", "(1, 1)", "1A", "Compilation error"], ans: "(1, A)", exp: "`zip` combines two lists into pairs: index 0 is `(1, A)`." },
  { id: "kt-030", diff: "hard", concepts: ["inline", "functions"], code: "inline fun runOp(fn: () -> Int) = fn() * 2\nprintln(runOp { 5 })", options: ["10", "5", "Compilation error", "2"], ans: "10", exp: "The inline function inlines the lambda at the callsite, evaluating 5 * 2 = 10." },
  { id: "kt-031", diff: "medium", concepts: ["nullability", "safe-cast"], code: "val obj: Any = 123\nval s = obj as? String\nprintln(s)", options: ["null", "123", "ClassCastException", "Compilation error"], ans: "null", exp: "The safe cast operator `as?` returns `null` instead of throwing `ClassCastException` on mismatch." },
  { id: "kt-032", diff: "medium", concepts: ["collections", "partition"], code: "val (even, odd) = listOf(1, 2, 3).partition { it % 2 == 0 }\nprintln(even)", options: ["[2]", "[1, 3]", "[1, 2, 3]", "Compilation error"], ans: "[2]", exp: "`partition` splits into a pair of lists: first has elements matching the predicate (`[2]`)." },
  { id: "kt-033", diff: "hard", concepts: ["typealias", "usage"], code: "typealias ID = Int\nval x: ID = 42\nprintln(x + 8)", options: ["50", "42", "Compilation error", "null"], ans: "50", exp: "`typealias` provides an alternative name for an existing type without creating a new runtime type." },
  { id: "kt-034", diff: "medium", concepts: ["collections", "firstornull"], code: "val res = listOf(1, 2).firstOrNull { it > 5 }\nprintln(res)", options: ["null", "NoSuchElementException", "0", "false"], ans: "null", exp: "`firstOrNull` safely returns `null` if no element satisfies the condition." },
  { id: "kt-035", diff: "hard", concepts: ["reified", "type-parameters"], code: "inline fun <reified T> isType(v: Any) = v is T\nprintln(isType<String>(\"test\"))", options: ["true", "false", "Compilation error", "null"], ans: "true", exp: "`reified` type parameters retain type information at runtime in inline functions." },
  { id: "kt-036", diff: "medium", concepts: ["strings", "takelast"], code: "println(\"Kotlin\".takeLast(3))", options: ["lin", "Kot", "tlin", "Error"], ans: "lin", exp: "`takeLast(3)` takes the final 3 characters: \"lin\"." },
  { id: "kt-037", diff: "hard", concepts: ["vararg", "spread"], code: "fun sumAll(vararg nums: Int) = nums.sum()\nval a = intArrayOf(2, 3)\nprintln(sumAll(1, *a))", options: ["6", "5", "Compilation error", "1"], ans: "6", exp: "The spread operator `*a` unpacks array elements into the vararg parameter: 1 + 2 + 3 = 6." },
  { id: "kt-038", diff: "medium", concepts: ["collections", "distinct"], code: "println(listOf(1, 2, 2, 3, 1).distinct())", options: ["[1, 2, 3]", "[1, 2, 2, 3, 1]", "[2, 1]", "Compilation error"], ans: "[1, 2, 3]", exp: "`distinct()` returns a list containing only unique elements in original encounter order." },
  { id: "kt-039", diff: "hard", concepts: ["constructors", "init-blocks"], code: "class C(val x: Int) {\n    var y = 0\n    init { y = x * 2 }\n}\nprintln(C(5).y)", options: ["10", "0", "5", "Compilation error"], ans: "10", exp: "The `init` block runs immediately during primary constructor invocation, setting `y = 5 * 2 = 10`." },
  { id: "kt-040", diff: "medium", concepts: ["ranges", "downto"], code: "val list = (3 downTo 1).toList()\nprintln(list)", options: ["[3, 2, 1]", "[1, 2, 3]", "[3, 1]", "Compilation error"], ans: "[3, 2, 1]", exp: "`downTo` creates a reverse progression: 3, 2, 1." },
  { id: "kt-041", diff: "hard", concepts: ["collections", "chunked"], code: "val chunks = listOf(1, 2, 3, 4, 5).chunked(2)\nprintln(chunks.size)", options: ["3", "2", "5", "Compilation error"], ans: "3", exp: "`chunked(2)` divides the list into `[1, 2]`, `[3, 4]`, and `[5]` (3 chunks)." },
  { id: "kt-042", diff: "medium", concepts: ["strings", "drop"], code: "println(\"Hello\".drop(2))", options: ["llo", "He", "ll", "Compilation error"], ans: "llo", exp: "`drop(2)` drops the first 2 characters, returning \"llo\"." },
  { id: "kt-043", diff: "hard", concepts: ["collections", "flatten"], code: "val nested = listOf(listOf(1), listOf(2, 3))\nprintln(nested.flatten().size)", options: ["3", "2", "4", "Compilation error"], ans: "3", exp: "`flatten()` combines nested collections into a single list `[1, 2, 3]` (size 3)." },
  { id: "kt-044", diff: "medium", concepts: ["boolean", "equality-triple"], code: "val a = Integer.valueOf(128)\nval b = Integer.valueOf(128)\nprintln(a == b)", options: ["true", "false", "Compilation error", "null"], ans: "true", exp: "Structural equality `==` translates to `.equals()`, which evaluates to `true` for equal Integer values." },
  { id: "kt-045", diff: "expert", concepts: ["referential-equality", "triple-equals"], code: "val a = Integer.valueOf(200)\nval b = Integer.valueOf(200)\nprintln(a === b)", options: ["false", "true", "Compilation error", "null"], ans: "false", exp: "Referential equality `===` checks memory reference. 200 is outside the cached integer range, producing `false`." }
];

export function getAllKotlinQuestions() {
  const result = [...kotlinQuestionsBase];
  for (const item of kotlinCatalog) {
    result.push({
      id: item.id,
      language: "kotlin",
      difficulty: item.diff,
      concepts: item.concepts,
      code: item.code,
      question: "What will be printed?",
      options: item.options,
      correctAnswer: item.ans,
      explanation: item.exp,
      runtime: "Kotlin 1.9+",
      hint: `Recall Kotlin language rules for ${item.concepts[0]}.`
    });
  }
  return result;
}
