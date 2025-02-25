import deepmerge from 'deepmerge';
import omit from 'lodash/omit';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var $schema = "https://json-schema.org/draft/2020-12/schema";
var SchemaBuilder = /** @class */ (function () {
    function SchemaBuilder(s) {
        this.schema = s;
    }
    SchemaBuilder.prototype.apply = function (builder) {
        this.schema = deepmerge(this.schema, builder.schema);
    };
    SchemaBuilder.prototype.toSchema = function () {
        return this.schema;
    };
    SchemaBuilder.prototype.toSchemaDocument = function () {
        if (typeof this.schema === "boolean") {
            return this.schema;
        }
        return __assign({ $schema: $schema }, this.schema);
    };
    return SchemaBuilder;
}());
var objectBuilder = function (schema) {
    return new SchemaBuilder(__assign({}, schema));
};
function object(options) {
    var _a;
    var properties = (options === null || options === void 0 ? void 0 : options.properties) || [];
    var additionalOptions = omit(options, [
        "properties",
        "propertyNames",
        "additionalProperties",
        "defs",
    ]);
    var schema = new SchemaBuilder(__assign({ type: "object" }, additionalOptions));
    for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
        var property_1 = properties_1[_i];
        schema.apply(property_1);
    }
    if (options === null || options === void 0 ? void 0 : options.propertyNames) {
        schema.apply(objectBuilder({
            propertyNames: {
                pattern: options.propertyNames,
            },
        }));
    }
    if (options === null || options === void 0 ? void 0 : options.additionalProperties) {
        schema.apply(objectBuilder({
            additionalProperties: (_a = options.additionalProperties) === null || _a === void 0 ? void 0 : _a.toSchema(),
        }));
    }
    if (options === null || options === void 0 ? void 0 : options.defs) {
        for (var _b = 0, _c = options.defs; _b < _c.length; _b++) {
            var def_1 = _c[_b];
            schema.apply(def_1);
        }
    }
    return schema;
}
function properties() {
    var props = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        props[_i] = arguments[_i];
    }
    var schema = new SchemaBuilder({});
    for (var _a = 0, props_1 = props; _a < props_1.length; _a++) {
        var property_2 = props_1[_a];
        schema.apply(property_2);
    }
    return schema;
}
function requiredProperty(name, schema, options) {
    var _a, _b;
    var _c;
    return objectBuilder(Object.assign({
        properties: (_a = {},
            _a[name] = schema.toSchema(),
            _a),
        required: [name],
    }, (options === null || options === void 0 ? void 0 : options.dependentSchema)
        ? { dependentSchemas: (_b = {}, _b[name] = (_c = options.dependentSchema) === null || _c === void 0 ? void 0 : _c.toSchema(), _b) }
        : {}));
}
function property(name, schema, options) {
    var _a, _b, _c;
    var _d;
    return objectBuilder(Object.assign({
        properties: (_a = {},
            _a[name] = schema.toSchema(),
            _a),
    }, (options === null || options === void 0 ? void 0 : options.dependsOn) ? { dependentRequired: (_b = {}, _b[name] = options.dependsOn, _b) } : {}, (options === null || options === void 0 ? void 0 : options.dependentSchema)
        ? { dependentSchemas: (_c = {}, _c[name] = (_d = options.dependentSchema) === null || _d === void 0 ? void 0 : _d.toSchema(), _c) }
        : {}));
}
function patternProperty(pattern, schema) {
    var _a;
    return objectBuilder({
        patternProperties: (_a = {},
            _a[pattern] = schema.toSchema(),
            _a),
    });
}
var arrayBuilder = function (schema) {
    return new SchemaBuilder(__assign({}, schema));
};
function array(options) {
    var additionalOptions = omit(options, [
        "items",
        "prefixItems",
        "unevaluatedItems",
        "contains",
        "defs",
    ]);
    var schema = new SchemaBuilder(__assign({ type: "array" }, additionalOptions));
    var items = options === null || options === void 0 ? void 0 : options.items;
    if (typeof items !== "undefined") {
        if (typeof items === "boolean") {
            schema.apply(arrayBuilder({
                items: items,
            }));
        }
        else {
            schema.apply(arrayBuilder({ items: items.toSchema() }));
        }
    }
    if (options === null || options === void 0 ? void 0 : options.prefixItems) {
        for (var _i = 0, _a = options.prefixItems; _i < _a.length; _i++) {
            var item = _a[_i];
            schema.apply(arrayBuilder({ prefixItems: [item.toSchema()] }));
        }
    }
    var unevaluatedItems = options === null || options === void 0 ? void 0 : options.unevaluatedItems;
    if (typeof unevaluatedItems !== "undefined") {
        if (typeof unevaluatedItems === "boolean") {
            schema.apply(arrayBuilder({
                unevaluatedItems: unevaluatedItems,
            }));
        }
        else {
            schema.apply(arrayBuilder({ unevaluatedItems: unevaluatedItems.toSchema() }));
        }
    }
    if (options === null || options === void 0 ? void 0 : options.contains) {
        schema.apply(arrayBuilder({
            contains: options.contains.schema.toSchema(),
            minContains: options.contains.min,
            maxContains: options.contains.max,
        }));
    }
    if (options === null || options === void 0 ? void 0 : options.defs) {
        for (var _b = 0, _c = options.defs; _b < _c.length; _b++) {
            var def_2 = _c[_b];
            schema.apply(def_2);
        }
    }
    return schema;
}
function string(options) {
    return new SchemaBuilder(__assign({ type: "string" }, options));
}
function integer(options) {
    return new SchemaBuilder(__assign({ type: "integer" }, options));
}
function number(options) {
    return new SchemaBuilder(__assign({ type: "number" }, options));
}
function nil(options) {
    return new SchemaBuilder(__assign({ type: "null" }, options));
}
function boolean(options) {
    return new SchemaBuilder(__assign({ type: "boolean" }, options));
}
function nullable(schema) {
    var nullableSchema = schema.toSchema();
    if (typeof nullableSchema === "boolean" ||
        nullableSchema.type === "null" ||
        typeof nullableSchema.type === "undefined") {
        return schema;
    }
    var type = Array.isArray(nullableSchema.type)
        ? nullableSchema.type.concat("null")
        : [nullableSchema.type, "null"];
    return new SchemaBuilder(__assign(__assign({}, nullableSchema), { type: type }));
}
function anyOf() {
    var schemas = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        schemas[_i] = arguments[_i];
    }
    return new SchemaBuilder({
        anyOf: schemas.map(function (s) { return s.toSchema(); }),
    });
}
function allOf() {
    var schemas = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        schemas[_i] = arguments[_i];
    }
    return new SchemaBuilder({
        allOf: schemas.map(function (s) { return s.toSchema(); }),
    });
}
function oneOf() {
    var schemas = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        schemas[_i] = arguments[_i];
    }
    return new SchemaBuilder({
        oneOf: schemas.map(function (s) { return s.toSchema(); }),
    });
}
function not(schema) {
    return new SchemaBuilder({
        not: schema.toSchema(),
    });
}
function concat() {
    var schemas = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        schemas[_i] = arguments[_i];
    }
    return new SchemaBuilder(schemas.reduce(function (acc, s) {
        var schema = s.toSchema();
        if (typeof acc === "boolean") {
            if (typeof schema === "boolean") {
                return acc || schema;
            }
            else {
                return schema;
            }
        }
        else if (typeof schema === "boolean") {
            return acc;
        }
        return __assign(__assign({}, acc), schema);
    }, {}));
}
function ifThenElse(condition, then, thenElse) {
    return new SchemaBuilder({
        if: condition.toSchema(),
        then: then.toSchema(),
        else: thenElse.toSchema(),
    });
}
function ifThen(condition, then) {
    return new SchemaBuilder({
        if: condition.toSchema(),
        then: then.toSchema(),
    });
}
function def(name, schema) {
    var _a;
    return new SchemaBuilder({
        $defs: (_a = {},
            _a[name] = schema.toSchema(),
            _a),
    });
}
function ref(def) {
    return new SchemaBuilder({
        $ref: "#/$defs/".concat(def),
    });
}
function constant(value) {
    return new SchemaBuilder({
        const: value,
    });
}
function enumerator() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    return new SchemaBuilder({
        enum: values,
    });
}
function $false() {
    return new SchemaBuilder(false);
}
function $true() {
    return new SchemaBuilder(true);
}
var s = {
    object: object,
    properties: properties,
    requiredProperty: requiredProperty,
    property: property,
    patternProperty: patternProperty,
    array: array,
    string: string,
    integer: integer,
    number: number,
    nil: nil,
    boolean: boolean,
    nullable: nullable,
    anyOf: anyOf,
    allOf: allOf,
    oneOf: oneOf,
    not: not,
    concat: concat,
    ifThenElse: ifThenElse,
    ifThen: ifThen,
    def: def,
    ref: ref,
    constant: constant,
    enumerator: enumerator,
    $false: $false,
    $true: $true,
};

export { $schema, SchemaBuilder, s };
