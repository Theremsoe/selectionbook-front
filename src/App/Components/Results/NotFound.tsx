import { Button, Empty } from 'antd';
import React, { PureComponent, ReactNode } from 'react';

export default class NotFound extends PureComponent {
    public render(): ReactNode {
        return (
            <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{
                    height: 60,
                }}
                description={(
                    <span>
                        Resource not found
                    </span>
                )}
            >
                <Button type="primary">Create Now</Button>
            </Empty>
        );
    }
}
