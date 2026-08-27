export interface LessonStep {
    stepNumber: number;
    title: string;
    instruction: string;
    codeTemplate: string;
    expectedClasses: string[];
    hint: string;
    targetLine?: number;
}

export interface Lesson {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    description: string;
    steps: LessonStep[];
}