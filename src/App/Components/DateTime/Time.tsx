import React, { PureComponent, ReactNode } from 'react';
import { DateTime } from 'luxon';

interface Props {
    datetime: string,
    format?: Intl.DateTimeFormatOptions
}

export default class Time extends PureComponent<Props> {
    public render(): ReactNode {
        const zone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const { datetime, format }: Props = this.props;

        return (
            <time dateTime={datetime}>
                {DateTime.fromISO(datetime, { zone }).toLocaleString(format || DateTime.DATE_SHORT)}
            </time>
        );
    }
}
