// express js, file code for assignment about the Express 
// Index for the node.js, express. js for the js 
import express, { urlencoded } from "express";


const app = express();
const port = 8080;
app.use(express.json());
app.use(urlencoded())

let products = [
    { id: "1", name: "laptop", price: 4000 },
    { id: "2", name: "Webcap", price: 3000 },
    { id: "3", name: "Smart phone", price: 2000 },
  ];
  
app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/", (req, res) => {
    const data = req.body;
    console.log("return post:", data);
    res.send("Post");
  });

app.get("/products", (req, res) => {
    res.status(200).send({
        success: true,
        message: 'return all products',
        payload: products,
    })
  });

  app.get("/products/:id", (req, res) => {
    const id = req.params.id;
    const product = products.find((product) => product.id === id);
    if (!product){
      res.status(404).send({
        success: false,
        message:"product not found",
      });
    }
    res.status(200).send({
        success: true,
        message: 'return single product',
        payload: product,
    })
  });


app.post ("/products", (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const data = req.body;
        const newProduct = {
          id: new Date().getTime().toString(),
          name: String(data.name),
          price: Number(data.price),
        };
        products.push(newProduct);
        res.json(products);

      } catch (error) {
     res.status(500).send({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
      } 
    });

app.listen(port, () => {
console.log(`server is running at http://localhost:${port}`)
});

