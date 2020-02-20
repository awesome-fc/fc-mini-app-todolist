/**
 * @author tudou527
 * @email [tudou527@gmail.com]
*/
import AliPayForm from './form';
export interface AlipaySdkConfig {
    /** 应用ID */
    appId: string;
    /**
     * 应用私钥字符串
     * RSA签名验签工具：https://docs.open.alipay.com/291/106097）
     * 密钥格式一栏请选择 “PKCS1(非JAVA适用)”
     */
    privateKey: string;
    signType?: 'RSA2' | 'RSA';
    /** 支付宝公钥（需要对返回值做验签时候必填） */
    alipayPublicKey?: string;
    /** 网关 */
    gateway?: string;
    /** 网关超时时间（单位毫秒，默认 5s） */
    timeout?: number;
    /** 是否把网关返回的下划线 key 转换为驼峰写法 */
    camelcase?: boolean;
    /** 编码（只支持 utf-8） */
    charset?: 'utf-8';
    /** api版本 */
    version?: '1.0';
    urllib?: any;
    /** 指定private key类型, 默认： PKCS1, PKCS8: PRIVATE KEY, PKCS1: RSA PRIVATE KEY */
    keyType?: 'PKCS1' | 'PKCS8';
}
export interface AlipaySdkCommonResult {
    code: string;
    msg: string;
    sub_code?: string;
    sub_msg?: string;
}
export interface IRequestParams {
    [key: string]: any;
    bizContent?: any;
}
export interface IRequestOption {
    validateSign?: boolean;
    log?: {
        info(...args: any[]): any;
        error(...args: any[]): any;
    };
    formData?: AliPayForm;
}
declare class AlipaySdk {
    private sdkVersion;
    config: AlipaySdkConfig;
    constructor(config: AlipaySdkConfig);
    private formatKey;
    private formatUrl;
    private multipartExec;
    private pageExec;
    private notifyRSACheck;
    /**
     *
     * @param originStr 开放平台返回的原始字符串
     * @param responseKey xx_response 方法名 key
     */
    getSignStr(originStr: string, responseKey: string): string;
    /**
     * 执行请求
     * @param {string} method 调用接口方法名，比如 alipay.ebpp.bill.add
     * @param {object} params 请求参数
     * @param {object} params.bizContent 业务请求参数
     * @param {Boolean} option 选项
     * @param {Boolean} option.validateSign 是否验签
     * @param {object} args.log 可选日志记录对象
     * @return {Promise} 请求执行结果
     */
    exec(method: string, params?: IRequestParams, option?: IRequestOption): Promise<AlipaySdkCommonResult | string>;
    checkResponseSign(signStr: string, responseKey: string): boolean;
    /**
     * 通知验签
     * @param postData {JSON} 服务端的消息内容
     */
    checkNotifySign(postData: any): boolean;
}
export default AlipaySdk;
