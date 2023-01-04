const express = require("express");
const cors = require("cors");
const cookies = require("cookie-parser");
const faceapi = require("face-api.js");
const port = 8000;
const app = express();
app.use(express.static("uploads"))
const canvas = require("canvas");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // This is new
app.use(cookies());
app.use("/uploads", express.static("middleware")); // tells server where to search images from

require("./server/config/mongoose.config");
require("./server/routes/user.routes")(app);
require("./server/routes/attendance.routes")(app);
require("./server/routes/photo.routes")(app);


const server = app.listen(port, () => console.log("listining on port", port));


app.get('/api/:a/', async (req, res) => {
  console.log(req.params.id)
  let array =[]
    Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromDisk(__dirname+'/models'),
        faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname+'/models'),
        faceapi.nets.faceRecognitionNet.loadFromDisk(__dirname+'/models'),
        faceapi.nets.faceExpressionNet.loadFromDisk(__dirname+'/models')
      ])
      .then(
      async ()=>{
            const { Canvas, Image, ImageData } = canvas
            const window = new JSDOM(`<!DOCTYPE html><img id="myImg" src="http://localhost:8000/${req.params.a}" />`, { resources: "usable", url: "file:///" + __dirname + "/" }).window;
            global.document = window.document;
            faceapi.env.monkeyPatch({
                fetch: fetch,
                Canvas: window.HTMLCanvasElement,
                Image: window.HTMLImageElement,
                ImageData: canvas.ImageData,
                createCanvasElement: () => document.createElement('canvas'),
                createImageElement: () => document.createElement('img')
            })
            const img = document.getElementById('myImg');
            const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors()
            array = JSON.stringify(detections[0].descriptor)
            console.log(JSON.stringify(detections[0].descriptor));
            res.send(JSON.stringify(detections[0].descriptor))
            // const Auther = autherModel.findOne({ _id: req.params.id })
            // Auther.update({avatarDesc: JSON.stringify(detections[0].descriptor)})
            // Auther.save
            // const Auther = autherModel.findOne({ _id: req.params.id })
      }

      )

})




const io = require("socket.io")(server, { cors: true });

//emitters - passes data where it needs to go (emit)
//on - trigger -- listening for a particular event

//Name of the trigger
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("chat", (msg) => {
    console.log("Got the message: " + msg);
    io.emit("post chat", msg);
  });
});
