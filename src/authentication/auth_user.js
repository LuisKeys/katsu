"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUser = void 0;
var authUser = function (user, password) {
    if (user === process.env.AUTH_USER && password === process.env.AUTH_PASSWORD) {
        return true;
    }
    return false;
};
exports.authUser = authUser;
