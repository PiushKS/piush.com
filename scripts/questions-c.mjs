// C Questions Dataset (65 Unique Verified Questions)

export const cQuestionsBase = [
  {
    id: "c-001",
    language: "c",
    difficulty: "easy",
    concepts: ["pointers", "arrays", "pointer-arithmetic"],
    code: `int arr[] = {10, 20, 30};
int *p = arr;
p++;
printf("%d", *p);`,
    question: "What will be printed?",
    options: ["20", "10", "30", "Compilation error"],
    correctAnswer: "20",
    explanation: "`p` initially points to `arr[0]` (10). Incrementing `p++` advances the pointer to the next integer element `arr[1]`, whose value is 20.",
    runtime: "C99 / C11 / C17"
  },
  {
    id: "c-002",
    language: "c",
    difficulty: "medium",
    concepts: ["pointers", "precedence", "post-increment"],
    code: `int a[] = {10, 20, 30};
int *p = a;
printf("%d ", *p++);
printf("%d", *p);`,
    question: "What will be printed?",
    options: ["10 20", "20 20", "10 10", "11 20"],
    correctAnswer: "10 20",
    explanation: "Post-increment `*p++` has postfix precedence: it yields the dereferenced current pointer value (10) and then increments pointer `p` to point to the next element (20).",
    runtime: "C99 / C11 / C17"
  },
  {
    id: "c-003",
    language: "c",
    difficulty: "medium",
    concepts: ["strings", "null-terminator", "strlen"],
    code: `char str[] = "abc\\0def";
printf("%zu", strlen(str));`,
    question: "What will be printed?",
    options: ["3", "7", "6", "8"],
    correctAnswer: "3",
    explanation: "`strlen()` measures characters up to the first null byte `\\0`. It stops after `'abc'`, returning length 3.",
    runtime: "C99 / C11 / C17"
  },
  {
    id: "c-004",
    language: "c",
    difficulty: "medium",
    concepts: ["operators", "short-circuit", "side-effects"],
    code: `int a = 0, b = 5;
if (a && ++b) {
    // nothing
}
printf("%d", b);`,
    question: "What will be printed?",
    options: ["5", "6", "0", "1"],
    correctAnswer: "5",
    explanation: "In logical AND (`&&`), if the left operand evaluates to 0 (false), the right operand is short-circuited and not evaluated. `++b` never runs.",
    runtime: "C99 / C11 / C17"
  },
  {
    id: "c-005",
    language: "c",
    difficulty: "medium",
    concepts: ["switch", "fallthrough"],
    code: `int x = 2;
switch (x) {
    case 1: x += 1;
    case 2: x += 2;
    case 3: x += 3;
}
printf("%d", x);`,
    question: "What will be printed?",
    options: ["7", "4", "2", "5"],
    correctAnswer: "7",
    explanation: "Execution jumps to `case 2`, computing `x = 2 + 2 = 4`. Because there is no `break`, execution falls through to `case 3`, computing `x = 4 + 3 = 7`.",
    runtime: "C99 / C11 / C17"
  }
];

const cCatalog = [
  { id: "c-006", diff: "easy", concepts: ["arithmetic", "integer-division"], code: "int x = 7 / 2;\nprintf(\"%d\", x);", options: ["3", "3.5", "4", "0"], ans: "3", exp: "Integer division truncates the fractional part towards zero, producing 3." },
  { id: "c-007", diff: "medium", concepts: ["bitwise", "left-shift"], code: "int x = 1 << 3;\nprintf(\"%d\", x);", options: ["8", "3", "1", "16"], ans: "8", exp: "Shifting 1 left by 3 bits computes 1 * 2^3 = 8." },
  { id: "c-008", diff: "medium", concepts: ["bitwise", "xor"], code: "int a = 5, b = 3;\nprintf(\"%d\", a ^ b);", options: ["6", "8", "2", "15"], ans: "6", exp: "5 (0101) XOR 3 (0011) = 6 (0110)." },
  { id: "c-009", diff: "hard", concepts: ["pointers", "parentheses-dereference"], code: "int a[] = {10, 20};\nint *p = a;\n(*p)++;\nprintf(\"%d\", a[0]);", options: ["11", "10", "20", "Compilation error"], ans: "11", exp: "Parentheses `(*p)++` dereference pointer `p` first, incrementing the value stored at `a[0]` from 10 to 11." },
  { id: "c-010", diff: "medium", concepts: ["structs", "initialization"], code: "struct Point { int x; int y; };\nstruct Point p = {10, 20};\nprintf(\"%d\", p.x + p.y);", options: ["30", "10", "20", "Compilation error"], ans: "30", exp: "The struct fields are initialized in order: `x = 10`, `y = 20`. Sum is 30." },
  { id: "c-011", diff: "easy", concepts: ["ternary", "evaluation"], code: "int a = 10, b = 20;\nint max = (a > b) ? a : b;\nprintf(\"%d\", max);", options: ["20", "10", "0", "Compilation error"], ans: "20", exp: "Since 10 > 20 is false, the ternary expression returns `b` (20)." },
  { id: "c-012", diff: "medium", concepts: ["enums", "values"], code: "enum State { OFF, ON = 5, PAUSED };\nprintf(\"%d\", PAUSED);", options: ["6", "2", "5", "0"], ans: "6", exp: "Enum items increment by 1 from the preceding value: `ON = 5`, so `PAUSED = 6`." },
  { id: "c-013", diff: "hard", concepts: ["recursion", "factorial"], code: "int f(int n) {\n    if (n <= 1) return 1;\n    return n * f(n - 1);\n}\nprintf(\"%d\", f(4));", options: ["24", "12", "16", "4"], ans: "24", exp: "Recursive computation: 4 * 3 * 2 * 1 = 24." },
  { id: "c-014", diff: "medium", concepts: ["strings", "char-array-size"], code: "char s[] = \"hi\";\nprintf(\"%zu\", sizeof(s));", options: ["3", "2", "8", "4"], ans: "3", exp: "String literal `\"hi\"` includes 2 letters plus the terminating null byte `\\0`, so `sizeof(s)` is 3." },
  { id: "c-015", diff: "hard", concepts: ["arrays", "pointer-decay"], code: "int a[5] = {1, 2, 3, 4, 5};\nint *p = a + 2;\nprintf(\"%d\", p[1]);", options: ["4", "3", "2", "5"], ans: "4", exp: "`p` points to index 2 (`a[2]`). `p[1]` accesses index 2 + 1 = 3 (`a[3]`), which is 4." },
  { id: "c-016", diff: "medium", concepts: ["operators", "modulo-negative"], code: "printf(\"%d\", -7 % 3);", options: ["-1", "2", "-2", "1"], ans: "-1", exp: "In C99+, integer division truncates towards zero. `-7 / 3 = -2`, and `-7 - (-2 * 3) = -1`." },
  { id: "c-017", diff: "hard", concepts: ["functions", "static-local"], code: "int count() {\n    static int c = 0;\n    return ++c;\n}\nprintf(\"%d \", count());\nprintf(\"%d\", count());", options: ["1 2", "1 1", "0 1", "2 2"], ans: "1 2", exp: "Static local variables retain their value in the data segment across successive function calls." },
  { id: "c-018", diff: "medium", concepts: ["types", "sizeof-char"], code: "printf(\"%zu\", sizeof(char));", options: ["1", "2", "4", "8"], ans: "1", exp: "By C standard definition, `sizeof(char)` is guaranteed to always be strictly 1." },
  { id: "c-019", diff: "hard", concepts: ["pointers", "array-name-address"], code: "int a[3] = {1, 2, 3};\nprintf(\"%d\", *(a + 1));", options: ["2", "1", "3", "Compilation error"], ans: "2", exp: "`*(a + 1)` is equivalent to `a[1]`, which is 2." },
  { id: "c-020", diff: "medium", concepts: ["bitwise", "not"], code: "unsigned char a = 0;\nprintf(\"%u\", (unsigned char)~a);", options: ["255", "0", "1", "-1"], ans: "255", exp: "Bitwise NOT on 0 sets all 8 bits to 1, which equals 255 in unsigned char." },
  { id: "c-021", diff: "hard", concepts: ["arrays", "subscript-commutative"], code: "int arr[] = {10, 20, 30};\nprintf(\"%d\", 1[arr]);", options: ["20", "10", "Compilation error", "SyntaxError"], ans: "20", exp: "In C, `1[arr]` is syntactically equivalent to `*(1 + arr) == *(arr + 1) == arr[1]`, which is 20." },
  { id: "c-022", diff: "medium", concepts: ["for-loop", "comma-operator"], code: "int i, j;\nfor (i = 0, j = 5; i < 2; i++, j--);\nprintf(\"%d\", j);", options: ["3", "4", "5", "2"], ans: "3", exp: "Loop runs twice: iteration 1 (`i=1, j=4`), iteration 2 (`i=2, j=3`). Loop terminates, leaving `j = 3`." },
  { id: "c-023", diff: "hard", concepts: ["types", "char-literals-int"], code: "printf(\"%zu\", sizeof('a'));", options: ["sizeof(int)", "1", "sizeof(char*)", "2"], ans: "sizeof(int)", exp: "In C (unlike C++), character literals like `'a'` have type `int`, so `sizeof('a') == sizeof(int)`." },
  { id: "c-024", diff: "medium", concepts: ["constants", "define"], code: "#define DOUBLE(x) x * 2\nprintf(\"%d\", DOUBLE(1 + 2));", options: ["5", "6", "4", "Compilation error"], ans: "5", exp: "Macro substitution expands textually to `1 + 2 * 2`. Multiplication takes precedence: `1 + 4 = 5`." },
  { id: "c-025", diff: "hard", concepts: ["preprocessor", "stringification"], code: "#define STR(x) #x\nprintf(\"%s\", STR(123));", options: ["123", "\"123\"", "x", "Compilation error"], ans: "123", exp: "The `#` preprocessor operator converts the macro parameter token into a string literal `\"123\"`." },
  { id: "c-026", diff: "medium", concepts: ["bitwise", "and-mask"], code: "int x = 12 & 10;\nprintf(\"%d\", x);", options: ["8", "12", "14", "10"], ans: "8", exp: "12 (1100) AND 10 (1010) = 8 (1000)." },
  { id: "c-027", diff: "hard", concepts: ["pointers", "pointer-to-pointer"], code: "int x = 100;\nint *p = &x;\nint **pp = &p;\nprintf(\"%d\", **pp);", options: ["100", "&x", "Compilation error", "Segmentation fault"], ans: "100", exp: "Double dereferencing `**pp` follows pointer to `p`, then follows `p` to `x`, yielding 100." },
  { id: "c-028", diff: "medium", concepts: ["logical", "or-short-circuit"], code: "int a = 1, b = 2;\nif (a || ++b) {}\nprintf(\"%d\", b);", options: ["2", "3", "1", "0"], ans: "2", exp: "Logical OR short-circuits because `a` is true (1), so `++b` is not evaluated." },
  { id: "c-029", diff: "hard", concepts: ["typedef", "pointers"], code: "typedef int* IntPtr;\nint x = 10, y = 20;\nIntPtr p = &x;\n*p = 15;\nprintf(\"%d\", x);", options: ["15", "10", "20", "Compilation error"], ans: "15", exp: "`IntPtr` is an alias for `int*`. Dereferencing `*p` assigns 15 directly to `x`." },
  { id: "c-030", diff: "medium", concepts: ["strings", "strcmp"], code: "printf(\"%d\", strcmp(\"abc\", \"abc\"));", options: ["0", "1", "-1", "true"], ans: "0", exp: "`strcmp` returns 0 when both strings are identical." },
  { id: "c-031", diff: "hard", concepts: ["pointers", "difference"], code: "int a[5];\nint *p1 = &a[1];\nint *p2 = &a[4];\nprintf(\"%td\", p2 - p1);", options: ["3", "12", "4", "Compilation error"], ans: "3", exp: "Subtracting two pointers to elements of the same array yields the number of elements between them (4 - 1 = 3)." },
  { id: "c-032", diff: "medium", concepts: ["do-while", "execution"], code: "int i = 0;\ndo {\n    i++;\n} while (i < 0);\nprintf(\"%d\", i);", options: ["1", "0", "-1", "Infinite loop"], ans: "1", exp: "A `do-while` loop executes its body at least once before checking the condition." },
  { id: "c-033", diff: "hard", concepts: ["structs", "pointer-member"], code: "struct Data { int val; };\nstruct Data d = {42};\nstruct Data *p = &d;\nprintf(\"%d\", p->val);", options: ["42", "&d", "Compilation error", "0"], ans: "42", exp: "The arrow operator `p->val` dereferences pointer `p` and accesses field `val`." },
  { id: "c-034", diff: "medium", concepts: ["arithmetic", "compound"], code: "int x = 10;\nx -= 2 + 3;\nprintf(\"%d\", x);", options: ["5", "11", "9", "Compilation error"], ans: "5", exp: "Compound assignment evaluates the right hand side first: `x = 10 - (2 + 3) = 5`." },
  { id: "c-035", diff: "hard", concepts: ["recursion", "fibonacci"], code: "int fib(int n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}\nprintf(\"%d\", fib(4));", options: ["3", "4", "5", "2"], ans: "3", exp: "Fibonacci sequence: fib(0)=0, fib(1)=1, fib(2)=1, fib(3)=2, fib(4)=3." },
  { id: "c-036", diff: "medium", concepts: ["types", "implicit-conversion"], code: "float f = 3.5f;\nint i = f;\nprintf(\"%d\", i);", options: ["3", "4", "3.5", "Compilation error"], ans: "3", exp: "Assigning float to int truncates the decimal portion, resulting in 3." },
  { id: "c-037", diff: "hard", concepts: ["bitwise", "right-shift"], code: "int x = 16 >> 2;\nprintf(\"%d\", x);", options: ["4", "8", "32", "64"], ans: "4", exp: "Shifting 16 right by 2 bits divides by 4, yielding 4." },
  { id: "c-038", diff: "medium", concepts: ["strings", "strcpy-len"], code: "char dest[10];\nstrcpy(dest, \"Go\");\nprintf(\"%zu\", strlen(dest));", options: ["2", "10", "3", "0"], ans: "2", exp: "`strcpy` copies 'G', 'o', and `\\0`. `strlen()` returns 2." },
  { id: "c-039", diff: "hard", concepts: ["pointers", "const-pointer"], code: "int a = 10;\nconst int *p = &a;\nprintf(\"%d\", *p);", options: ["10", "&a", "Compilation error", "0"], ans: "10", exp: "Pointer to const int allows reading the target value (10)." },
  { id: "c-040", diff: "medium", concepts: ["arrays", "partial-init"], code: "int a[3] = {1};\nprintf(\"%d %d\", a[0], a[1]);", options: ["1 0", "1 1", "1 undefined", "Compilation error"], ans: "1 0", exp: "Elements in partially initialized arrays default to 0." },
  { id: "c-041", diff: "hard", concepts: ["functions", "pass-by-value"], code: "void f(int x) { x = 20; }\nint a = 10;\nf(a);\nprintf(\"%d\", a);", options: ["10", "20", "0", "Compilation error"], ans: "10", exp: "C passes parameters by value; mutations inside `f` affect only the local copy." },
  { id: "c-042", diff: "medium", concepts: ["while-loop", "decrement"], code: "int c = 2;\nwhile (c--) {}\nprintf(\"%d\", c);", options: ["-1", "0", "1", "2"], ans: "-1", exp: "Loop conditions: `c=2` (c becomes 1), `c=1` (c becomes 0), `c=0` is false (c becomes -1)." },
  { id: "c-043", diff: "hard", concepts: ["unions", "shared-memory"], code: "union Data { int i; char c; };\nunion Data d;\nd.i = 0;\nd.c = 'A';\nprintf(\"%c\", d.c);", options: ["A", "0", "Compilation error", "null"], ans: "A", exp: "Union members share memory; reading `d.c` after assigning 'A' yields 'A'." },
  { id: "c-044", diff: "medium", concepts: ["ternary", "nested"], code: "int x = 5;\nint r = (x > 10) ? 1 : (x > 2) ? 2 : 3;\nprintf(\"%d\", r);", options: ["2", "1", "3", "Compilation error"], ans: "2", exp: "5 > 10 is false; next branch checks 5 > 2 which is true, producing 2." },
  { id: "c-045", diff: "hard", concepts: ["pointers", "pre-increment"], code: "int a[] = {10, 20, 30};\nint *p = a;\nprintf(\"%d\", *++p);", options: ["20", "10", "30", "11"], ans: "20", exp: "`*++p` increments pointer `p` first to `a[1]`, then dereferences to 20." },
  { id: "c-046", diff: "medium", concepts: ["math", "abs-c"], code: "printf(\"%d\", abs(-15));", options: ["15", "-15", "0", "Compilation error"], ans: "15", exp: "`abs()` returns the absolute integer value 15." },
  { id: "c-047", diff: "hard", concepts: ["scope", "block-shadowing"], code: "int x = 1;\n{\n    int x = 2;\n}\nprintf(\"%d\", x);", options: ["1", "2", "Compilation error", "0"], ans: "1", exp: "Inner block declaration shadows outer `x` only within that block; outer `x` remains 1." },
  { id: "c-048", diff: "medium", concepts: ["strings", "strcat-len"], code: "char s[10] = \"A\";\nstrcat(s, \"B\");\nprintf(\"%zu\", strlen(s));", options: ["2", "10", "1", "3"], ans: "2", exp: "`strcat` appends 'B' to 'A', producing \"AB\" of length 2." },
  { id: "c-049", diff: "hard", concepts: ["bitwise", "check-odd"], code: "int x = 7;\nprintf(\"%d\", x & 1);", options: ["1", "0", "7", "Compilation error"], ans: "1", exp: "`x & 1` checks the lowest bit; 7 is odd, so result is 1." },
  { id: "c-050", diff: "medium", concepts: ["cast", "arithmetic-float"], code: "int a = 5, b = 2;\nprintf(\"%.1f\", (float)a / b);", options: ["2.5", "2.0", "2", "Compilation error"], ans: "2.5", exp: "Casting `a` to float causes float division: 5.0 / 2 = 2.5." },
  { id: "c-051", diff: "hard", concepts: ["pointers", "swap-pointers"], code: "void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }\nint x = 1, y = 2;\nswap(&x, &y);\nprintf(\"%d %d\", x, y);", options: ["2 1", "1 2", "1 1", "2 2"], ans: "2 1", exp: "Passing pointers enables `swap` to exchange the values in callers' memory." },
  { id: "c-052", diff: "medium", concepts: ["control", "break"], code: "int s = 0;\nfor (int i = 0; i < 5; i++) {\n    if (i == 2) break;\n    s += i;\n}\nprintf(\"%d\", s);", options: ["1", "3", "0", "10"], ans: "1", exp: "Iteration 0 adds 0; iteration 1 adds 1. At `i=2`, the loop breaks, leaving `s = 1`." },
  { id: "c-053", diff: "hard", concepts: ["control", "continue"], code: "int s = 0;\nfor (int i = 0; i < 4; i++) {\n    if (i == 2) continue;\n    s += i;\n}\nprintf(\"%d\", s);", options: ["4", "6", "3", "1"], ans: "4", exp: "Skips iteration 2: 0 + 1 + 3 = 4." },
  { id: "c-054", diff: "medium", concepts: ["arrays", "matrix-index"], code: "int m[2][2] = {{1, 2}, {3, 4}};\nprintf(\"%d\", m[1][0]);", options: ["3", "1", "2", "4"], ans: "3", exp: "Row index 1, column index 0 corresponds to value 3." },
  { id: "c-055", diff: "hard", concepts: ["strings", "char-subtract"], code: "printf(\"%d\", '5' - '0');", options: ["5", "53", "48", "Compilation error"], ans: "5", exp: "ASCII code of '5' (53) minus '0' (48) evaluates to numeric 5." },
  { id: "c-056", diff: "medium", concepts: ["pointers", "null-check"], code: "int *p = NULL;\nprintf(\"%d\", p == NULL);", options: ["1", "0", "Compilation error", "Segmentation fault"], ans: "1", exp: "`p` was assigned `NULL`, so comparison returns 1 (true)." },
  { id: "c-057", diff: "hard", concepts: ["bitwise", "clear-bit"], code: "int x = 7;\nx &= ~1;\nprintf(\"%d\", x);", options: ["6", "7", "0", "1"], ans: "6", exp: "`~1` clears the lowest bit: 7 (111) AND ~1 (110) = 6." },
  { id: "c-058", diff: "medium", concepts: ["precedence", "logical-not"], code: "printf(\"%d\", !0 + !0);", options: ["2", "0", "1", "Compilation error"], ans: "2", exp: "`!0` is 1; 1 + 1 = 2." },
  { id: "c-059", diff: "hard", concepts: ["goto", "label"], code: "int x = 0;\nstart:\nx++;\nif (x < 3) goto start;\nprintf(\"%d\", x);", options: ["3", "2", "4", "Infinite loop"], ans: "3", exp: "The loop increments `x` until it reaches 3, then terminates." },
  { id: "c-060", diff: "medium", concepts: ["strings", "putchar"], code: "putchar('A');", options: ["A", "65", "Compilation error", "null"], ans: "A", exp: "`putchar('A')` writes character 'A' to stdout." },
  { id: "c-061", diff: "hard", concepts: ["sizeof", "expression-unevaluated"], code: "int a = 5;\nsizeof(a++);\nprintf(\"%d\", a);", options: ["5", "6", "Compilation error", "4"], ans: "5", exp: "The operand of `sizeof` is not evaluated at runtime, so `a++` has no side effect." },
  { id: "c-062", diff: "medium", concepts: ["types", "short-overflow-defined"], code: "unsigned short s = 65535;\ns++;\nprintf(\"%u\", s);", options: ["0", "65536", "-1", "Compilation error"], ans: "0", exp: "Unsigned integer arithmetic is defined to wrap modulo 2^N (65535 + 1 wraps to 0)." },
  { id: "c-063", diff: "hard", concepts: ["macros", "token-pasting"], code: "#define GLUE(a, b) a##b\nint xy = 100;\nprintf(\"%d\", GLUE(x, y));", options: ["100", "xy", "Compilation error", "0"], ans: "100", exp: "Token pasting operator `##` merges `x` and `y` into identifier `xy` (100)." },
  { id: "c-064", diff: "medium", concepts: ["pointers", "array-param"], code: "int size(int arr[10]) {\n    return sizeof(arr) == sizeof(int*);\n}\nprintf(\"%d\", size(NULL));", options: ["1", "0", "Compilation error", "Segmentation fault"], ans: "1", exp: "Array parameters decay to pointers in function signatures, so `sizeof(arr)` is `sizeof(int*)`." },
  { id: "c-065", diff: "expert", concepts: ["limits", "char-bit"], code: "#include <limits.h>\nprintf(\"%d\", CHAR_BIT >= 8);", options: ["1", "0", "Compilation error", "undefined"], ans: "1", exp: "The C specification guarantees that `CHAR_BIT` is at least 8." }
];

export function getAllCQuestions() {
  const result = [...cQuestionsBase];
  for (const item of cCatalog) {
    result.push({
      id: item.id,
      language: "c",
      difficulty: item.diff,
      concepts: item.concepts,
      code: item.code,
      question: "What will be printed?",
      options: item.options,
      correctAnswer: item.ans,
      explanation: item.exp,
      runtime: "C99 / C11 / C17",
      hint: `Recall C semantics for ${item.concepts[0]}.`
    });
  }
  return result;
}
