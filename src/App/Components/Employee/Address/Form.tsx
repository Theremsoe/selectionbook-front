import {
    Button, Col, Divider, Form, Input, Row,
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Store } from 'antd/lib/form/interface';
import { AxiosPromise, AxiosResponse } from 'axios';
import React, { Component, ReactNode, RefObject } from 'react';
import Http from '../../../Providers/Http';
import {
    Response, Resource, Payload, Request,
} from '../../../Data/Address';
import { Resource as UserResource } from '../../../Data/User';

interface Props {
    user: UserResource,
    address: Resource | null,
    onChange: (address: Resource) => void;
}

interface State {
    fetch: AxiosPromise<Response> | null;
}

export default class AddressForm extends Component<Props, State> {
    protected form: RefObject<FormInstance> = React.createRef<FormInstance>();

    public state: State = {
        fetch: null,
    };

    public constructor(props: Props, state: State) {
        super(props, state);

        this.submit = this.submit.bind(this);
    }

    public componentDidMount(): void {
        const { address }: Props = this.props;

        if (address) this.setPayload(address.attributes);
    }

    protected submit(): void {
        const { address, onChange }: Props = this.props;
        const attrs: Payload = this.getPayload();
        const fetch: AxiosPromise<Response> = this.repository(attrs, address?.id);

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
            ? Http.patch(`${user.relationships.address.links.self}/${id}`, json)
            : Http.post(user.relationships.address.links.self, json);
    }

    protected getPayload(): Payload {
        if (!this.form.current) return {} as Payload;

        const values: Store = this.form.current.getFieldsValue();

        return {
            street: values.street,
            city: values.city,
            zipcode: values.zipcode,
            state: values.state,
            country: values.country,
            geometry: {
                type: 'Point',
                coordinates: [1, 1],
            },
        };
    }

    protected setPayload(attrs: Payload): void {
        if (!this.form.current) return;

        this.form.current.setFieldsValue({
            street: attrs.street,
            city: attrs.city,
            zipcode: attrs.zipcode,
            state: attrs.state,
            country: attrs.country,
        });
    }

    public render(): ReactNode {
        const { fetch }: State = this.state;

        return (
            <div className="p-3" style={{ backgroundColor: '#fff' }}>
                <Divider orientation="left">Address</Divider>
                <Form
                    ref={this.form}
                    onFinish={this.submit}
                    name="address"
                    size="large"
                    labelCol={{ xs: 24, sm: 6 }}
                >
                    <Form.Item label="Street" name="street" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="City" name="city" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Zipcode" name="zipcode" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="State" name="state" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Country" name="country" rules={[{ required: true }]}>
                        <Input />
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
