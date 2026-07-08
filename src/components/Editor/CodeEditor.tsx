import React, { useState } from 'react'

export const CodeEditor = () => {
    const [clicker, setClicker] = useState(0);

    const handleClicker = () => {
        setClicker(clicker + 1);
    }
    return (
        <>
            <div>Este es mi componente react CSM</div>
            <div className='clicker-container'>
                <p>Presioname</p>
                <button className='clicker-btn' onClick={handleClicker}>Hola</button>
                <p>Valor: </p>
                <p>{clicker}</p>
            </div>
        </>
    )
}
