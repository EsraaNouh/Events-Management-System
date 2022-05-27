export class Speaker {
    address = {
        city:"",
        street:"",
        building:0
    }
    constructor(
        public _id: string,
        public email: string,       
        public userName: string,
        public password: string | null,   
        city: string ,
        street:string , 
        building: number
    ){
        this.address.city = city;
        this.address.street = street;
        this.address.building = building;
    }
}
