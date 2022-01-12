import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import isEven from 'is-even';
import { libFunction } from 'core';

export const banana: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";


    const result: boolean = isEven(2);
    const result2 = libFunction();

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: result2
    };
};