const express = require("express");
//Tomar las variables de entorno
const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});
const path = require("path");
const cors = require("cors");

const connectDB = require("./config/db");

//Inicializar la aplicación
const app = express();

//Conectarse con la base de datos
connectDB();

//Middlewares
app.use(express.json({extended: false}));
app.use(cors());

const port = process.env.PORT || 5000;

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

//Servir los archivos estáticos generados en production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

app.listen(port, () => {
  console.log(`Server inicializado en el puerto ${port}`)
});