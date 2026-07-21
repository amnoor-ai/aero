---
name: backend-architecture
description: "Guidelines for Laravel backend architecture, routing, controllers, and business logic separation."
---

# Laravel Backend Architecture

To ensure the backend remains scalable and testable, Antigravity agents must respect the following boundaries when writing PHP/Laravel code.

## 1. Thin Controllers
- **Rule:** Controllers are only responsible for receiving HTTP requests, triggering logic, and returning a Response (JSON or Inertia).
- **Validation:** Never write inline validation in controllers for complex forms. Always generate and use a `FormRequest` class.

## 2. Business Logic Boundaries
- **Action / Service Classes:** Any business logic that requires multiple steps (e.g., creating a user, assigning a role, and sending a welcome email) must be extracted into a dedicated Action class (e.g., `App\Actions\RegisterUserAction`) or Service class. Do not put this in the controller.
- **Model Hooks:** Avoid putting complex business logic in Eloquent Model lifecycle hooks (like `created` or `updated` events), as this creates hidden side-effects that are hard to debug.

## 3. Database & Queries
- Keep raw SQL out of controllers.
- Use Eloquent Scopes for complex queries (e.g., `User::active()->withRecentOrders()`).
- Always eager load relationships (`with()`) to prevent N+1 query problems before passing data to Inertia.

## 4. AI Anti-Pattern Warning: The "Enterprise" Trap
- **Do not create useless boilerplate:** Do not create `Action` or `Service` classes for basic CRUD operations (e.g., a simple `User::create()` or `$post->update()`). 
- **Rule of Thumb:** If the action class contains only one line of code, it belongs directly in the controller. Only extract logic that involves multiple steps, side-effects, or cross-domain interactions.
