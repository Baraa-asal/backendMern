const { Photo } = require("../models/photo.model");

const DataTypeInt = require("mongoose");
const express = require("express");
const app = express();

const cors = require("cors");
const router = express.Router();
const faceapi = require("face-api.js");
const canvas = require("canvas");
const jsdom = require("jsdom");
const { json } = require("express");
const { JSDOM } = jsdom;
app.use(express.static("uploads"));


module.exports.Avatar = async (req, res) => {
  const avatar = req.file.filename;
  const user_id = req.body.user_id;
  console.log("req.body.user_id",req.body.user_id)
  console.log("req.file.avatar",req.file.filename)

  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromDisk(__dirname + "/models"),
    faceapi.nets.faceLandmark68Net.loadFromDisk(__dirname + "/models"),
    faceapi.nets.faceRecognitionNet.loadFromDisk(__dirname + "/models"),
    faceapi.nets.faceExpressionNet.loadFromDisk(__dirname + "/models"),
  ])
    .then(async () => {
      console.log(avatar);
      const { Canvas, Image, ImageData } = canvas;
      const window = new JSDOM(
        `<!DOCTYPE html><img id="myImg" src="http://localhost:8000/${avatar}" />`,
        { resources: "usable", url: "file:///" + __dirname + "/" }
      ).window;
      global.document = window.document;
      faceapi.env.monkeyPatch({
        fetch: fetch,
        Canvas: window.HTMLCanvasElement,
        Image: window.HTMLImageElement,
        ImageData: canvas.ImageData,
        createCanvasElement: () => document.createElement("canvas"),
        createImageElement: () => document.createElement("img"),
      });
      const img = document.getElementById("myImg");
      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      console.log("desc",JSON.stringify(detections[0].descriptor));
      console.log(JSON.stringify(detections[0].descriptor));
      Photo.create({
        avatar,
        user_id,
        desc: JSON.stringify(detections[0].descriptor),
      });
      //   res.send(JSON.stringify(detections[0].descriptor))
    })
    .then((auther) => res.json(auther))
    .catch((err) => res.status(400).json(err));
};
