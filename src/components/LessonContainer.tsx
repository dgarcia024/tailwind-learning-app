import React, { useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { PreviewFrame } from './PreviewFrame';
import type { Lesson, LessonStep } from '../types';

interface LessonContainerProps {
    lessonData: Lesson;
}

export const LessonContainer = ({ lessonData }: LessonContainerProps) => {
    // Estado para el paso actual
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

    // Estado para capturar el codigo que el usuario escribe en el editor
    const [userCode, setUserCode] = useState<string>('');

    // Estado para saber si el estado actual ha sido completado con éxito
    const [isStepCompleted, setisStepCompleted] = useState<boolean>(false);

    // Mostro u ocultar la pista
    const [showHint, setShowHint] = useState<boolean>(false);

    const currentStep: LessonStep = lessonData.steps[currentStepIndex];

    // Cada vez que cambie el paso, reiniciamos el codigo con la plantilla y los visuales
    useEffect(() => {
        if (currentStep) {
            setUserCode(currentStep.codeTemplate);
            setisStepCompleted(false);
            setShowHint(false);
        }

    }, [currentStepIndex, lessonData]);


    // Función de validación simple en tiempo real
    useEffect(() => {
        if (!currentStep) return;
        // Comprobamos si todas las clases esperadas estan incluidas en el codigo del usuario
        const allClassesMatches = currentStep.expectedClasses.every((className) => {
            // Una validación simple busca que el string exacto de la clase exista en el código
            return userCode.includes(className);
        });

        setisStepCompleted(allClassesMatches);
    }, [userCode, currentStep]);


    const handleNextStep = () => {
        if (currentStepIndex < lessonData.steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        }
        else {
            alert("Felicidades!!! haz completado todas las etapas de esta leccion");
        }
    }

    const handlePrevStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1)
        }
    }
    return (
        <>
            <div className='flex w-full h-screen overflow-hidden bg-slate-900 text-slate-300'>
                {/* PANEL IZQUIERDO:  Instrucciones y progreso*/}
                <div className='w-[25%] h-full p-6 bg-slate-800 border-r border-slate-700 flex flex-col justify-between overflow-y-auto'>
                    <div>
                        <span className='text-xs font-bold text-emerald-400 uppercase tracking-wider'>
                            {lessonData.title}
                        </span>
                        <h2 className='text-xl font-bold mt-2 text-white'>
                            Paso {currentStep.stepNumber}: {currentStep.title}
                        </h2>
                        <p className='text-slate-300 leading-relaxed mt-4'>
                            {currentStep.instruction}
                        </p>

                        {/* Botón de pista */}
                        <div className='mt-4'>
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className='text-cyan-400 hover:text-cyan-300 underline text-sm font-medium focus:outline-none'
                            >
                                {showHint ? 'Ocultar pista' : '¿Necesitas una pista?'}
                            </button>
                            {showHint && (<p className='bg-slate-900 border-l-4 border-cyan-500 p-3 mt-2 text-sm text-slate-300 rounded-r leading-relaxed'>
                                {currentStep.hint}
                            </p>)}
                        </div>
                    </div>

                    {/* controles de Navegacion al fondo del panel */}
                    <div className='mt-8 flex gap-3'>
                        <button
                            onClick={handlePrevStep}
                            disabled={currentStepIndex === 0}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors
                                ${currentStepIndex === 0
                                    ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                                    : 'bg-slate-700 text-slate-200 border-slate-600 hover:bg-slate-600'}`}
                        >
                            Anterior
                        </button>
                        <button
                            onClick={handleNextStep}
                            disabled={!isStepCompleted}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm
                                ${isStepCompleted
                                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            {currentStepIndex === lessonData.steps.length - 1 ? 'Finalizar lección' : 'Siguiente paso'}
                        </button>
                    </div>
                </div>
                {/* PANEL CENTRAL Y DERECHO: Editor y vista previa */}
                <div className='w-[70%] h-full flex flex-col'>
                    {/* Seccion editor del codigo */}
                    <div className='w-[50%] border-b bg-slate-700 flex flex-col'>
                        <div className='bg-slate-950 px-4 py-2 border-b border-slate-800 flex justify-between items-center'>
                            <span className='text-xs font-mono uppercase tracking-wider text-slate-400'>
                                Editor HTML / Tailwind
                            </span>

                            {/* pequeño badge de validacion */}
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium 
                            ${isStepCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {isStepCompleted ? '✓ Completado' : '⚡ En progreso'}
                            </span>
                        </div>
                        <div className='flex-1 overflow-auto text-base'>
                            <CodeMirror 
                                value={userCode}
                                height='100%'
                                theme='dark'
                                extensions={[html()]}
                                onChange={(value) => setUserCode(value)}
                                className='h-full overflow-hidden'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
