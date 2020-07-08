"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { stock, customers } = require("./data/promo");
express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")
  .post("/order", (req, res) => {
    console.log(req.body);
    //variables
    const newOrder = req.body.order;
    console.log(newOrder);
    const tshirtSize = req.body.size;
    const firstName = req.body.givenName;
    const lastName = req.body.surname;
    const clEmail = req.body.email;
    const clAddres = req.body.address;
    const tshirtSizeCheck = stock.shirt;
    const sizeStock = tshirtSizeCheck[tshirtSize];
    const itemStock = stock[newOrder];
    const countryShip = req.body.country;
    console.log(countryShip);
    console.log(tshirtSize);
    console.log(sizeStock);
    console.log(stock.shirt.small);

    //shirt conditions
    let inStock = () => {
      if (newOrder === "shirt") {
        if (sizeStock > 0) {
          console.log("gotcha");
        } else {
          console.log("not enough fam");
          res.json({ status: "error", error: "unavailable" });
        }
        // res.json({ status: "success" });
      } else {
        if (itemStock > 0) {
          console.log("yerrrr");
        } else {
          console.log("not enough fam");
          res.json({ status: "error", error: "unavailable" });
        }
      }
    };
    //country
    let country = () => {
      if (countryShip !== "Canada") {
        res.json({ status: "error", error: "undeliverable" });
      } else {
        inStock();
      }
    };

    //customer check
    let repeatBuy = () => {
      customers.forEach((customer) => {
        if (
          (customer.givenName === firstName && customer.surname === lastName) ||
          customer.email === clEmail ||
          customer.address === clAddres
        ) {
          res.json({ status: "error", error: "repeat-customer" });
        } else {
          country();
        }
      });
    };
    // empty data
    const reqVars = Object.values(req.body);
    reqVars.forEach((param) => {
      if (param === "undefined") {
        res.json({ status: "error", error: "missing-data" });
      } else {
        repeatBuy();
      }
    });
  })
  // endpoints

  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(8000, () => console.log(`Listening on port 8000`));
