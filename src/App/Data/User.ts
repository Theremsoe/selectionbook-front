import {
    Timestamps,
    ResponseJSON,
    ResourceJSON,
    CollectionJSON,
    RequestJSON,
} from './Contracts/JSON/Specification';

import { HasMany as HasManyRelationship } from './Contracts/JSON/Relationships';

export interface Payload {
    name: string
    last_name: string
    email: string
    username: string
    born_date: string
}

export interface Relationships {
    skill: HasManyRelationship,
    address: HasManyRelationship,
}

export interface Attributes extends Payload, Timestamps { }
export interface Resource extends ResourceJSON<Attributes, 'user', Relationships> { }
export interface Response extends ResponseJSON<Resource> { }
export interface Request extends RequestJSON<Payload> { }
export interface Collection extends CollectionJSON<Resource> { }
