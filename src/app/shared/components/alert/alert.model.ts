export class Alert {
    id: string;
    msgType: MsgType;
    alertType: AlertType;
    message: string;
    autoClose: boolean;
    keepAfterRouteChange: boolean;
    fade: boolean;
    duplicat: boolean;

    constructor(init?: Partial<Alert>) {
        Object.assign(this, init);
    }
}

export enum MsgType {
    Success,
    Error,
    Info,
    Warning
}

export enum AlertType {
    DEFAULT=0,
    ALINMA=1
}