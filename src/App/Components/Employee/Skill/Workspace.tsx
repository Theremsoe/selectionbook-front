import React, { Component, ReactNode } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { AxiosPromise, AxiosResponse } from 'axios';
import Form from './Form';
import { Resource, Response } from '../../../Data/Skill';
import { Resource as UserResource } from '../../../Data/User';
import Spin from '../../Spinners/Spin';
import Http from '../../../Providers/Http';
import NotFound from '../../Results/NotFound';

interface Params {
    userId: string,
    skillId: string,
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

    protected skill: Resource | null = null;

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
                    this.skill = res.data.data;

                    return this.skill;
                })
                .finally((): void => this.setState({ fetch: null }));

            this.setState({ fetch });
        }
    }

    protected repository(): AxiosPromise<Response> {
        const { user }: Props = this.props;

        return Http.get(`${user.relationships.skill.links.self}/${this.getKey()}`);
    }

    protected getKey(): number | null {
        const { match: { params: { skillId } } }: Props = this.props;

        return Number.parseInt(skillId, 10) || null;
    }

    public onChange(skill: Resource): void {
        const {
            history: { replace },
            match: { params: { skillId }, url },
        }: Props = this.props;

        this.skill = skill;

        if (!skillId) replace(`${url}/${skill.id}`);
    }

    public render(): ReactNode {
        const { fetch }: State = this.state;
        const { user }: Props = this.props;

        if (fetch) return <Spin />;
        if (this.getKey() && !this.skill) return <NotFound />;

        return <Form user={user} skill={this.skill} onChange={this.onChange} />;
    }
}
