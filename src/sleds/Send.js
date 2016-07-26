/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-04-27
 * @author Liang <liang@maichong.it>
 */

import IntlMessageFormat from 'intl-messageformat';
import alaska from 'alaska';
import service from '../';
import Sms from '../models/Sms';

const messageCache = {};

export default class Send extends alaska.Sled {
  /**
   * 发送短信
   * @param data
   *        data.sms 短信模板ID或记录
   *        data.to 目标手机号
   *        [data.message] 短信内容,如果有此值,则忽略data.sms
   *        [data.locale] 短信采用的语言
   *        [data.driver] 驱动,如果不指定,则采用data.sms记录中指定的驱动或默认驱动
   *        [data.values] 短信内容中填充的数据
   */
  async exec(data) {
    let message = data.message;
    let driver = data.driver;
    let to = data.to;
    if (driver && typeof driver === 'string') {
      driver = service.driversMap[driver];
    }
    if (driver && to && message) {
      return await driver.send(to, message);
    }
    let sms = data.sms;
    if (sms && typeof sms === 'string') {
      sms = await Sms.findCache(sms);
    }
    if (!message) {
      if (!sms) alaska.panic('Can not find sms');
      message = sms.content;
      if (data.locale) {
        //定义了语言
        let field = 'content_' + data.locale.replace('-', '_');
        if (sms[field]) {
          message = sms[field];
        }
      }
    }

    if (!driver) {
      if (sms && sms.driver) {
        driver = service.driversMap[sms.driver];
      }
      if (!driver) {
        driver = service.defaultDriver;
      }
    }

    let values = data.values;
    if (values) {
      if (!messageCache[message]) {
        messageCache[message] = new IntlMessageFormat(message);
      }
      message = messageCache[message].format(values);
    }

    return await driver.send(to, message);
  }
}
