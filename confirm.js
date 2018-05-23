const request = require('superagent');
const NCMB    = require('ncmb');
const applicationKey = 'APPLICATION_KEY';
const clientKey = 'CLIENT_KEY';
const ncmb = new NCMB(applicationKey, clientKey);

module.exports = (req, res) => {
  const twilioToken = 'TWILIO_TOKEN';
  const params = req.body;
  request
    .get(`https://api.authy.com/protected/json/verify/${params.confirm}/${params.userId}`)
    .set({
      'X-Authy-API-Key': twilioToken
    })
    .send()
    .then(response => {
      if (response.body.success == 'true') {
        console.log(params.userId);
        return ncmb.User
          .equalTo('twilioUserId', params.userId)
          .fetch()
      } else {
        res.send(response.body).status(401);
      }
    })
    .then(user => {
      const acl = new ncmb.Acl;
      acl
        .setPublicReadAccess(true)
        .setUserReadAccess(user, true)
        .setUserWriteAccess(user, true);
      return user
        .set('confirm', false)
        .set('acl', acl)
        .update();
    })
    .then(() => {
      return res.json({message: "完了"})
    })
    .catch(err => {
      console.log(err)
      res.json(JSON.parse(err.response.text)).status(err.status)
    })
}
