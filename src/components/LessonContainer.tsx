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
        if(currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1)
        }
    }
    return (
        <div className='flex w-full h-screen overflow-hidden'>LessonContainer</div>
    )
}
