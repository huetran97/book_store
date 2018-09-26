declare var global: NodeJS.Global;

declare namespace NodeJS {
    export interface Global {
        access_token: string
    }
}
