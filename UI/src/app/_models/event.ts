export class Event {
    constructor(
        public _id: number,
        public title: string,
        public event_date: Date,
        public mainSpeaker_id: string,
        public otherSpeakers_ids: string[],
        public students_ids: number[]
    ){}
}
