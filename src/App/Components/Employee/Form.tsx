import React, { Component, ReactElement, RefObject } from 'react';
import {
    Button, Col, DatePicker, Divider, Form, Input, Row,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import moment, { Moment } from 'moment';
import { AxiosPromise, AxiosResponse } from 'axios';
import { Store } from 'antd/lib/form/interface';
import Http from '../../Providers/Http';
import {
    Resource, Payload, Response, Request,
} from '../../Data/User';

interface Props {
    user: Resource | null;
    onChange: (user: Resource) => void;
}

interface State {
    fetch: AxiosPromise<Response> | null;
}

export default class EmployeeForm extends Component<Props, State> {
    protected form: RefObject<FormInstance> = React.createRef<FormInstance>();

    public state: State = {
        fetch: null,
    };

    public constructor(props: Props, state: State) {
        super(props, state);

        this.submit = this.submit.bind(this);
    }

    public componentDidMount(): void {
        const { user }: Props = this.props;

        if (user) this.setPayload(user.attributes);
    }

    protected submit(): void {
        const { user, onChange }: Props = this.props;
        const attrs: Payload = this.getPayload();
        const fetch: AxiosPromise<Response> = this.repository(attrs, user?.id);

        fetch.then((res: AxiosResponse<Response>): Resource => {
            onChange(res.data.data);

            return res.data.data;
        });

        fetch.finally(() => this.setState({ fetch: null }));

        this.setState({ fetch });
    }

    // eslint-disable-next-line class-methods-use-this
    protected repository(attrs: Payload, id: number | null = null): AxiosPromise<Response> {
        const json: Request = { data: { attributes: attrs } };

        return id ? Http.patch(`user/${id}`, json) : Http.post('user', json);
    }

    protected getPayload(): Payload {
        if (!this.form.current) return {} as Payload;

        const values: Store = this.form.current.getFieldsValue();

        return {
            name: values.name,
            last_name: values.last_name,
            email: values.email,
            username: values.username,
            born_date: (values.born_date as Moment).format('YYYY-MM-DD'),
        };
    }

    protected setPayload(attrs: Payload): void {
        if (!this.form.current) return;

        this.form.current.setFieldsValue({
            name: attrs.name,
            last_name: attrs.last_name,
            email: attrs.email,
            username: attrs.username,
            born_date: moment(attrs.born_date),
        });
    }

    public render(): ReactElement {
        const { fetch }: State = this.state;

        return (
            <div className="p-3" style={{ backgroundColor: '#fff' }}>
                <Divider orientation="left">Employee</Divider>
                <Form
                    ref={this.form}
                    onFinish={this.submit}
                    name="employee"
                    size="large"
                    labelCol={{ xs: 24, sm: 6 }}
                >
                    <Form.Item label="Name(s)" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Surname(s)" name="last_name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="e-mail" name="email" rules={[{ required: true }]}>
                        <Input type="email" />
                    </Form.Item>
                    <Form.Item label="Username" name="username" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Born date" name="born_date" rules={[{ required: true }]}>
                        <DatePicker format="DD/MM/YYYY" />
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
