const mongoose = require('mongoose')

const EmployeeSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    picture: String,
    salary: String,
    position: String
})

mongoose.model("employee", EmployeeSchema)