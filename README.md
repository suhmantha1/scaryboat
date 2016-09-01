# scaryboat

## Getting Started

Setting up this project is easy! 
To do it, follow these steps in **this order**:

1. [Install node modules and linters](#install-node-modules)
2. [Install pre-commit](#install-pre-commit)
3. [Install bower components](#install-bower-components)
4. [Deployments](#deployments)

### Install node modules and linters

```
npm install
```

Among other things, this will force the Use All Five coding style guides for JavaScript and SCSS.

To ensure the latter, [install](https://packagecontrol.io/installation) the following packages for Sublime Text (or similiar IDE):

- EditorConfig
- SublimeLinter
- SublimeLinter-jscs
- SublimeLinter-jshint
- SublimeLinter-contrib-scss-lint

### Install pre-commit

1. Install Pre-Commit, follow [these installation instructions](http://pre-commit.com/#install).
2. Run:
```
pre-commit install
```

This should install the following pre-commit linters:
- scss-lint
- jshint
- jscs

### Install bower components

```
bower install
```

### Deployments

### Make a Build & Test

You’ll want to do a build to make sure all the dependencies load correctly. This will essentially be what gets deployed.

```
grunt build
```

#### To Deploy to Staging

Copy the contents of `secret-sample.yml` into `secret.yml`. And update with the correct info.

To push to staging, run:
```
grunt stage
```
