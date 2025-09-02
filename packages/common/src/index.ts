export const VALUE = "harkirt singh";
export const BACKEND_URL ="https://api.google.com"

// 1.first
// // "exports":{
// //     "./config":"./src/index.js"
// //   },

// 2.config file

// 3.  "dependencies": {
//     "zod": "^3.23.8",
//    "@repo/common":"*"
//   }
//  find it hear in monorepo it is part of npm worksapce that is what * stands for

//now when we use import anothor file we will get error 
//from get off form this we have to use esbuild(compiler also do same thing converting ts to js )
//first npm build
//for bundle it run (esbuild app.js --bundle --platform=node --target=node10.4)
//in our case (npx esbuild ./src/index.ts --bundle --platform=node --target=node10.4)or
//npx esbuild ./src/index.ts --bundle --platform=node --outfile=dist/index.js
//good to go 