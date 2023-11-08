import http from "http";
import { parse } from "querystring";

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

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    try {
      successResponse(res, 200, "Hello World!");
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  } else if (req.url === "/products" && req.method === "GET") {
    try {
      successResponse(res, 200, "All the proudtcs are listed!", products);
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  } else if (req.url.match(/\/products\/([0-9]+)/) && req.method === "GET") {
    try {
      const id = req.url.split("/")[2];
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
      req.on("end", () => {
        const data = parse(body);
        console.log(data);
        //data : name and price
        const newProduct = {
          id: new Date().getTime().toString(),
          name: String(data.name),
          price: Number(data.price),
        };
        products.push(newProduct);
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

// server:
//GET -> / -> just a hello world
//GET -> /products -> return the products
//GET -> /products/id -> return the product
//POST -> /products -> create a product

//useful information
//1-you can add many response but the last one always should be "res.end" only 1 end !
//2- make it relastic, you can pass more like if its succeussful, statucCode ...etc
