import { AxiosPromise, AxiosResponse } from 'axios';
import React, { Component, ReactNode } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Resource, Response } from '../../../Data/Address';
import { Resource as UserResource } from '../../../Data/User';
import Http from '../../../Providers/Http';
import NotFound from '../../Results/NotFound';
import Spin from '../../Spinners/Spin';
import Form from './Form';

interface Params {
    userId: string,
    addressId: string,
}

interface Props extends RouteComponentProps<Params> {
    user: UserResource,
}

interface State {
    fetch: AxiosPromise<Response> | null;
}

export default class Workspace extends Component<Props, State> {
    public readonly state: State = {
        fetch: null,
    };

    protected address: Resource | null = null;

    public constructor(props: Props, state: State) {
        super(props, state);

        this.onChange = this.onChange.bind(this);
    }

    public componentDidMount(): void {
        this.fetch();
    }

    protected fetch(): void {
        const key: number | null = this.getKey();

        if (key) {
            const fetch: AxiosPromise<Response> = this.repository();

            fetch
                .then((res: AxiosResponse<Response>): Resource => {
                    this.address = res.data.data;

                    return this.address;
                })
                .finally((): void => this.setState({ fetch: null }));

            this.setState({ fetch });
        }
    }

    protected repository(): AxiosPromise<Response> {
        const { user }: Props = this.props;

        return Http.get(`${user.relationships.address.links.self}/${this.getKey()}`);
    }

    protected getKey(): number | null {
        const { match: { params: { addressId } } }: Props = this.props;

        return Number.parseInt(addressId, 10) || null;
    }

    public onChange(address: Resource): void {
        const {
            history: { replace },
            match: { params: { addressId }, url },
        }: Props = this.props;

        this.address = address;

        if (!addressId) replace(`${url}/${address.id}`);
    }

    public render(): ReactNode {
        const { fetch }: State = this.state;
        const { user }: Props = this.props;

        if (fetch) return <Spin />;
        if (this.getKey() && !this.address) return <NotFound />;

        return <Form user={user} address={this.address} onChange={this.onChange} />;
    }
}
