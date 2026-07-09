import React from 'react'

interface PreviewFrameProps {
    code: string
}

export const PreviewFrame = ({ code }: PreviewFrameProps) => {

    const iframeContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <style>
            /* Centramos el contenido dentro del preview para que los diseños luzcan mejor */
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: #f8fafc;
                margin: 0;
                padding: 1rem;
            }
        </style>
    </head>
    <body>
        ${code}
    </body>
    </html>
    `;

    return (
        <>
        <iframe
            title='Tailwindcss Live Preview'
            srcDoc={iframeContent}
            className='w-full h-full border-0 bg-slate-50 rounded-lg shadow-inner'
            sandbox='allow-scripts'
        ></iframe>

        </>
    )
}
