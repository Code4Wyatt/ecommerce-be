export class HttpException extends Error {
    message: string;
    errorCode: any;
    statusCode: number;
    errors: ErrorCode;

    constructor(message: string, errorCode: ErrorCode, statusCode: number, errors: any) {
        super(message)

        this.message = message
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.errors = errors
    }
}

export enum ErrorCode {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INCORRECT_PASSWORD = 1003,
    ADDRESS_NOT_FOUND = 1004,
    NOT_USERS_ADDRESS = 1005,
    UNPROCESSABLE_ENTITY = 2001,
    INTERNAL_EXCEPTION = 3001,
    UNAUTHORISED = 4001,
    PRODUCT_NOT_FOUND = 5001,
}