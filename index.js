const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
app.use(morgan('tiny'))


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]



app.get('/' , (request,response)=>{
    response.send('<h1>HELLO Trhe</h1>')
})
app.get('/info' , (request,response)=>{
    const personsCount = persons.length
    const currentTime = new Date()
    response.send(`<p>Phonebook has info of ${personsCount} contacts </bn> </br> ${currentTime}</p>`)
})
app.get('/api/persons' , (request,response)=>{
    response.json(persons)
})
// lol already added

app.get('/api/persons/:id' , (request,response)=>{
    const id = Number(request.params.id)
    const person = persons.find( p => p.id === id )
    if (person) {
        response.send(person)
    }else {
        response.status(404).end()
    }
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

    person.id = (persons.length)+1
    persons = persons.concat(person)
    response.json(person)
})

app.use(unknownEndpoint)



const PORT = 3001
app.listen(PORT , () => {
    console.log(`Server running on port ${PORT}`)
})

// console.log('hello world')
