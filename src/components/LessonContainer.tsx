import React, { useEffect, useState } from 'react'
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
            <div className='flex w-full h-screen overflow-hidden'>
                {/* PANEL IZQUIERDO:  Instrucciones y progreso*/}
                <div className='w-[30%] h-full p-6 bg-gray-100 border-r border-gray-200 flex flex-col justify-between overflow-y-auto'>
                    <div>
                        <span className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
                            {lessonData.title}
                        </span>
                        <h2 className='text-xl font-bold mt-2 text-gray-800'>
                            Paso {currentStep.stepNumber}: {currentStep.title}
                        </h2>
                        <p className='text-gray-600 leading-relaxed mt-4'>
                            {currentStep.instruction}
                        </p>

                        {/* Botón de pista */}
                        <div className='mt-4'>
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className='text-blue-600 hover:text-blue-800 underline text-sm font-medium rounded-r'
                            >
                                {showHint ? 'Ocultar pista' : '¿Necesitas una pista?'}
                            </button>
                            {showHint && (<p className='bg-blue-50 border-l-4 p-3 mt-2 text-sm text-blue-800 rounded-r'>
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
                                    ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
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
            </div>
        </>
    )
}
