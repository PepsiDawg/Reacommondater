// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyCcqMvAETi5QdNfUODOL4PP3NEhxKJigsg",
    authDomain: "reacommodater.firebaseapp.com",
    databaseURL: "https://reacommodater.firebaseio.com",
    projectId: "reacommodater",
    storageBucket: "reacommodater.appspot.com",
    messagingSenderId: "879741203081"
  }
};
