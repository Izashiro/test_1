export class Exam {
    _id: string = "";
    examName: string = "";
    startTime: string = "";
    duration!: number;
    teacherID: string = "";
    examDate: string = "";
    message: string = "";
    teacherName: string = "";
    hasStarted: boolean = false;
    participants: Array<string> = [];
    question!: string;
    outSightTime!: number;
}
