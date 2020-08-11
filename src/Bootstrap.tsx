import { Layout, Menu } from 'antd';
import React, { PureComponent, ReactElement } from 'react';
import {
    HashRouter as Router, Link, Route, Switch,
} from 'react-router-dom';
import Employee from './App/Components/Employee';

export default class Default extends PureComponent {
    public render(): ReactElement {
        return (
            <Router>
                <Layout style={{ minHeight: '100vh' }}>
                    <Layout.Header>
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                            <Menu.Item key="1">
                                Employees
                                <Link to="/employees" />
                            </Menu.Item>
                        </Menu>
                    </Layout.Header>
                    <Layout.Content>
                        <div className="container-fluid py-3">
                            <Switch>
                                <Route exact path="/employees" component={Employee.Grid} />
                                <Route extact path="/employee/:userId?" component={Employee.Workspace} />
                            </Switch>
                        </div>
                    </Layout.Content>
                    <Layout.Footer>Todos los derechos reservados</Layout.Footer>
                </Layout>
            </Router>
        );
    }
}
