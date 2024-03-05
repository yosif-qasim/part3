const PersonForm =({newName,addName,newNumber,addNumber ,checkInput })=>{

    return(
        <>
            <form onSubmit={checkInput}>
                name: <input value={newName} onChange={addName}/>
                number: <input value={newNumber} onChange={addNumber}/>
                <button type="submit">add</button>
            </form>
        </>
    )
}

export default PersonForm