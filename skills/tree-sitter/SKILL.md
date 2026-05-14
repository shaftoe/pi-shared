---
name: tree-sitter
description: Use the `tree-sitter` CLI to parse source files, query syntax trees, and explore codebases structurally. Use when you need to understand code structure, find patterns across files, extract symbols, or analyze syntax beyond what grep/regex can do. Ideal for tasks like "find all function definitions", "list all class methods", "find calls to X", or "show the AST of this file".
---

# Tree-sitter Code Exploration

Tree-sitter is a fast, incremental parser generator that builds concrete syntax trees (CST) for source code. The `tree-sitter` CLI lets you parse files, query syntax trees with structured patterns, and extract symbols — making it a powerful tool for codebase exploration that goes beyond text search.

> **When to use this skill:** Any time you need to understand code structure, find syntactic patterns, extract symbols, or analyze code in a language-aware way. Prefer `tree-sitter` over `grep`/`rg` when the query depends on code structure (e.g., "find all function parameters", "list method calls on X", "find unused imports").

## Setup

If parsers aren't configured yet, initialize the config:

```bash
tree-sitter init-config
# Then edit ~/.config/tree-sitter/config.json to add parser directories
# or install grammars via tree-sitter build
```

Check available languages:

```bash
tree-sitter dump-languages
```

## Core Commands

### 1. Parse — Generate a Syntax Tree

```bash
# Show the full CST (concrete syntax tree)
tree-sitter parse file.py

# Pretty-printed CST (more readable)
tree-sitter parse -c file.py

# XML output (machine-readable)
tree-sitter parse -x file.py

# Show parse statistics (errors, nodes)
tree-sitter parse -s file.py

# Time the parse
tree-sitter parse -t file.py

# Quiet mode — just check for errors (useful for validation)
tree-sitter parse -q file.py

# Parse multiple files
tree-sitter parse src/**/*.rs

# Force rebuild the parser
tree-sitter parse -r file.py

# Use a specific grammar path
tree-sitter parse -p /path/to/grammar/dir file.py
```

**Use cases:**
- Understand the structure of a file
- Find syntax errors (shown as `ERROR` or `MISSING` nodes)
- Discover node type names for writing queries
- Validate that files parse correctly

### 2. Query — Search with Structured Patterns

This is the most powerful command for codebase exploration. Queries use S-expression patterns to match nodes in the syntax tree.

```bash
# Run a query from a file against source files
tree-sitter query query.scm file.py

# Inline: pipe a query string (write to temp file first)
echo '(function_definition name: (identifier) @fn-name)' > /tmp/q.scm
tree-sitter query /tmp/q.scm file.py
```

#### Query Syntax (S-expressions)

**Basic patterns** — Match nodes by type:
```
; Match any binary_expression
(binary_expression)
```

**Named captures** — Bind nodes to names with `@name`:
```
; Capture function names
(function_definition name: (identifier) @fn-name)

; Capture class names
(class_definition name: (identifier) @class-name)
```

**Child matching** — Match specific children:
```
; Functions that contain a return statement
(function_definition body: (block (return_statement)))
```

**Alternation** — Match multiple node types with `[...]`:
```
; Match functions or methods
[
  (function_definition name: (identifier) @name)
  (method_declaration name: (identifier) @name)
]
```

**Wildcards** — `_` matches any single node, `...` matches any sequence:
```
; Function with any body
(function_definition name: (identifier) @fn-name body: (_))
```

**Anchoring** — `.` forces a child to be the first/last:
```
; Function whose first statement is a return
(function_definition body: (block . (return_statement)))
```

**Predicates** — Filter matches:
```
; Match function names containing "test"
(function_definition name: (identifier) @fn-name
  (#match? @fn-name "test"))

; Match names equal to a string
(function_definition name: (identifier) @fn-name
  (#eq? @fn-name "main"))

; Exclude nodes
(function_definition name: (identifier) @fn-name
  (#not-match? @fn-name "^_"))
```

#### Common Query Examples by Language

**Python:**
```scheme
; All function definitions
(function_definition name: (identifier) @fn-name) @fn

; All class definitions
(class_definition name: (identifier) @class-name) @class

; All imports
(import_statement name: (dotted_name) @import-name)
(import_from_statement module_name: (dotted_name) @module)

; All decorators
(decorator) @decorator

; Function calls
(call function: (identifier) @call-name)

; Method definitions
(function_definition name: (identifier) @method-name) @method
```

**JavaScript/TypeScript:**
```scheme
; Function declarations
(function_declaration name: (identifier) @fn-name) @fn

; Arrow functions assigned to variables
(variable_declarator name: (identifier) @var-name
  value: (arrow_function)) @arrow-fn

; Class declarations
(class_declaration name: (identifier) @class-name) @class

; Method definitions
(method_definition name: (property_identifier) @method-name) @method

; Import statements
(import_statement (import_clause) @imports)
```

**Rust:**
```scheme
; Function definitions
(function_item name: (identifier) @fn-name) @fn

; Struct definitions
(struct_item name: (type_identifier) @struct-name) @struct

; Impl blocks
(impl_item type: (type_identifier) @impl-type) @impl

; Enum definitions
(enum_item name: (type_identifier) @enum-name) @enum

; use statements
(use_declaration (scoped_identifier) @use-path)
```

**Go:**
```scheme
; Function declarations
(function_declaration name: (identifier) @fn-name) @fn

; Method declarations
(method_declaration name: (field_identifier) @method-name) @method

; Type declarations
(type_declaration (type_spec name: (type_identifier) @type-name)) @type

; Interface declarations
(interface_declaration name: (type_identifier) @iface-name) @iface
```

### 3. Highlight — Syntax-Aware Highlighting

```bash
# Highlight a file (terminal output)
tree-sitter highlight file.py

# Generate HTML with syntax highlighting
tree-sitter highlight -H file.py > highlighted.html

# Use CSS classes instead of inline styles
tree-sitter highlight -H --css-classes file.py > highlighted.html
```

### 4. Tags — Extract Symbols

```bash
# Extract tags (functions, classes, etc.) from files
tree-sitter tags file.py
```

Useful for generating symbol lists and code navigation.

## Workflow: Exploring a New Codebase

### Step 1: Parse key files to understand structure

```bash
# Get a quick view of the syntax tree
tree-sitter parse -c src/main.py

# Check for parse errors across the project
tree-sitter parse -s -q src/**/*.py
```

### Step 2: Extract all symbols

```bash
# List all functions
echo '(function_definition name: (identifier) @name)' > /tmp/functions.scm
tree-sitter query /tmp/functions.scm src/**/*.py

# List all classes with methods
echo '(class_definition name: (identifier) @class body: (block (function_definition name: (identifier) @method)))' > /tmp/classes.scm
tree-sitter query /tmp/classes.scm src/**/*.py
```

### Step 3: Find patterns and relationships

```bash
# Find all TODO/FIXME comments
echo '(comment) @comment' > /tmp/comments.scm
tree-sitter query /tmp/comments.scm src/**/*.py | grep -i 'todo\|fixme'

# Find function calls to a specific function
echo '(call function: (identifier) @name (#eq? @name "process_data"))' > /tmp/calls.scm
tree-sitter query /tmp/calls.scm src/**/*.py

# Find functions with many parameters (code smell detection)
echo '(function_definition parameters: (parameters (identifier)* @param))' > /tmp/params.scm
tree-sitter query /tmp/params.scm src/**/*.py
```

## Tips

- **Discover node types first:** Run `tree-sitter parse -c file.ext` to see all node types, then write queries against them.
- **Queries live in `.scm` files:** The convention is to write queries in files with a `.scm` extension (Scheme-like).
- **Combine with shell tools:** Pipe `tree-sitter query` output into `grep`, `sort`, `uniq`, `wc`, `jq` for further analysis.
- **Handle errors gracefully:** Tree-sitter parses even broken code. Look for `ERROR` and `MISSING` nodes to find syntax issues.
- **Multiple languages:** Use `--scope` to force a specific language when file extensions are ambiguous:
  ```bash
  tree-sitter parse --scope source.tsx component.jsx
  tree-sitter query --scope source.tsx query.scm component.jsx
  ```
- **Performance:** Tree-sitter is extremely fast. Don't hesitate to parse entire codebases:
  ```bash
  tree-sitter parse -q -s $(find . -name '*.py') 2>&1 | grep -c ERROR
  ```

## Decision Guide

| Task | Command |
|------|---------|
| View the AST of a file | `tree-sitter parse -c file` |
| Check for syntax errors | `tree-sitter parse -s -q file` |
| Find all function/class definitions | `tree-sitter query` with `(function_definition name: (identifier) @name)` |
| Find all calls to function X | `tree-sitter query` with `(call function: (identifier) @name (#eq? @name "X"))` |
| Extract imports | `tree-sitter query` with `(import_statement ...)` |
| Find patterns across a codebase | `tree-sitter query query.scm **/*.ext` |
| Generate syntax-highlighted HTML | `tree-sitter highlight -H file` |
| Extract tags/symbols | `tree-sitter tags file` |
| Discover available node types | `tree-sitter parse -c file` then read the tree |

## Reference

- **CLI version:** 0.26.8
- **Docs:** https://tree-sitter.github.io/tree-sitter/
- **Query syntax:** https://tree-sitter.github.io/tree-sitter/using-parsers/queries/1-syntax.html
- **Available parsers:** https://github.com/tree-sitter/tree-sitter/wiki/List-of-parsers
