const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
require('./Employee')

app.use(bodyParser.json())

PORT = 3000

const Employee = mongoose.model("employee")
const mongoUri = "mongodb+srv://hiten:hiten@123@cluster0-dsgv6.mongodb.net/test?retryWrites=true&w=majority"

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB")
})

mongoose.connection.on("error", (err) => {
    console.log("Error Occured while connecting to Mongo", err)
})



//route to Fetch all data Records
app.get('/', (req, res) => {
    Employee.find({}).then(data => {
        res.send(data)
    }).catch(err => {
        console.log(err)
    })
})


//route for Creating Employee
app.post('/send-data', (req, res) => {
    const employee = new Employee({
        name: req.body.name,
        position: req.body.position,
        email: req.body.email,
        phone: req.body.phone,
        salary: req.body.salary,
        picture: req.body.picture
    })
    employee.save()
        .then(data => {
            console.log(data)
            res.send(data)
        })
        .catch(err => {
            console.log(err)
        })
})


//route for Delete
app.post('/delete', (req, res) => {
    Employee.findByIdAndRemove(req.body.id)
        .then(data => {
            console.log(data)
            res.send(data)
        }).catch(err => {
            console.log(err)
        })
})

//route for Update
app.post('/update', (req, res) => {
    Employee.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        position: req.body.position,
        email: req.body.email,
        phone: req.body.phone,
        salary: req.body.salary,
        picture: req.body.picture
    })
        .then(data => {
            console.log(data)
            res.send(data)
        })
        .catch(err => {
            console.log(err)
        })
})


app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
})