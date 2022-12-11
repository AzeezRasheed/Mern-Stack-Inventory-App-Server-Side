const express = require("express");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const contactRoute = require("./routes/contactRoute");
const connectDB = require("./db/connect");
const bodyParser = require("body-parser");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
var cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;

dotenv.config();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000"], // "https://pinvent-app.vercel.app"
    credentials: true,
  })
);

// Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/contactus", contactRoute);

// Routes
app.get("/", (req, res) => {
  res.send("Home Page");
  console.log("Cookies :  ", req.cookies);
});

// Error Middleware
app.use(errorHandler);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const startUp = async () => {
  try {
    await connectDB(process.env.Mongo_URI),
      {
        useNewUrlParser: true,
      };
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    res.json(err);
  }
};

startUp();

app.use(notFound);
