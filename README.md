# MenuFiWebPortal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

This is part of a larger MenuFi solution that includes the following projects:
* https://github.com/MenuFi/MenuFiBackend
* https://github.com/MenuFi/MenuFiAndroidApp

## Release Notes version 1.0

### NEW FEATURES

* Added user login and registration
* Added ability to update menu items
* Added visualization for menu items
* Added visualization for trends across restaurant

### BUG FIXES

* Different login credentials no longer point to same restaurant
* Fixed long descriptions in menu items pushing down menu item info
* Changed layout to be mobile friendly

### KNOWN BUGS

* Names cannot have single quotes / apostrophes (')
* Auth guard doesn't check for time-validity of auth token

## Install Guide

### PRE-REQUISITES

You must have the following installed and configured (in order) before preceding:
1. Node Package Manager (npm): https://www.npmjs.com/
2. Angular CLI: https://github.com/angular/angular-cli
    - Run `npm install -g @angular/cli`

### DOWNLOAD

1. Navigate to https://github.com/MenuFi/MenuFiWebPortal
2. Click `Clone or download`
3. Click `Download ZIP`

### DEPENDENCIES

All dependenices are contained within the local `package.json` file.

After downloading the project (see above step), resolve dependencies by running the following command in the base path of the project:

`npm install`

### BUILD

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### INSTALLATION

Copy the files in the `dist/` directory to your desired remote location (wherever the site will be hosted).

### RUNNING APPLICATION

#### LOCALLY

##### Deploying and testing

Run `ng serve` for a dev deployment. This will use locally mocked services instead of a backend.

Run `ng serve --env=local` for a local deployment. This will use the local backend at http://localhost:8080

Run `ng serve --prod` for a prod deployment. This will use the remote backend at http://menufi-192821.appspot.com/

The three different environments are outlined in the environments folder.

##### Testing build artifacts

1. Navigate to `/dist` in your file explorer.
2. Right click on the `index.html` file and select `Open With`
3. Choose a browser to test in.

#### REMOTE

Simply navigate to your hosted website domain.

### TROUBLESHOOTING

**Resolving Dependencies:**

Dependencies of dependencies will need to be first resolved. Read the output of running `npm install`, and proceed to install dependencies of the dependencies using `npm install <dependency>`.

**Registering New Dependencies:**

Make sure to use one of the two following flags to register it in the `packages.json` file:

* `npm install --save <dependency>` for a runtime dependency
* `npm install --save-dev <dependency>` for a dev compilation dependency

See http://imcodebased.com/npm-save-or-save-dev-which-one-to-use/ for more advice on which to use.
