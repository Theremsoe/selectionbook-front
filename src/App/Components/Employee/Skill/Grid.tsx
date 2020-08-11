import { Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import { AxiosPromise, AxiosResponse } from 'axios';
import React, { Component, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Collection as SkillCollection, Resource as SkillResource } from '../../../Data/Skill';
import { Resource as UserResource } from '../../../Data/User';
import Http from '../../../Providers/Http';

interface State {
    fetch: AxiosPromise<SkillCollection> | null;
}

interface Props {
    user: UserResource
}

export default class Grid extends Component<Props, State> {
    protected data: SkillCollection | null = null;

    public state: State = {
        fetch: null,
    };

    public componentDidMount(): void {
        this.fetch();
    }

    protected fetch(page = 1): void {
        const fetch: AxiosPromise<SkillCollection> = this.repository({ page });

        fetch
            .then((res: AxiosResponse<SkillCollection>): SkillCollection => {
                this.data = res.data;

                return this.data;
            })
            .finally((): void => {
                this.setState({ fetch: null });
            });

        this.setState({ fetch });
    }

    protected repository(params: Record<string, unknown>): AxiosPromise<SkillCollection> {
        const { user }: Props = this.props;

        return Http.get(user.relationships.skill.links.self, { params });
    }

    protected columns(): ColumnProps<SkillResource>[] {
        return [
            {
                title: '#',
                dataIndex: 'id',
            },
            {
                title: 'Skill',
                dataIndex: ['attributes', 'name'],
            },
            {
                title: 'Details',
                dataIndex: ['attributes', 'details'],
            },
            {
                render: (item: UserResource): ReactNode => {
                    const { user }: Props = this.props;

                    return (<Link to={`/employee/${user.id}/skill/${item.id}`}>Edit</Link>);
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
