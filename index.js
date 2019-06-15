const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('./db.json');

app.use(bodyParser.json())

let { persons } = db;

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${ new Date()}</p>
  `)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if ( person ) {
    response.json(person)
  } else {
    response.status(404).send(`
    <p>The person you are look for does not exist in the database</p>
  `).end()
  }
})

app.delete('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return `${ new Date().valueOf() }_${ Math.floor(Math.random() * 1000) }`;
}

app.post('/persons', (request, response) => {
  const {name, number} = request.body

  let errors = [];

  if ( !number ) {
    errors.push('number field missing')
  }

  if ( !name ) {
    errors.push('name field missing')
  } else {
    const duplicateName = persons.find(person => person.name === name)

    if ( duplicateName ) {
      errors.push('name must be unique')
    }
  }

  if ( errors.length ) {
    return response.status(400).json({ 
      error: `${errors.map((error, index) => {
        return index === 0 ? error : ' ' + error
      })}` 
    })
  }
  
  const person = {
    name: name,
    number: number || false,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const port = 3001
app.listen(port)
console.log(`Server running on port ${port}`)