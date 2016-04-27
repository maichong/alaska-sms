/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-04-27
 * @author Liang <liang@maichong.it>
 */

export default {
  prefix: false,
  /**
   * 短信发送驱动
   */
  drivers: {
    test: {
      label: 'Test',
      lib: 'alaska-sms-test'
    }
  },
  /**
   * 短信签名,例如 【脉冲软件】
   */
  sign: ''
};
