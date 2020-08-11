import {
    Button, Col, Divider, Form, Input, Row,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Store } from 'antd/lib/form/interface';
import { AxiosPromise, AxiosResponse } from 'axios';
import React, { Component, ReactNode, RefObject } from 'react';
import {
    Response, Resource, Payload, Request,
} from '../../../Data/Skill';
import { Resource as UserResource } from '../../../Data/User';
import Http from '../../../Providers/Http';

interface Props {
    user: UserResource,
    skill: Resource | null,
    onChange: (skill: Resource) => void;
}

interface State {
    fetch: AxiosPromise<Response> | null;
}

export default class SkillFrom extends Component<Props, State> {
    protected form: RefObject<FormInstance> = React.createRef<FormInstance>();

    public state: State = {
        fetch: null,
    };

    public constructor(props: Props, state: State) {
        super(props, state);

        this.submit = this.submit.bind(this);
    }

    public componentDidMount(): void {
        const { skill }: Props = this.props;

        if (skill) this.setPayload(skill.attributes);
    }

    protected submit(): void {
        const { skill, onChange }: Props = this.props;
        const attrs: Payload = this.getPayload();
        const fetch: AxiosPromise<Response> = this.repository(attrs, skill?.id);

        fetch.then((res: AxiosResponse<Response>): Resource => {
            onChange(res.data.data);

            return res.data.data;
        });

        fetch.finally(() => this.setState({ fetch: null }));

        this.setState({ fetch });
    }

    protected repository(attrs: Payload, id: number | null = null): AxiosPromise<Response> {
        const json: Request = { data: { attributes: attrs } };
        const { user }: Props = this.props;

        return id
            ? Http.patch(`${user.relationships.skill.links.self}/${id}`, json)
            : Http.post(user.relationships.skill.links.self, json);
    }

    protected getPayload(): Payload {
        if (!this.form.current) return {} as Payload;

        const values: Store = this.form.current.getFieldsValue();

        return {
            name: values.name,
            details: values.details,
        };
    }

    protected setPayload(attrs: Payload): void {
        if (!this.form.current) return;

        this.form.current.setFieldsValue({
            name: attrs.name,
            details: attrs.details,
        });
    }

    public render(): ReactNode {
        const { fetch }: State = this.state;

        return (
            <div className="p-3" style={{ backgroundColor: '#fff' }}>
                <Divider orientation="left">Skill</Divider>
                <Form
                    ref={this.form}
                    onFinish={this.submit}
                    name="skill"
                    size="large"
                    labelCol={{ xs: 24, sm: 6 }}
                >
                    <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Details" name="details">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Row justify="center" gutter={[24, 16]} className="my-4">
                            <Col>
                                <Button type="primary" htmlType="submit" loading={!!fetch}>Save</Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}
