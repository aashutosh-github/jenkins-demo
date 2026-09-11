# Jenkins Node.js CI/CD Demo

A small Node.js application built to learn and demonstrate a complete
Jenkins CI/CD pipeline.

The project uses a **Jenkins Multibranch Pipeline** to automatically
discover branches and run the pipeline defined in the `Jenkinsfile`.

## What this project demonstrates

The pipeline follows this flow:

``` text
GitHub
   │
   ▼
Jenkins Multibranch Pipeline
   │
   ├── Checkout
   ├── Install dependencies
   ├── Lint
   ├── Test
   ├── Build
   ├── Package
   ├── Deploy (main only)
   └── Smoke test (main only)
```

It is intended as a learning project for understanding practical CI/CD
concepts with Jenkins.

## Tech Stack

-   Node.js
-   Express
-   Jest
-   ESLint
-   esbuild
-   Jenkins
-   Git / GitHub

## Project Structure

``` text
.
├── Jenkinsfile
├── package.json
├── package-lock.json
├── eslint.config.js
├── src/
│   ├── app.js
│   ├── math.js
│   └── server.js
└── tests/
    ├── app.test.js
    └── math.test.js
```

## Application

The application is a simple Express server.

The source code lives in `src/`, while tests live in `tests/`.

### Available npm scripts

``` bash
npm run dev       # Run the application directly from source
npm start         # Run the built application
npm run lint      # Run ESLint
npm test          # Run Jest tests
npm run test:ci   # Run tests in CI mode and generate JUnit output
npm run build     # Bundle the server using esbuild
```

## Running Locally

Install dependencies:

``` bash
npm ci
```

Run linting:

``` bash
npm run lint
```

Run tests:

``` bash
npm test
```

Build the application:

``` bash
npm run build
```

Start the built application:

``` bash
npm start
```

The server listens on port `3000` by default.

## Jenkins Pipeline

The pipeline is defined in `Jenkinsfile`.

### 1. Checkout

``` groovy
checkout scm
```

The source code is checked out from the repository configured by the
Multibranch Pipeline.

### 2. Install Dependencies

``` bash
npm ci
```

Uses `package-lock.json` to install reproducible dependencies.

### 3. Lint

``` bash
npm run lint
```

The pipeline fails if ESLint reports an error.

### 4. Testing

``` bash
npm run test:ci
```

Jest runs in CI mode and generates a JUnit report.

Jenkins publishes the report using:

``` groovy
junit testResults: 'reports/junit/junit.xml'
```

### 5. Build

``` bash
npm run build
```

esbuild bundles the application into:

``` text
dist/server.js
```

### 6. Package

The build output and package metadata are packaged into a tarball:

``` text
node-demo-${BUILD_NUMBER}.tar.gz
```

For example:

``` text
node-demo-7.tar.gz
```

The artifact is also archived by Jenkins using `archiveArtifacts`.

### 7. Deploy

Deployment only happens on the `main` branch.

Each deployment gets its own release directory:

``` text
/opt/cicd-demo/node/releases/<BUILD_NUMBER>
```

The `current` symlink points to the active release:

``` text
/opt/cicd-demo/node/current
```

This provides a basic release-based deployment structure.

The application is started on port `3000`, and its PID is stored in:

``` text
/opt/cicd-demo/node/app.pid
```

Logs are written to:

``` text
/opt/cicd-demo/node/app.log
```

### 8. Smoke Test

After deployment, Jenkins checks:

``` text
http://localhost:3000/health
```

using:

``` bash
curl -f http://localhost:3000/health
```

If the health endpoint fails, the Jenkins build fails.

## Jenkins Configuration

This project is designed for a **Jenkins Multibranch Pipeline**.

The Jenkins installation should have Node.js configured as:

``` text
NodeJS-26
```

The Jenkinsfile references this installation:

``` groovy
tools {
    nodejs 'NodeJS-26'
}
```

The Multibranch Pipeline should point to this repository and discover
the `Jenkinsfile` from each branch.

### Branch behavior

All discovered branches can run:

``` text
Checkout → Install → Lint → Test → Build → Package
```

Deployment and smoke testing are restricted to:

``` text
main
```

using:

``` groovy
when {
    branch 'main'
}
```

## CI/CD Concepts Demonstrated

This project covers several important Jenkins concepts:

-   Jenkins Multibranch Pipelines
-   Jenkinsfile-based pipeline configuration
-   SCM checkout
-   Jenkins agents
-   Jenkins tool configuration
-   Pipeline stages
-   Build artifacts
-   JUnit test reports
-   Branch-specific stages
-   Environment variables
-   Release directories
-   Deployment symlinks
-   Basic smoke testing
-   Preventing concurrent builds
-   Timestamped build logs

## Pipeline Options

The pipeline uses:

``` groovy
disableConcurrentBuilds()
timestamps()
skipDefaultCheckout(true)
```

### `disableConcurrentBuilds()`

Prevents multiple builds of the same job from running simultaneously.

### `timestamps()`

Adds timestamps to Jenkins console output.

### `skipDefaultCheckout(true)`

Prevents Jenkins from automatically checking out the repository. The
pipeline performs checkout explicitly using:

``` groovy
checkout scm
```

## Artifact Example

For build `#12`, Jenkins creates:

``` text
node-demo-12.tar.gz
```

containing:

``` text
dist/
package.json
package-lock.json
```

Jenkins archives this file as a build artifact.
