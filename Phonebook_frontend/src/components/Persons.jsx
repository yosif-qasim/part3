const Persons = ({persons , newFilter,deleteContact}) => {

    const Person = persons.map( (person) => {
        return(
            <li key={person.id}>
                {person.name} {person.number}
                <button onClick={() => deleteContact(person.id)}>delete</button>
            </li>
        )
    })

    const Search = persons.filter(person => {
        return person.name.toLowerCase().includes(newFilter.toLowerCase())  })

    const Show = newFilter === ''
        ? Person
        : Search.map( (person)=> <li key={person.id}>{person.name}{person.number}
            <button onClick={() => deleteContact(person.id)} > delete</button>
        </li>)


    return (
        <>
        {Show}
        </>
    )
}

export default Persons