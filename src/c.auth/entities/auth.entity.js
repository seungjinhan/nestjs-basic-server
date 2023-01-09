"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TokenEntity = exports.Auth = void 0;
var swagger_1 = require("@nestjs/swagger");
var Auth = /** @class */ (function () {
    function Auth() {
    }
    return Auth;
}());
exports.Auth = Auth;
var TokenEntity = /** @class */ (function () {
    function TokenEntity() {
    }
    __decorate([
        (0, swagger_1.ApiProperty)()
    ], TokenEntity.prototype, "id");
    __decorate([
        (0, swagger_1.ApiProperty)()
    ], TokenEntity.prototype, "userId");
    __decorate([
        (0, swagger_1.ApiProperty)()
    ], TokenEntity.prototype, "token");
    __decorate([
        (0, swagger_1.ApiProperty)()
    ], TokenEntity.prototype, "created");
    __decorate([
        (0, swagger_1.ApiProperty)()
    ], TokenEntity.prototype, "updated");
    return TokenEntity;
}());
exports.TokenEntity = TokenEntity;
