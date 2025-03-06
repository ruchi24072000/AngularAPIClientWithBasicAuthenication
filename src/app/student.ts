import { subscriptionLogsToBeFn } from "rxjs/internal/testing/TestScheduler";

export class Student {
    id:number;
    fullName:string;
    mobileNo:string;
    email:string;
    dateOfBirth:Date;
    state:string;
    district:string;
    photoPath:string;

    constructor(){
        this.id=0;
        this.fullName=''
        this.mobileNo=''
        this.email=''
        this.dateOfBirth=new Date();
        this.state='';
        this.district='';
        this.photoPath=''

    }

}


