# Motivation behind the rewrite from EmberJS to Angular

## <a name="differences"> Main Differences

### <a name="angular7"> Angular instead of EmberJS

The previous version of the platform used EmberJS, which offers similar features to Angular 7.

Because of this, there are parts of our previous UI stack that we should be able to reuse:

- Our custom CSS / SASS that provide the current dashboard styling / brand colors
- Semantic UI components and CSS
- FontAwesome icon CSS
- EventSource patterns
- DataOne authentication strategies
- Backend API call patterns
- Even some of the templates
- OAuth login pattern

Note that while some of this code may need to be adapted to be "more Angular", it should certainly not constitute a full redesign of the above components.

Reasoning: EmberJS support is dwindling, with seemingly less community active than ever before and it is becoming difficult to get answers to basic questions that arise during development. It is even more difficult to reuse anything that the community has contributed due to either minor differences in each version of EmberJS. Furthermore, we are running an older version of Ember, causing further disparity between us and the state-of-the-art.

#### <a name="directives-and-pipes"> Directives and Pipes instead of Helpers

Where EmberJS had "helpers" that could be called from within templates, Angular offers "directives" or "pipes".

Pipes are simply value converters/transformers - given one or more input value, they will manipulate the input to produce an output and can be chained together for reuse. Some examples of built-in pipes are:

- `decimal` - format a numerical value, optionally with a pre-specified precision
- `date` - format a Date variable into the user's default browser locale
- `uppercase` / `lowercase` - transform a string to uppercase/lowercase
- `async` - given an asynchronous input stream, this tells Angular that it should consume the value - Angular will automatically close this stream when needed

Directives, on the other hand, are a bit more complex. Directives allow Angular to extend HTML by adding new elements, or by adding custom attributes or classes to existing elements. These directives can have data-bound values that Angular will keep in-sync for you, given the correct syntax. In general with Angular (since version 1), anything that modifies the DOM directly should be in a directive - that is, we shouldn't have any calls to `document` or `$` in a component, only within directives.
Angular offers many built-in directives that work similarly to the helpers offered by EmberJS:

- `ngFor` / `ngForOf` == `{#each}`
- `ngIf` == `{#if}` / `{#unless}` / `{#when}`
- `ngSwitch` / `ngSwitchCase` / `ngPlural` can be used instead of nested if / else blocks
- `ngClass` / `ngStyle` can be used to programatically set particular CSS classes or styles when a particular condition is met
- Form validation directives for common tasks, such as `email`, `min`, `max`, `pattern`, `required`, etc

Reasoning: Syntactical sugar from EmberJS is still present, with new additions to make writing dynamic templates and forms even easier.

#### <a name="modules-components-routes"> Modules, Components, and Routes instead of Controllers / Routes / Templates / Components

Where EmberJS used a unique mix of component-based architecture and classic MVC, Angular appears to be more purely component-based.

Angular allows you to define modules - groups of related components/services that can be injected into and inherited by one another.

A module can then use Angular's `Router` to map URL path suffixes to individual components, and the router will populate the view with the correct components upon navigation.

A module can declare a "service" which, just like in EmberJS, is a singleton class allowing modules and components to share their data between each other. Also just like EmberJS, services can be injected into one another and into components using dependency injection.

For example, our app has an `AppModule` at its base that is made up of a `HeaderComponent`, `MainComponent`, and `FooterComponent` (currently unused). The `MainComponent` contains our `<router-outlet></router-outlet>`, which is where our component will be rendered when a matching URL is found. The routes we've set up point to sub-modules named `tale-catalog`, `data-catalog`, `compute-environments`, and `run-tale`. Each of these sub-modules is currently made up of a single component, but could be split into as few or as many different components as we'd like.

Reasoning: Modular code is easier to understand and refactor independently of other modules. Designing with modularity in mind helps you write more cohesive and maintainable code that can be sustained long-term.

### <a name="typescript"> TypeScript instead of JavaScript

One of the biggest differences here is the adoption of TypeScript, which effectively adds more strict typing to classic JavaScript. Notice that type definitions `string` (member type) and `void` (function return type) are provided in the following TypeScript snippet:

```typescript
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet(): void {
    return 'Hello, ' + this.greeting;
  }
}

let greeter = new Greeter('world');
```

Note that the `greeter` variable does not require a type - if TypeScript can trivially determine the type of a variable at compile time, then the type annotation is optional. Classic JavaScript allows us to do things like the following, where TypeScript would throw an error during compilation due to having a nondeterministic type:

```javascript
let a = 6;
a = "and now I'm a string";
```

Reasoning: While it can sometimes add frustration during the compile step, using a strongly-typed language can make code easier to read, test, and maintain.

Aside: The `any` type keyword can be used to declare a "classic" JavaScript variable, and TypeScript won't complain about the type. Long-term this is a very fragile pattern, but it works great for putting together a quick prototype.

### <a name="yarn">Yarn instead of NPM

The last big difference will be the usage of `yarn` instead of `npm` for package installation.

Prefer `yarn add --dev <package-name>` over `npm install --save-dev <package-name>`.

Reasoning: Yarn appears to be better than NPM at synchronizing dependency versions for better build reproducibility.
