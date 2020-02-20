/**
 * @author tudou527
 * @email [tudou527@gmail.com]
*/
import { AlipaySdkConfig } from './alipay';
declare const ALIPAY_ALGORITHM_MAPPING: {
    RSA: string;
    RSA2: string;
};
/**
 * 签名
 * @param {string} method 调用接口方法名，比如 alipay.ebpp.bill.add
 * @param {object} bizContent 业务请求参数
 * @param {object} publicArgs 公共请求参数
 * @param {object} config sdk 配置
 */
declare function sign(method: string, params: any, config: AlipaySdkConfig): any;
export { sign, ALIPAY_ALGORITHM_MAPPING, };
