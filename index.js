//module for reading & writing the data from/in the files
const fs = require('fs');
//module for request and respose from browser
const http = require('http');
// simple dependancy module
const { default: slugify } = require('slugify');
// module for url
const url = require('url');
//my own created module
const replaceTemplete = require('./modules/replaceTemplete');

////////////////////////////////////////
////FILES

// const Niamat = require("fs");
// const txtIn = Niamat.readFileSync("./text/input.txt", "utf-8");
// console.log(txtIn);
// const output = `This is what we want to know about avocado: ${txtIn}.\n Created on ${Date.now()}`;
// Niamat.writeFileSync("./text/output.txt", output);
// console.log("the text has been added");

//using the concept of asynchronous
// fs.readFile("./text/start.txt", "utf-8", (err, data1) => {
//   console.log(data1);
//   fs.readFile(`./text/readthis.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./text/append.text", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(
//         "./text/final.txt",
//         `${data2}\n ${data3}`,
//         "utf-8",
//         (err) => {
//           console.log("your file has been written 😻.");
//         }
//       );
//     });
//   });
// });
// console.log("welcome to node js");
////////////////////////////////////////
////SERVER

// Reading data from files using synchronization concept
const tempOverView = fs.readFileSync(`${__dirname}/templetes/Templete-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templetes/Templete-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templetes/Templete-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
//this is an array which contains on objects
const dataObj = JSON.parse(data);

//using thrid-party package
const slugy = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugy);
// const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;
  const { query, pathname } = url.parse(req.url, true);
  console.log(query, '************', pathName);
  //OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    // creating header for respose
    res.writeHead(200, { 'Content-type': 'text/html' });

    //map on dataObj and set data of an object inside the card templete after converting to a string using join method
    const cardHTML = dataObj.map((el) => replaceTemplete(tempCard, el)).join('');

    // replace Product card templete with cardHTML
    const output = tempOverView.replace('{%PRODUCT_CARDS%}', cardHTML);
    res.end(output);
  }
  //PRODUCT PAGE
  else if (pathname === '/product') {
    // creating header for respose
    res.writeHead(200, { 'Content-type': 'text/html' });

    // take product id from dataObj array
    const product = dataObj[query.id];
    // set the product in product templete by calling replaceTemplete module
    const output = replaceTemplete(tempProduct, product);
    res.end(output);
  }
  //API
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }
  //NOT FOUND
  else {
    res.end('<h1>page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listeing server is running on port 8000');
});
