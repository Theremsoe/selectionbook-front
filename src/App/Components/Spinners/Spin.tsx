import React, { ReactNode, PureComponent } from 'react';
import { Spin as AntSpin, Col, Row } from 'antd';

export default class Spin extends PureComponent {
    public render(): ReactNode {
        return (
            <Row justify="center" className="py-5">
                <Col>
                    <AntSpin size="large" />
                </Col>
            </Row>
        );
    }
}
