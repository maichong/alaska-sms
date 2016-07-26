/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-04-27
 * @author Liang <liang@maichong.it>
 */

import alaska from 'alaska';
import service from '../';

export default class Sms extends alaska.Model {
  static label = 'SMS';
  static icon = 'comment';
  static title = 'title';
  static defaultColumns = '_id title content createdAt';
  static defaultSort = '_id';

  static fields = {
    _id: {
      type: String,
      required: true
    },
    title: {
      label: 'Title',
      type: String,
      require: true
    },
    driver: {
      label: 'Driver',
      type: 'select',
      options: service.driversOptions,
      default: service.defaultDriver.key
    },
    content: {
      label: '内容',
      type: String,
      require: true,
      multiLine: true
    },
    createdAt: {
      label: 'Created At',
      type: Date
    }
  };

  preSave() {
    if (!this.createdAt) {
      this.createdAt = new Date;
    }
  }
}

let locales = alaska.main.config('locales');

if (locales && locales.length > 1) {
  Sms.fields.content.help = 'Default';
  locales.forEach(locale => {
    Sms.fields['content_' + locale.replace('-', '_')] = {
      label: 'Content',
      type: String,
      multiLine: true,
      help: service.t('lang', locale)
    };
  });
}
