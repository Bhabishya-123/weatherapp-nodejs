//Nodejs code is here
var express = require("express");
var requests = require("requests");
var app = express();

var bodyParser = require("body-parser");

//in nodejs we have builtin middleware that does everthings for us
app.use("/public", express.static("public"));

//it tells express to use ejs as a viewengine that will then render dynamic content
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  console.log("Request made on:" + req.url);

  requests(
    "http://api.openweathermap.org/data/2.5/weather?q=kathmandu&appid=344b134b52cf63f9d28bb5e7ea69259b&units=metric"
  )
    //if we get data then it goes through chunk and print data in console
    .on("data", function (chunk) {
      const objdata = JSON.parse(chunk); //converting json to object to use data in site
      //after this we can pass object in ejs site

      const time = new Date().toLocaleTimeString();

      //we can pass data dynamic througn 2nd param as objects
      res.render("weather", { apidata: objdata, time: time });
      console.log(objdata);
    })
    //else through error
    .on("end", function (err) {
      if (err) return console.log("connection closed due to errors", err);
      console.log("end");
    });
});

// create application/x-www-form-urlencoded parser i.e middleware
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//when user submit city to find its weather below things will happens
//if user clicked submit it will submit all data to req.body object and that can be further stored in server
app.post("/", urlencodedParser, function (req, res) {
  var reqCity = req.body.city; //data that was submitted by user
  requests(
    "http://api.openweathermap.org/data/2.5/weather?q=" +
      reqCity +
      "&appid=344b134b52cf63f9d28bb5e7ea69259b&units=metric"
  )
    .on("data", function (chunk) {
      const objdata = JSON.parse(chunk);
      const time = new Date().toLocaleTimeString();

      console.log("weather requested :" + req.body.city);
      if (objdata) {
        res.render("weather", { apidata: objdata, time: time });
      }
      console.log(objdata);
    })
    .on("end", function (err) {
      if (err) return console.log("connection closed due to errors", err);
      console.log('something went wrong')
      console.log("end");
    });
});

//this express app server listen on port 5000
app.listen(5000);
