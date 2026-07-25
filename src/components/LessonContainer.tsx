import React, { useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { EditorView, Decoration } from '@codemirror/view';
import { PreviewFrame } from './PreviewFrame';
import type { Lesson, LessonStep } from '../types';

interface LessonContainerProps {
    lessonData: Lesson;
}


// Helper para crear la extensión de resaltado
const highlightTargetLine = (targetLineNumber?: number) => {
    if (!targetLineNumber || targetLineNumber < 1) return [];

    return EditorView.decorations.compute(['doc'], (state) => {
        if (targetLineNumber <= state.doc.lines) {
            const line = state.doc.line(targetLineNumber);
            const lineHighlightDecoration = Decoration.line({
                attributes: { class: 'cm-highlighted-step-line' }
            });
            return Decoration.set([lineHighlightDecoration.range(line.from)]);
        }
        return Decoration.none;
    });
};

export const LessonContainer = ({ lessonData }: LessonContainerProps) => {
    const STORAGE_KEY = `lesson_progress_${lessonData.id}`;


    // Estado para el paso actual
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

    // Guardamos el historial del codigo por paso { [stepNumber] : string }
    const [userCodeHistory, setUserCodeHistory] = useState<Record<number, string>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    return JSON.parse(saved)
                } catch (error) {
                    console.log(error);
                }
            }
        }
        return {};
    })

    // Estado para capturar el codigo que el usuario escribe en el editor
    const [userCode, setUserCode] = useState<string>('');

    // Estado para saber si el estado actual ha sido completado con éxito
    const [isStepCompleted, setIsStepCompleted] = useState<boolean>(false);

    // Mostro u ocultar la pista
    const [showHint, setShowHint] = useState<boolean>(false);

    const currentStep: LessonStep = lessonData.steps[currentStepIndex];

    // 1. Cargar código guardado o plantilla por defecto cuando cambia el paso
    useEffect(() => {
        if (currentStep) {
            const savedCodeForStep = userCodeHistory[currentStep.stepNumber];
            setUserCode(savedCodeForStep !== undefined ? savedCodeForStep : currentStep.codeTemplate);
            setShowHint(false);
        }
    }, [currentStepIndex, lessonData]);


    // 2. Guardar en historial y localStorage cada vez que el usuario escribe
    const handleCodeChange = (value: string) => {
        setUserCode(value);
        const updatedHistory = { ...userCodeHistory, [currentStep.stepNumber]: value };
        setUserCodeHistory(updatedHistory);
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
        }
    };

    // 3. Validación de clases
    useEffect(() => {
        if (!currentStep) return;

        const allClassMatches = currentStep.expectedClasses.every((className) => {
            return userCode.includes(className);
        });

        setIsStepCompleted(allClassMatches);
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

    const missingClasses = currentStep.expectedClasses.filter(c => !userCode.includes(c)) || [];
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
                                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                        >
                            {currentStepIndex === lessonData.steps.length - 1 ? 'Finalizar lección' : 'Siguiente paso'}
                        </button>
                    </div>
                </div>
                {/* PANEL DERECHO: Editor de codigo y vista previa */}
                <div className='w-[75%] h-full flex flex-col'>
                    {/* Seccion editor del codigo */}
                    <div className='h-[50%] border-b bg-slate-700 flex flex-col'>
                        <div className='bg-slate-950 px-4 py-2 border-b border-slate-800 flex justify-between items-center'>
                            <span className='text-xs font-mono uppercase tracking-wider text-slate-400'>
                                Editor HTML / Tailwind
                            </span>

                            {/* pequeño badge de validacion y estado */}
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium 
                            ${isStepCompleted ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {isStepCompleted ? '✓ Completado' : '⚡ En progreso'}
                            </span>
                        </div>
                        {/* Banner con detalle de Clases Faltantes */}
                        {!isStepCompleted && (
                            <div className="bg-rose-950/40 border-b border-rose-900/50 px-4 py-2 text-xs text-rose-300 flex items-center gap-2">
                                <span className="font-semibold text-rose-400">Faltan por agregar:</span>
                                <div className="flex gap-1.5 flex-wrap">
                                    {missingClasses.map((cls) => (
                                        <code key={cls} className="bg-rose-900/60 text-rose-200 border border-rose-700/50 px-1.5 py-0.5 rounded font-mono">
                                            {cls}
                                        </code>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex-1 overflow-auto text-base">
                            <CodeMirror
                                value={userCode}
                                height="100%"
                                theme="dark"
                                extensions={[html()]}
                                onChange={handleCodeChange}
                                basicSetup={{
                                    highlightActiveLineGutter: true, // Resalta el número de la línea activa
                                    highlightActiveLine: true,       // Resalta la línea donde está el cursor
                                    lineNumbers: true,
                                    foldGutter: true,
                                }}
                                className="h-full overflow-hidden"
                            />
                        </div>
                    </div>
                    {/* Seccion vista previa */}
                    <div className='h-[50%] flex flex-col bg-slate-950'>
                        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800">
                            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Vista Previa en Vivo</span>
                        </div>
                        <div className="flex-1 p-4 bg-slate-900">
                            <PreviewFrame code={userCode} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
