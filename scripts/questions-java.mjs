// Java Questions Dataset (75 Unique Verified Questions)

export const javaQuestionsBase = [
  {
    id: "java-001",
    language: "java",
    difficulty: "easy",
    concepts: ["strings", "string-pool", "equality"],
    code: `String s1 = "Java";
String s2 = new String("Java");
System.out.println(s1 == s2);`,
    question: "What will be the output?",
    options: ["false", "true", "null", "Compilation error"],
    correctAnswer: "false",
    explanation: "`==` tests reference equality. `s1` refers to the string literal in the string intern pool, whereas `new String(...)` allocates an explicit new object in the heap.",
    runtime: "Java 17+"
  },
  {
    id: "java-002",
    language: "java",
    difficulty: "medium",
    concepts: ["strings", "intern", "string-pool"],
    code: `String s1 = "Java";
String s2 = new String("Java").intern();
System.out.println(s1 == s2);`,
    question: "What will be the output?",
    options: ["true", "false", "null", "Compilation error"],
    correctAnswer: "true",
    explanation: "Calling `.intern()` returns the canonical representation from the string pool, which matches the reference of `s1`.",
    runtime: "Java 17+"
  },
  {
    id: "java-003",
    language: "java",
    difficulty: "easy",
    concepts: ["operators", "integer-division"],
    code: `int a = 5 / 2;
double b = 5 / 2;
System.out.println(a + " " + b);`,
    question: "What will be the output?",
    options: ["2 2.0", "2 2.5", "2.5 2.5", "2.0 2.0"],
    correctAnswer: "2 2.0",
    explanation: "Both operands of `5 / 2` are integer literals, performing integer truncation to 2. Assigning 2 to `double b` converts it to `2.0`.",
    runtime: "Java 17+"
  },
  {
    id: "java-004",
    language: "java",
    difficulty: "medium",
    concepts: ["autoboxing", "integer-cache"],
    code: `Integer a = 100, b = 100;
Integer c = 200, d = 200;
System.out.println((a == b) + " " + (c == d));`,
    question: "What will be the output?",
    options: ["true false", "true true", "false false", "false true"],
    correctAnswer: "true false",
    explanation: "Java caches boxed Integer instances for values between -128 and 127. Values outside this range (such as 200) create separate instances in heap memory.",
    runtime: "Java 17+"
  },
  {
    id: "java-005",
    language: "java",
    difficulty: "medium",
    concepts: ["exceptions", "finally", "control-flow"],
    code: `static int getVal() {
    int x = 1;
    try {
        return x;
    } finally {
        x = 2;
    }
}
System.out.println(getVal());`,
    question: "What will be the output?",
    options: ["1", "2", "0", "Compilation error"],
    correctAnswer: "1",
    explanation: "The value of primitive `x` (1) is copied to the return register before the `finally` block executes. Modifying the local variable `x` afterwards has no effect on the returned value.",
    runtime: "Java 17+"
  }
];

const javaCatalog = [
  { id: "java-006", diff: "hard", concepts: ["overloading", "null", "polymorphism"], code: "class T { void f(Object o){System.out.print(\"Obj\");} void f(String s){System.out.print(\"Str\");} }\nnew T().f(null);", options: ["Str", "Obj", "Compilation error", "NullPointerException"], ans: "Str", exp: "Java resolves overloaded methods by choosing the most specific applicable parameter type (`String` is a subtype of `Object`)." },
  { id: "java-007", diff: "medium", concepts: ["stringbuilder", "append"], code: "StringBuilder sb = new StringBuilder(\"A\"); sb.append(\"B\"); System.out.println(sb);", options: ["AB", "A", "B", "Compilation error"], ans: "AB", exp: "StringBuilder is mutable and `.append()` appends in-place." },
  { id: "java-008", diff: "easy", concepts: ["arrays", "length"], code: "int[] arr = new int[3]; System.out.println(arr.length);", options: ["3", "0", "undefined", "NullPointerException"], ans: "3", exp: "Array length in Java is a final property `.length` holding the allocated capacity." },
  { id: "java-009", diff: "medium", concepts: ["operators", "post-increment"], code: "int i = 0; i = i++; System.out.println(i);", options: ["0", "1", "-1", "Compilation error"], ans: "0", exp: "`i++` evaluates to the old value (0) and queues the increment, which is immediately overwritten by the assignment of 0." },
  { id: "java-010", diff: "hard", concepts: ["inheritance", "static-methods"], code: "class P { static void m(){System.out.print(\"P\");} }\nclass C extends P { static void m(){System.out.print(\"C\");} }\nP obj = new C(); obj.m();", options: ["P", "C", "Compilation error", "Runtime error"], ans: "P", exp: "Static methods cannot be overridden dynamically; they are shadowed and dispatched based on the reference type (`P`)." },
  { id: "java-011", diff: "medium", concepts: ["collections", "arraylist", "remove"], code: "List<Integer> list = new ArrayList<>(List.of(1, 2, 3)); list.remove(1); System.out.println(list.get(1));", options: ["3", "2", "1", "IndexOutOfBoundsException"], ans: "3", exp: "`list.remove(int index)` removes the element at index 1 (value 2), shifting value 3 into index 1." },
  { id: "java-012", diff: "hard", concepts: ["collections", "arraylist", "remove-object"], code: "List<Integer> list = new ArrayList<>(List.of(1, 2, 3)); list.remove(Integer.valueOf(1)); System.out.println(list.get(0));", options: ["2", "1", "3", "IndexOutOfBoundsException"], ans: "2", exp: "`remove(Object o)` removes the first occurrence of value 1, leaving `[2, 3]` with element 0 being 2." },
  { id: "java-013", diff: "easy", concepts: ["types", "char-arithmetic"], code: "char c = 'A'; System.out.println((char)(c + 1));", options: ["B", "66", "A1", "Compilation error"], ans: "B", exp: "Char 'A' is numeric code 65; 65 + 1 is 66, cast back to char is 'B'." },
  { id: "java-014", diff: "medium", concepts: ["boolean", "short-circuit"], code: "int a = 0; if (false && ++a > 0) {} System.out.println(a);", options: ["0", "1", "false", "Compilation error"], ans: "0", exp: "The `&&` operator short-circuits on `false` without evaluating the right operand." },
  { id: "java-015", diff: "hard", concepts: ["boolean", "bitwise-and-eval"], code: "int a = 0; if (false & ++a > 0) {} System.out.println(a);", options: ["1", "0", "false", "Compilation error"], ans: "1", exp: "Non-short-circuit `&` evaluates both operands even when the left operand is `false`." },
  { id: "java-016", diff: "medium", concepts: ["arrays", "default-values"], code: "boolean[] b = new boolean[1]; System.out.println(b[0]);", options: ["false", "true", "null", "0"], ans: "false", exp: "Array elements in Java are initialized with their default values (boolean defaults to `false`)." },
  { id: "java-017", diff: "hard", concepts: ["constructors", "chaining"], code: "class B { B(){System.out.print(\"B\");} }\nclass D extends B { D(){System.out.print(\"D\");} }\nnew D();", options: ["BD", "D", "DB", "Compilation error"], ans: "BD", exp: "The superclass constructor `B()` runs automatically before the subclass constructor body `D()`." },
  { id: "java-018", diff: "medium", concepts: ["switch", "fallthrough"], code: "int x = 2; switch(x){ case 1: x+=1; case 2: x+=2; case 3: x+=3; } System.out.println(x);", options: ["7", "4", "2", "Compilation error"], ans: "7", exp: "Case 2 matches (`x = 2 + 2 = 4`), then without `break`, it falls through to case 3 (`x = 4 + 3 = 7`)." },
  { id: "java-019", diff: "easy", concepts: ["math", "max"], code: "System.out.println(Math.max(10, 20));", options: ["20", "10", "0", "Compilation error"], ans: "20", exp: "`Math.max(10, 20)` returns the greater value, 20." },
  { id: "java-020", diff: "hard", concepts: ["generics", "type-erasure"], code: "List<String> l1 = new ArrayList<>(); List<Integer> l2 = new ArrayList<>(); System.out.println(l1.getClass() == l2.getClass());", options: ["true", "false", "Compilation error", "TypeError"], ans: "true", exp: "Due to generic type erasure at compile time, both instances share the exact same runtime `ArrayList.class`." },
  { id: "java-021", diff: "medium", concepts: ["string", "substring"], code: "String s = \"Hello\"; System.out.println(s.substring(1, 4));", options: ["ell", "ello", "Hel", "ellh"], ans: "ell", exp: "`substring(1, 4)` takes characters from index 1 inclusive to 4 exclusive ('e', 'l', 'l')." },
  { id: "java-022", diff: "hard", concepts: ["initializers", "instance-blocks"], code: "class A { int x = 1; { x = 2; } A(){ x = 3; } }\nSystem.out.println(new A().x);", options: ["3", "2", "1", "Compilation error"], ans: "3", exp: "Instance initialization blocks execute before the constructor body, so `x = 3` is the final assignment." },
  { id: "java-023", diff: "medium", concepts: ["wrapper", "parseint"], code: "System.out.println(Integer.parseInt(\"101\", 2));", options: ["5", "101", "Compilation error", "NumberFormatException"], ans: "5", exp: "Radix 2 specifies binary string parsing: `101` in binary is decimal 5." },
  { id: "java-024", diff: "hard", concepts: ["final", "references"], code: "final List<Integer> l = new ArrayList<>(); l.add(5); System.out.println(l.size());", options: ["1", "Compilation error", "0", "UnsupportedOperationException"], ans: "1", exp: "`final` prevents the reference `l` from being reassigned, but the underlying object remains mutable." },
  { id: "java-025", diff: "medium", concepts: ["strings", "concat-null"], code: "String s = null; System.out.println(\"Hi \" + s);", options: ["Hi null", "NullPointerException", "Hi ", "Compilation error"], ans: "Hi null", exp: "String concatenation coerces a `null` reference to the string literal `\"null\"`." },
  { id: "java-026", diff: "hard", concepts: ["try-finally", "exit"], code: "try { System.out.print(\"A\"); System.exit(0); } finally { System.out.print(\"B\"); }", options: ["A", "AB", "B", "Compilation error"], ans: "A", exp: "`System.exit(0)` halts the JVM immediately without executing pending `finally` blocks." },
  { id: "java-027", diff: "medium", concepts: ["types", "widening"], code: "int a = 10; double b = a; System.out.println(b);", options: ["10.0", "10", "Compilation error", "ClassCastException"], ans: "10.0", exp: "Widening primitive conversion from `int` to `double` occurs implicitly." },
  { id: "java-028", diff: "hard", concepts: ["types", "narrowing-cast"], code: "int x = 130; byte b = (byte) x; System.out.println(b);", options: ["-126", "130", "127", "Compilation error"], ans: "-126", exp: "`byte` ranges from -128 to 127. 130 overflows and wraps around to -126." },
  { id: "java-029", diff: "medium", concepts: ["arrays", "clone"], code: "int[] a = {1, 2}; int[] b = a.clone(); b[0] = 9; System.out.println(a[0]);", options: ["1", "9", "Compilation error", "0"], ans: "1", exp: "Cloning a primitive array creates a independent copy of the array elements." },
  { id: "java-030", diff: "hard", concepts: ["inheritance", "field-shadowing"], code: "class P { int x = 1; }\nclass C extends P { int x = 2; }\nP obj = new C(); System.out.println(obj.x);", options: ["1", "2", "Compilation error", "Runtime error"], ans: "1", exp: "Fields are not polymorphic in Java; they are resolved according to the compile-time reference type (`P`)." },
  { id: "java-031", diff: "medium", concepts: ["collections", "hashmap", "null-key"], code: "Map<String, Integer> map = new HashMap<>(); map.put(null, 42); System.out.println(map.get(null));", options: ["42", "NullPointerException", "null", "0"], ans: "42", exp: "`HashMap` in Java explicitly permits one `null` key, hashed to bucket 0." },
  { id: "java-032", diff: "hard", concepts: ["collections", "hashtable", "null-key"], code: "Map<String, Integer> map = new Hashtable<>(); try { map.put(null, 1); } catch (NullPointerException e) { System.out.println(\"NPE\"); }", options: ["NPE", "null", "Compilation error", "1"], ans: "NPE", exp: "Unlike `HashMap`, legacy `Hashtable` throws `NullPointerException` on null keys or null values." },
  { id: "java-033", diff: "medium", concepts: ["strings", "replace"], code: "String s = \"a.b.c\"; System.out.println(s.replace(\".\", \"-\"));", options: ["a-b-c", "---", "a.b.c", "Compilation error"], ans: "a-b-c", exp: "`String.replace(CharSequence, CharSequence)` replaces literal matches without evaluating as regex." },
  { id: "java-034", diff: "hard", concepts: ["strings", "replaceall-regex"], code: "String s = \"a.b.c\"; System.out.println(s.replaceAll(\".\", \"-\"));", options: ["-----", "a-b-c", "a.b.c", "Compilation error"], ans: "-----", exp: "`replaceAll` interprets `.` as a regex wildcard matching any character, replacing all 5 chars with `-`." },
  { id: "java-035", diff: "medium", concepts: ["math", "round"], code: "System.out.println(Math.round(2.5f) + \" \" + Math.round(-2.5f));", options: ["3 -2", "3 -3", "2 -2", "2 -3"], ans: "3 -2", exp: "`Math.round` adds 0.5 and takes floor: 2.5 + 0.5 = 3.0 (3); -2.5 + 0.5 = -2.0 (-2)." },
  { id: "java-036", diff: "hard", concepts: ["objects", "equals-contract"], code: "Integer x = 5; Long y = 5L; System.out.println(x.equals(y));", options: ["false", "true", "Compilation error", "ClassCastException"], ans: "false", exp: "`Integer.equals(Object)` returns `false` immediately if the passed object is not an instance of `Integer`." },
  { id: "java-037", diff: "medium", concepts: ["operators", "compound-assignment"], code: "int a = 5; a *= 2 + 3; System.out.println(a);", options: ["25", "13", "10", "Compilation error"], ans: "25", exp: "Compound assignment groups the right-hand expression: `a = a * (2 + 3) = 5 * 5 = 25`." },
  { id: "java-038", diff: "hard", concepts: ["varargs", "overloading"], code: "class T { static void f(int a){System.out.print(\"1\");} static void f(int... a){System.out.print(\"N\");} }\nT.f(5);", options: ["1", "N", "Compilation error", "Ambiguous error"], ans: "1", exp: "Exact parameter matches take precedence over varargs method variants." },
  { id: "java-039", diff: "medium", concepts: ["collections", "hashset", "duplicates"], code: "Set<String> s = new HashSet<>(List.of(\"a\", \"b\", \"a\")); System.out.println(s.size());", options: ["2", "3", "Compilation error", "1"], ans: "2", exp: "HashSet stores only unique elements, ignoring the duplicate 'a'." },
  { id: "java-040", diff: "hard", concepts: ["enums", "ordinal"], code: "enum Day { MON, TUE, WED } System.out.println(Day.TUE.ordinal());", options: ["1", "2", "0", "Compilation error"], ans: "1", exp: "Enum ordinal indices are zero-based (`MON=0`, `TUE=1`, `WED=2`)." },
  { id: "java-041", diff: "medium", concepts: ["strings", "trim"], code: "String s = \"   \"; System.out.println(s.trim().isEmpty());", options: ["true", "false", "Compilation error", "NullPointerException"], ans: "true", exp: "`trim()` removes all spaces, resulting in an empty string `\"\"`." },
  { id: "java-042", diff: "hard", concepts: ["records", "immutability"], code: "record Point(int x, int y) {} Point p = new Point(1, 2); System.out.println(p.x());", options: ["1", "2", "Compilation error", "undefined"], ans: "1", exp: "Records automatically generate canonical public accessor methods matching component names (`p.x()`)." },
  { id: "java-043", diff: "medium", concepts: ["interfaces", "default-methods"], code: "interface I { default int v(){ return 10; } } class C implements I {} System.out.println(new C().v());", options: ["10", "0", "Compilation error", "null"], ans: "10", exp: "Implementing classes inherit default interface method implementations." },
  { id: "java-044", diff: "hard", concepts: ["classes", "anonymous-inner"], code: "Runnable r = new Runnable() { public void run() { System.out.print(\"OK\"); } }; r.run();", options: ["OK", "null", "Compilation error", "Thread error"], ans: "OK", exp: "Directly invoking `r.run()` on the anonymous Runnable instance executes the method synchronously." },
  { id: "java-045", diff: "medium", concepts: ["arrays", "binary-search"], code: "int[] a = {10, 20, 30}; System.out.println(Arrays.binarySearch(a, 20));", options: ["1", "2", "0", "-1"], ans: "1", exp: "Binary search finds element 20 at zero-based index 1." },
  { id: "java-046", diff: "hard", concepts: ["streams", "count"], code: "long c = Stream.of(1, 2, 3).filter(x -> x > 1).count(); System.out.println(c);", options: ["2", "3", "1", "Compilation error"], ans: "2", exp: "Filter keeps values 2 and 3, yielding a stream count of 2." },
  { id: "java-047", diff: "medium", concepts: ["optional", "orelse"], code: "Optional<String> o = Optional.empty(); System.out.println(o.orElse(\"fallback\"));", options: ["fallback", "null", "NoSuchElementException", "empty"], ans: "fallback", exp: "`orElse` returns the fallback value when the Optional is empty." },
  { id: "java-048", diff: "hard", concepts: ["optional", "orelseget"], code: "Optional<String> o = Optional.of(\"val\"); System.out.println(o.orElseGet(() -> \"alt\"));", options: ["val", "alt", "null", "Compilation error"], ans: "val", exp: "`orElseGet` returns the contained value 'val' without executing the supplier." },
  { id: "java-049", diff: "medium", concepts: ["string", "charat"], code: "String s = \"Code\"; System.out.println(s.charAt(2));", options: ["d", "o", "e", "C"], ans: "d", exp: "Index 2 corresponds to the third character, 'd'." },
  { id: "java-050", diff: "hard", concepts: ["collections", "unmodifiable"], code: "List<Integer> list = List.of(1, 2); try { list.add(3); } catch (UnsupportedOperationException e) { System.out.println(\"ERR\"); }", options: ["ERR", "3", "Compilation error", "null"], ans: "ERR", exp: "`List.of(...)` creates an unmodifiable list; mutating calls throw `UnsupportedOperationException`." },
  { id: "java-051", diff: "medium", concepts: ["types", "instanceof-pattern"], code: "Object obj = \"Test\"; if (obj instanceof String s) { System.out.println(s.length()); }", options: ["4", "Compilation error", "0", "ClassCastException"], ans: "4", exp: "Java 16+ pattern matching for `instanceof` binds the variable `s` directly with type String." },
  { id: "java-052", diff: "hard", concepts: ["reflection", "class-loading"], code: "System.out.println(int.class.isPrimitive());", options: ["true", "false", "Compilation error", "NullPointerException"], ans: "true", exp: "Primitive type tokens like `int.class` return `true` for `.isPrimitive()`." },
  { id: "java-053", diff: "medium", concepts: ["math", "sqrt"], code: "System.out.println((int) Math.sqrt(25));", options: ["5", "25", "5.0", "Compilation error"], ans: "5", exp: "`Math.sqrt(25)` evaluates to 5.0, cast to int is 5." },
  { id: "java-054", diff: "hard", concepts: ["concurrency", "volatile"], code: "class S { volatile int x = 0; } System.out.println(new S().x);", options: ["0", "null", "Compilation error", "ThreadError"], ans: "0", exp: "The `volatile` modifier ensures memory visibility; initial value is 0." },
  { id: "java-055", diff: "medium", concepts: ["strings", "strip-vs-trim"], code: "System.out.println(\" a \".strip().length());", options: ["1", "3", "Compilation error", "0"], ans: "1", exp: "`String.strip()` removes Unicode whitespace, leaving 'a' (length 1)." },
  { id: "java-056", diff: "hard", concepts: ["functional", "predicate"], code: "Predicate<Integer> p = x -> x > 5; System.out.println(p.test(10));", options: ["true", "false", "Compilation error", "null"], ans: "true", exp: "`p.test(10)` tests 10 > 5, returning `true`." },
  { id: "java-057", diff: "medium", concepts: ["collections", "sort-comparator"], code: "List<Integer> list = new ArrayList<>(List.of(3, 1, 2)); list.sort(Comparator.naturalOrder()); System.out.println(list.get(0));", options: ["1", "3", "2", "Compilation error"], ans: "1", exp: "Natural order sorts ascending; index 0 is 1." },
  { id: "java-058", diff: "hard", concepts: ["streams", "maptoint-sum"], code: "int sum = List.of(\"1\", \"2\", \"3\").stream().mapToInt(Integer::parseInt).sum(); System.out.println(sum);", options: ["6", "123", "0", "Compilation error"], ans: "6", exp: "`mapToInt` maps to primitives and `.sum()` computes 1 + 2 + 3 = 6." },
  { id: "java-059", diff: "medium", concepts: ["bitwise", "xor"], code: "System.out.println(6 ^ 3);", options: ["5", "3", "9", "0"], ans: "5", exp: "6 (110) XOR 3 (011) = 5 (101)." },
  { id: "java-060", diff: "hard", concepts: ["text-blocks", "indentation"], code: "String block = \"\"\"\n    Hi\"\"\"; System.out.println(block);", options: ["Hi", "    Hi", "Compilation error", "null"], ans: "Hi", exp: "Text blocks strip common leading indentation whitespace automatically." },
  { id: "java-061", diff: "medium", concepts: ["strings", "repeat"], code: "System.out.println(\"A\".repeat(3));", options: ["AAA", "A 3", "Compilation error", "Error"], ans: "AAA", exp: "`String.repeat(3)` returns 'AAA'." },
  { id: "java-062", diff: "hard", concepts: ["collections", "linkedhashmap-order"], code: "Map<String, Integer> m = new LinkedHashMap<>(); m.put(\"z\", 1); m.put(\"a\", 2); System.out.println(m.keySet().iterator().next());", options: ["z", "a", "Compilation error", "null"], ans: "z", exp: "LinkedHashMap preserves predictable insertion order; 'z' was inserted first." },
  { id: "java-063", diff: "medium", concepts: ["numbers", "double-nan"], code: "double d = 0.0 / 0.0; System.out.println(d != d);", options: ["true", "false", "ArithmeticException", "Compilation error"], ans: "true", exp: "`0.0 / 0.0` yields `Double.NaN`, which is the only value strictly not equal to itself." },
  { id: "java-064", diff: "hard", concepts: ["numbers", "infinity"], code: "System.out.println(1.0 / 0.0);", options: ["Infinity", "ArithmeticException", "NaN", "0"], ans: "Infinity", exp: "Floating-point division by zero produces `Double.POSITIVE_INFINITY` without throwing an exception." },
  { id: "java-065", diff: "medium", concepts: ["numbers", "int-divide-zero"], code: "try { int x = 1 / 0; } catch (ArithmeticException e) { System.out.println(\"DIV0\"); }", options: ["DIV0", "Infinity", "Compilation error", "0"], ans: "DIV0", exp: "Integer division by zero throws an `ArithmeticException`." },
  { id: "java-066", diff: "hard", concepts: ["streams", "findfirst"], code: "Optional<String> res = List.of(\"a\", \"b\").stream().findFirst(); System.out.println(res.get());", options: ["a", "b", "Optional[a]", "null"], ans: "a", exp: "`findFirst()` returns an Optional containing the first element 'a'." },
  { id: "java-067", diff: "medium", concepts: ["arrays", "fill"], code: "int[] a = new int[2]; Arrays.fill(a, 9); System.out.println(a[1]);", options: ["9", "0", "2", "Compilation error"], ans: "9", exp: "`Arrays.fill` populates all indices with 9." },
  { id: "java-068", diff: "hard", concepts: ["classes", "inner-class-access"], code: "class Outer { int x = 10; class Inner { int get(){ return Outer.this.x; } } }\nSystem.out.println(new Outer().new Inner().get());", options: ["10", "0", "Compilation error", "null"], ans: "10", exp: "`Outer.this.x` accesses the outer enclosing instance member." },
  { id: "java-069", diff: "medium", concepts: ["string", "compareto"], code: "System.out.println(\"a\".compareTo(\"b\"));", options: ["-1", "0", "1", "Compilation error"], ans: "-1", exp: "'a' (97) minus 'b' (98) is -1." },
  { id: "java-070", diff: "hard", concepts: ["collections", "unsupported-remove"], code: "List<String> list = Arrays.asList(\"a\", \"b\"); try { list.remove(0); } catch (UnsupportedOperationException e) { System.out.println(\"FIXED\"); }", options: ["FIXED", "b", "Compilation error", "null"], ans: "FIXED", exp: "`Arrays.asList` returns a fixed-size list backed by the array; removing elements throws `UnsupportedOperationException`." },
  { id: "java-071", diff: "medium", concepts: ["math", "hypot"], code: "System.out.println((int) Math.hypot(3, 4));", options: ["5", "7", "25", "Compilation error"], ans: "5", exp: "Pythagorean theorem: sqrt(3^2 + 4^2) = sqrt(25) = 5." },
  { id: "java-072", diff: "hard", concepts: ["atomic", "atomicinteger"], code: "AtomicInteger ai = new AtomicInteger(10); System.out.println(ai.addAndGet(5));", options: ["15", "10", "5", "Compilation error"], ans: "15", exp: "`addAndGet(5)` atomically increments by 5 and returns the new value (15)." },
  { id: "java-073", diff: "medium", concepts: ["string", "join"], code: "System.out.println(String.join(\"/\", \"usr\", \"bin\"));", options: ["usr/bin", "usr/bin/", "/usr/bin", "Compilation error"], ans: "usr/bin", exp: "`String.join` joins with delimiter between items." },
  { id: "java-074", diff: "hard", concepts: ["time", "localdate"], code: "LocalDate d = LocalDate.of(2025, 1, 1).plusDays(1); System.out.println(d.getDayOfMonth());", options: ["2", "1", "Compilation error", "0"], ans: "2", exp: "Jan 1 + 1 day is Jan 2." },
  { id: "java-075", diff: "expert", concepts: ["threads", "thread-state"], code: "Thread t = new Thread(() -> {}); System.out.println(t.getState());", options: ["NEW", "RUNNABLE", "TERMINATED", "WAITING"], ans: "NEW", exp: "Before `start()` is invoked, a Thread's state is `NEW`." }
];

export function getAllJavaQuestions() {
  const result = [...javaQuestionsBase];
  for (const item of javaCatalog) {
    result.push({
      id: item.id,
      language: "java",
      difficulty: item.diff,
      concepts: item.concepts,
      code: item.code,
      question: "What will be the output?",
      options: item.options,
      correctAnswer: item.ans,
      explanation: item.exp,
      runtime: "Java 17+",
      hint: `Consider how Java handles ${item.concepts[0]}.`
    });
  }
  return result;
}
