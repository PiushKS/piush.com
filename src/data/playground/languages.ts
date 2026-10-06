// Code Playground Supported Languages & Runtime Configurations
export interface LanguageVersion {
  version: string;
  id: number; // Judge0 Language ID
  isDefault?: boolean;
}

export interface CodeExample {
  title: string;
  category: string;
  code: string;
  stdin?: string;
}

export interface PlaygroundLanguage {
  id: string;
  name: string;
  category: 'popular' | 'more';
  monacoLang: string;
  ext: string;
  versions: LanguageVersion[];
  starterCode: string;
  starterStdin?: string;
  supportsFormat?: boolean;
  examples: CodeExample[];
}

export const PLAYGROUND_LANGUAGES: PlaygroundLanguage[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'popular',
    monacoLang: 'javascript',
    ext: '.js',
    supportsFormat: true,
    versions: [
      { version: 'Node.js 22.08.0', id: 102, isDefault: true },
      { version: 'Node.js 20.17.0', id: 97 },
      { version: 'Node.js 18.15.0', id: 93 }
    ],
    starterCode: `// JavaScript (Node.js) Playground
console.log("Hello, World!");

// Quick computation demo
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled array:", doubled);
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `console.log("Hello, World!");\n`
      },
      {
        title: 'Array Transformations',
        category: 'Arrays',
        code: `const users = [\n  { name: 'Alice', age: 28, role: 'Lead Engineer' },\n  { name: 'Bob', age: 34, role: 'Product Architect' },\n  { name: 'Charlie', age: 24, role: 'Frontend Developer' }\n];\n\nconst engineers = users\n  .filter(u => u.role.includes('Engineer'))\n  .map(u => ({ name: u.name, seniority: u.age > 25 ? 'Senior' : 'Mid' }));\n\nconsole.log("Filtered Engineers:", JSON.stringify(engineers, null, 2));\n`
      },
      {
        title: 'Standard Input (stdin)',
        category: 'I/O',
        code: `// Reading line from stdin in Node.js\nconst fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst lines = input.split('\\n');\n\nconsole.log(\`Received \${lines.length} lines of input:\`);\nlines.forEach((line, idx) => {\n  console.log(\`Line \${idx + 1}: \${line}\`);\n});\n`,
        stdin: "Apple\nBanana\nCherry"
      },
      {
        title: 'Async / Await Flow',
        category: 'Async',
        code: `async function fetchMockStats() {\n  return new Promise(resolve => {\n    setTimeout(() => {\n      resolve({ uptime: '99.98%', requests: 1420500, p99_latency: '18ms' });\n    }, 50);\n  });\n}\n\nasync function main() {\n  console.log("Fetching telemetry stats...");\n  const stats = await fetchMockStats();\n  console.log("Telemetry Received:", stats);\n}\n\nmain();\n`
      }
    ]
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'popular',
    monacoLang: 'typescript',
    ext: '.ts',
    supportsFormat: true,
    versions: [
      { version: 'TypeScript 5.6.2', id: 101, isDefault: true },
      { version: 'TypeScript 5.0.3', id: 94 }
    ],
    starterCode: `// TypeScript Playground
interface Developer {
  name: string;
  languages: string[];
  activeYears: number;
}

const dev: Developer = {
  name: "Piush",
  languages: ["TypeScript", "Dart", "Rust", "Python"],
  activeYears: 7
};

function formatProfile(d: Developer): string {
  return \`\${d.name} has \${d.activeYears}+ years experience across \${d.languages.join(", ")}.\`;
}

console.log(formatProfile(dev));
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World & Types',
        category: 'Basics',
        code: `const greeting: string = "Hello, TypeScript!";\nconsole.log(greeting);\n`
      },
      {
        title: 'Generics & Result Type',
        category: 'Generics',
        code: `type Result<T, E = Error> = \n  | { ok: true; value: T }\n  | { ok: false; error: E };\n\nfunction divide(a: number, b: number): Result<number, string> {\n  if (b === 0) return { ok: false, error: "Division by zero" };\n  return { ok: true, value: a / b };\n}\n\nconsole.log(divide(10, 2));\nconsole.log(divide(10, 0));\n`
      }
    ]
  },
  {
    id: 'python',
    name: 'Python',
    category: 'popular',
    monacoLang: 'python',
    ext: '.py',
    supportsFormat: false,
    versions: [
      { version: 'Python 3.12.5', id: 100, isDefault: true },
      { version: 'Python 3.13.2', id: 109 },
      { version: 'Python 3.11.2', id: 92 },
      { version: 'Python 2.7.17', id: 70 }
    ],
    starterCode: `# Python Playground
print("Hello, World!")

# List comprehension & Dictionary demo
squares = {x: x**2 for x in range(1, 6)}
print("Squares dictionary:", squares)
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `print("Hello, World!")\n`
      },
      {
        title: 'Standard Input (stdin)',
        category: 'I/O',
        code: `import sys\n\n# Read all input from stdin\nlines = sys.stdin.read().splitlines()\nprint(f"Total lines received: {len(lines)}")\nfor i, line in enumerate(lines, 1):\n    print(f"  [{i}]: {line.upper()}")\n`,
        stdin: "hello\nworld\nfrom python"
      },
      {
        title: 'Fibonacci Generator',
        category: 'Functions',
        code: `def fibonacci(limit: int):\n    a, b = 0, 1\n    while a < limit:\n        yield a\n        a, b = b, a + b\n\nprint("Fibonacci numbers under 100:")\nprint(list(fibonacci(100)))\n`
      },
      {
        title: 'Dataclass & Sorting',
        category: 'Classes',
        code: `from dataclasses import dataclass\n\n@dataclass\nclass Product:\n    name: str\n    price: float\n    stock: int\n\ninventory = [\n    Product("Mechanical Keyboard", 129.99, 14),\n    Product("Ultra-wide Monitor", 449.50, 5),\n    Product("Ergonomic Mouse", 79.99, 22),\n]\n\nsorted_inventory = sorted(inventory, key=lambda p: p.price, reverse=True)\nfor p in sorted_inventory:\n    print(f"{p.name:25} \${p.price:6.2f} (Stock: {p.stock})")\n`
      }
    ]
  },
  {
    id: 'cpp',
    name: 'C++',
    category: 'popular',
    monacoLang: 'cpp',
    ext: '.cpp',
    supportsFormat: false,
    versions: [
      { version: 'GCC 14.1.0', id: 105, isDefault: true },
      { version: 'GCC 9.2.0', id: 54 },
      { version: 'Clang 7.0.1', id: 76 }
    ],
    starterCode: `#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::cout << "Hello, World!\\n";
    
    std::vector<int> nums = {10, 20, 30, 40, 50};
    int sum = std::accumulate(nums.begin(), nums.end(), 0);
    
    std::cout << "Sum of elements: " << sum << std::endl;
    return 0;
}
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!\\n";\n    return 0;\n}\n`
      },
      {
        title: 'Standard Input (cin / cout)',
        category: 'I/O',
        code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    if (cin >> a >> b) {\n        cout << "Inputs: " << a << " and " << b << endl;\n        cout << "Sum: " << (a + b) << endl;\n        cout << "Product: " << (a * b) << endl;\n    } else {\n        cout << "Please provide two integers in stdin." << endl;\n    }\n    return 0;\n}\n`,
        stdin: "15 25"
      },
      {
        title: 'Binary Search Algorithm',
        category: 'Algorithms',
        code: `#include <iostream>\n#include <vector>\n\nint binarySearch(const std::vector<int>& arr, int target) {\n    int left = 0, right = arr.size() - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target) return mid;\n        if (arr[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    std::vector<int> sorted = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};\n    int target = 23;\n    int index = binarySearch(sorted, target);\n    std::cout << "Found " << target << " at index " << index << std::endl;\n    return 0;\n}\n`
      }
    ]
  },
  {
    id: 'c',
    name: 'C',
    category: 'popular',
    monacoLang: 'c',
    ext: '.c',
    supportsFormat: false,
    versions: [
      { version: 'GCC 14.1.0', id: 103, isDefault: true },
      { version: 'Clang 19.1.7', id: 110 }
    ],
    starterCode: `#include <stdio.h>

int main(void) {
    printf("Hello, World!\\n");
    return 0;
}
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `#include <stdio.h>\n\nint main(void) {\n    printf("Hello, World!\\n");\n    return 0;\n}\n`
      },
      {
        title: 'Pointers & Dynamic Memory',
        category: 'Pointers',
        code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    int n = 5;\n    int *arr = (int *)malloc(n * sizeof(int));\n    if (!arr) return 1;\n\n    for (int i = 0; i < n; i++) {\n        arr[i] = (i + 1) * 10;\n        printf("arr[%d] = %d (addr: %p)\\n", i, arr[i], (void*)&arr[i]);\n    }\n\n    free(arr);\n    return 0;\n}\n`
      },
      {
        title: 'Input Reading with scanf',
        category: 'I/O',
        code: `#include <stdio.h>\n\nint main(void) {\n    int a, b;\n    if (scanf("%d %d", &a, &b) == 2) {\n        printf("Sum: %d\\n", a + b);\n    } else {\n        printf("Failed to read two numbers from stdin\\n");\n    }\n    return 0;\n}\n`,
        stdin: "40 2"
      }
    ]
  },
  {
    id: 'java',
    name: 'Java',
    category: 'popular',
    monacoLang: 'java',
    ext: '.java',
    supportsFormat: false,
    versions: [
      { version: 'JDK 17.0.6', id: 91, isDefault: true },
      { version: 'OpenJDK 13.0.1', id: 62 }
    ],
    starterCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        int a = 15;
        int b = 27;
        System.out.println("Result: " + (a + b));
    }
}
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n`
      },
      {
        title: 'Scanner Standard Input',
        category: 'I/O',
        code: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNextInt()) {\n            int n = scanner.nextInt();\n            System.out.println("Input received: " + n);\n            System.out.println("Square: " + (n * n));\n        } else {\n            System.out.println("No input found.");\n        }\n    }\n}\n`,
        stdin: "12"
      },
      {
        title: 'Streams & Filters',
        category: 'Streams',
        code: `import java.util.List;\nimport java.util.stream.Collectors;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> tech = List.of("Java", "Kotlin", "Swift", "Dart", "Rust");\n        List<String> filtered = tech.stream()\n            .filter(s -> s.length() <= 4)\n            .map(String::toUpperCase)\n            .collect(Collectors.toList());\n\n        System.out.println("Short names uppercase: " + filtered);\n    }\n}\n`
      }
    ]
  },
  {
    id: 'csharp',
    name: 'C#',
    category: 'popular',
    monacoLang: 'csharp',
    ext: '.cs',
    supportsFormat: false,
    versions: [
      { version: 'Mono 6.6.0.161', id: 51, isDefault: true }
    ],
    starterCode: `using System;
using System.Collections.Generic;
using System.Linq;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
        
        var numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        var evens = numbers.Where(n => n % 2 == 0).ToList();
        
        Console.WriteLine("Even numbers: " + string.Join(", ", evens));
    }
}
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}\n`
      },
      {
        title: 'Standard Input',
        category: 'I/O',
        code: `using System;\n\nclass Program {\n    static void Main() {\n        string line = Console.ReadLine();\n        Console.WriteLine("Echo from stdin: " + line);\n    }\n}\n`,
        stdin: "C# execution working!"
      }
    ]
  },
  {
    id: 'go',
    name: 'Go',
    category: 'popular',
    monacoLang: 'go',
    ext: '.go',
    supportsFormat: false,
    versions: [
      { version: 'Go 1.23.5', id: 107, isDefault: true },
      { version: 'Go 1.22.0', id: 106 },
      { version: 'Go 1.18.5', id: 95 }
    ],
    starterCode: `package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("Hello, World!")
	fmt.Printf("Current Unix Timestamp: %d\\n", time.Now().Unix())
}
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}\n`
      },
      {
        title: 'Goroutines & Channels',
        category: 'Concurrency',
        code: `package main\n\nimport (\n\t"fmt"\n\t"sync"\n)\n\nfunc worker(id int, ch chan<- string, wg *sync.WaitGroup) {\n\tdefer wg.Done()\n\tch <- fmt.Sprintf("Worker %d finished", id)\n}\n\nfunc main() {\n\tvar wg sync.WaitGroup\n\tch := make(chan string, 3)\n\n\tfor i := 1; i <= 3; i++ {\n\t\twg.Add(1)\n\t\tgo worker(i, ch, &wg)\n\t}\n\n\twg.Wait()\n\tclose(ch)\n\n\tfor msg := range ch {\n\t\tfmt.Println(msg)\n\t}\n}\n`
      },
      {
        title: 'Standard Input Scanning',
        category: 'I/O',
        code: `package main\n\nimport (\n\t"bufio"\n\t"fmt"\n\t"os"\n)\n\nfunc main() {\n\tscanner := bufio.NewScanner(os.Stdin)\n\tfor scanner.Scan() {\n\t\tfmt.Println("Input line:", scanner.Text())\n\t}\n}\n`,
        stdin: "Golang line 1\nGolang line 2"
      }
    ]
  },
  {
    id: 'rust',
    name: 'Rust',
    category: 'popular',
    monacoLang: 'rust',
    ext: '.rs',
    supportsFormat: false,
    versions: [
      { version: 'Rust 1.85.0', id: 108, isDefault: true },
      { version: 'Rust 1.40.0', id: 73 }
    ],
    starterCode: `fn main() {
    println!("Hello, World!");
    
    let numbers: Vec<i32> = (1..=5).collect();
    let product: i32 = numbers.iter().product();
    
    println!("Factorial of 5 is: {}", product);
}
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `fn main() {\n    println!("Hello, World!");\n}\n`
      },
      {
        title: 'Pattern Matching & Option',
        category: 'Pattern Matching',
        code: `enum WebhookEvent {\n    UserCreated { id: u64, email: String },\n    PaymentReceived { amount_cents: u64 },\n    ServerOffline,\n}\n\nfn handle_event(event: WebhookEvent) {\n    match event {\n        WebhookEvent::UserCreated { id, email } => {\n            println!("New user [{}]: {}", id, email);\n        }\n        WebhookEvent::PaymentReceived { amount_cents } => {\n            println!("Payment logged: \${:.2}", amount_cents as f64 / 100.0);\n        }\n        WebhookEvent::ServerOffline => println!("ALERT: Server went down!"),\n    }\n}\n\nfn main() {\n    handle_event(WebhookEvent::UserCreated {\n        id: 42,\n        email: "alice@example.com".to_string(),\n    });\n    handle_event(WebhookEvent::PaymentReceived { amount_cents: 4999 });\n}\n`
      },
      {
        title: 'Standard Input Reading',
        category: 'I/O',
        code: `use std::io::{self, BufRead};\n\nfn main() {\n    let stdin = io::stdin();\n    for line in stdin.lock().lines() {\n        match line {\n            Ok(content) => println!("Processed: {}", content.trim()),\n            Err(err) => eprintln!("Read error: {}", err),\n        }\n    }\n}\n`,
        stdin: "Rust memory safety\nZero-cost abstractions"
      }
    ]
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    category: 'popular',
    monacoLang: 'kotlin',
    ext: '.kt',
    supportsFormat: false,
    versions: [
      { version: 'Kotlin 2.1.10', id: 111, isDefault: true },
      { version: 'Kotlin 1.3.70', id: 78 }
    ],
    starterCode: `fun main() {
    println("Hello, World!")
    
    val frameworks = listOf("Jetpack Compose", "KMP", "Coroutines", "Ktor")
    frameworks.forEachIndexed { idx, name ->
        println("\${idx + 1}. \$name")
    }
}
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `fun main() {\n    println("Hello, World!")\n}\n`
      },
      {
        title: 'Data Class & Extensions',
        category: 'Classes',
        code: `data class Article(val title: String, val views: Int, val isDraft: Boolean)\n\nfun Article.isPopular(): Boolean = views > 1000 && !isDraft\n\nfun main() {\n    val post = Article("Android Performance Guide", 4520, false)\n    println("\${post.title} is popular: \${post.isPopular()}")\n}\n`
      }
    ]
  },
  {
    id: 'swift',
    name: 'Swift',
    category: 'popular',
    monacoLang: 'swift',
    ext: '.swift',
    supportsFormat: false,
    versions: [
      { version: 'Swift 5.2.3', id: 83, isDefault: true }
    ],
    starterCode: `import Foundation

print("Hello, World!")

let languages = ["Swift", "Objective-C", "Rust"]
let uppercase = languages.map { $0.uppercased() }
print("Upper: \\(uppercase)")
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `print("Hello, World!")\n`
      },
      {
        title: 'Structures & Protocols',
        category: 'OOP',
        code: `struct Vector2D {\n    var x: Double\n    var y: Double\n\n    var magnitude: Double {\n        return (x * x + y * y).squareRoot()\n    }\n}\n\nlet point = Vector2D(x: 3.0, y: 4.0)\nprint("Magnitude: \\(point.magnitude)")\n`
      }
    ]
  },
  {
    id: 'dart',
    name: 'Dart',
    category: 'popular',
    monacoLang: 'dart',
    ext: '.dart',
    supportsFormat: false,
    versions: [
      { version: 'Dart 2.19.2', id: 90, isDefault: true }
    ],
    starterCode: `void main() {
  print('Hello, World!');
  
  final items = <String>['Flutter', 'Dart', 'Web', 'Mobile'];
  final joined = items.map((e) => '• $e').join('\\n');
  print(joined);
}
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `void main() {\n  print('Hello, World!');\n}\n`
      },
      {
        title: 'Classes & Factory Constructors',
        category: 'Classes',
        code: `class AppConfig {\n  final String environment;\n  final int port;\n\n  AppConfig({required this.environment, required this.port});\n\n  factory AppConfig.production() => AppConfig(environment: 'prod', port: 443);\n\n  @override\n  String toString() => 'Config(\$environment:\$port)';\n}\n\nvoid main() {\n  final config = AppConfig.production();\n  print('Loaded: \$config');\n}\n`
      }
    ]
  },
  {
    id: 'php',
    name: 'PHP',
    category: 'more',
    monacoLang: 'php',
    ext: '.php',
    supportsFormat: false,
    versions: [
      { version: 'PHP 8.3.11', id: 98, isDefault: true },
      { version: 'PHP 7.4.1', id: 68 }
    ],
    starterCode: `<?php
echo "Hello, World!\n";

$data = [
    'framework' => 'Laravel',
    'language' => 'PHP 8.3',
    'ready' => true
];

echo json_encode($data, JSON_PRETTY_PRINT) . "\n";
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `<?php\necho "Hello, World!\\n";\n`
      }
    ]
  },
  {
    id: 'ruby',
    name: 'Ruby',
    category: 'more',
    monacoLang: 'ruby',
    ext: '.rb',
    supportsFormat: false,
    versions: [
      { version: 'Ruby 2.7.0', id: 72, isDefault: true }
    ],
    starterCode: `puts "Hello, World!"

# Enumerable methods
words = %w[apple banana cherry date]
longest = words.max_by(&:length)
puts "Longest word: #{longest}"
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `puts "Hello, World!"\n`
      }
    ]
  },
  {
    id: 'bash',
    name: 'Bash / Shell',
    category: 'more',
    monacoLang: 'shell',
    ext: '.sh',
    supportsFormat: false,
    versions: [
      { version: 'Bash 5.0.0', id: 46, isDefault: true }
    ],
    starterCode: `#!/bin/bash
echo "Hello, World!"

echo "Current Date: $(date)"
echo "Kernel: $(uname -s -m)"
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `#!/bin/bash\necho "Hello, World!"\n`
      },
      {
        title: 'Loop & Conditionals',
        category: 'Control Flow',
        code: `#!/bin/bash\nfor i in {1..5}; do\n  if [ $((i % 2)) -eq 0 ]; then\n    echo "$i is even"\n  else\n    echo "$i is odd"\n  fi\ndone\n`
      }
    ]
  },
  {
    id: 'lua',
    name: 'Lua',
    category: 'more',
    monacoLang: 'lua',
    ext: '.lua',
    supportsFormat: false,
    versions: [
      { version: 'Lua 5.3.5', id: 64, isDefault: true }
    ],
    starterCode: `print("Hello, World!")

-- Table manipulation
local person = { name = "Coder", skills = { "Lua", "GameDev", "Neovim" } }
for i, skill in ipairs(person.skills) do
    print(string.format("Skill %d: %s", i, skill))
end
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `print("Hello, World!")\n`
      }
    ]
  },
  {
    id: 'perl',
    name: 'Perl',
    category: 'more',
    monacoLang: 'perl',
    ext: '.pl',
    supportsFormat: false,
    versions: [
      { version: 'Perl 5.28.1', id: 85, isDefault: true }
    ],
    starterCode: `use strict;
use warnings;

print "Hello, World!\n";

my @langs = ('Perl', 'Python', 'Ruby');
print "Joined: " . join(", ", @langs) . "\n";
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `print "Hello, World!\n";\n`
      }
    ]
  },
  {
    id: 'r',
    name: 'R',
    category: 'more',
    monacoLang: 'r',
    ext: '.r',
    supportsFormat: false,
    versions: [
      { version: 'R 4.4.1', id: 99, isDefault: true },
      { version: 'R 4.0.0', id: 80 }
    ],
    starterCode: `cat("Hello, World!\n")

# Vector & Statistical operations
data <- c(12, 15, 18, 22, 35, 40)
cat("Mean:", mean(data), "\n")
cat("Standard Deviation:", sd(data), "\n")
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `cat("Hello, World!\n")\n`
      }
    ]
  },
  {
    id: 'scala',
    name: 'Scala',
    category: 'more',
    monacoLang: 'scala',
    ext: '.scala',
    supportsFormat: false,
    versions: [
      { version: 'Scala 3.4.2', id: 112, isDefault: true },
      { version: 'Scala 2.13.2', id: 81 }
    ],
    starterCode: `object Main extends App {
  println("Hello, World!")
  
  val numbers = List(1, 2, 3, 4, 5)
  val doubled = numbers.map(_ * 2)
  println(s"Doubled list: $doubled")
}
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `object Main extends App {\n  println("Hello, World!")\n}\n`
      }
    ]
  },
  {
    id: 'haskell',
    name: 'Haskell',
    category: 'more',
    monacoLang: 'haskell',
    ext: '.hs',
    supportsFormat: false,
    versions: [
      { version: 'GHC 8.8.1', id: 61, isDefault: true }
    ],
    starterCode: `main :: IO ()
main = do
    putStrLn "Hello, World!"
    let nums = [1..10]
    let evens = filter even nums
    putStrLn ("Evens: " ++ show evens)
`,
    starterStdin: '',
    examples: [
      {
        title: 'Hello World',
        category: 'Basics',
        code: `main :: IO ()\nmain = putStrLn "Hello, World!"\n`
      }
    ]
  },
  {
    id: 'sql',
    name: 'SQL (SQLite)',
    category: 'more',
    monacoLang: 'sql',
    ext: '.sql',
    supportsFormat: false,
    versions: [
      { version: 'SQLite 3.27.2', id: 82, isDefault: true }
    ],
    starterCode: `-- SQLite 3 Playground
CREATE TABLE developers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    favorite_lang TEXT NOT NULL,
    experience_years INTEGER
);

INSERT INTO developers (name, favorite_lang, experience_years) VALUES
('Piush', 'TypeScript', 7),
('Elena', 'Rust', 5),
('Marcus', 'Go', 6),
('Sophia', 'Python', 4);

SELECT name, favorite_lang, experience_years 
FROM developers 
ORDER BY experience_years DESC;
`,
    starterStdin: '',
    examples: [
      {
        title: 'Table & Queries',
        category: 'Basics',
        code: `CREATE TABLE test (id INT, val TEXT);\nINSERT INTO test VALUES (1, 'Alpha'), (2, 'Beta');\nSELECT * FROM test;\n`
      }
    ]
  }
];

export function getLanguageById(id: string): PlaygroundLanguage {
  const normalized = id.toLowerCase().trim();
  if (normalized === 'c++') return PLAYGROUND_LANGUAGES.find(l => l.id === 'cpp')!;
  if (normalized === 'c#') return PLAYGROUND_LANGUAGES.find(l => l.id === 'csharp')!;
  if (normalized === 'js') return PLAYGROUND_LANGUAGES.find(l => l.id === 'javascript')!;
  if (normalized === 'ts') return PLAYGROUND_LANGUAGES.find(l => l.id === 'typescript')!;
  if (normalized === 'py') return PLAYGROUND_LANGUAGES.find(l => l.id === 'python')!;
  if (normalized === 'sh') return PLAYGROUND_LANGUAGES.find(l => l.id === 'bash')!;
  if (normalized === 'shell') return PLAYGROUND_LANGUAGES.find(l => l.id === 'bash')!;
  
  const found = PLAYGROUND_LANGUAGES.find(l => l.id === normalized);
  return found || PLAYGROUND_LANGUAGES[0];
}
