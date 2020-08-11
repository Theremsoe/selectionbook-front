import {
    Breadcrumb, Button, Col, Divider, Row, Table,
} from 'antd';
import { AxiosPromise, AxiosResponse } from 'axios';
import React, { Component, ReactElement, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ColumnProps } from 'antd/lib/table';
import Time from '../DateTime/Time';
import Http from '../../Providers/Http';
import { Collection as UserCollection, Resource as UserResource } from '../../Data/User';

interface State {
    fetch: AxiosPromise<UserCollection> | null;
}

export default class Grid extends Component<unknown, State> {
    protected data: UserCollection | null = null;

    public state: State = {
        fetch: null,
    };

    public componentDidMount(): void {
        this.fetch();
    }

    protected fetch(page = 1): void {
        const fetch: AxiosPromise<UserCollection> = this.repository({ page });

        fetch
            .then((res: AxiosResponse<UserCollection>): UserCollection => {
                this.data = res.data;

                return this.data;
            })
            .finally(
                (): void => this.setState({ fetch: null }),
            );

        this.setState({ fetch });
    }

    // eslint-disable-next-line class-methods-use-this
    protected repository(params: Record<string, unknown>): AxiosPromise<UserCollection> {
        return Http.get('/user', { params });
    }

    // eslint-disable-next-line class-methods-use-this
    protected columns(): ColumnProps<UserResource>[] {
        return [
            {
                title: '#',
                dataIndex: 'id',
            },
            {
                title: 'Name(s)',
                dataIndex: ['attributes', 'name'],
            },
            {
                title: 'Surname(s)',
                dataIndex: ['attributes', 'last_name'],
            },
            {
                title: 'Email',
                render: (item: UserResource): ReactNode => {
                    const { attributes: { email } }: UserResource = item;

                    return (<a href={`mailto:${email}`} title={email}>{email}</a>);
                },
            },
            {
                title: 'Born Date',
                render: (item: UserResource): ReactNode => <Time datetime={item.attributes.born_date} />,
            },
            {
                render: (item: UserResource): ReactNode => (
                    <>
                        <Link to={`/employee/${item.id}`}>Edit</Link>
                        <Divider type="vertical" />
                        <Link to={`/employee/${item.id}/skills`}>Skills</Link>
                        <Divider type="vertical" />
                        <Link to={`/employee/${item.id}/addresses`}>Addresses</Link>
                    </>
                ),
            },
        ];
    }

    public render(): ReactElement {
        const { fetch }: State = this.state;

        return (
            <>
                <Row justify="space-between" align="middle" className="mb-3 px-3" style={{ backgroundColor: '#fff' }}>
                    <Col>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Employees</Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col>
                        <Link to="/employee">
                            <Button>
                                Create employee
                            </Button>
                        </Link>
                    </Col>
                </Row>
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
            </>
        );
    }
}
