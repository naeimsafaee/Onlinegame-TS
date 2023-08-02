import * as http from 'http';
import * as https from 'https';
import {URL} from "node:url";
import {RequestOptions} from "https";

enum Methods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

interface Parameter {
    key: string,
    value: string
}

class Http {

    static get(url: string): Request {
        return new Request(url, Methods.GET);
    }

    static post(url: string): Request {
        return new Request(url, Methods.POST);
    }

}

class Request {

    private readonly url: string;
    private method: Methods;
    private headers: any = {}
    private body: any = {}
    private raw: any = {}
    private query: Parameter[] = []

    constructor(url: string, method: Methods) {
        this.url = url;
        this.method = method
    }

    addHeaders(header: Parameter): Request {
        this.headers[header.key] = header.value
        return this;
    }

    addBodyParameter(body: Parameter): Request {
        this.body[body.key] = body.value
        return this;
    }

    addRawParameter(body: Parameter): Request {
        this.raw[body.key] = body.value
        return this;
    }

    addQueryParameter(body: Parameter): Request {
        this.query.push(body)
        return this;
    }

    build(): Response {

        const options: https.RequestOptions | http.RequestOptions = {
            headers: this.headers,
            method: this.method
        }

        const response = new Response();

        const body = this.body.length > 0 ? this.body : false;
        const raw = this.raw;

        new Queue(this.url, options, response, body, raw, this.query)

        return response;
    }


}

class Response {

    public StringCallback: ((data: string) => void) | undefined
    public ErrorCallback: ((data: string) => void) | undefined

    getAsString(cb: (data: string) => void): Response {
        this.StringCallback = cb;
        return this;
    }

    getAsJSONArray(cb: (data: string) => void): Response {
        return this;
    }

    getError(cb: (error: string) => void) {
        this.ErrorCallback = cb;
        return this;
    }
}

class Queue {

    private responseEmitter: Response;

    constructor(url: string,
                options: https.RequestOptions | http.RequestOptions,
                response: Response, body: any, raw: any, query: Parameter[]) {

        if (query.length > 0) {
            url += "?";
            let queries = [];
            for (let i = 0; i < query.length; i++) {
                queries.push(query[i].key + "=" + query[i].value);
            }

            url += queries.join('&');
        }

        const _url = new URL(url);

        options.hostname = _url.hostname;
        options.protocol = _url.protocol;
        options.path = _url.pathname;

        const client = (_url.protocol == "https:") ? https : http;
        this.responseEmitter = response;

        console.log(_url)
        console.log(options.path)

        const req = client.request({
            method: options.method,
            ...options,
        }, res => {

            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });

            res.on('end', () => {
                try {
                    if (this.responseEmitter.StringCallback)
                        this.responseEmitter.StringCallback(rawData)
                } catch (e) {
                    if (this.responseEmitter.ErrorCallback)
                        this.responseEmitter.ErrorCallback((e as Error).message)
                }
                /*
                switch(res.headers['content-type']) {
                    case 'application/json':
                        resBody = JSON.parse(resBody);
                        break;
                }*/
            })
        })
        req.on('error', (e) => {
            if (this.responseEmitter.ErrorCallback)
                this.responseEmitter.ErrorCallback(e.message)
        });

        if (raw) {
            req.write(JSON.stringify(raw));
        }

        req.end();

        /*const req = client.get(_url, options, (res: http.IncomingMessage): void => {

            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });

            res.on('end', () => {
                try {
                    if (this.responseEmitter.StringCallback)
                        this.responseEmitter.StringCallback(rawData)
                } catch (e) {
                    if (this.responseEmitter.ErrorCallback)
                        this.responseEmitter.ErrorCallback((e as Error).message)
                }
            });

        });

        /!*if(body){
            req.write(body)
        }*!/

        req.on('error', (e) => {
            if (this.responseEmitter.ErrorCallback)
                this.responseEmitter.ErrorCallback(e.message)
        });

        if(raw){
            req.write(JSON.stringify(raw));
        }


        req.end();*/

    }


}

export default Http
