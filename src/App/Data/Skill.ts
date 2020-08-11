import {
    Timestamps,
    ResponseJSON,
    ResourceJSON,
    CollectionJSON,
    RequestJSON,
} from './Contracts/JSON/Specification';

export interface Payload {
    name: string
    details: string
}

export interface Attributes extends Payload, Timestamps { }
export interface Resource extends ResourceJSON<Attributes> { }
export interface Response extends ResponseJSON<Resource> { }
export interface Request extends RequestJSON<Payload> { }
export interface Collection extends CollectionJSON<Resource> { }
