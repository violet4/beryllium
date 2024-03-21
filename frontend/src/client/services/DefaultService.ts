/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProcessNewSchema } from '../models/ProcessNewSchema';
import type { ProcessSchema } from '../models/ProcessSchema';
import type { WebappNewSchema } from '../models/WebappNewSchema';
import type { WebappSchema } from '../models/WebappSchema';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * List Webapps
     * @returns WebappSchema Successful Response
     * @throws ApiError
     */
    public static listWebappsAppsGet(): CancelablePromise<Array<WebappSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/apps',
        });
    }
    /**
     * Create Webapp
     * @returns WebappSchema Successful Response
     * @throws ApiError
     */
    public static createWebappAppsPost({
        requestBody,
    }: {
        requestBody: WebappNewSchema,
    }): CancelablePromise<WebappSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/apps',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Webapp
     * @returns WebappSchema Successful Response
     * @throws ApiError
     */
    public static getWebappAppsAppNameGet({
        appName,
    }: {
        appName: string,
    }): CancelablePromise<WebappSchema> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/apps/{app_name}',
            path: {
                'app_name': appName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Start Webapp
     * @returns any Successful Response
     * @throws ApiError
     */
    public static startWebappAppsAppNamePost({
        appName,
    }: {
        appName: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/apps/{app_name}',
            path: {
                'app_name': appName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Stop Webapp
     * @returns any Successful Response
     * @throws ApiError
     */
    public static stopWebappAppsAppNamePut({
        appName,
    }: {
        appName: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/apps/{app_name}',
            path: {
                'app_name': appName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Webapp
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteWebappAppsAppNameDelete({
        appName,
    }: {
        appName: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/apps/{app_name}',
            path: {
                'app_name': appName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List Processes
     * @returns ProcessSchema Successful Response
     * @throws ApiError
     */
    public static listProcessesProcessesWebappIdGet({
        webappId,
    }: {
        webappId: number,
    }): CancelablePromise<Array<ProcessSchema>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/processes/{webapp_id}',
            path: {
                'webapp_id': webappId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Process
     * @returns ProcessSchema Successful Response
     * @throws ApiError
     */
    public static createProcessProcessesWebappIdPost({
        webappId,
        requestBody,
    }: {
        webappId: number,
        requestBody: ProcessNewSchema,
    }): CancelablePromise<ProcessSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/processes/{webapp_id}',
            path: {
                'webapp_id': webappId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Start Process
     * @returns ProcessSchema Successful Response
     * @throws ApiError
     */
    public static startProcessProcessesStartProcessIdPost({
        processId,
    }: {
        processId: number,
    }): CancelablePromise<ProcessSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/processes/start/{process_id}',
            path: {
                'process_id': processId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Stop Process
     * @returns ProcessSchema Successful Response
     * @throws ApiError
     */
    public static stopProcessProcessesStopProcessIdPut({
        processId,
    }: {
        processId: number,
    }): CancelablePromise<ProcessSchema> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/processes/stop/{process_id}',
            path: {
                'process_id': processId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Process
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteProcessProcessesProcessIdDelete({
        processId,
    }: {
        processId: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/processes/{process_id}',
            path: {
                'process_id': processId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
