import { Table } from 'antd';
import { AxiosPromise, AxiosResponse } from 'axios';
import React, { Component, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ColumnProps } from 'antd/lib/table';
import { Collection as AddressesCollection, Resource as AddressResource } from '../../../Data/Address';
import { Resource as UserResource } from '../../../Data/User';
import Http from '../../../Providers/Http';

interface State {
    fetch: AxiosPromise<AddressesCollection> | null;
}

interface Props {
    user: UserResource
}

export default class Grid extends Component<Props, State> {
    protected data: AddressesCollection | null = null;

    public state: State = {
        fetch: null,
    };

    public componentDidMount(): void {
        this.fetch();
    }

    protected fetch(page = 1): void {
        const fetch: AxiosPromise<AddressesCollection> = this.repository({ page });

        fetch
            .then((res: AxiosResponse<AddressesCollection>): AddressesCollection => {
                this.data = res.data;

                return this.data;
            })
            .finally((): void => {
                this.setState({ fetch: null });
            });

        this.setState({ fetch });
    }

    protected repository(params: Record<string, unknown>): AxiosPromise<AddressesCollection> {
        const { user }: Props = this.props;

        return Http.get(user.relationships.address.links.self, { params });
    }

    protected columns(): ColumnProps<AddressResource>[] {
        return [
            {
                title: '#',
                dataIndex: 'id',
            },
            {
                title: 'Street',
                dataIndex: ['attributes', 'street'],
            },
            {
                title: 'City',
                dataIndex: ['attributes', 'city'],
            },
            {
                title: 'Zipcode',
                dataIndex: ['attributes', 'zipcode'],
            },
            {
                title: 'State',
                dataIndex: ['attributes', 'state'],
            },
            {
                title: 'Country',
                dataIndex: ['attributes', 'country'],
            },
            {
                render: (item: UserResource): ReactNode => {
                    const { user }: Props = this.props;

                    return (
                        <Link to={`/employee/${user.id}/address/${item.id}`}>Edit</Link>
                    );
                },
            },
        ];
    }

    public render(): ReactNode {
        const { fetch }: State = this.state;

        return (
            <Table
                rowKey="id"
                columns={this.columns()}
                pagination={{
                    onChange: this.fetch.bind(this),
                    total: this.data?.meta.total ?? 0,
                    pageSize: this.data?.meta.per_page ?? 15,
                    current: this.data?.meta.current_page ?? 1,
                }}
                dataSource={this.data?.data ?? []}
                loading={!!fetch}
            />
        );
    }
}
