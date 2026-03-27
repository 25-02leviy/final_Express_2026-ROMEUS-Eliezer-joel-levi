//importation
const express = require("express");
const userRoute = require("./routes/utilisateurR");
const dotenv = require("dotenv");
const Konekte = require("./db/db");
const errorHandler = require("./middlewares/errorHandler");
// const postRoute = require("./routes/post.route");

//initialisation
dotenv.config()
const app = express();
Konekte(); 

app.use(express.json());
app.use("/api/utilisateur", userRoute);


// app.use("/api/post", postRoute);
// app.use("/api/comment", require("./routes/comment.routes"));

app.use(errorHandler);

//route par defaut
app.get("/", (req, res) => {
    res.send("serveur en ecoute ");
});
//fichier
// app.use("/uploads", express.static("uploads"));

//lencement du serveur
app.listen(process.env.PORT, () => {
    console.log("serveur en ecoute");
});

