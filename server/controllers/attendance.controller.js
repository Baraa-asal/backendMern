const Attendance = require("../models/attendance.model");
const express = require("express");
const { response } = require("express");
const { User } = require("../models/user.model");
const faceapi = require("face-api.js");
const { Photo } = require("../models/photo.model");
const DataTypeInt = require("mongoose");

// module.exports.createAttendance = (request, response) => {
//   Attendance.create(request.body)
//     .then((attendance) => response.json(attendance))
//     .catch((err) => response.status(400).json(err));
// };

module.exports.getAllAttendance = (request, response) => {
  Attendance.find({})
    .populate("user_id", "firstName")
    .then((allAttendances) => response.json(allAttendances))
    .catch((err) => response.json(err));
};

module.exports.findOneAttendance = (request, response) => {
  Attendance.findOne({ _id: req.params.id })
    .then((oneSingleAttendance) =>
      response.json({ attendance: oneSingleAttendance })
    )
    .catch((err) =>
      response.json({ message: "Something went wrong", error: err })
    );
};

module.exports.findAttendancesBelongingToUser = (request, response) => {
  Attendance.find({ user_id: request.params.userId })
    .populate("user_id", "firstName")
    .then((allAttendances) => response.json(allAttendances))
    .catch((err) => response.json(err));
};

module.exports.createAttendance =async (req, resp) =>{
  // console.log("respone", req.body)
  Photo.find({})
  .then(async(res)=>
      { 
          const labeledDesc = res.map((photo, key)=>{
          if (photo?.desc?.length && photo?.desc?.length > 0){
              return new faceapi.LabeledFaceDescriptors(photo._id.toString(), [Float32Array.from(Object.values(JSON.parse(photo?.desc)))])
          }
      })
      faceMatcher = new faceapi.FaceMatcher(labeledDesc, 0.7)
      console.log(faceMatcher)
      let detectionFace = await  faceMatcher.findBestMatch(Object.values(req.body.desc));
      console.log(faceMatcher.findBestMatch(Object.values(req.body.desc)))
      console.log(typeof detectionFace._label)

      id = DataTypeInt.Types.ObjectId(detectionFace._label);
      // console.log("The Id is :" + id, typeof id);
      Photo.find({_id : id})
      .then((photo)=>{
        console.log("photo is:", photo)
        console.log("id for user photo :", photo[0].user_id)
        User.find({_id : photo[0].user_id})
          .then((person)=>{
            console.log(person)
            Attendance.create({
            user_id : person[0]._id,
            status:true,
              })
      })

        // console.log("person", photo)
        // Attendance.create({
        //     user_id : photo.user_id,
        //     status:true,
        //   })
        //  resp.json({photo})
        })
      }
    
     )
    .catch(err =>resp.json(err))}
      
      // .then(()=>{
          
         
      // })

// module.exports.updateAttendance = (request, response) => {
//   Attendance.findOneAndUpdate
// }