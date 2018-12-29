const express = require("express")
const _ = require("lodash")

const router = express.Router()
const { authenticate } = require("../middleware/authenticate")

const { Money, Portfolio } = require("../models/model")

router.get("/money", authenticate, (req, res) => {
    Money.find({_creator: req.user._id}).then(data => {
        res.send(data)
    }).catch(err => {
        res.send(err)
    })
})

router.post("/money", authenticate, (req, res) => {
    const money = new Money({
        money: req.body.money,
        _creator: req.user._id
    })

    money.save().then(data => {
        // console.log("money created")
        res.send(data)
    }).catch(err => {
        res.send(err)
    })
})

router.patch("/money", authenticate, (req, res) => {
    const body = _.pick(req.body, ["money"])

    Money.findOneAndUpdate({_creator: req.user._id}, {$set: body}, {new: true}).then(data => {
        if(data == null) {
            return res.status(404).send()
        }
        res.send(data)
    }).catch(err => {
        res.send(data)
    })
})

router.delete("/money", authenticate, (req, res) => {
    Money.deleteOne({_creator: req.user._id})
        .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.send(err);
    });
});

router.get("/company", authenticate, (req, res) => {
    Portfolio.find({_creator: req.user._id}).then(data => {
        // console.log(data)
        res.send(data)
    }).catch(err => {
        res.send(err)
    })
})

router.post("/company", authenticate, (req, res) => {
    const company = _.pick(req.body, ["company", "companyName", "quantity", "buyPrice", "currPrice", "shareWorth", "profitLoss"])
    company["_creator"] = req.user._id

    // console.log(company)

    Portfolio.create(company).then(data => {
        res.send(data)
    }).catch(err => {
        res.send(err)
    })
})

router.patch("/company", authenticate, (req, res) => {
    const updatedValue = _.pick(req.body, ["company", "companyName", "quantity", "buyPrice", "currPrice", "shareWorth", "profitLoss"])
    
    Portfolio.findOneAndUpdate({"_creator": req.user._id}, {$set: updatedValue}, {new: true}).then(data => {
        if(data == null) {
            return res.status(404).send()
        }
        res.send(data)
    }).catch(err => {
        res.send(err)
    })
})

router.delete("/company", authenticate, (req, res) => {
    Portfolio.findOneAndDelete({"_id": req.body.id})
        .then(data => {
            res.send(data)
        }).catch(err => {
            res.send(err)
        })
})

module.exports = router