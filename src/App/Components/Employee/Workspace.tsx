import { AxiosPromise, AxiosResponse } from 'axios';
import React, { Component, ReactNode } from 'react';
import {
    Link, Route, RouteComponentProps, Switch,
} from 'react-router-dom';
import {
    Breadcrumb, Button, Col, Layout, Menu, Row,
} from 'antd';
import { UserOutlined } from '@ant-design/icons';
import Http from '../../Providers/Http';
import { Response, Resource } from '../../Data/User';
import Skill from './Skill';
import Address from './Address';
import Form from './Form';
import Spin from '../Spinners/Spin';
import NotFound from '../Results/NotFound';

interface Params {
    userId: string
}

interface State {
    fetch: AxiosPromise<Response> | null;
}

interface Props extends RouteComponentProps<Params> { }

export default class Workspace extends Component<Props, State> {
    public state: State = {
        fetch: null,
    };

    /**
     * Store workspace user
     */
    protected user: Resource | null = null;

    public constructor(props: Props, state: State) {
        super(props, state);

        this.onChange = this.onChange.bind(this);
    }

    public componentDidMount(): void {
        this.fetch();
    }

    /**
     * Fetch defined repository for get curren workspace user
     */
    protected fetch(): void {
        const key: number | null = this.getKey();

        if (key) {
            const fetch: AxiosPromise<Response> = this.repository(key);

            fetch
                .then((res: AxiosResponse<Response>): Resource => {
                    this.user = res.data.data;
                    return this.user;
                })
                .finally((): void => this.setState({ fetch: null }));

            this.setState({ fetch });
        }
    }

    /**
     * Data repository
     */
    // eslint-disable-next-line class-methods-use-this
    protected repository(id: number): AxiosPromise<Response> {
        return Http.get(`user/${id}`);
    }

    /**
     * Get current identifier
     */
    public getKey(): number | null {
        const { match: { params: { userId } } }: Props = this.props;

        return Number.parseInt(userId, 10) || null;
    }

    public onChange(user: Resource): void {
        const {
            history: { replace },
            match: { params: { userId }, url },
        }: Props = this.props;

        this.user = user;

        if (!userId) replace(`${url}/${user.id}`);
    }

    public render(): ReactNode {
        const { fetch }: State = this.state;
        const { match: { url }, location: { pathname } }: Props = this.props;
        const [, , , section, subId]: string[] = pathname.split('/');

        if (fetch) return <Spin />;

        if (this.getKey() && this.user === null) return <NotFound />;

        return (
            <>
                <Row justify="space-between" align="middle" className="mb-3 px-3" style={{ backgroundColor: '#fff' }}>
                    <Col>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>
                                <Link to="/employees">
                                    Employees
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link to={url}>
                                    {`Employee ${this.user?.id ?? ''}`}
                                </Link>
                            </Breadcrumb.Item>
                            {(section === 'skills' || section === 'skill') && (
                                <Breadcrumb.Item>
                                    <Link to={`${url}/skills`}>Skills</Link>
                                </Breadcrumb.Item>
                            )}
                            {section === 'skill' && (
                                <Breadcrumb.Item>{`Skill ${subId ?? ''}`}</Breadcrumb.Item>
                            )}
                            {(section === 'addresses' || section === 'address') && (
                                <Breadcrumb.Item>
                                    <Link to={`${url}/skills`}>Addresses</Link>
                                </Breadcrumb.Item>
                            )}
                            {section === 'address' && (
                                <Breadcrumb.Item>{`Address ${subId ?? ''}`}</Breadcrumb.Item>
                            )}
                        </Breadcrumb>
                    </Col>
                    <Col>
                        {section === 'skills' && (
                            <Link to={`${url}/skill`}>
                                <Button>Create skill</Button>
                            </Link>
                        )}

                        {section === 'addresses' && (
                            <Link to={`${url}/address`}>
                                <Button>Create Address</Button>
                            </Link>
                        )}
                    </Col>
                </Row>

                <Layout>
                    <Layout.Sider theme="light">
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={[section]}
                            defaultOpenKeys={['main-stub']}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            <Menu.SubMenu key="main-stub" icon={<UserOutlined />} title="Employee">
                                <Menu.Item key="profile" isSelected={!section}>
                                    Profile
                                    <Link to={`${url}`} />
                                </Menu.Item>
                                {this.user && [
                                    (
                                        <Menu.Item key="skills">
                                            Skills
                                            <Link to={`${url}/skills`} />
                                        </Menu.Item>
                                    ),
                                    (
                                        <Menu.Item key="addresses">
                                            Addresses
                                            <Link to={`${url}/addresses`} />
                                        </Menu.Item>
                                    ),
                                ]}
                            </Menu.SubMenu>
                        </Menu>
                    </Layout.Sider>
                    <Layout.Content className="pl-3">
                        <Switch>
                            <Route exact path={url}>
                                <Form user={this.user} onChange={this.onChange} />
                            </Route>
                            {this.user && (
                                <>
                                    <Route exact path={`${url}/skills`}>
                                        <Skill.Grid user={this.user} />
                                    </Route>
                                    <Route
                                        exact
                                        path={`${url}/skill/:skillId?`}
                                        render={
                                            (props): ReactNode => {
                                                if (this.user) return <Skill.Workspace {...props} user={this.user} />;

                                                return null;
                                            }
                                        }
                                    />
                                    <Route exact path={`${url}/addresses`}>
                                        <Address.Grid user={this.user} />
                                    </Route>
                                    <Route
                                        exact
                                        path={`${url}/address/:addressId?`}
                                        render={
                                            (props): ReactNode => {
                                                if (this.user) return <Address.Workspace {...props} user={this.user} />;

                                                return null;
                                            }
                                        }
                                    />
                                </>
                            )}
                        </Switch>
                    </Layout.Content>
                </Layout>
            </>
        );
    }
}
