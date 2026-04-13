# TypeScript with React

## Section 3: Using TypeScript with React - Essentials

---

## 26. Module Introduction

**What is this:** An overview of what this section covers — integrating TypeScript into React projects for type-safe component development.

**Description:** This module introduces the core concepts of using TypeScript alongside React. It sets expectations for how TypeScript enhances React development by catching type errors at compile time, improving IDE support, and making component interfaces explicit.

**Examples:**

```tsx
// Example 1: Why TypeScript helps in React
// Without TypeScript, this passes silently but breaks at runtime
function Greeting({ name }) {
  return <h1>Hello, {name.toUpperCase()}</h1>;
}
<Greeting />; // no error at compile time, but crashes

// With TypeScript — caught immediately
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name.toUpperCase()}</h1>;
}
<Greeting />; // Error: Property 'name' is missing
```

```tsx
// Example 2: TypeScript gives autocomplete and safety
type ButtonProps = {
  label: string;
  onClick: () => void;
};

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
// IDE knows exactly what props Button accepts
```

---

## 27. Creating a React + TypeScript Project

**What is this:** The process of scaffolding a new React project that is configured with TypeScript out of the box.

**Description:** Using Vite or Create React App (CRA) you can generate a React project pre-configured with TypeScript. This gives you `.tsx` files, a `tsconfig.json`, and the necessary type packages installed automatically.

**Examples:**

```bash
# Example 1: Create with Vite (recommended)
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
```

```bash
# Example 2: Create with Create React App
npx create-react-app my-app --template typescript
cd my-app
npm start
```

---

## 28. Understanding the Role of tsconfig.json

**What is this:** The TypeScript configuration file that controls how TypeScript compiles your code.

**Description:** `tsconfig.json` sits at the root of your project and defines compiler options such as target JS version, strict mode, module resolution, and JSX handling. In a React + TypeScript project, understanding key options like `"jsx": "react-jsx"` and `"strict": true` is essential.

**Examples:**

```json
// Example 1: Typical tsconfig.json for a Vite React project
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"]
}
```

```json
// Example 2: Enabling path aliases via tsconfig
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
// Now you can import like: import Button from '@components/Button'
```

---

## 29. Building a First Component & Facing a Missing Type

**What is this:** Writing your first React component in TypeScript and encountering the common "missing type" error when props are not annotated.

**Description:** When you write a React component and try to use props without type annotations, TypeScript will throw an error because it cannot infer the shape of the props object. This is the first hands-on encounter with typing in React components.

**Examples:**

```tsx
// Example 1: The error — props implicitly have type 'any'
function Welcome({ name }) {
  // Error: Parameter 'name' implicitly has an 'any' type
  return <h2>Welcome, {name}</h2>;
}

// Fixed by annotating inline
function Welcome({ name }: { name: string }) {
  return <h2>Welcome, {name}</h2>;
}
```

```tsx
// Example 2: Component with multiple untyped props causing multiple errors
function UserCard({ name, age, email }) {
  // all implicitly 'any'
  return (
    <div>
      {name} - {age} - {email}
    </div>
  );
}

// Fixed
function UserCard({
  name,
  age,
  email,
}: {
  name: string;
  age: number;
  email: string;
}) {
  return (
    <div>
      {name} - {age} - {email}
    </div>
  );
}
```

---

## 30. Defining Component Props Types

**What is this:** Explicitly defining the types for a component's props using TypeScript type annotations.

**Description:** To make components type-safe, you annotate props either inline or using a separate `type` or `interface`. TypeScript will then enforce that all required props are provided with the correct types when the component is used.

**Examples:**

```tsx
// Example 1: Inline type annotation
function Product({ name, price }: { name: string; price: number }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>${price.toFixed(2)}</p>
    </div>
  );
}
```

```tsx
// Example 2: Optional props with '?'
function Avatar({ src, alt, size }: { src: string; alt: string; size?: number }) {
  return <img src={src} alt={alt} width={size ?? 50} />;
}

<Avatar src="/photo.png" alt="User" />           // valid — size is optional
<Avatar src="/photo.png" alt="User" size={100} /> // also valid
```

---

## 31. Storing Props Types as a Custom Type or Interface

**What is this:** Extracting props type definitions into a named `type` alias or `interface` for better reusability and readability.

**Description:** Instead of writing inline type annotations, you can define a `type` or `interface` separately and reference it in the component. Both work for props, but `type` is generally preferred for component props in React projects. Extracting types makes them reusable across multiple components.

**Examples:**

```tsx
// Example 1: Using 'type' alias
type ButtonProps = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
};

function Button({ label, disabled, onClick }: ButtonProps) {
  return (
    <button disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}
```

```tsx
// Example 2: Using 'interface'
interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
}

function Card({ title, description, imageUrl }: CardProps) {
  return (
    <div>
      {imageUrl && <img src={imageUrl} alt={title} />}
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
```

---

## 32. Defining a Type for Props with "children"

**What is this:** Typing the special `children` prop that React components receive when they wrap other elements.

**Description:** When a component accepts nested JSX as content, it receives a `children` prop. In TypeScript, this must be explicitly typed. The correct type for `children` is `React.ReactNode`, which covers strings, numbers, JSX elements, arrays, and `null`.

**Examples:**

```tsx
// Example 1: Typing children with React.ReactNode
import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
};

function Container({ children }: ContainerProps) {
  return <div className="container">{children}</div>;
}

<Container>
  <p>Any JSX content here</p>
</Container>;
```

```tsx
// Example 2: Component with children + additional props
import { ReactNode } from "react";

type SectionProps = {
  title: string;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

<Section title="About">
  <p>Some text</p>
  <img src="/img.png" alt="about" />
</Section>;
```

---

## 33. Component Props & The Special "key" Prop

**What is this:** Understanding that the `key` prop is a React-internal prop and cannot be included in your custom props type definition.

**Description:** React uses `key` internally to identify list items and manage reconciliation. You cannot define `key` in your props type or access it inside a component — TypeScript will raise an error if you try. `key` is always passed externally by React itself.

**Examples:**

```tsx
// Example 1: 'key' is NOT part of props — it's React-internal
type ItemProps = {
  id: number;
  label: string;
  // key: string; // ❌ Do NOT add key here — it's reserved
};

function Item({ id, label }: ItemProps) {
  return <li>{label}</li>;
}

const items = [
  { id: 1, label: "Apple" },
  { id: 2, label: "Banana" },
];

<ul>
  {items.map((item) => (
    <Item key={item.id} id={item.id} label={item.label} />
  ))}
</ul>;
```

```tsx
// Example 2: Attempting to read 'key' inside a component fails
type CardProps = {
  title: string;
};

function Card({ title }: CardProps) {
  // console.log(key); // ❌ 'key' is not accessible inside the component
  return <div>{title}</div>;
}
// 'key' is only used by React's reconciler — pass a separate 'id' prop if needed inside
```

---

## 34. Another Way Of Typing Components

**What is this:** Using `React.FC` (Function Component) type to annotate a component, as an alternative to inline prop typing.

**Description:** `React.FC<Props>` (or `React.FunctionComponent<Props>`) is a generic type that explicitly marks a function as a React functional component. While it was more popular in older React/TypeScript codebases, it is now less recommended because it adds implicit complexity. Understanding both patterns is important.

**Examples:**

```tsx
// Example 1: Using React.FC
import React from "react";

type GreetingProps = {
  name: string;
};

const Greeting: React.FC<GreetingProps> = ({ name }) => {
  return <h1>Hello, {name}</h1>;
};
```

```tsx
// Example 2: Preferred modern approach (no React.FC)
type GreetingProps = {
  name: string;
};

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}</h1>;
}
// Cleaner, explicit, and avoids implicit 'children' injection from React.FC
```

---

## 35. Exercise: Creating a Header Component

**What is this:** A hands-on exercise to build a typed `Header` component from scratch using what was learned about props types.

**Description:** The goal is to create a `Header` component that accepts typed props (e.g., `title` and optional `subtitle`), define its props using a `type` or `interface`, and render it correctly. This exercise consolidates the fundamentals of component typing.

**Examples:**

```tsx
// Example 1: Basic Header component with typed props
type HeaderProps = {
  title: string;
  subtitle?: string;
};

function Header({ title, subtitle }: HeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}

<Header title="My App" />
<Header title="My App" subtitle="Welcome back!" />
```

```tsx
// Example 2: Header with navigation links
type NavLink = {
  label: string;
  href: string;
};

type HeaderProps = {
  title: string;
  links: NavLink[];
};

function Header({ title, links }: HeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
      <nav>
        {links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
```

---

## 36. Using useState() and TypeScript

**What is this:** Typing React's `useState` hook so TypeScript knows the shape of your state value.

**Description:** TypeScript can often infer the type of `useState` from the initial value. However, when the initial value is `null`, `undefined`, or a complex object, you must explicitly provide a generic type argument so TypeScript understands what the state can hold.

**Examples:**

```tsx
// Example 1: Inferred type — TypeScript infers string from initial value
const [name, setName] = useState("");
// setName(42); // ❌ Error: Argument of type 'number' is not assignable to type 'string'
```

```tsx
// Example 2: Explicit generic when initial value is null
type User = {
  id: number;
  name: string;
};

const [user, setUser] = useState<User | null>(null);

// Later:
setUser({ id: 1, name: "Alice" }); // ✅
setUser(null); // ✅
setUser({ id: 2 }); // ❌ Error: 'name' is missing
```

---

## 37. Working with State & Outputting State-based Values

**What is this:** Using typed state values safely in JSX and handling cases where state might be `null` or `undefined`.

**Description:** When state holds complex or nullable types, TypeScript forces you to handle edge cases before accessing properties. This prevents runtime errors like "Cannot read property of null". You use optional chaining, conditional rendering, or type narrowing to safely output state-based values.

**Examples:**

```tsx
// Example 1: Conditional rendering with nullable state
type Product = { name: string; price: number };

const [product, setProduct] = useState<Product | null>(null);

return (
  <div>
    {product ? (
      <p>
        {product.name} — ${product.price}
      </p>
    ) : (
      <p>No product selected</p>
    )}
  </div>
);
```

```tsx
// Example 2: Outputting a list from state
type Task = { id: number; text: string; done: boolean };

const [tasks, setTasks] = useState<Task[]>([]);

return (
  <ul>
    {tasks.map((task) => (
      <li
        key={task.id}
        style={{ textDecoration: task.done ? "line-through" : "none" }}
      >
        {task.text}
      </li>
    ))}
  </ul>
);
```

---

## 38. Another Exercise & Reusing Types Across Files

**What is this:** A practice exercise that also introduces the pattern of defining shared types in a separate file and importing them where needed.

**Description:** As a project grows, repeating the same type definitions across files leads to inconsistency. The solution is to define shared types in a dedicated file (e.g., `types.ts`) and import them wherever they are needed, following the DRY principle.

**Examples:**

```ts
// Example 1: types.ts — centralized type definitions
export type User = {
  id: number;
  name: string;
  email: string;
};

export type Post = {
  id: number;
  title: string;
  authorId: number;
};
```

```tsx
// Example 2: Importing and reusing types in components
import { User } from "./types";

type UserCardProps = {
  user: User;
};

function UserCard({ user }: UserCardProps) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}
```

---

## 39. Passing Functions as Values - In A Type-Safe Way

**What is this:** Typing props that are functions (callbacks) so that the function signature is enforced at the call site.

**Description:** React components often receive functions as props (e.g., event handlers, callbacks). In TypeScript, you must define the exact signature of these function props — including parameter types and return type — to prevent misuse and get proper type checking.

**Examples:**

```tsx
// Example 1: Typing a simple callback prop
type ButtonProps = {
  label: string;
  onClick: () => void;
};

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

<Button label="Submit" onClick={() => console.log('clicked')} /> // ✅
<Button label="Submit" onClick={(e) => console.log(e)} />       // ❌ wrong signature
```

```tsx
// Example 2: Typing a callback that receives a value
type InputProps = {
  value: string;
  onChange: (newValue: string) => void;
};

function Input({ value, onChange }: InputProps) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}

<Input value={text} onChange={(val) => setText(val)} />;
```

---

## 40. Handling & Typing Events

**What is this:** Properly typing event handler functions in React using TypeScript's built-in React event types.

**Description:** React wraps native DOM events in its own `SyntheticEvent` system. TypeScript provides specific types for each event kind (e.g., `React.MouseEvent`, `React.ChangeEvent`, `React.FormEvent`). Using the correct event type gives you access to accurate event properties with full type safety.

**Examples:**

```tsx
// Example 1: Typing a click event handler
function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
  console.log(event.currentTarget.textContent);
}

<button onClick={handleClick}>Click me</button>;
```

```tsx
// Example 2: Typing a form submit and input change event
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  // process form
}

function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
  console.log(event.target.value);
}

<form onSubmit={handleSubmit}>
  <input type="text" onChange={handleChange} />
  <button type="submit">Submit</button>
</form>;
```

---

## 41. Working with Generic Event Types

**What is this:** Understanding how React event types are generic and how to specify which HTML element they target.

**Description:** React event types like `React.ChangeEvent<T>` and `React.MouseEvent<T>` accept a generic type parameter for the HTML element. This allows TypeScript to know the exact shape of `event.target` and `event.currentTarget`, giving you access to element-specific properties like `value`, `checked`, or `files`.

**Examples:**

```tsx
// Example 1: ChangeEvent on an input vs a select
const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value); // string — input's value
  console.log(e.target.checked); // boolean — works for checkboxes
};

const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  console.log(e.target.value); // selected option's value
};
```

```tsx
// Example 2: MouseEvent on different elements
const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget.disabled); // boolean — button-specific property
};

const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
  console.log(e.clientX, e.clientY); // mouse position
};
```

---

## 42. Using useRef() with TypeScript

**What is this:** Typing React's `useRef` hook to safely reference DOM elements or store mutable values without causing re-renders.

**Description:** `useRef` can hold a reference to a DOM element or an arbitrary mutable value. In TypeScript, you provide a generic type to `useRef<T>` to tell it what kind of value or element it will hold. For DOM refs, you initialize with `null` and TypeScript ensures you check for `null` before accessing the ref's value.

**Examples:**

```tsx
// Example 1: Ref to a DOM input element
import { useRef } from "react";

function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus(); // safe access with optional chaining
  };

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}
```

```tsx
// Example 2: Ref for storing a mutable value (no re-render)
import { useRef } from "react";

function Timer() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    intervalRef.current = setInterval(() => console.log("tick"), 1000);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

---

## 43. Handling User Input In A Type-Safe Way

**What is this:** Combining event typing, state typing, and validation to process user input safely from start to finish.

**Description:** Handling user input type-safely means: typing the event correctly to extract `value`, updating typed state, and validating the input shape before use. This end-to-end approach prevents runtime crashes and gives full IDE support throughout the input pipeline.

**Examples:**

```tsx
// Example 1: Controlled input with typed state and event
import { useState } from "react";

function NameForm() {
  const [name, setName] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted:", name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

```tsx
// Example 2: useRef to read input value on submit (uncontrolled)
import { useRef } from "react";

function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value ?? "";
    const password = passwordRef.current?.value ?? "";
    console.log({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={emailRef} type="email" placeholder="Email" />
      <input ref={passwordRef} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
```

---

## 44. Summary

**What is this:** A recap of all the key TypeScript + React concepts covered in this section.

**Description:** This section walked through the essentials of using TypeScript with React — from project setup and `tsconfig.json`, to typing props, children, events, state, refs, and function callbacks. The core takeaway is that TypeScript makes your React components self-documenting, catches bugs at compile time, and improves the development experience through IDE autocomplete and type inference.

**Examples:**

```tsx
// Example 1: A fully typed component combining multiple concepts
import { useState, useRef } from "react";

type Todo = {
  id: number;
  text: string;
};

type TodoListProps = {
  onAdd: (text: string) => void;
};

function TodoInput({ onAdd }: TodoListProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = inputRef.current?.value.trim() ?? "";
    if (value) {
      onAdd(value);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} type="text" placeholder="New todo" />
      <button type="submit">Add</button>
    </form>
  );
}
```

```tsx
// Example 2: Parent managing typed state and passing callbacks
function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    setTodos((prev) => [...prev, { id: Date.now(), text }]);
  };

  return (
    <div>
      <TodoInput onAdd={addTodo} />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
```

---
