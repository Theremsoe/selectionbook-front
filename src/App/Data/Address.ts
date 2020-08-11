import {
    Timestamps,
    ResponseJSON,
    ResourceJSON,
    CollectionJSON,
    RequestJSON,
} from './Contracts/JSON/Specification';

export interface Payload {
    street: string,
    city: string,
    state: string,
    zipcode: string,
    country: string,
    geometry: {
        type: string,
        coordinates: number[]
    }
}

export interface Attributes extends Payload, Timestamps { }
export interface Resource extends ResourceJSON<Attributes> { }
export interface Response extends ResponseJSON<Resource> { }
export interface Request extends RequestJSON<Payload> { }
export interface Collection extends CollectionJSON<Resource> { }
