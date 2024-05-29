import { Authorizations } from "./Authorizations";

export class User {

    constructor(
        public id: number,
        public emailAddress: string,
        public userName: string,
        public firstName: string,
        public lastName: string,
        public token: string,
        public password: string,
        public authorizations: Authorizations[]

    ) {}
}