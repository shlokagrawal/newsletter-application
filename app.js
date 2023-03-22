const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
// const { response } = require("express");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function (req,res) {
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function (req,res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    // console.log(firstName +" "+lastName + " "+email );

    // to send data to mailchimp website, we have created our data variable according to their API documentation.
    const data = {
        members:[
            {
            email_address: email,
            status : "subscribed",
            merge_fields : {
                FNAME : firstName,
                LNAME : lastName
            }
        }
        ]
    }

    // our data contains plain javascript but we need to send JSON to mailchimp server so we need to convert it into json, following method does that.
    const jsonData = JSON.stringify(data); 

    // now we are going to send this data to mailchimp server
    const url = "https://us21.api.mailchimp.com/3.0/lists/2a59a060da";

    const options = {
        method : "POST",
        auth: "shlokagrawal:b5bfb83c7869e687d77212e9e353c118-us21"
    }

    const request = https.request(url, options, function (response) {

        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
    // res.send("Done!");
})

app.post("/failure", function (req,res) {
    res.redirect("/");
})

// this is for our local machine, when it is hosting app as server
app.listen("3000", function() {
    console.log("Server is running on port 3000");
})

// for heroku
// app.listen(process.env.PORT, function () {
//     console.log("Server is running on port 3000");
// })

// if we we want to work both on heroku & locally
// app.listen(process.env.PORT || 3000, function () {
//     console.log("Server is running on port 3000");
// })

// Heroku is asking for payment details for credit card, which we don't have if any one asked do you have experience of deploying app on heroku tell them yes, bbut after there policy change where they ask payment info. i have stopped deploying oh heroku. if you can give me heroku id which is verified i can deploy app.
// and then refer to lecture 251 from web development course.

// Since Heroku has become paid service we are going to use alternative to deploy this app/
// refer this video - https://www.youtube.com/watch?v=MusIvEKjqsc&t=75s
// we are going to use render or railway or cyclic to deploy our application.



