"use strict";
/**
 * @author tudou527
 * @email [tudou527@gmail.com]
*/
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const moment = require("moment");
const iconv = require("iconv-lite");
const snakeCaseKeys = require("snakecase-keys");
const ALIPAY_ALGORITHM_MAPPING = {
    RSA: 'RSA-SHA1',
    RSA2: 'RSA-SHA256',
};
exports.ALIPAY_ALGORITHM_MAPPING = ALIPAY_ALGORITHM_MAPPING;
/**
 * 签名
 * @param {string} method 调用接口方法名，比如 alipay.ebpp.bill.add
 * @param {object} bizContent 业务请求参数
 * @param {object} publicArgs 公共请求参数
 * @param {object} config sdk 配置
 */
function sign(method, params = {}, config) {
    const bizContent = params.bizContent || null;
    delete params.bizContent;
    const signParams = Object.assign({
        method,
        appId: config.appId,
        charset: config.charset,
        version: config.version,
        signType: config.signType,
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    }, params);
    if (bizContent) {
        signParams.bizContent = JSON.stringify(snakeCaseKeys(bizContent));
    }
    // params key 驼峰转下划线
    const decamelizeParams = snakeCaseKeys(signParams);
    // 排序
    const signStr = Object.keys(decamelizeParams).sort().map((key) => {
        let data = decamelizeParams[key];
        if (Array.prototype.toString.call(data) !== '[object String]') {
            data = JSON.stringify(data);
        }
        return `${key}=${iconv.encode(data, config.charset)}`;
    }).join('&');
    // 计算签名
    const sign = crypto.createSign(ALIPAY_ALGORITHM_MAPPING[config.signType])
        .update(signStr, 'utf8').sign(config.privateKey, 'base64');
    return Object.assign(decamelizeParams, { sign });
}
exports.sign = sign;
//# sourceMappingURL=util.js.map