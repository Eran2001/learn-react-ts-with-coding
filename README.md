# TypeScript with React

# Section 3: Using TypeScript with React - Essentials

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

---

# Section 4: Advanced Component Types - Dynamic Components, Polymorphic

---

## 45. Module Introduction

**What is this:** An overview of advanced component typing patterns covered in this section — dynamic, flexible, wrapper, and polymorphic components.

**Description:** This module builds on the essentials and dives into more sophisticated TypeScript + React patterns. You'll learn how to build components that are flexible in what props they accept, wrap native HTML elements while preserving their built-in props, and create fully polymorphic components that can render as any HTML tag.

**Example:**

```tsx
// A preview of what's ahead — a polymorphic Button that renders as any tag
type PolymorphicButtonProps<T extends React.ElementType> = {
  as?: T;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

function Button<T extends React.ElementType = 'button'>({
  as,
  children,
  ...rest
}: PolymorphicButtonProps<T>) {
  const Tag = as ?? 'button';
  return <Tag {...rest}>{children}</Tag>;
}

<Button>Click</Button>
<Button as="a" href="/home">Go</Button>
```

---

## 46. Building a More Dynamic & Flexible Component

**What is this:** Designing a component whose behavior and output vary based on the combination of props it receives.

**Description:** A dynamic component uses union types or conditional logic to accept different sets of props and render different outputs accordingly. This pattern avoids creating multiple near-identical components by consolidating flexibility into one typed component.

**Example:**

```tsx
type AlertProps =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string; retry?: () => void };

function Alert(props: AlertProps) {
  if (props.type === 'error') {
    return (
      <div style={{ color: 'red' }}>
        {props.message}
        {props.retry && <button onClick={props.retry}>Retry</button>}
      </div>
    );
  }
  return <div style={{ color: 'green' }}>{props.message}</div>;
}

<Alert type="success" message="Saved!" />
<Alert type="error" message="Failed" retry={() => refetch()} />
```

---

## 47. Problem: Flexible Components With Required Prop Combinations

**What is this:** The challenge that arises when certain props are only valid or required together, and how plain optional props fail to enforce these rules.

**Description:** When a component has props that depend on each other (e.g., `label` is required only when `showLabel` is true), using all-optional props allows invalid combinations silently. TypeScript's type system needs discriminated unions to properly enforce mutually exclusive or co-required prop sets.

**Example:**

```tsx
// ❌ Problem: both modes accept the same props — no enforcement
type BadProps = {
  mode: 'text' | 'icon';
  label?: string; // should be required for 'text' but optional for 'icon'
  icon?: string;  // should be required for 'icon' but irrelevant for 'text'
};

// TypeScript allows invalid combinations with no error:
<BadComponent mode="text" />           // missing label — but no error
<BadComponent mode="icon" label="x" /> // label makes no sense for icon mode
```

---

## 48. Solution: Building Components with Discriminated Unions

**What is this:** Using TypeScript discriminated unions to enforce that only valid prop combinations are accepted by a component.

**Description:** A discriminated union is a union of object types that each have a common literal property (the "discriminant"). TypeScript uses this to narrow the type and enforce which other props are required or available. This eliminates invalid prop combinations at compile time.

**Example:**

```tsx
type TextModeProps = { mode: 'text'; label: string };
type IconModeProps = { mode: 'icon'; icon: string; ariaLabel: string };

type BadgeProps = TextModeProps | IconModeProps;

function Badge(props: BadgeProps) {
  if (props.mode === 'text') {
    return <span>{props.label}</span>;
  }
  return <img src={props.icon} aria-label={props.ariaLabel} />;
}

<Badge mode="text" label="Admin" />
<Badge mode="icon" icon="/star.svg" ariaLabel="Star" />
// <Badge mode="text" /> ❌ Error: 'label' is required
```

---

## 49. Onwards To A New Project

**What is this:** A transition point where you move to a fresh project to apply advanced component patterns from scratch.

**Description:** Starting a new project resets context and lets you practice building advanced typed components without legacy constraints. This is a chance to apply discriminated unions, wrapper components, and polymorphic patterns in a clean environment.

**Example:**

```bash
# Scaffold a new Vite + React + TypeScript project
npm create vite@latest advanced-components -- --template react-ts
cd advanced-components
npm install
npm run dev
```

---

## 50. Building a Basic Wrapper Component

**What is this:** A component that wraps an existing HTML element and passes through props while adding its own behavior or styling.

**Description:** A wrapper component enhances a native element (e.g., `<input>`, `<button>`) by adding custom styles or logic while still accepting and forwarding all standard HTML props. The key is extending the native element's props type using `React.ComponentPropsWithoutRef<'element'>`.

**Example:**

```tsx
type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  label: string;
};

function Input({ label, ...rest }: InputProps) {
  return (
    <div>
      <label>{label}</label>
      <input {...rest} />
    </div>
  );
}

<Input label="Email" type="email" placeholder="you@example.com" required />;
```

---

## 51. Building Better Wrapper Components with ComponentPropsWithoutRef

**What is this:** Using `React.ComponentPropsWithoutRef<T>` to precisely type a wrapper component so it inherits all native props of the wrapped element without including `ref`.

**Description:** `ComponentPropsWithoutRef<'input'>` gives you the full set of props for an `<input>` element, excluding `ref` (which needs special handling via `forwardRef`). This is the correct base type when building wrapper components that don't yet need to forward refs.

**Example:**

```tsx
type ButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  variant?: 'primary' | 'secondary';
};

function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} ${className ?? ''}`}
      {...rest}
    />
  );
}

<Button onClick={() => alert('hi')}>Save</Button>
<Button variant="secondary" disabled>Cancel</Button>
```

---

## 52. Building a Wrapper Component That Renders Different Elements

**What is this:** A wrapper component that can render as different HTML elements based on a prop, while correctly typing the available props for each element.

**Description:** By accepting an `as` prop, a single wrapper component can render as `<button>`, `<a>`, `<div>`, etc. The challenge is ensuring the correct HTML attributes are available for each tag. This requires generics and `React.ComponentPropsWithoutRef<T>` to stay type-safe.

**Example:**

```tsx
type FlexibleProps<T extends React.ElementType> = {
  as?: T;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

function Flexible<T extends React.ElementType = 'div'>({
  as,
  children,
  ...rest
}: FlexibleProps<T>) {
  const Tag = as ?? 'div';
  return <Tag {...rest}>{children}</Tag>;
}

<Flexible>Just a div</Flexible>
<Flexible as="section" id="main">Section content</Flexible>
<Flexible as="a" href="/about">Link</Flexible>
```

---

## 53. Working with Type Predicates & Facing TypeScript Limitations

**What is this:** Using custom type predicate functions to narrow union types, and understanding cases where TypeScript's inference falls short.

**Description:** A type predicate (`value is SomeType`) is a return type annotation on a function that tells TypeScript: "if this returns true, the argument is of this type." This is useful when narrowing complex union types that TypeScript can't narrow automatically. However, TypeScript has limitations — it won't always infer narrowed types across complex logic.

**Example:**

```tsx
type Circle = { kind: "circle"; radius: number };
type Square = { kind: "square"; side: number };
type Shape = Circle | Square;

function isCircle(shape: Shape): shape is Circle {
  return shape.kind === "circle";
}

function getArea(shape: Shape): number {
  if (isCircle(shape)) {
    return Math.PI * shape.radius ** 2; // TypeScript knows shape is Circle here
  }
  return shape.side ** 2;
}
```

---

## 54. Building a Basic Polymorphic Component

**What is this:** A component that renders as any HTML tag specified via an `as` prop, while maintaining type safety for the chosen element's attributes.

**Description:** A polymorphic component is the flexible pattern taken to its logical conclusion — a single component that can become any HTML element. The simplest version accepts an `as` prop with a default element type and spreads the appropriate props, though without full generic typing yet.

**Example:**

```tsx
type PolymorphicProps = {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
};

function Box({ as: Tag = 'div', children, className }: PolymorphicProps) {
  return <Tag className={className}>{children}</Tag>;
}

<Box>Default div</Box>
<Box as="main" className="layout">Main content</Box>
<Box as="p">A paragraph</Box>
```

---

## 55. Building a Better Polymorphic Component with Generics

**What is this:** Upgrading the polymorphic component with TypeScript generics so that element-specific props (like `href` for `<a>`) are properly enforced.

**Description:** The basic polymorphic component loses type safety for element-specific props. By using a generic `T extends React.ElementType`, combined with `React.ComponentPropsWithoutRef<T>`, TypeScript knows exactly which props are valid for the chosen element.

**Example:**

```tsx
type PolymorphicProps<T extends React.ElementType> = {
  as?: T;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as'>;

function Box<T extends React.ElementType = 'div'>({
  as,
  children,
  ...rest
}: PolymorphicProps<T>) {
  const Tag = (as ?? 'div') as React.ElementType;
  return <Tag {...rest}>{children}</Tag>;
}

<Box>A div</Box>
<Box as="a" href="/home">Link — href is valid here</Box>
// <Box as="div" href="/x" /> ❌ Error: div doesn't accept href
```

---

## 56. Examples: More Component Ideas

**What is this:** A collection of additional component patterns that apply the polymorphic and wrapper techniques from this section.

**Description:** This topic explores more real-world component ideas using the patterns learned — typed card components, layout wrappers, and reusable text components. The goal is to reinforce how these patterns apply across different UI building blocks.

**Example:**

```tsx
type TextProps<T extends React.ElementType = 'p'> = {
  as?: T;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as'>;

function Text<T extends React.ElementType = 'p'>({
  as,
  size = 'md',
  children,
  ...rest
}: TextProps<T>) {
  const Tag = (as ?? 'p') as React.ElementType;
  return <Tag className={`text-${size}`} {...rest}>{children}</Tag>;
}

<Text>Regular paragraph</Text>
<Text as="h1" size="lg">Page Title</Text>
<Text as="h3" size="sm">Subheading</Text>
```

---

## 57. Using forwardRef with TypeScript

**What is this:** Typing React's `forwardRef` to allow parent components to attach a ref directly to a DOM element inside a wrapper component.

**Description:** By default, functional components don't forward refs to their internal DOM nodes. `React.forwardRef` enables this, and TypeScript requires you to annotate both the ref type (the DOM element) and the props type as generic arguments: `forwardRef<RefType, PropsType>`.

**Example:**

```tsx
import { forwardRef, useRef } from "react";

type InputProps = React.ComponentPropsWithoutRef<"input"> & {
  label: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, ...rest }, ref) => (
    <div>
      <label>{label}</label>
      <input ref={ref} {...rest} />
    </div>
  ),
);

function Form() {
  const inputRef = useRef<HTMLInputElement>(null);
  return <Input ref={inputRef} label="Name" />;
}
```

---

## 58. Building Another Wrapper Component (Custom Form Component)

**What is this:** Applying wrapper component patterns to build a reusable, typed custom form component.

**Description:** A custom form wrapper extends native `<form>` props via `ComponentPropsWithoutRef<'form'>` and can add validation logic, submission handling, or layout structure while keeping all standard form attributes available to the consumer.

**Example:**

```tsx
type FormProps = React.ComponentPropsWithoutRef<"form"> & {
  onSubmitValues: (data: FormData) => void;
};

function Form({ onSubmitValues, children, ...rest }: FormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    onSubmitValues(data);
  };

  return (
    <form onSubmit={handleSubmit} {...rest}>
      {children}
    </form>
  );
}

<Form onSubmitValues={(data) => console.log(data.get("email"))}>
  <input name="email" type="email" />
  <button type="submit">Send</button>
</Form>;
```

---

## 59. Sharing Logic with "unknown" & Type Casting

**What is this:** Using the `unknown` type as a safe alternative to `any`, and using type casting (`as`) to narrow it when the actual type is known.

**Description:** `unknown` forces you to verify the type before using a value, unlike `any` which bypasses all checks. When you receive data from an external source (API, event, storage) and need to assert its shape, you use `as` casting after validating — or use type guards for safer narrowing.

**Example:**

```tsx
function processApiResponse(data: unknown) {
  // Option 1: Type casting (trust yourself, no validation)
  const user = data as { name: string; age: number };
  console.log(user.name);

  // Option 2: Type guard (safer — validate before asserting)
  if (
    typeof data === "object" &&
    data !== null &&
    "name" in data &&
    typeof (data as Record<string, unknown>).name === "string"
  ) {
    console.log((data as { name: string }).name);
  }
}
```

---

## 60. Exposing Component APIs with useImperativeHandle (with TypeScript)

**What is this:** Using `useImperativeHandle` with `forwardRef` to expose a custom, limited API from a component to its parent via a ref.

**Description:** Instead of forwarding the raw DOM ref, `useImperativeHandle` lets you define exactly what the parent can call on the child's ref. In TypeScript, you define an interface for the exposed handle and pass it as the ref type to `forwardRef`.

**Example:**

```tsx
import { forwardRef, useImperativeHandle, useRef } from 'react';

type DialogHandle = {
  open: () => void;
  close: () => void;
};

const Dialog = forwardRef<DialogHandle>((_, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  return <dialog ref={dialogRef}>Dialog content</dialog>;
});

// Parent usage:
const dialogRef = useRef<DialogHandle>(null);
<Dialog ref={dialogRef} />
<button onClick={() => dialogRef.current?.open()}>Open</button>
```

---

## 61. Alternative: Avoiding Type Casting with "as"

**What is this:** Strategies to replace unsafe `as` type casting with safer TypeScript patterns like type guards, generics, and proper narrowing.

**Description:** Using `as` bypasses TypeScript's type checker and can hide bugs. The safer alternatives are: using type predicates, narrowing with `typeof`/`instanceof`/`in`, using generics to infer types, or structuring code so the type is never ambiguous in the first place.

**Example:**

```tsx
// ❌ Unsafe: 'as' silences the compiler but can cause runtime errors
const value = JSON.parse(someString) as { id: number; name: string };

// ✅ Safer: use a type guard to validate before asserting
function isUser(val: unknown): val is { id: number; name: string } {
  return (
    typeof val === "object" &&
    val !== null &&
    typeof (val as Record<string, unknown>).id === "number" &&
    typeof (val as Record<string, unknown>).name === "string"
  );
}

const parsed = JSON.parse(someString);
if (isUser(parsed)) {
  console.log(parsed.name); // TypeScript knows the shape — no 'as' needed
}
```

---

---

# Section 5: Advanced Type-Safe State with Context API & useReducer()

---

## 63. Module Introduction

**What is this:** An overview of how to manage global, type-safe state in React using the Context API combined with `useReducer`.

**Description:** This section covers building a fully type-safe state management system without external libraries. You'll type your context, provider, reducer, and actions so that every piece of shared state and every state transition is validated by TypeScript at compile time.

**Example:**

```tsx
// The pattern you'll build in this section — typed context + reducer
type State = { count: number };
type Action = { type: "increment" } | { type: "decrement" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
  }
}

const CounterContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | null>(null);
```

---

## 64. The Starting Project

**What is this:** The project scaffold used throughout this section to build a type-safe Context + useReducer setup.

**Description:** The starting project is a minimal React + TypeScript app that needs shared state. It serves as the base for incrementally adding a typed context, provider, reducer, and custom hook — showing how all the pieces connect.

**Example:**

```bash
# Clone or scaffold the starting project
npm create vite@latest context-reducer-app -- --template react-ts
cd context-reducer-app
npm install
npm run dev
```

---

## 65. Creating a Context & Fitting Types

**What is this:** Defining a React context with a proper TypeScript type so consumers receive typed values.

**Description:** `createContext` is generic — you pass it the type of value the context will hold. Since the context starts as `null` before the provider mounts, the type is usually `SomeType | null`. TypeScript then forces consumers to handle the `null` case.

**Example:**

```tsx
import { createContext } from "react";

type User = { id: number; name: string };

type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | null>(null);
// null = no provider above — consumers must check for null
```

---

## 66. Creating a Type-Safe Provider Component

**What is this:** Building a provider component that wraps the app, holds state, and passes typed values down through context.

**Description:** The provider component uses `useState` or `useReducer` to hold the context value and passes it to `Context.Provider`. Its props type only needs `children: ReactNode`. The value passed to `Provider` must match the context's type exactly — TypeScript enforces this.

**Example:**

```tsx
import { createContext, useState, ReactNode } from "react";

type CartContextType = {
  items: string[];
  addItem: (item: string) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);

  const addItem = (item: string) => setItems((prev) => [...prev, item]);

  return (
    <CartContext.Provider value={{ items, addItem }}>
      {children}
    </CartContext.Provider>
  );
}
```

---

## 67. Accessing Context Type-Safe With A Custom Hook

**What is this:** Wrapping `useContext` in a custom hook that throws if the context is `null`, eliminating repeated null-checks in every consumer.

**Description:** Rather than calling `useContext(MyContext)` in every component and manually guarding against `null`, you create a custom hook that does the check once and throws a descriptive error if used outside the provider. This gives consumers a fully non-nullable typed value.

**Example:**

```tsx
import { useContext } from "react";
import { CartContext } from "./CartProvider";

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return ctx; // CartContextType — never null after this point
}

// Usage in any component:
function CartButton() {
  const { items, addItem } = useCart(); // fully typed, no null check needed
  return <button onClick={() => addItem("apple")}>{items.length} items</button>;
}
```

---

## 68. Getting Started with useReducer() & TypeScript

**What is this:** Introducing `useReducer` as a typed alternative to `useState` for managing complex state transitions.

**Description:** `useReducer` takes a reducer function and an initial state, returning the current state and a `dispatch` function. In TypeScript, the reducer's state and action types are inferred automatically from the function signature, giving you full type safety on both the state shape and every dispatched action.

**Example:**

```tsx
import { useReducer } from "react";

type State = { count: number };
type Action = { type: "increment" } | { type: "decrement" } | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    case "reset":
      return { count: 0 };
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });

dispatch({ type: "increment" }); // ✅
dispatch({ type: "unknown" }); // ❌ Error: not a valid action type
```

---

## 69. A Basic Reducer Function & A Basic Action Type

**What is this:** Writing a typed reducer function and defining a union type for all possible actions it handles.

**Description:** A reducer is a pure function `(state, action) => newState`. The action type is a discriminated union — each member has a `type` literal and optional `payload`. TypeScript narrows the action inside each `case` block, so you only access the payload that belongs to that action.

**Example:**

```tsx
type Task = { id: number; text: string; done: boolean };

type TasksState = { tasks: Task[] };

type TaskAction =
  | { type: "ADD_TASK"; payload: { text: string } }
  | { type: "REMOVE_TASK"; payload: { id: number } };

function tasksReducer(state: TasksState, action: TaskAction): TasksState {
  switch (action.type) {
    case "ADD_TASK":
      return {
        tasks: [
          ...state.tasks,
          { id: Date.now(), text: action.payload.text, done: false },
        ],
      };
    case "REMOVE_TASK":
      return {
        tasks: state.tasks.filter((t) => t.id !== action.payload.id),
      };
  }
}
```

---

## 70. Changing State via the Reducer Function

**What is this:** Dispatching actions to the reducer and seeing how TypeScript enforces the correct payload shape for each action type.

**Description:** When you call `dispatch`, TypeScript checks the action against your union type. If you dispatch an action with the wrong `type` string or missing/wrong `payload` fields, you get a compile-time error. This makes state transitions fully auditable and safe.

**Example:**

```tsx
const [state, dispatch] = useReducer(tasksReducer, { tasks: [] });

// Add a task
dispatch({ type: "ADD_TASK", payload: { text: "Buy groceries" } }); // ✅

// Remove a task
dispatch({ type: "REMOVE_TASK", payload: { id: 1 } }); // ✅

// Wrong payload shape
dispatch({ type: "ADD_TASK", payload: { id: 1 } });
// ❌ Error: Object literal may only specify known properties,
//    'id' does not exist in type '{ text: string }'
```

---

## 71. Using Better Action Types

**What is this:** Improving action type definitions using discriminated unions with `payload` shaped specifically per action, avoiding loose or overly broad types.

**Description:** A common improvement is to make each action's payload type as specific as possible — or to skip `payload` entirely for actions that carry no data. Using string literal union types for `type` and per-action payload shapes gives you the tightest possible compile-time guarantees.

**Example:**

```tsx
// ❌ Loose: one generic payload that weakens type safety
type LooseAction = { type: string; payload?: unknown };

// ✅ Better: each action has its own exact shape
type CartAction =
  | { type: "ADD_ITEM"; payload: { id: number; name: string; price: number } }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "CLEAR_CART" }; // no payload needed

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.payload] };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };
    case "CLEAR_CART":
      return { items: [] };
  }
}
```

---

## 72. Wiring Everything Up & Finishing the App

**What is this:** Connecting the typed context, provider, reducer, and custom hook into a complete, working application.

**Description:** The final step combines all patterns: the reducer manages state transitions, the context distributes state and dispatch, the provider wraps the app, and the custom hook gives consumers clean, typed access. The result is a fully type-safe global state system with no external libraries.

**Example:**

```tsx
// context/TasksContext.tsx — full wiring
import { createContext, useContext, useReducer, ReactNode } from "react";

type Task = { id: number; text: string; done: boolean };
type State = { tasks: Task[] };
type Action =
  | { type: "ADD"; payload: string }
  | { type: "TOGGLE"; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return {
        tasks: [
          ...state.tasks,
          { id: Date.now(), text: action.payload, done: false },
        ],
      };
    case "TOGGLE":
      return {
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, done: !t.done } : t,
        ),
      };
  }
}

type ContextType = { state: State; dispatch: React.Dispatch<Action> };
const TasksContext = createContext<ContextType | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { tasks: [] });
  return (
    <TasksContext.Provider value={{ state, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used inside <TasksProvider>");
  return ctx;
}
```

---

---

# Section 6: Side Effects, useEffect() & Data Fetching with TypeScript

---

## 73. Module Introduction

**What is this:** An overview of how TypeScript enhances side effect management, `useEffect`, and data fetching in React.

**Description:** This section covers typing side effects — from basic `useEffect` usage to interval management with refs, async data fetching, response validation with Zod, and properly handling loading and error states. TypeScript ensures the data flowing through your effects matches expected shapes.

**Example:**

```tsx
// The pattern you'll build — typed fetch with loading/error state
type FetchState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

const [state, setState] = useState<FetchState<User[]>>({ status: "loading" });
```

---

## 74. Creating a First Side Effect

**What is this:** Using `useEffect` to run code after a component renders, such as logging, subscriptions, or timers.

**Description:** `useEffect` accepts a callback that runs after every render (or only when specified dependencies change). TypeScript doesn't add special syntax here, but it ensures that any values used inside the effect are correctly typed, preventing common mistakes with stale or wrong-typed values.

**Example:**

```tsx
import { useEffect, useState } from "react";

function Clock() {
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(id); // cleanup on unmount
  }, []); // empty deps = run once on mount

  return <p>Current time: {time}</p>;
}
```

---

## 75. Using useEffect() with TypeScript

**What is this:** Understanding how TypeScript interacts with `useEffect` — particularly around typed dependencies and return values.

**Description:** TypeScript enforces that the `useEffect` callback either returns `void` or a cleanup function `() => void`. It also catches mistakes where you accidentally return a Promise (by making the callback `async`), which `useEffect` does not support directly.

**Example:**

```tsx
// ❌ Async directly in useEffect — TypeScript warns, useEffect ignores the returned Promise
useEffect(async () => {
  const data = await fetchData(); // this pattern is discouraged
}, []);

// ✅ Correct: define async function inside and call it
useEffect(() => {
  async function load() {
    const data = await fetchData();
    setData(data);
  }
  load();
}, []);
```

---

## 76. Managing An Interval With Refs & The Effect Cleanup Function

**What is this:** Using a `useRef` to store an interval ID and clearing it in the `useEffect` cleanup to prevent memory leaks.

**Description:** When you set up a `setInterval` inside `useEffect`, you must clear it when the component unmounts or before the effect re-runs. Storing the interval ID in a `useRef<ReturnType<typeof setInterval>>` keeps the reference stable across renders without triggering re-renders.

**Example:**

```tsx
import { useEffect, useRef, useState } from "react";

function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return <p>{seconds}s elapsed</p>;
}
```

---

## 77. useEffect() & Its Dependencies

**What is this:** Understanding the dependency array of `useEffect` and how TypeScript helps ensure the correct values are listed.

**Description:** The dependency array tells React when to re-run the effect. TypeScript + the `eslint-plugin-react-hooks` exhaustive-deps rule ensures you don't forget to include variables used inside the effect. Omitting dependencies can cause stale closures; TypeScript helps surface the values that need to be tracked.

**Example:**

```tsx
type SearchProps = { query: string };

function SearchResults({ query }: SearchProps) {
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    // 'query' is used inside — it must be in the dependency array
    async function search() {
      const data = await fakeSearch(query);
      setResults(data);
    }
    search();
  }, [query]); // re-runs whenever 'query' changes

  return (
    <ul>
      {results.map((r) => (
        <li key={r}>{r}</li>
      ))}
    </ul>
  );
}
```

---

## 78. A Small Bug & Its Solution

**What is this:** Identifying and fixing a common side effect bug — typically a stale closure or missing cleanup — that TypeScript or React's strict mode surfaces.

**Description:** A common bug is updating state inside an effect after the component has unmounted, or using a stale value because a dependency was omitted. TypeScript narrows down where the bug lives; the fix is usually adding the missing dependency, using a ref, or adding an `isMounted` guard.

**Example:**

```tsx
// ❌ Bug: sets state after unmount if fetch takes too long
useEffect(() => {
  fetchUser(id).then((data) => setUser(data)); // no cleanup!
}, [id]);

// ✅ Fix: use an abort controller to cancel in-flight requests
useEffect(() => {
  const controller = new AbortController();

  fetchUser(id, controller.signal).then((data) => setUser(data));

  return () => controller.abort(); // cancel on unmount or id change
}, [id]);
```

---

## 79. Onwards to Data Fetching!

**What is this:** A transition to building a real data-fetching layer using TypeScript — typing the response, handling errors, and managing async state.

**Description:** Data fetching in React requires handling three states: loading, success (with typed data), and error. TypeScript makes this explicit by forcing you to define the shape of the fetched data upfront, so every consumer knows exactly what they'll receive.

**Example:**

```tsx
type Post = { id: number; title: string; body: string };

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json() as Promise<Post[]>;
}
```

---

## 80. Building a Utility "get" Function with TypeScript

**What is this:** Creating a reusable typed `get` utility function that wraps `fetch`, enforces response types, and throws on errors.

**Description:** Rather than repeating fetch + error-check + json parsing everywhere, you extract a utility function. Using a generic `<T>` on the function lets callers specify what type the response should be, keeping all fetch calls consistent and type-safe.

**Example:**

```tsx
async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data as T;
}

// Usage — caller specifies the expected response type
const posts = await get<Post[]>("/api/posts");
const user = await get<User>("/api/user/1");
```

---

## 81. Fetching & Transforming Data

**What is this:** Fetching raw data from an API, transforming it into the shape your app needs, and keeping both the raw and transformed types explicit.

**Description:** API responses often don't match your internal data model. You define a raw response type that mirrors the API, then a transformed type for your app, and write a typed mapping function between them. This keeps your app decoupled from the API's shape.

**Example:**

```tsx
// Raw API shape
type ApiPost = { id: number; title: string; userId: number };

// App-internal shape
type Post = { id: number; title: string; authorId: number };

function transformPost(raw: ApiPost): Post {
  return { id: raw.id, title: raw.title, authorId: raw.userId };
}

const raw = await get<ApiPost[]>("/api/posts");
const posts: Post[] = raw.map(transformPost);
```

---

## 82. Alternative: Using the "zod" Library for Response Data Validation

**What is this:** Using the `zod` library to validate API responses at runtime and infer TypeScript types from the schema automatically.

**Description:** TypeScript types only exist at compile time — they can't validate actual runtime data from an API. `zod` bridges this gap: you define a schema, parse the response through it (throwing on mismatch), and infer the TypeScript type from the schema so you never have to write the type separately.

**Example:**

```tsx
import { z } from "zod";

const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

const PostsSchema = z.array(PostSchema);

// Infer the TypeScript type from the schema — no duplication
type Post = z.infer<typeof PostSchema>;

const res = await fetch("/api/posts");
const data = await res.json();
const posts = PostsSchema.parse(data); // throws if shape doesn't match
// posts is typed as Post[] automatically
```

---

## 83. Alternative: A Generic "get" Function

**What is this:** Enhancing the `get` utility to optionally accept a Zod schema, validating and typing the response in a single call.

**Description:** By making the schema parameter optional, the same `get` function works both as a plain typed fetch (when you trust the API) and as a validated fetch (when you pass a Zod schema). The return type is inferred from the schema if provided, or from the generic `T` otherwise.

**Example:**

```tsx
import { z, ZodSchema } from "zod";

async function get<T>(url: string, schema?: ZodSchema<T>): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const data = await res.json();
  if (schema) return schema.parse(data); // validated + typed
  return data as T; // trusted cast, no validation
}

const PostSchema = z.object({ id: z.number(), title: z.string() });

// With validation:
const post = await get("/api/post/1", PostSchema);

// Without validation (trust the API):
const raw = await get<{ id: number; title: string }>("/api/post/1");
```

---

## 84. Handling Loading & Error States

**What is this:** Typing the full lifecycle of a data-fetch operation — loading, success, and error — using a discriminated union state type.

**Description:** Instead of separate `isLoading`, `data`, and `error` state variables (which can get out of sync), a discriminated union models all three states as a single typed value. TypeScript then forces you to handle each case, making incomplete UI states impossible.

**Example:**

```tsx
import { useEffect, useState } from "react";

type FetchState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };

type Post = { id: number; title: string };

function PostList() {
  const [state, setState] = useState<FetchState<Post[]>>({ status: "loading" });

  useEffect(() => {
    get<Post[]>("/api/posts")
      .then((data) => setState({ status: "success", data }))
      .catch((err: unknown) =>
        setState({
          status: "error",
          message: err instanceof Error ? err.message : "Unknown error",
        }),
      );
  }, []);

  if (state.status === "loading") return <p>Loading...</p>;
  if (state.status === "error") return <p>Error: {state.message}</p>;
  return (
    <ul>
      {state.data.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}
```

---

---

# Section 7: Using Redux with TypeScript

---

## 85. Module Introduction

**What is this:** An overview of integrating Redux Toolkit (RTK) with TypeScript for fully typed global state management.

**Description:** This section covers setting up Redux Toolkit in a TypeScript project, creating typed slices, reducers, and actions, providing the store, and consuming it with type-safe hooks. RTK was designed with TypeScript in mind — most types are inferred automatically.

**Example:**

```tsx
// The pattern you'll build — typed store, slice, and hooks
import { configureStore, createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
});

const store = configureStore({ reducer: { counter: counterSlice.reducer } });
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
```

---

## 86. The Starting Project

**What is this:** The scaffold project used throughout this section to add Redux Toolkit step by step.

**Description:** The starting project is a React + TypeScript app without state management. It provides the UI shell so you can focus on wiring in Redux — installing RTK, creating a store, adding slices, and connecting components.

**Example:**

```bash
npm create vite@latest redux-ts-app -- --template react-ts
cd redux-ts-app
npm install @reduxjs/toolkit react-redux
npm run dev
```

---

## 87. Redux Setup

**What is this:** Installing and configuring Redux Toolkit and React-Redux in a TypeScript project.

**Description:** Setup requires two packages: `@reduxjs/toolkit` (RTK) and `react-redux`. You then create the store with `configureStore`, export the `RootState` and `AppDispatch` types derived from the store, and wrap your app in `<Provider store={store}>`.

**Example:**

```tsx
// store.ts
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {}, // slices go here
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// main.tsx
import { Provider } from "react-redux";
import { store } from "./store";

<Provider store={store}>
  <App />
</Provider>;
```

---

## 88. Creating a Redux Store & A First Slice

**What is this:** Using `createSlice` to define a piece of state along with its reducers and auto-generated actions in one place.

**Description:** A slice bundles the state shape, reducers, and action creators together. RTK's `createSlice` infers the action types from the reducer names and uses Immer internally, so you can write "mutating" logic that is actually immutable under the hood.

**Example:**

```tsx
// features/counter/counterSlice.ts
import { createSlice } from "@reduxjs/toolkit";

type CounterState = { value: number };

const initialState: CounterState = { value: 0 };

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
});

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;
```

---

## 89. Setting a State Type

**What is this:** Explicitly defining and annotating the state type for a Redux slice so TypeScript knows the exact shape of that slice's state.

**Description:** While RTK can infer the state type from `initialState`, explicitly defining a `type` or `interface` and typing `initialState` with it makes the shape clear and allows for more complex types (e.g., nullable fields, nested objects) that inference might not handle precisely.

**Example:**

```tsx
type CartItem = { id: number; name: string; quantity: number };

type CartState = {
  items: CartItem[];
  totalPrice: number;
};

const initialState: CartState = {
  items: [],
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /* ... */
  },
});
```

---

## 90. A First Reducer & Controlling the Action Payload Type

**What is this:** Writing a reducer that accepts a payload and using `PayloadAction<T>` from RTK to type it precisely.

**Description:** RTK exports `PayloadAction<T>` — the type for an action that carries a typed payload. When you annotate a reducer's second parameter with `PayloadAction<T>`, TypeScript enforces that the dispatched action contains exactly that payload shape.

**Example:**

```tsx
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartState = { items: { id: number; name: string }[] };

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] } as CartState,
  reducers: {
    addItem(state, action: PayloadAction<{ id: number; name: string }>) {
      state.items.push(action.payload);
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});
```

---

## 91. Adding Logic To The Reducer

**What is this:** Implementing more complex reducer logic — derived values, conditional updates, and multi-field state changes — while keeping full type safety.

**Description:** Reducers can compute derived values (like a total price), conditionally update fields, or change multiple parts of state in one action. Because state and action are typed, TypeScript catches shape mismatches and ensures every branch returns a consistent state.

**Example:**

```tsx
type CartState = { items: CartItem[]; total: number };

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], total: 0 } as CartState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.total = state.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
    },
  },
});
```

---

## 92. Providing the Redux Store

**What is this:** Wrapping the React app in the Redux `<Provider>` so every component in the tree can access the store.

**Description:** `<Provider store={store}>` makes the Redux store available via React context to any component that uses `useSelector` or `useDispatch`. It goes at the top of the component tree, typically in `main.tsx` or `index.tsx`.

**Example:**

```tsx
// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
```

---

## 93. Dispatching Actions & Adjusting the useDispatch Hook

**What is this:** Using `useDispatch` to send actions to the store, and creating a typed version of the hook using `AppDispatch`.

**Description:** The default `useDispatch` returns a generic `Dispatch` type that doesn't know about your store's specific action types. By creating a typed `useAppDispatch` hook that returns `AppDispatch`, you get full inference on what can be dispatched, including thunks.

**Example:**

```tsx
// hooks.ts
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();

// Usage in a component:
function CartButton() {
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() =>
        dispatch(addItem({ id: 1, name: "Apple", quantity: 1, price: 0.5 }))
      }
    >
      Add to cart
    </button>
  );
}
```

---

## 94. Creating a Type-Safe useSelector Hook

**What is this:** Creating a typed `useAppSelector` hook so that `useSelector` callbacks receive the fully typed `RootState`.

**Description:** The default `useSelector` doesn't know the shape of your store's state. By creating `useAppSelector` typed with `RootState`, every selector callback is automatically typed — no need to annotate the state parameter manually in each component.

**Example:**

```tsx
// hooks.ts
import { useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState } from "./store";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Usage in a component — state is fully typed as RootState:
function CartCount() {
  const items = useAppSelector((state) => state.cart.items);
  return <span>{items.length} items</span>;
}
```

---

## 95. Selecting & Transforming Redux Store Data

**What is this:** Using selectors to read and derive data from the Redux store in a typed, reusable way.

**Description:** A selector is a function that takes `RootState` and returns a derived value. Defining selectors separately (in the slice file or a dedicated selectors file) keeps components clean and makes the derivation logic reusable and independently testable.

**Example:**

```tsx
// cartSlice.ts — co-located selectors
import type { RootState } from "../store";

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectItemCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

// Component:
function CartSummary() {
  const total = useAppSelector(selectCartTotal);
  const count = useAppSelector(selectItemCount);
  return (
    <p>
      {count} items — ${total.toFixed(2)}
    </p>
  );
}
```

---

## 96. Finishing Touches & Summary

**What is this:** A recap of the full Redux + TypeScript setup — store, slices, typed hooks, selectors, and dispatch.

**Description:** The complete pattern involves: a typed store with `configureStore`, slices with `PayloadAction`-typed reducers, `RootState` and `AppDispatch` exported from the store, and `useAppSelector`/`useAppDispatch` hooks for type-safe consumption. Together these cover the full Redux data flow with TypeScript.

**Example:**

```tsx
// The complete typed Redux flow in one view:

// 1. Slice with typed state and actions
const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 } as { value: number },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    setValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
  },
});

// 2. Store + exported types
const store = configureStore({ reducer: { counter: counterSlice.reducer } });
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

// 3. Typed hooks
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 4. Component consuming the store
function Counter() {
  const value = useAppSelector((s) => s.counter.value);
  const dispatch = useAppDispatch();
  return (
    <div>
      <p>{value}</p>
      <button onClick={() => dispatch(counterSlice.actions.increment())}>
        +
      </button>
    </div>
  );
}
```

---

---

# Section 8: Zustand with TypeScript

---

## 1. Introduction to Zustand

**What is this:** Zustand is a minimal, fast global state management library for React that requires far less boilerplate than Redux.

**Description:** Unlike Redux, Zustand doesn't require actions, reducers, or a provider. You define a store as a single typed object with state and actions combined, and consume it directly with a hook. TypeScript integration is first-class — you define the store's type once and everything is inferred from it.

**Example:**

```tsx
import { create } from "zustand";

type CounterStore = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

function Counter() {
  const { count, increment } = useCounterStore();
  return <button onClick={increment}>{count}</button>;
}
```

---

## 2. Setting Up Zustand

**What is this:** Installing Zustand and creating your first store in a React + TypeScript project.

**Description:** Zustand is a single package with no peer dependencies beyond React. After installing, you call `create<T>()` with a generic type that describes the full store shape (state + actions). No provider, no boilerplate — the store is ready to use immediately.

**Example:**

```bash
npm install zustand
```

```tsx
// store/useAppStore.ts
import { create } from "zustand";

type AppStore = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}));
```

---

## 3. Typing the Store with an Interface or Type

**What is this:** Defining a separate `type` or `interface` for the store shape and passing it as a generic to `create<T>()`.

**Description:** Separating the store type from the `create` call makes the shape reusable, easier to read, and possible to split into state and actions sub-types. TypeScript enforces that the object passed to `create` matches the declared type exactly.

**Example:**

```tsx
import { create } from "zustand";

type UserState = {
  name: string;
  email: string;
};

type UserActions = {
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  reset: () => void;
};

type UserStore = UserState & UserActions;

const initialState: UserState = { name: "", email: "" };

export const useUserStore = create<UserStore>((set) => ({
  ...initialState,
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  reset: () => set(initialState),
}));
```

---

## 4. Reading State with Selectors

**What is this:** Using selector functions inside `useStore` to subscribe only to the specific slice of state a component needs, avoiding unnecessary re-renders.

**Description:** By default, a component re-renders whenever any part of the store changes. Passing a selector function (e.g., `state => state.count`) limits re-renders to only when that specific value changes. TypeScript infers the return type of the selector automatically.

**Example:**

```tsx
type Store = { count: number; name: string; increment: () => void };

const useStore = create<Store>((set) => ({
  count: 0,
  name: "App",
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// Only re-renders when 'count' changes — 'name' changes are ignored
function Counter() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  return <button onClick={increment}>{count}</button>;
}
```

---

## 5. Updating State (set & get)

**What is this:** Using `set` to update store state and `get` to read current state from within an action.

**Description:** `set` merges the returned partial object into the current state (shallow merge). `get` gives you synchronous access to the current state inside actions — useful when the new value depends on the current state without needing the `state =>` callback pattern.

**Example:**

```tsx
import { create } from "zustand";

type Store = {
  items: string[];
  addItem: (item: string) => void;
  removeLastItem: () => void;
  logItems: () => void;
};

const useStore = create<Store>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeLastItem: () => set((state) => ({ items: state.items.slice(0, -1) })),
  logItems: () => console.log(get().items), // read current state without triggering re-render
}));
```

---

## 6. Persisting State with Middleware

**What is this:** Using Zustand's `persist` middleware to automatically save and restore store state from `localStorage`.

**Description:** The `persist` middleware wraps your store creator and serializes state to a storage layer (default: `localStorage`). In TypeScript, you wrap `create` with `persist` and keep the same generic type — Zustand handles the serialization types internally.

**Example:**

```tsx
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsStore = {
  theme: "light" | "dark";
  language: string;
  setTheme: (theme: "light" | "dark") => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: "light",
      language: "en",
      setTheme: (theme) => set({ theme }),
    }),
    { name: "settings-storage" }, // localStorage key
  ),
);
// State survives page refreshes automatically
```

---

## 7. Splitting a Store into Slices

**What is this:** Organizing a large Zustand store by splitting it into multiple typed slices that are merged into one store.

**Description:** For larger apps, keeping all state in one `create` call becomes unwieldy. The slice pattern lets you define each piece of state and its actions in a separate function, then combine them in the final `create` call. Each slice has its own type, and the full store type is their intersection.

**Example:**

```tsx
import { create, StateCreator } from "zustand";

type CounterSlice = { count: number; increment: () => void };
type NameSlice = { name: string; setName: (n: string) => void };
type AppStore = CounterSlice & NameSlice;

const createCounterSlice: StateCreator<AppStore, [], [], CounterSlice> = (
  set,
) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
});

const createNameSlice: StateCreator<AppStore, [], [], NameSlice> = (set) => ({
  name: "",
  setName: (name) => set({ name }),
});

export const useAppStore = create<AppStore>()((...args) => ({
  ...createCounterSlice(...args),
  ...createNameSlice(...args),
}));
```

---

## 8. Zustand vs Redux — When to Use Which

**What is this:** A comparison of Zustand and Redux to understand when each is the right tool.

**Description:** Zustand is ideal for simpler or medium-complexity state: less boilerplate, easier to set up, and great TypeScript inference. Redux Toolkit is better for large teams, complex async flows (thunks, RTK Query), or apps that benefit from strict action traceability and devtools. Both work well with TypeScript.

**Example:**

```tsx
// Zustand — minimal setup, great for most apps
const useStore = create<{ user: User | null; setUser: (u: User) => void }>(
  (set) => ({
    user: null,
    setUser: (user) => set({ user }),
  }),
);

// Redux — more structure, better for large-scale apps
const userSlice = createSlice({
  name: "user",
  initialState: { user: null as User | null },
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});
// Choose Zustand for simplicity, Redux when you need devtools, middleware chains, or RTK Query
```

---
