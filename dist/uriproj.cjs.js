'use strict';

var proj4 = require('proj4');

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
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @description the keys of the cache are absolute uris
 */
var cache = {};
var ROOT_PREFIX = "http://www.opengis.net/def/crs";
function get(crsUri) {
    return cache[crsUri];
}
function set(authCode, projtxt) {
    cache[authCodeToUri(authCode)] = projtxt;
    return projtxt;
}
function load(crsUri) {
    return __awaiter(this, void 0, void 0, function () {
        var authCode, txt, _a, auth, code, res, wkt;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    authCode = parseCrsId(crsUri);
                    txt = get(authCode);
                    _a = authCode.split(":"), auth = _a[0], code = _a[1];
                    if (txt)
                        return [2 /*return*/, txt];
                    return [4 /*yield*/, fetch("https://spatialreference.org/ref/".concat(auth.toLocaleLowerCase(), "/").concat(code, "/prettywkt2.txt"))];
                case 1:
                    res = _b.sent();
                    if (!res.ok)
                        throw Error("Error fetching crs definition:".concat(res.status, " at url:").concat(res.url));
                    return [4 /*yield*/, res.text()];
                case 2:
                    wkt = _b.sent();
                    return [2 /*return*/, set(authCode, wkt)];
            }
        });
    });
}
/**
 * @description return a auth:code string
 */
function parseCrsId(crsuri) {
    if (crsuri.indexOf(ROOT_PREFIX) !== -1)
        return uriToAuthCode(crsuri);
    if (crsuri.split(":").length === 2)
        return crsuri;
    if (crsuri.split(":").length === 7)
        return uriToAuthCode(urnToUri(crsuri));
    throw Error("Invalid syntax");
}
/**
 *
 * @param crsuri a valid CRS uri
 * @returns the authority and code of the uri
 * http://www.opengis.net/def/crs/OGC/1.3/CRS84 -> OGC:CRS84
 */
function uriToAuthCode(crsuri) {
    if (crsuri.indexOf(ROOT_PREFIX) === -1)
        throw Error("Unsupported CRS URI:".concat(crsuri));
    var _a = crsuri.substring(ROOT_PREFIX.length).split("/"), auth = _a[1], code = _a[3];
    return "".concat(auth, ":").concat(code);
}
function authCodeToUri(authCode) {
    var parts = authCode.split(":");
    if (parts.length !== 2)
        throw Error("Invalid syntax. Should be <authority>:<code>");
    var version = 0;
    if (parts[1] === "CRS84")
        version = 1.3;
    return "".concat(ROOT_PREFIX, "/").concat(parts[0], "/").concat(version, "/").concat(parts[1]);
}
/**
 *
 * @param uri a deprecated urn identifier @example urn:ogc:def:crs:EPSG:6.3:26986
 */
function urnToUri(urn) {
    var _a = urn.split(":"), authority = _a[4], version = _a[5], code = _a[6];
    return "".concat(ROOT_PREFIX, "/").concat(authority, "/").concat(version, "/").concat(code);
}
/**
 *
 * @param from When a second argument is not provided, this will default to proj4's inbuilt EPSG:4326
 * @param to the crs to project the coordinates to
 */
function uriproj(to, from) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(from === undefined)) return [3 /*break*/, 2];
                    _a = proj4;
                    return [4 /*yield*/, load(to)];
                case 1: return [2 /*return*/, _a.apply(void 0, [_d.sent()])];
                case 2:
                    _b = proj4;
                    return [4 /*yield*/, load(from)];
                case 3:
                    _c = [_d.sent()];
                    return [4 /*yield*/, load(to)];
                case 4: return [2 /*return*/, _b.apply(void 0, _c.concat([_d.sent()]))];
            }
        });
    });
}

exports.authCodeToUri = authCodeToUri;
exports.get = get;
exports.load = load;
exports.parseCrsId = parseCrsId;
exports.set = set;
exports.uriToAuthCode = uriToAuthCode;
exports.uriproj = uriproj;
exports.urnToUri = urnToUri;
