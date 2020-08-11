export interface ResourceJSON<A, T = 'entity', R = unknown> {
    id: number;
    type: T,
    attributes: A,
    relationships: R
}

export interface Timestamps {
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface RequestJSON<T> {
    data: {
        attributes: T
    }
}

export interface ResponseJSON<T> {
    data: T;
}

export interface CollectionJSON<T> {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        next: string | null;
        prev: string | null;
        self: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}
