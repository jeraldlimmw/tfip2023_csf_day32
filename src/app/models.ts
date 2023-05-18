// make form field name the same as the entity object
export interface Friend {
    name: string
    email: string
    age: number
    gender: string
    fact: Fact[]
}

export interface Fact {
    fact: string
    value: string
}