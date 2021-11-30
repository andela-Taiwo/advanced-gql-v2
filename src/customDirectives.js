const { SchemaDirectiveVisitor, AuthenticationError } = require("apollo-server");
const { defaultFieldResolver, GraphQLString } = require("graphql");
const { formatDate } = require("./utils");

class LogDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;

    // To pass argument to directive from client, modify field.args
    field.args.push({
      type: GraphQLString,
      name: "message",
    });

    field.resolve = (root, { message, ...rest }, ctx, info) => {
      const { message: schemaMessage } = this.args; // to get schema or field argument on directive
      return resolver.call(this, root, rest, ctx, info);
    };
  }
  visitedType;
}

class DateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    const { format: schemaFormat } = this.args;
    field.args.push({
      type: GraphQLString,
      name: "format",
    });
    field.resolve = async (root, { format, ...rest }, ctx, info) => {
      // field.resolve = async (...args) => {
      const dateFormat = format || schemaFormat;
      const result = await resolver.call(this, root, rest, ctx, info);
      return formatDate(result, dateFormat);
    };
  }
}

class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    field.resolve = async (root, args, ctx, info) => {
      if (ctx.user) {
        return resolver(root,args, ctx, info);
        
      };
      throw new AuthenticationError("Not Authenticated!")
    };
  }
}

class AuthorizationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const resolver = field.resolve || defaultFieldResolver;
    const {role} = this.args
    field.resolve = async (root, args, ctx, info) => {
      if (ctx.user && ctx.user.role === role) {
        return resolver(root, args, ctx, info);
      } else {
        throw new AuthenticationError("Not Authorized!");
      }
    };
  }
}
module.exports = {
  LogDirective,
  DateDirective,
  AuthenticationDirective,
  AuthorizationDirective,
};
