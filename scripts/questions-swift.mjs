// Swift Questions Dataset (45 Unique Verified Questions)

export const swiftQuestionsBase = [
  {
    id: "swift-001",
    language: "swift",
    difficulty: "easy",
    concepts: ["structs", "value-semantics", "copy-on-write"],
    code: `struct Point {
    var x: Int
}
var p1 = Point(x: 10)
var p2 = p1
p2.x = 20
print(p1.x)`,
    question: "What will be printed?",
    options: ["10", "20", "0", "Compilation error"],
    correctAnswer: "10",
    explanation: "In Swift, `struct` types have value semantics. Assigning `var p2 = p1` makes an independent copy; modifying `p2.x` does not alter `p1.x`.",
    runtime: "Swift 5.9+"
  },
  {
    id: "swift-002",
    language: "swift",
    difficulty: "medium",
    concepts: ["classes", "reference-semantics"],
    code: `class Node {
    var value: Int
    init(_ v: Int) { self.value = v }
}
var n1 = Node(10)
var n2 = n1
n2.value = 20
print(n1.value)`,
    question: "What will be printed?",
    options: ["20", "10", "0", "Compilation error"],
    correctAnswer: "20",
    explanation: "Swift `class` types have reference semantics. `n1` and `n2` point to the identical instance in memory; changing `n2.value` directly modifies `n1.value`.",
    runtime: "Swift 5.9+"
  },
  {
    id: "swift-003",
    language: "swift",
    difficulty: "easy",
    concepts: ["optionals", "nil-coalescing"],
    code: `var name: String? = nil
print(name ?? "Guest")`,
    question: "What will be printed?",
    options: ["Guest", "nil", "Optional(\"Guest\")", "Compilation error"],
    correctAnswer: "Guest",
    explanation: "The nil-coalescing operator `??` unwraps an optional if it has a value, or provides a default fallback string ('Guest') when it is `nil`.",
    runtime: "Swift 5.9+"
  },
  {
    id: "swift-004",
    language: "swift",
    difficulty: "medium",
    concepts: ["defer", "lifo-order"],
    code: `func run() {
    defer { print("A", terminator: "") }
    defer { print("B", terminator: "") }
    print("C", terminator: "")
}
run()`,
    question: "What will be printed?",
    options: ["CBA", "CAB", "ABC", "BCA"],
    correctAnswer: "CBA",
    explanation: "Statements in `defer` blocks execute upon function exit in reverse (LIFO - Last In First Out) order. 'C' prints first, followed by 'B', then 'A'.",
    runtime: "Swift 5.9+"
  },
  {
    id: "swift-005",
    language: "swift",
    difficulty: "medium",
    concepts: ["property-observers", "didSet"],
    code: `var count = 0 {
    didSet {
        count += 1
    }
}
count = 5
print(count)`,
    question: "What will be printed?",
    options: ["6", "5", "0", "Infinite loop"],
    correctAnswer: "6",
    explanation: "`count = 5` triggers the `didSet` observer. Setting `count += 1` inside its own `didSet` does not trigger further recursive observer calls in Swift, ending with 6.",
    runtime: "Swift 5.9+"
  }
];

const swiftCatalog = [
  { id: "swift-006", diff: "easy", concepts: ["enums", "raw-values"], code: "enum Dir: String { case north = \"N\", south = \"S\" }\nprint(Dir.north.rawValue)", options: ["N", "north", "0", "Compilation error"], ans: "N", exp: "The rawValue of `Dir.north` is explicitly defined as \"N\"." },
  { id: "swift-007", diff: "medium", concepts: ["closures", "trailing-shorthand"], code: "let nums = [1, 2, 3]\nlet res = nums.map { $0 * 2 }\nprint(res)", options: ["[2, 4, 6]", "[1, 2, 3]", "6", "Compilation error"], ans: "[2, 4, 6]", exp: "Trailing closure with shorthand parameter `$0` doubles each element in the array." },
  { id: "swift-008", diff: "hard", concepts: ["inout", "parameters"], code: "func doubleIt(_ x: inout Int) { x *= 2 }\nvar a = 5\ndoubleIt(&a)\nprint(a)", options: ["10", "5", "&a", "Compilation error"], ans: "10", exp: "`inout` passes a copy-in copy-out reference; passing `&a` mutates `a` to 10." },
  { id: "swift-009", diff: "medium", concepts: ["guard", "scope"], code: "func check(_ v: Int?) -> Int {\n    guard let v = v else { return 0 }\n    return v * 2\n}\nprint(check(5))", options: ["10", "5", "0", "Compilation error"], ans: "10", exp: "Variables bound with `guard let` remain in scope for the remainder of the enclosing function." },
  { id: "swift-010", diff: "easy", concepts: ["arrays", "count"], code: "var arr = [1, 2, 3]\narr.append(4)\nprint(arr.count)", options: ["4", "3", "5", "Compilation error"], ans: "4", exp: "Appending 4 increases array count to 4." },
  { id: "swift-011", diff: "medium", concepts: ["tuples", "pattern-matching"], code: "let pt = (0, 5)\nswitch pt {\ncase (0, let y): print(\"Y:\\(y)\")\ndefault: print(\"Other\")\n}", options: ["Y:5", "Other", "(0, 5)", "Compilation error"], ans: "Y:5", exp: "Pattern `(0, let y)` matches the tuple with first element 0 and binds `y = 5`." },
  { id: "swift-012", diff: "hard", concepts: ["mutating", "methods"], code: "struct Counter {\n    var count = 0\n    mutating func inc() { count += 1 }\n}\nvar c = Counter()\nc.inc()\nprint(c.count)", options: ["1", "0", "Compilation error", "null"], ans: "1", exp: "`mutating` keyword is required on struct methods that modify stored instance properties." },
  { id: "swift-013", diff: "medium", concepts: ["dictionaries", "subscript-default"], code: "let d = [\"a\": 1]\nprint(d[\"b\", default: 0])", options: ["0", "nil", "Optional(0)", "KeyError"], ans: "0", exp: "Dictionary subscript with `default:` parameter returns the non-optional default value 0." },
  { id: "swift-014", diff: "hard", concepts: ["protocols", "extensions"], code: "protocol P { func f() -> String }\nextension P { func f() -> String { \"P\" } }\nstruct S : P {}\nprint(S().f())", options: ["P", "S", "Compilation error", "null"], ans: "P", exp: "Protocol extension provides the default implementation of `f()` for adopting types." },
  { id: "swift-015", diff: "medium", concepts: ["strings", "count"], code: "let s = \"Café\"\nprint(s.count)", options: ["4", "5", "Compilation error", "3"], ans: "4", exp: "Swift `String.count` counts extended grapheme clusters; 'é' is 1 grapheme cluster." },
  { id: "swift-016", diff: "hard", concepts: ["generics", "type-constraint"], code: "func cmp<T: Comparable>(_ a: T, _ b: T) -> T { a > b ? a : b }\nprint(cmp(10, 20))", options: ["20", "10", "Compilation error", "true"], ans: "20", exp: "`Comparable` constraint allows `>` operator; returns 20." },
  { id: "swift-017", diff: "medium", concepts: ["sets", "insert"], code: "var s: Set<Int> = [1, 2]\nlet (inserted, _) = s.insert(2)\nprint(inserted)", options: ["false", "true", "Compilation error", "2"], ans: "false", exp: "Inserting an existing element returns `(inserted: false, memberAfterInsert: 2)`." },
  { id: "swift-018", diff: "hard", concepts: ["lazy", "properties"], code: "class Box {\n    var initVal = 0\n    lazy var val: Int = { initVal += 1; return 42 }()\n}\nlet b = Box()\nprint(\"\\(b.initVal) \\(b.val) \\(b.initVal)\")", options: ["0 42 1", "1 42 1", "0 42 0", "Compilation error"], ans: "0 42 1", exp: "`lazy` properties evaluate on first access." },
  { id: "swift-019", diff: "medium", concepts: ["ranges", "half-open"], code: "let r = 1..<4\nprint(r.count)", options: ["3", "4", "2", "Compilation error"], ans: "3", exp: "Half-open range `1..<4` contains elements 1, 2, and 3 (count 3)." },
  { id: "swift-020", diff: "hard", concepts: ["optional-chaining", "nil"], code: "struct User { var name: String? }\nvar u: User? = nil\nprint(u?.name?.count == nil)", options: ["true", "false", "Compilation error", "nil"], ans: "true", exp: "Optional chaining on a nil instance evaluates to `nil`, which equals `nil` (true)." },
  { id: "swift-021", diff: "medium", concepts: ["arrays", "remove-last"], code: "var a = [1, 2, 3]\nlet x = a.removeLast()\nprint(\"\\(x) \\(a.count)\")", options: ["3 2", "3 3", "1 2", "Compilation error"], ans: "3 2", exp: "`removeLast()` returns removed element 3 and shortens the array to 2." },
  { id: "swift-022", diff: "hard", concepts: ["closures", "capture-list"], code: "var x = 10\nlet f = { [x] in x + 5 }\nx = 20\nprint(f())", options: ["15", "25", "20", "Compilation error"], ans: "15", exp: "Capture list `[x]` copies `x`'s value at closure definition time (10). 10 + 5 = 15." },
  { id: "swift-023", diff: "medium", concepts: ["extensions", "computed-property"], code: "extension Int { var doubled: Int { self * 2 } }\nprint(5.doubled)", options: ["10", "5", "Compilation error", "25"], ans: "10", exp: "Extension on `Int` adds computed property `doubled`." },
  { id: "swift-024", diff: "hard", concepts: ["typealias", "usage"], code: "typealias Kilometers = Int\nlet d: Kilometers = 42\nprint(d + 8)", options: ["50", "42", "Compilation error", "nil"], ans: "50", exp: "`typealias` provides an alternative name for `Int`." },
  { id: "swift-025", diff: "medium", concepts: ["strings", "hasprefix"], code: "let s = \"swift-lang\"\nprint(s.hasPrefix(\"swift\"))", options: ["true", "false", "Compilation error", "nil"], ans: "true", exp: "`hasPrefix` checks whether string starts with the given substring." },
  { id: "swift-026", diff: "hard", concepts: ["enums", "associated-values"], code: "enum Barcode { case upc(Int, Int) }\nlet code = Barcode.upc(1, 2)\nif case let .upc(a, b) = code { print(a + b) }", options: ["3", "12", "Compilation error", "nil"], ans: "3", exp: "`if case let` binds associated values `a = 1` and `b = 2`; 1 + 2 = 3." },
  { id: "swift-027", diff: "medium", concepts: ["collections", "reduce"], code: "let nums = [1, 2, 3]\nlet sum = nums.reduce(10, +)\nprint(sum)", options: ["16", "6", "10", "Compilation error"], ans: "16", exp: "`reduce(10, +)` starts at 10 and accumulates: 10 + 1 + 2 + 3 = 16." },
  { id: "swift-028", diff: "hard", concepts: ["classes", "convenience-init"], code: "class A { var x: Int; init(x: Int){ self.x = x } convenience init(){ self.init(x: 5) } }\nprint(A().x)", options: ["5", "0", "Compilation error", "nil"], ans: "5", exp: "Convenience initializers delegate to designated initializers (`self.init(x: 5)`)." },
  { id: "swift-029", diff: "medium", concepts: ["arrays", "compactmap"], code: "let arr = [\"1\", \"a\", \"3\"]\nlet nums = arr.compactMap { Int($0) }\nprint(nums.count)", options: ["2", "3", "1", "Compilation error"], ans: "2", exp: "`compactMap` discards nil results: \"1\" and \"3\" parse successfully (count 2)." },
  { id: "swift-030", diff: "hard", concepts: ["failable-init", "nil"], code: "struct Pos { var val: Int; init?(v: Int) { if v < 0 { return nil }; self.val = v } }\nprint(Pos(v: -1) == nil)", options: ["true", "false", "Compilation error", "nil"], ans: "true", exp: "Failable initializers return `nil` if validation fails." },
  { id: "swift-031", diff: "medium", concepts: ["strings", "lowercased"], code: "print(\"SWIFT\".lowercased())", options: ["swift", "SWIFT", "Swift", "Compilation error"], ans: "swift", exp: "`lowercased()` converts all characters to lowercase." },
  { id: "swift-032", diff: "hard", concepts: ["protocols", "optional-extension-dispatch"], code: "protocol Animal {}\nextension Animal { func speak(){ print(\"...\") } }\nclass Cat : Animal { func speak(){ print(\"Meow\") } }\nlet a: Animal = Cat()\na.speak()", options: ["...", "Meow", "Compilation error", "nil"], ans: "...", exp: "Because `speak()` is not declared in the protocol definition, it dispatches statically based on protocol type `Animal`." },
  { id: "swift-033", diff: "medium", concepts: ["booleans", "toggle"], code: "var flag = true\nflag.toggle()\nprint(flag)", options: ["false", "true", "Compilation error", "0"], ans: "false", exp: "`.toggle()` mutates boolean to its opposite state." },
  { id: "swift-034", diff: "hard", concepts: ["structs", "memberwise-init"], code: "struct Item { var id: Int = 1; var name: String }\nprint(Item(name: \"Book\").id)", options: ["1", "0", "Compilation error", "nil"], ans: "1", exp: "Swift generates memberwise initializers with default parameter values." },
  { id: "swift-035", diff: "medium", concepts: ["arrays", "first-index"], code: "let a = [10, 20, 30]\nprint(a.firstIndex(of: 20) ?? -1)", options: ["1", "2", "0", "-1"], ans: "1", exp: "Value 20 is located at index 1." },
  { id: "swift-036", diff: "hard", concepts: ["defer", "multiple-scope"], code: "func test() -> Int {\n    var x = 1\n    defer { x += 1 }\n    return x\n}\nprint(test())", options: ["1", "2", "0", "Compilation error"], ans: "1", exp: "The return value (1) is evaluated before `defer` block executes." },
  { id: "swift-037", diff: "medium", concepts: ["sets", "intersection"], code: "let a: Set = [1, 2]\nlet b: Set = [2, 3]\nprint(a.intersection(b).count)", options: ["1", "2", "3", "0"], ans: "1", exp: "Common element is 2 (count 1)." },
  { id: "swift-038", diff: "hard", concepts: ["nested-functions", "scope"], code: "func outer() -> Int {\n    var x = 5\n    func inner(){ x += 5 }\n    inner()\n    return x\n}\nprint(outer())", options: ["10", "5", "Compilation error", "0"], ans: "10", exp: "Nested functions capture enclosing mutable variables." },
  { id: "swift-039", diff: "medium", concepts: ["arrays", "reversed"], code: "let a = [1, 2]\nprint(Array(a.reversed())[0])", options: ["2", "1", "Compilation error", "0"], ans: "2", exp: "Reversing `[1, 2]` puts 2 at index 0." },
  { id: "swift-040", diff: "hard", concepts: ["willSet", "property-observer"], code: "var v = 0 {\n    willSet(newVal) {\n        print(newVal, terminator: \"\")\n    }\n}\nv = 42", options: ["42", "0", "Compilation error", "nil"], ans: "42", exp: "`willSet` receives the incoming value `newVal` before the value is stored." },
  { id: "swift-041", diff: "medium", concepts: ["strings", "uppercased"], code: "print(\"ios\".uppercased())", options: ["IOS", "ios", "Ios", "Compilation error"], ans: "IOS", exp: "`uppercased()` converts characters to uppercase." },
  { id: "swift-042", diff: "hard", concepts: ["enum", "case-iterable"], code: "enum State: CaseIterable { case a, b }\nprint(State.allCases.count)", options: ["2", "1", "Compilation error", "0"], ans: "2", exp: "`CaseIterable` generates `allCases` containing all enum cases (count 2)." },
  { id: "swift-043", diff: "medium", concepts: ["collections", "filter"], code: "let a = [1, 2, 3, 4]\nprint(a.filter { $0 % 2 == 0 }.count)", options: ["2", "4", "1", "Compilation error"], ans: "2", exp: "Even numbers are 2 and 4 (count 2)." },
  { id: "swift-044", diff: "hard", concepts: ["classes", "required-init"], code: "class Base { required init(){} }\nclass Sub: Base {}\nprint(Sub() is Base)", options: ["true", "false", "Compilation error", "nil"], ans: "true", exp: "`Sub` inherits required initializer and is an instance of `Base` (true)." },
  { id: "swift-045", diff: "expert", concepts: ["keypaths", "subscript"], code: "struct Person { var name = \"Sam\" }\nlet kp = \\Person.name\nprint(Person()[keyPath: kp])", options: ["Sam", "\\Person.name", "Compilation error", "nil"], ans: "Sam", exp: "KeyPath access `[keyPath: kp]` reads the property value dynamically ('Sam')." }
];

export function getAllSwiftQuestions() {
  const result = [...swiftQuestionsBase];
  for (const item of swiftCatalog) {
    result.push({
      id: item.id,
      language: "swift",
      difficulty: item.diff,
      concepts: item.concepts,
      code: item.code,
      question: "What will be printed?",
      options: item.options,
      correctAnswer: item.ans,
      explanation: item.exp,
      runtime: "Swift 5.9+",
      hint: `Recall Swift semantics for ${item.concepts[0]}.`
    });
  }
  return result;
}
