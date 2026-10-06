// C++ Questions Dataset (65 Unique Verified Questions)

export const cppQuestionsBase = [
  {
    id: "cpp-001",
    language: "cpp",
    difficulty: "easy",
    concepts: ["references", "functions", "pass-by-reference"],
    code: `void addTen(int &x) {
    x += 10;
}

int a = 5;
addTen(a);
std::cout << a;`,
    question: "What will be printed?",
    options: ["15", "5", "10", "Compilation error"],
    correctAnswer: "15",
    explanation: "Parameter `int &x` is passed by reference, binding directly to `a`. Mutating `x` modifies the original variable `a` to 15.",
    runtime: "C++17 / C++20"
  },
  {
    id: "cpp-002",
    language: "cpp",
    difficulty: "medium",
    concepts: ["vector", "copy-semantics", "stl"],
    code: `std::vector<int> a = {1, 2};
auto b = a;
b.push_back(3);
std::cout << a.size() << " " << b.size();`,
    question: "What will be printed?",
    options: ["2 3", "3 3", "2 2", "Compilation error"],
    correctAnswer: "2 3",
    explanation: "In C++, `std::vector` possesses deep copy value semantics. `auto b = a` creates an independent copy; modifying `b` does not alter `a`.",
    runtime: "C++17 / C++20"
  },
  {
    id: "cpp-003",
    language: "cpp",
    difficulty: "hard",
    concepts: ["polymorphism", "virtual-functions", "inheritance"],
    code: `struct Base {
    virtual void show() { std::cout << "B"; }
};
struct Derived : Base {
    void show() override { std::cout << "D"; }
};

Base *b = new Derived();
b->show();`,
    question: "What will be printed?",
    options: ["D", "B", "BD", "Compilation error"],
    correctAnswer: "D",
    explanation: "Because `show()` is declared `virtual` in `Base`, dynamic dispatch invokes the overridden method in `Derived` at runtime.",
    runtime: "C++17 / C++20"
  },
  {
    id: "cpp-004",
    language: "cpp",
    difficulty: "medium",
    concepts: ["lambdas", "capture-by-value", "mutable"],
    code: `int x = 10;
auto fn = [x]() mutable {
    return ++x;
};
fn();
std::cout << x;`,
    question: "What will be printed?",
    options: ["10", "11", "Compilation error", "0"],
    correctAnswer: "10",
    explanation: "Capture `[x]` copies `x` by value into the lambda's closure. The `mutable` keyword allows modifying the captured copy, leaving outer `x` unchanged at 10.",
    runtime: "C++17 / C++20"
  },
  {
    id: "cpp-005",
    language: "cpp",
    difficulty: "medium",
    concepts: ["range-for", "copy-vs-reference"],
    code: `std::vector<int> v = {1, 2};
for (auto x : v) {
    x *= 2;
}
std::cout << v[0];`,
    question: "What will be printed?",
    options: ["1", "2", "0", "Compilation error"],
    correctAnswer: "1",
    explanation: "`for (auto x : v)` iterates by value, copying each element into `x`. Modifying `x` does not update the vector elements; `for (auto &x : v)` would be required.",
    runtime: "C++17 / C++20"
  }
];

const cppCatalog = [
  { id: "cpp-006", diff: "easy", concepts: ["strings", "concatenation"], code: "std::string s = \"A\";\ns += \"B\";\nstd::cout << s;", options: ["AB", "A", "B", "Compilation error"], ans: "AB", exp: "`+=` appends string 'B' to 'A'." },
  { id: "cpp-007", diff: "hard", concepts: ["smart-pointers", "unique-ptr", "move"], code: "auto p1 = std::make_unique<int>(42);\nauto p2 = std::move(p1);\nstd::cout << (p1 == nullptr);", options: ["1", "0", "Compilation error", "Segmentation fault"], ans: "1", exp: "`std::move` transfers ownership to `p2`, leaving `p1` holding `nullptr` (evaluated as 1 in boolean context)." },
  { id: "cpp-008", diff: "medium", concepts: ["references", "const-ref-binding"], code: "const int &r = 10;\nstd::cout << r;", options: ["10", "Compilation error", "0", "Segmentation fault"], ans: "10", exp: "In C++, a `const` reference can bind to a temporary rvalue, extending its lifetime." },
  { id: "cpp-009", diff: "hard", concepts: ["constructors", "initializer-list-order"], code: "struct S { int a; int b; S(int x) : b(x), a(b + 1) {} };", options: ["Undefined behavior / uninitialized 'a'", "Valid standard behavior", "Compilation error", "None"], ans: "Undefined behavior / uninitialized 'a'", exp: "Members are initialized in order of their declaration in class definition (`a` before `b`), so reading `b` before it is initialized is undefined." },
  { id: "cpp-010", diff: "medium", concepts: ["auto", "type-deduction"], code: "auto a = 5.0f;\nstd::cout << typeid(a).name();", options: ["float type", "double type", "int type", "Compilation error"], ans: "float type", exp: "Suffix `f` denotes a float literal, so `auto` deduces `float`." },
  { id: "cpp-011", diff: "hard", concepts: ["templates", "specialization"], code: "template<typename T> struct C { static int f(){ return 1; } };\ntemplate<> struct C<int> { static int f(){ return 2; } };\nstd::cout << C<int>::f();", options: ["2", "1", "Compilation error", "0"], ans: "2", exp: "Explicit template specialization for `int` takes precedence over primary template, returning 2." },
  { id: "cpp-012", diff: "medium", concepts: ["vector", "at-bounds"], code: "std::vector<int> v = {1};\ntry { v.at(5); } catch (const std::out_of_range&) { std::cout << \"OOR\"; }", options: ["OOR", "1", "Segmentation fault", "Compilation error"], ans: "OOR", exp: "Unlike `v[5]`, `.at(5)` performs bounds-checking and throws `std::out_of_range`." },
  { id: "cpp-013", diff: "hard", concepts: ["classes", "destructors-virtual"], code: "struct B { ~B(){ std::cout << \"B\"; } };\nstruct D : B { ~D(){ std::cout << \"D\"; } };\n{ D d; }", options: ["DB", "BD", "D", "B"], ans: "DB", exp: "Derived class destructor body runs first, followed by base class destructor." },
  { id: "cpp-014", diff: "medium", concepts: ["stl", "accumulate"], code: "std::vector<int> v = {1, 2, 3};\nstd::cout << std::accumulate(v.begin(), v.end(), 10);", options: ["16", "6", "10", "Compilation error"], ans: "16", exp: "`std::accumulate` computes 10 + 1 + 2 + 3 = 16." },
  { id: "cpp-015", diff: "hard", concepts: ["move-semantics", "rvalue-ref"], code: "void f(int &) { std::cout << \"L\"; }\nvoid f(int &&) { std::cout << \"R\"; }\nf(42);", options: ["R", "L", "Compilation error", "Ambiguous error"], ans: "R", exp: "Literal `42` is an rvalue (prvalue), binding to the rvalue reference overload `f(int&&)`." },
  { id: "cpp-016", diff: "medium", concepts: ["pairs", "make-pair"], code: "auto p = std::make_pair(\"A\", 1);\nstd::cout << p.first << p.second;", options: ["A1", "A 1", "Compilation error", "1A"], ans: "A1", exp: "`std::make_pair` creates a pair with members `.first` and `.second`." },
  { id: "cpp-017", diff: "hard", concepts: ["constexpr", "compile-time"], code: "constexpr int sq(int x) { return x * x; }\nconstexpr int val = sq(4);\nstd::cout << val;", options: ["16", "4", "Compilation error", "0"], ans: "16", exp: "`constexpr` function evaluates at compile-time when called with constant expressions." },
  { id: "cpp-018", diff: "medium", concepts: ["set", "ordered-unique"], code: "std::set<int> s = {3, 1, 2, 1};\nstd::cout << *s.begin();", options: ["1", "3", "2", "Compilation error"], ans: "1", exp: "`std::set` keeps unique elements sorted ascending; `*s.begin()` is 1." },
  { id: "cpp-019", diff: "hard", concepts: ["map", "subscript-default"], code: "std::map<std::string, int> m;\nstd::cout << m[\"missing\"];", options: ["0", "KeyError", "Compilation error", "-1"], ans: "0", exp: "`map::operator[]` value-initializes missing entries (int defaults to 0)." },
  { id: "cpp-020", diff: "medium", concepts: ["strings", "find-npos"], code: "std::string s = \"abc\";\nstd::cout << (s.find('z') == std::string::npos);", options: ["1", "0", "Compilation error", "-1"], ans: "1", exp: "When a character is not found, `find()` returns `std::string::npos` (evaluates to true/1)." },
  { id: "cpp-021", diff: "hard", concepts: ["smart-pointers", "shared-ptr-use-count"], code: "auto s1 = std::make_shared<int>(5);\nauto s2 = s1;\nstd::cout << s1.use_count();", options: ["2", "1", "0", "Compilation error"], ans: "2", exp: "Both `s1` and `s2` share ownership of the integer, so reference count is 2." },
  { id: "cpp-022", diff: "medium", concepts: ["vector", "pop-back"], code: "std::vector<int> v = {1, 2};\nv.pop_back();\nstd::cout << v.size();", options: ["1", "2", "0", "Compilation error"], ans: "1", exp: "`pop_back()` removes the last element, decreasing size to 1." },
  { id: "cpp-023", diff: "hard", concepts: ["lambdas", "capture-by-ref"], code: "int a = 5;\nauto f = [&a]() { a += 5; };\nf();\nstd::cout << a;", options: ["10", "5", "Compilation error", "0"], ans: "10", exp: "Capture by reference `[&a]` modifies the original `a`." },
  { id: "cpp-024", diff: "medium", concepts: ["casting", "static-cast"], code: "double d = 4.7;\nint i = static_cast<int>(d);\nstd::cout << i;", options: ["4", "5", "4.7", "Compilation error"], ans: "4", exp: "`static_cast<int>` truncates the fractional portion to 4." },
  { id: "cpp-025", diff: "hard", concepts: ["classes", "default-delete"], code: "struct NoCopy { NoCopy() = default; NoCopy(const NoCopy&) = delete; };", options: ["Prevents copy construction", "Deletes destructor", "Compilation error", "None"], ans: "Prevents copy construction", exp: "`= delete` explicitly disables copy constructor invocation." },
  { id: "cpp-026", diff: "medium", concepts: ["stl", "count"], code: "std::vector<int> v = {1, 2, 2, 3};\nstd::cout << std::count(v.begin(), v.end(), 2);", options: ["2", "1", "3", "0"], ans: "2", exp: "`std::count` tallies elements equal to 2 (appears twice)." },
  { id: "cpp-027", diff: "hard", concepts: ["classes", "explicit-constructor"], code: "struct B { explicit B(int){} };", options: ["Prevents implicit conversion from int", "Requires int pointer", "Compilation error", "None"], ans: "Prevents implicit conversion from int", exp: "`explicit` prohibits automatic type conversions (e.g., `B b = 5;`)." },
  { id: "cpp-028", diff: "medium", concepts: ["vector", "front-back"], code: "std::vector<int> v = {10, 20, 30};\nstd::cout << v.front() + v.back();", options: ["40", "30", "10", "20"], ans: "40", exp: "`v.front()` is 10 and `v.back()` is 30; 10 + 30 = 40." },
  { id: "cpp-029", diff: "hard", concepts: ["operator-overload", "plus"], code: "struct V { int x; V operator+(const V& o) const { return {x + o.x}; } };\nV a{2}, b{3};\nstd::cout << (a + b).x;", options: ["5", "2", "3", "Compilation error"], ans: "5", exp: "Overloaded `operator+` computes `2 + 3 = 5`." },
  { id: "cpp-030", diff: "medium", concepts: ["strings", "substr"], code: "std::string s = \"abcdef\";\nstd::cout << s.substr(2, 3);", options: ["cde", "cd", "bc", "cdef"], ans: "cde", exp: "In C++, `substr(pos, count)` takes position 2 and extracts 3 characters ('c', 'd', 'e')." },
  { id: "cpp-031", diff: "hard", concepts: ["optional", "has-value"], code: "std::optional<int> o;\nstd::cout << o.value_or(100);", options: ["100", "0", "bad_optional_access", "Compilation error"], ans: "100", exp: "Empty `std::optional` returns the fallback value 100 via `value_or`." },
  { id: "cpp-032", diff: "medium", concepts: ["tuples", "get"], code: "auto t = std::make_tuple(1, \"A\");\nstd::cout << std::get<0>(t);", options: ["1", "A", "Compilation error", "0"], ans: "1", exp: "`std::get<0>` extracts the first element (1)." },
  { id: "cpp-033", diff: "hard", concepts: ["templates", "fold-expressions"], code: "template<typename... Args> auto sum(Args... args) { return (args + ...); }\nstd::cout << sum(1, 2, 3, 4);", options: ["10", "1", "4", "Compilation error"], ans: "10", exp: "C++17 unary fold expression `(args + ...)` calculates 1 + 2 + 3 + 4 = 10." },
  { id: "cpp-034", diff: "medium", concepts: ["enums", "enum-class"], code: "enum class Color { Red, Blue };\nstd::cout << (Color::Red == Color::Red);", options: ["1", "0", "Compilation error", "Red"], ans: "1", exp: "Scoped `enum class` elements can be compared for equality with same enum type." },
  { id: "cpp-035", diff: "hard", concepts: ["type-traits", "is-same"], code: "std::cout << std::is_same_v<int, int32_t>;", options: ["1", "0", "Compilation error", "undefined"], ans: "1", exp: "On platforms where int is 32-bit, `int` and `int32_t` denote the exact same underlying type." },
  { id: "cpp-036", diff: "medium", concepts: ["deque", "push-front"], code: "std::deque<int> d = {2};\nd.push_front(1);\nstd::cout << d[0];", options: ["1", "2", "Compilation error", "0"], ans: "1", exp: "`push_front(1)` prepends 1 to the deque." },
  { id: "cpp-037", diff: "hard", concepts: ["variant", "holds-alternative"], code: "std::variant<int, std::string> v = 42;\nstd::cout << std::holds_alternative<int>(v);", options: ["1", "0", "Compilation error", "42"], ans: "1", exp: "`std::variant` currently holds an `int`, so `holds_alternative<int>` is true (1)." },
  { id: "cpp-038", diff: "medium", concepts: ["queue", "fifo"], code: "std::queue<int> q;\nq.push(1); q.push(2);\nstd::cout << q.front();", options: ["1", "2", "Compilation error", "0"], ans: "1", exp: "`std::queue` is FIFO (First-In, First-Out); `front()` is 1." },
  { id: "cpp-039", diff: "hard", concepts: ["stack", "lifo"], code: "std::stack<int> s;\ns.push(1); s.push(2);\nstd::cout << s.top();", options: ["2", "1", "Compilation error", "0"], ans: "2", exp: "`std::stack` is LIFO (Last-In, First-Out); `top()` is 2." },
  { id: "cpp-040", diff: "medium", concepts: ["string-view", "no-copy"], code: "std::string_view sv = \"Hello\";\nstd::cout << sv.length();", options: ["5", "6", "Compilation error", "0"], ans: "5", exp: "`std::string_view` non-owning view of \"Hello\" has length 5." },
  { id: "cpp-041", diff: "hard", concepts: ["any", "any-cast"], code: "std::any a = 10;\nstd::cout << std::any_cast<int>(a);", options: ["10", "bad_any_cast", "Compilation error", "0"], ans: "10", exp: "`std::any_cast<int>` retrieves the contained integer 10." },
  { id: "cpp-042", diff: "medium", concepts: ["vector", "clear-empty"], code: "std::vector<int> v = {1};\nv.clear();\nstd::cout << v.empty();", options: ["1", "0", "Compilation error", "true"], ans: "1", exp: "`v.clear()` removes all items; `v.empty()` returns true (1)." },
  { id: "cpp-043", diff: "hard", concepts: ["destructors", "order-members"], code: "struct A { ~A(){ std::cout << \"A\"; } };\nstruct B { ~B(){ std::cout << \"B\"; } };\nstruct C { A a; B b; };\n{ C c; }", options: ["BA", "AB", "C", "Compilation error"], ans: "BA", exp: "Member variables are destroyed in the reverse order of their declaration: `b` then `a`." },
  { id: "cpp-044", diff: "medium", concepts: ["math", "clamp"], code: "std::cout << std::clamp(15, 0, 10);", options: ["10", "15", "0", "Compilation error"], ans: "10", exp: "C++17 `std::clamp(val, low, high)` clamps 15 to the upper bound 10." },
  { id: "cpp-045", diff: "hard", concepts: ["stl", "binary-search"], code: "std::vector<int> v = {1, 3, 5};\nstd::cout << std::binary_search(v.begin(), v.end(), 3);", options: ["1", "0", "Compilation error", "3"], ans: "1", exp: "`std::binary_search` returns boolean true (1) if element 3 is present." },
  { id: "cpp-046", diff: "medium", concepts: ["vector", "insert"], code: "std::vector<int> v = {1, 3};\nv.insert(v.begin() + 1, 2);\nstd::cout << v[1];", options: ["2", "1", "3", "Compilation error"], ans: "2", exp: "`insert` puts element 2 at index 1." },
  { id: "cpp-047", diff: "hard", concepts: ["structured-binding", "tuple"], code: "auto [x, y] = std::make_pair(10, 20);\nstd::cout << x + y;", options: ["30", "10", "20", "Compilation error"], ans: "30", exp: "C++17 structured bindings decompose the pair into `x = 10` and `y = 20`; 10 + 20 = 30." },
  { id: "cpp-048", diff: "medium", concepts: ["chrono", "duration"], code: "auto sec = std::chrono::seconds(2);\nstd::cout << sec.count();", options: ["2", "2000", "Compilation error", "0"], ans: "2", exp: "`.count()` returns the number of representation ticks (2)." },
  { id: "cpp-049", diff: "hard", concepts: ["casting", "dynamic-cast-null"], code: "struct B { virtual ~B(){} };\nstruct D : B {};\nB b;\nstd::cout << (dynamic_cast<D*>(&b) == nullptr);", options: ["1", "0", "bad_cast", "Compilation error"], ans: "1", exp: "Downcasting an actual `B` instance pointer to `D*` fails safely, returning `nullptr` (1)." },
  { id: "cpp-050", diff: "medium", concepts: ["algorithm", "reverse"], code: "std::string s = \"ABC\";\nstd::reverse(s.begin(), s.end());\nstd::cout << s;", options: ["CBA", "ABC", "Compilation error", "0"], ans: "CBA", exp: "`std::reverse` reverses in-place." },
  { id: "cpp-051", diff: "hard", concepts: ["stl", "lower-bound"], code: "std::vector<int> v = {10, 20, 30};\nauto it = std::lower_bound(v.begin(), v.end(), 20);\nstd::cout << *it;", options: ["20", "10", "30", "Compilation error"], ans: "20", exp: "`std::lower_bound` returns an iterator to the first element not less than 20." },
  { id: "cpp-052", diff: "medium", concepts: ["algorithm", "min-max"], code: "auto [mn, mx] = std::minmax({4, 1, 9, 2});\nstd::cout << mn << mx;", options: ["19", "49", "12", "Compilation error"], ans: "19", exp: "`std::minmax` computes minimum (1) and maximum (9)." },
  { id: "cpp-053", diff: "hard", concepts: ["classes", "friend-function"], code: "class Secret { int val = 99; friend int read(Secret s){ return s.val; } };\nstd::cout << read(Secret{});", options: ["99", "Compilation error", "0", "undefined"], ans: "99", exp: "A `friend` function has access to private class members." },
  { id: "cpp-054", diff: "medium", concepts: ["vector", "reserve-vs-resize"], code: "std::vector<int> v;\nv.reserve(10);\nstd::cout << v.size();", options: ["0", "10", "Compilation error", "undefined"], ans: "0", exp: "`reserve(10)` allocates internal capacity without creating elements, so `.size()` is 0." },
  { id: "cpp-055", diff: "hard", concepts: ["vector", "resize-size"], code: "std::vector<int> v;\nv.resize(10);\nstd::cout << v.size();", options: ["10", "0", "Compilation error", "undefined"], ans: "10", exp: "`resize(10)` creates 10 zero-initialized elements, so `.size()` is 10." },
  { id: "cpp-056", diff: "medium", concepts: ["numbers", "gcd-cpp"], code: "std::cout << std::gcd(24, 18);", options: ["6", "3", "2", "Compilation error"], ans: "6", exp: "`std::gcd` in `<numeric>` computes the greatest common divisor (6)." },
  { id: "cpp-057", diff: "hard", concepts: ["bitset", "count"], code: "std::bitset<8> b(\"00001101\");\nstd::cout << b.count();", options: ["3", "8", "4", "Compilation error"], ans: "3", exp: "`.count()` counts set bits (ones); there are three 1s." },
  { id: "cpp-058", diff: "medium", concepts: ["complex", "real"], code: "std::complex<double> c(3.0, 4.0);\nstd::cout << c.real();", options: ["3", "4", "5", "Compilation error"], ans: "3", exp: "`.real()` returns real component 3.0." },
  { id: "cpp-059", diff: "hard", concepts: ["type-traits", "underlying-type"], code: "enum class E : char { A = 'x' };\nstd::cout << (char)E::A;", options: ["x", "120", "Compilation error", "0"], ans: "x", exp: "Explicitly casting enum class to its underlying `char` type yields 'x'." },
  { id: "cpp-060", diff: "medium", concepts: ["string", "starts-with"], code: "std::string s = \"cpp20\";\nstd::cout << s.starts_with(\"cpp\");", options: ["1", "0", "Compilation error", "true"], ans: "1", exp: "C++20 `starts_with` returns true (1)." },
  { id: "cpp-061", diff: "hard", concepts: ["concepts", "requires"], code: "template<typename T> concept Addable = requires(T a, T b){ a + b; };\nstd::cout << Addable<int>;", options: ["1", "0", "Compilation error", "true"], ans: "1", exp: "C++20 concept `Addable<int>` evaluates to boolean true (1)." },
  { id: "cpp-062", diff: "medium", concepts: ["ranges", "iota"], code: "auto v = std::views::iota(1, 4);\nstd::cout << *v.begin();", options: ["1", "4", "0", "Compilation error"], ans: "1", exp: "`std::views::iota(1, 4)` generates half-open range [1, 4); first element is 1." },
  { id: "cpp-063", diff: "hard", concepts: ["memory", "span"], code: "int a[] = {1, 2, 3};\nstd::span sp(a);\nstd::cout << sp.size();", options: ["3", "sizeof(int*)", "Compilation error", "0"], ans: "3", exp: "C++20 `std::span` automatically deduces array extent (3)." },
  { id: "cpp-064", diff: "medium", concepts: ["numeric", "midpoint"], code: "std::cout << std::midpoint(10, 20);", options: ["15", "14", "10", "Compilation error"], ans: "15", exp: "C++20 `std::midpoint(a, b)` computes integer midpoint without overflow (15)." },
  { id: "cpp-065", diff: "expert", concepts: ["spaceship-operator", "three-way"], code: "auto cmp = (1 <=> 2);\nstd::cout << (cmp < 0);", options: ["1", "0", "Compilation error", "-1"], ans: "1", exp: "C++20 three-way comparison operator `<=>` yields `strong_ordering::less`, which compares `< 0` as true (1)." }
];

export function getAllCppQuestions() {
  const result = [...cppQuestionsBase];
  for (const item of cppCatalog) {
    result.push({
      id: item.id,
      language: "cpp",
      difficulty: item.diff,
      concepts: item.concepts,
      code: item.code,
      question: "What will be printed?",
      options: item.options,
      correctAnswer: item.ans,
      explanation: item.exp,
      runtime: "C++17 / C++20",
      hint: `Think about C++ semantics for ${item.concepts[0]}.`
    });
  }
  return result;
}
