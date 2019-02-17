module.exports = require('lodash').template(`
import * as jayson from "jayson/promise";
import * as Djv from "djv";

export default class <%= className %> {
  rpc: jayson.Client;

  constructor(options) {
    this.schema = JSON.parse(<%= JSON.stringify(methods) %>);
    if (options.transport === undefined || options.transport.type === undefined) {
      throw new Error("Invalid constructor params");
    }

    this.rpc = jayson.client[options.transport.type](options.transport);

    this.validators = {};
    methods.forEach((method) => {
      this.validators[method.name] = method.params.map((param) => new Djv().addSchema(method.name, param.schema));
    });
  }

  <% methods.forEach((method, i) => { %>
  <%= method.name %>(...params: Array<any>): jayson.JSONRPCRequest {
    params.forEach((param, i) => this.validators['<%= method.name %>'][i].validate(param));
    return this.rpc.request("<%= method.name %>", params);
  }
  <% }) %>
}
`);