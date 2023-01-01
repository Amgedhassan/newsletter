const express = require("express");
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3001;
const path = require("path");
const https = require("https");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");

///////////////////////////////////////////////////////////////////
mailchimp.setConfig({
    apiKey: process.env.SECRET_KEY,
    server: "us11",
});

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
///////////////////////////////////////////////////////////////////
const listId = "8430546adf";
///////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res) => {

    var addUser = async () => {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: req.body.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: req.body.fName,
                    LNAME: req.body.lName
                }
            });
            console.log(`user added, user id: ${response.id}`)
            res.sendFile(__dirname + "/success.html");
        } catch (err) {
            console.log(err.status);
            res.sendFile(__dirname + "/failure.html");
        }
    }
    addUser();
})


//////////////////////////////////////////////////////////////////////
app.listen(port, () => {
    console.log(`App is up and running on port ${port}`);
})
