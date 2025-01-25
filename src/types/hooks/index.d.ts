export type IActionWithPayload<T = string, P = any, C = {}> = {
    type: T;
    payload: P;
} & C;