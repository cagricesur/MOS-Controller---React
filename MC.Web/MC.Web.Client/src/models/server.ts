


    // $Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes$Classes/Enums/Interfaces(filter)[template][separator]
    // filter (optional): Matches the name or full name of the current item. * = match any, wrap in [] to match attributes or prefix with : to match interfaces or base classes.
    // template: The template to repeat for each matched item
    // separator (optional): A separator template that is placed between all templates e.g. [public : ][, ]

    // More info: http://frhagn.github.io/Typewriter/


    
    export enum UserStatusEnum { 
        
        Unknown,
        Active,
        Passive,
    }
    export enum UserRoleEnum { 
        
        Unknown,
        Administrator,
        Member,
    }

    
    export interface BaseRequest {
        
        successMessage?:string;
    }
    export interface BaseResponse {
        
        error?:Error;
        isSuccess:boolean;
    }
    export interface Config {
        
        key:string;
        value:string;
        description?:string;
    }
    export interface Error {
        
        code:string;
    }
    export interface Menu {
        
        id:string;
        parentID?:string;
        caption:string;
        path?:string;
        icon:string;
    }
    export interface State {
        
        id:string;
        caption:string;
        description?:string;
        rows:StateRow[];
        columns:StateColumn[];
        creationDate:Date;
    }
    export interface StateRow {
        
        id:string;
        codeStart:number;
        codeEnd:number;
    }
    export interface StateColumn {
        
        id:string;
        position:number;
        caption:string;
        color?:string;
        code:string;
    }
    export interface User {
        
        id:string;
        userName:string;
        firstName:string;
        lastName:string;
        status:UserStatusEnum;
        role:UserRoleEnum;
    }
    export interface AddResourceRequest extends BaseRequest {
        
        key:string;
        value:string;
        language:string;
    }
    export interface AddStateRequest extends BaseRequest {
        
        state:State;
    }
    export interface AddUserRequest extends BaseRequest {
        
        userName:string;
        firstName:string;
        lastName:string;
        password?:string;
    }
    export interface AuthenticationRequest extends BaseRequest {
        
        userName:string;
        password:string;
    }
    export interface DeleteStateRequest extends BaseRequest {
        
        id:string;
    }
    export interface DeleteUserRequest extends BaseRequest {
        
        id:string;
    }
    export interface GetConfigsRequest extends BaseRequest {
        
    }
    export interface GetMenusRequest extends BaseRequest {
        
        role:UserRoleEnum;
    }
    export interface GetResourcesRequest extends BaseRequest {
        
        language:string;
    }
    export interface GetStateRequest extends BaseRequest {
        
        id:string;
    }
    export interface GetUserRequest extends BaseRequest {
        
        id:string;
    }
    export interface ListStatesRequest extends BaseRequest {
        
    }
    export interface ListUsersRequest extends BaseRequest {
        
    }
    export interface PushCommandRequest extends BaseRequest {
        
        command:string;
        stateID:string;
    }
    export interface RefreshTokenRequest extends BaseRequest {
        
        userName:string;
        token:string;
    }
    export interface UpdateConfigsRequest extends BaseRequest {
        
        config:Config;
    }
    export interface UpdateStateRequest extends BaseRequest {
        
        id:string;
        state:State;
    }
    export interface UpdateUserRequest extends BaseRequest {
        
        id:string;
        status:UserStatusEnum;
    }
    export interface AddResourceResponse extends BaseResponse {
        
        resources:Record<string, string>;
    }
    export interface AddStateResponse extends BaseResponse {
        
    }
    export interface AddUserResponse extends BaseResponse {
        
    }
    export interface AuthenticationResponse extends BaseResponse {
        
        user?:User;
        token?:string;
        tokenExpiration?:Date;
    }
    export interface DeleteStateResponse extends BaseResponse {
        
    }
    export interface DeleteUserResponse extends BaseResponse {
        
    }
    export interface GetConfigsResponse extends BaseResponse {
        
        configs:Config[];
    }
    export interface GetMenusResponse extends BaseResponse {
        
        menus:Menu[];
    }
    export interface GetResourcesResponse extends BaseResponse {
        
        resources:Record<string, string>;
    }
    export interface GetStateResponse extends BaseResponse {
        
        state?:State;
    }
    export interface GetUserResponse extends BaseResponse {
        
        user?:User;
    }
    export interface ListStatesResponse extends BaseResponse {
        
        states:State[];
    }
    export interface ListUsersResponse extends BaseResponse {
        
        users:User[];
    }
    export interface PushCommandResponse extends BaseResponse {
        
    }
    export interface RefreshTokenResponse extends BaseResponse {
        
        token?:string;
        tokenExpiration?:Date;
    }
    export interface UpdateConfigsResponse extends BaseResponse {
        
    }
    export interface UpdateStateResponse extends BaseResponse {
        
    }
    export interface UpdateUserResponse extends BaseResponse {
        
    }


