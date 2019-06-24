# wt-ng-dash

A prototype rewrite of the WholeTale Dashboard in Angular 7+

This project was seeded from [ng-seed/universal](https://github.com/ng-seed/univseral)

## Table of contents:

- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Setting up upstream repository](#setting-up-upstream-repository)
  - [Development and builds](#development-and-builds)
  - [CLI Scaffolding](#cli-scaffolding)
- [Directory structure](#directory-structure)
- [License](#license)

## <a name="prerequisites"></a> Prerequisites

Packages in this seed project depend on `@angular v7.x.x`. Older versions contain outdated dependencies, might produce errors.

Also, please ensure that you are using **`Typescript v3.1.x`** or higher.

## <a name="getting-started"> Getting started

### <a name="installation"> Installation

You can install **`ng-seed/universal`** by simply forking the repo:

```
# clone the repo
$ git clone https://github.com/ng-seed/universal.git [your-project-name]
$ cd [your-project-name]
```

### <a name="setting-up-upstream-repository"> Setting up upstream repository

Once you have cloned the repo, you can follow these steps to allow sync changes made in this repo with your fork:

```
# set up `origin`
$ git remote set-url origin [your-fork-repo]

# set up `upstream` to sync future changes
$ git remote add upstream https://github.com/ng-seed/universal.git

# verify the upstream repo specified for your fork
$ git remote -v
origin    https://github.com/YOUR_USERNAME/[your-fork-repo].git (fetch)
origin    https://github.com/YOUR_USERNAME/[your-fork-repo].git (push)
upstream  https://github.com/ng-seed/universal.git (fetch)
upstream  https://github.com/ng-seed/universal.git (push)

# initial push for the fork
$ git push
```

Now, you can create a new directory (_ex: `src/app/shared`_) to build your codebase out, while benefiting from the
client framework located at the `src/app/framework` directory.

In order to merge the latest upstream changes, simply follow:

```
# fetch the latest upstream
$ git fetch upstream

# merge the upstream changes
$ git merge upstream/master
```

then handle any conflicts, and go on with building your app.

### <a name="development-builds"> Development and builds

Below are the scripts to dev, build, and test this seed project:

#### Install dependencies

```
# use `yarn` to install the dependencies
$ yarn
```

#### Development servers

```
# dev server
$ ng serve

# dev server (HMR-enabled)
$ yarn start:hmr

# dev server (AoT compilation)
$ yarn start:prod

# dev server (SSR)
$ yarn start:ssr

# dev server (SSR & AoT compilation)
$ yarn start:ssr:prod
```

#### Build

```
# development build
$ ng build

# production build
$ ng build --prod

# development build (SSR)
$ yarn build:ssr

# production build (SSR)
$ yarn build:ssr:prod
```

The build artifacts will be stored in the `dist/` directory.

#### Running tests

```
# run unit tests
$ yarn test

# run e2e tests
$ yarn e2e
```

### <a name="cli-scaffolding"> CLI Scaffolding

The project currently performs **CLI scaffolding** using the official `@schematics/angular` collection and `@ngrx/schematics`
collection.

`@schematics/angular` blueprints :

- class
- component
- directive
- enum
- guard
- interface
- module
- pipe
- service

#### Example

```
# add module `todo`
$ ng g module todo
# create src/app/todo/todo.module.ts (183 bytes)
```

`@ngrx/schematics` blueprints :

- action
- container
- effect
- entity
- feature
- reducer
- store

##### Initial store setup

```
# add store module
$ ng g m store --m app.module.ts
# CREATE src/app/store/store.module.ts (189 bytes)
# UPDATE src/app/app.module.ts (3525 bytes)

# add root state interface
# ng g i store/state
# CREATE src/app/store/state.ts (27 bytes)
```

##### Feature store module setup

```
# add module `store/todo/Todo`
$ ng g m store/todo/Todo --flat
# CREATE src/app/store/todo/todo.module.ts (196 bytes)

// TODO: remove
# add reducer `store/todo/todo`
$ ng g r store/todo/todo --spec false
# CREATE src/app/store/todo/todo.reducer.ts (247 bytes)

# add entity `store/todo/item/Item`
$ ng g en store/todo/item/Item -m ../../todo/todo.module.ts --reducers ../../store/todo.reducer.ts
# CREATE src/app/store/todo/item/item.actions.ts (2078 bytes)
# CREATE src/app/store/todo/item/item.model.ts (40 bytes)
# CREATE src/app/store/todo/item/item.reducer.ts (1746 bytes)
# CREATE src/app/store/todo/item/item.reducer.spec.ts (322 bytes)
# UPDATE src/app/store/todo/todo.module.ts (340 bytes)

# add effects `store/todo/item/Item`
$ ng g ef store/todo/item/Item -m +todo/todo.module.ts
# CREATE src/app/store/todo/item/item.effects.ts (183 bytes)
# CREATE src/app/store/todo/item/item.effects.spec.ts (577 bytes)
# UPDATE src/app/store/todo/todo.module.ts (489 bytes)

# add service `store/todo/Item`
$ ng g s store/todo/Item
# CREATE src/app/store/todo/item/item.service.spec.ts (323 bytes)
# CREATE src/app/store/todo/item/item.service.ts (133 bytes)
```

##### Container & child components setup

```
# add module `+todo/Todo`
$ ng g m +todo/Todo --flat
# CREATE src/app/+todo/todo.module.ts (188 bytes)

# add container component `+todo/item/item-container`
$ ng g co +todo/item/item-container --flat --state ../../store/todo/item/item.reducer.ts
# CREATE src/app/+todo/item/item-container.component.html (33 bytes)
# CREATE src/app/+todo/item/item-container.component.ts (432 bytes)
# CREATE src/app/+todo/item/item-container.component.scss (0 bytes)
# CREATE src/app/+todo/item/item-container.component.spec.ts (884 bytes)
# UPDATE src/app/+todo/todo.module.ts (829 bytes)

# add child component `+todo/item`
$ ng g c +todo/item -c OnPush
# CREATE src/app/+todo/item/item.component.html (23 bytes)
# CREATE src/app/+todo/item/item.component.spec.ts (614 bytes)
# CREATE src/app/+todo/item/item.component.ts (262 bytes)
# CREATE src/app/+todo/item/item.component.scss (0 bytes)
# UPDATE src/app/+todo/todo.module.ts (829 bytes)

# add container component `+todo/item/item-detail/item-detail-container`
$ ng g co +todo/item/item-detail/item-detail-container --flat --state ../../../store/todo/item/item.reducer.ts
# CREATE src/app/+todo/item/item-detail/item-detail-container.component.html (40 bytes)
# CREATE src/app/+todo/item/item-detail/item-detail-container.component.ts (462 bytes)
# CREATE src/app/+todo/item/item-detail/item-detail-container.component.scss (0 bytes)
# CREATE src/app/+todo/item/item-detail/item-detail-container.component.spec.ts (927 bytes)
# UPDATE src/app/+todo/todo.module.ts (946 bytes)

# add child component `+todo/item-detail`
$ ng g c +todo/item/item-detail -c OnPush
# CREATE src/app/+todo/item/item-detail/item-detail.component.html (30 bytes)
# CREATE src/app/+todo/item/item-detail/item-detail.component.spec.ts (657 bytes)
# CREATE src/app/+todo/item/item-detail/item-detail.component.ts (289 bytes)
# CREATE src/app/+todo/item/item-detail/item-detail.component.scss (0 bytes)
# UPDATE src/app/+todo/todo.module.ts (946 bytes)
```

## <a name="directory-structure"></a> Directory structure

We use the **component approach** in this seed project, which is a _standard for developing Angular apps_ and also a great
way to ensure maintainable code by encapsulation of our behavior logic.

A component is basically a self contained app usually in a single file or a directory with each concern as a file: _style_,
_template_, _specs_, and _component class_.

> As an old convention, we use the **`+` prefix** for _lazy-loaded_ modules. Please keep in mind that it does not change
> the _router behavior_, neither makes the directory _unworkable_. It's just a handy _method_ to **identify lazy-loaded modules**
> by having a straight look at the directory structure.

```
universal/
 ├──.cache/                         * cache directory for ngx-cache
 |
 ├──.circleci/
 |   └──config.yml                  * CircleCI config
 |
 ├──.github/                        * issue & pr templates
 ├──coverage/                       * test coverage reports
 |
 ├──dist/                           * output directory to extract bundles
 |  ├──browser/                     * browser bundles
 |  └──server/                      * server bundles
 |
 ├──node_modules/                   * dependencies
 |
 ├──src/
 |   ├──app/                        * application code
 |   |   ├──+lazy-module/           * some LAZY module (attn to the `+` prefix for lazy-loaded modules)
 |   |   |  ...
 |   |   ├──framework/              * client framework
 |   |   ├──layout/                 * layout (app module)
 |   |   ├──library/                * application library (models, services, state management, etc.)
 |   |   ├──login/                  * login (app module)
 |   |   ├──shared/                 * shared codebase
 |   |   └──store/                  * state (ngrx) module
 |   └──assets/                     * static assets (scss, img, json, etc.)
 |   └──environments/               * environment settings
 |
 ├──tools/
 |   ├──build/                      * build config and scripts (webpack, etc.)
 |   ├──config/                     * config files for static-assets (stylelint, etc.)
 |   └──test/                       * test config
 |
 ├──.gitignore                      * GIT settings
 ├──.jshintrc                       * jshint config
 ├──angular.json                    * Angular CLI config
 ├──CHANGELOG.md                    * change log
 ├──CODE_OF_CONDUCT.md              * code of conduct
 ├──CONTRIBUTING.md                 * contributing info
 ├──LICENSE                         * software license
 ├──package.json                    * deps management
 ├──README.md                       * project information
 ├──server.ts                       * server code
 ├──stylelint.config.js             * stylelint config locator
 ├──test-report.xml                 * JUNIT test results
 ├──tsconfig.json                   * typescript config
 ├──tsconfig.server.json            * typescript config (for server build)
 ├──tsconfig.server-compile.json    * typescript config (for server compilation)
 ├──tsconfig.spec.json              * typescript config (for unit/e2e tests)
 ├──tslint.json                     * tslint config
 └──yarn.lock                       * deps lockfile
```

## <a name="license"></a> License

The MIT License (MIT)
