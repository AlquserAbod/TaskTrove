function readTemplateParms(template, params) {
    try {
      if (params) {
        for (const key in params) {
          const regex = new RegExp(`{{${key}}}`, 'g');
          template = template.replace(regex, params[key]);
        }
      }
  
      return template;
    } catch (error) {
      throw new Error('Error reading email template');
    }
  }

module.exports = { readTemplateParms };
