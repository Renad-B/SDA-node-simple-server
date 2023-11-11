import http from "http";
import { parse } from "querystring";
import fs from "fs/promises";

const port = 8080;

//products to return in the "GET" requsit
let products = [
  { id: "1", name: "laptop", price: 4000 },
  { id: "2", name: "Webcap", price: 3000 },
  { id: "3", name: "Smart phone", price: 2000 },
];

//reusing function for error response
const errorResponse = (res, statusCode, message) => {
  res.writeHead(statusCode, { "Content-type": "application/json" });
  res.end(
    JSON.stringify({
      message: message,
    })
  );
};

//reusing function for successful response
const successResponse = (res, statusCode, message, data = {}) => {
  res.writeHead(statusCode, { "Content-type": "application/json" });
  res.end(
    JSON.stringify({
      success: true,
      message: message,
      data: data,
    })
  );
};

const server = http.createServer(async (req, res) => {
  if (req.url === "/" && req.method === "GET") {
    try {
      successResponse(res, 200, "Hello World!");
    } catch (error) {
      errorResponse(res, 500, error.message);
    }

  } else if (req.url === "/products" && req.method === "GET") {
    try {
      //make it readable
      const products = JSON.parse(await fs.readFile("product.json", "utf-8"));
      successResponse(res, 200, "All the proudtcs are listed!", products);
    } catch (error) {
      errorResponse(res, 500, error.message);
    }

  } else if (req.url.match(/\/products\/([0-9]+)/) && req.method === "GET") {
    try {
      const id = req.url.split("/")[2];
      const products = JSON.parse(await fs.readFile("product.json", "utf-8"));
      const product = products.find((product) => product.id === id);
      console.log(req.url);
      successResponse(res, 200, "Single product!", product);
    } catch (error) {
      errorResponse(res, 500, error.message);
    }

  } else if (req.url === "/products" && req.method === "POST") {
    try {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      //to have it
      req.on("end", async () => {
        const data = parse(body);
        console.log(data);
        //data : name and price
        const newProduct = {
          id: new Date().getTime().toString(),
          name: String(data.name),
          price: Number(data.price),
        };
       // 1- get exisiting products from the file 

      //1, make it readable always
      const exisitngProducts = JSON.parse(await fs.readFile("product.json", "utf-8"));
      //2-  add the new data to the existing product 
      exisitngProducts.push(newProduct);
      //3- write the file again 
      await fs.writeFile("product.json", JSON.stringify(exisitngProducts));
      });
      successResponse(res, 200, "New product !");
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  }
});

server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
