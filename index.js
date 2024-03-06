const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
require('dotenv').config()

const cors = require('cors')

app.use(cors())

morgan.token( 'data' , (request)=> JSON.stringify(request.body))
app.use(morgan(' :method :url :status :res[content-length] - :response-time ms :data'))
//
// const mongoose = require('mongoose')
// mongoose.set('strictQuery', false)
// const url = `mongodb+srv://yossif:123@fso.tshfdlf.mongodb.net/PhoneBook?retryWrites=true&w=majority&appName=FSO`
// mongoose.connect(url)
//     .then(result => console.log("connection succeseful" ))
//     .catch( (error) => console.log("connection failed" , error.message))
//
//
//
// const contactSchema = new mongoose.Schema({
//     name : String,
//     number : String,
// })
//
// contactSchema.set('toJSON',{
//     transform: (document, returnedObject) => {
//         returnedObject.id = returnedObject._id.toString()
//         delete returnedObject._id
//         delete returnedObject.__v
//     }
// })

const Contact =  require('./models/mongo')

let persons = [

]


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.get('/' , (request,response)=>{
    response.send('<h1>HELLO Trhe</h1>')

})

app.get('/info' , (request,response)=>{
    const personsCount = persons.length
    const currentTime = new Date()
    response.send(`<p>Phonebook has info of ${personsCount} contacts </bn> </br> ${currentTime}</p>`)
})

app.get('/api/persons' , (request,response)=>{
    Contact.find({})
        .then( persons => {
            console.log( "contact : ---> ", persons)
            return response.json(persons)

        })
        .catch( (error)=>{
        console.log(error.message)
    } )
})


// lol already done

app.get('/api/persons/:id' , (request,response)=>{
    Contact.findById(request.params.id).then(contact => {
        response.json(contact)
    })
})

app.delete('/api/persons/:id' , (request,response)=>{
    const id = Number(request.params.id)
    const person = persons.find( p => p.id === id )
    persons = persons.filter( p => p.id !== id )
    if (person) {
        response.send(`person with id ${id} deleted`)
    }else {
        response.status(404).end()
    }
})

app.post( "/api/persons" , (request , response )=>{
    const person = request.body

    if (!person.name || !person.number) {
        return response.status(400).json({
            error: 'some data is missing'
        })
    } else if(persons.find( (p) =>person.name === p.name)) {
        return response.status(400).json({
            error: 'person already exists'
        })
    }

    const contact = new Contact({
        name : person.name,
        number : person.number,
    })

    contact.save().then(savedContact => {
        response.json(savedContact)
    })
})

app.use(unknownEndpoint)



const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
// console.log('hello world')
