const request = require('superagent');
const NCMB    = require('ncmb');
const applicationKey = 'APPLICATION_KEY';
const clientKey = 'CLIENT_KEY';
const ncmb = new NCMB(applicationKey, clientKey);

module.exports = (req, res) => {
  const twilioToken = 'TWILIO_TOKEN';
  const params = req.body;
  let userId = null;
  request
    .post('https://api.authy.com/protected/json/users/new')
    .set({
      'X-Authy-API-Key': twilioToken
    })
    .send({
      user: {
        email: params.email,
        cellphone: params.tel,
        country_code: 81
      }
    })
    .then(response => {
      const body = response.body;
      userId = body.user.id;
      return request
        .get(`https://api.authy.com/protected/json/sms/${body.user.id}?force=true`)
        .set({
          'X-Authy-API-Key': twilioToken
        })
        .send();
    })
    .then(response => {
      const acl = new ncmb.Acl;
      acl
        .setPublicReadAccess(true)
        .setPublicWriteAccess(true);
      const user = new ncmb.User();
      return user
        .set('userName', params.email)
        .set('mailAddress', params.email)
        .set('cellphone', params.tel)
        .set('password', params.password)
        .set('twilioUserId', userId)
        .set('confirm', false)
        .set('acl', acl)
        .save();
    })
    .then(response => {
      res.json({
        id: userId,
        message: '登録完了しました'
      });
    })
    .catch(err => {
      res.json(JSON.parse(err.response.text)).status(err.status)
    })
}
