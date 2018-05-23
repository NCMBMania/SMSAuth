$(() => {
  const applicationKey = 'APPLICATION_KEY';
  const clientKey = 'CLIENT_KEY';
  const ncmb = new NCMB(applicationKey, clientKey);
  let userId = null;
  $('.alert').hide();
  $('#register').on('click', e => {
    e.preventDefault();
    const params = {
      email: $('#inputEmail').val(),
      password: $('#inputPassword').val(),
      tel: $('#inputTel').val().replace(/\-/g, '').replace(/^0/, '')
    };
    ncmb.Script
      .data(params)
      .exec('POST', 'register.js')
      .then(res => {
        const body = typeof res.body == 'string' ? JSON.parse(res.body) : res.body;
        console.log(body);
        userId = body.id;
        $('.register').show().text(body.message);
      })
      .catch(err => {
        console.log(err);
      });
  });
  
  $('#confirm').on('click', e => {
    e.preventDefault();
    const params = {
      confirm: $('#inputCode').val(),
      userId: userId
    };
    ncmb.Script
      .data(params)
      .exec('POST', 'confirm.js')
      .then(res => {
        const json = JSON.parse(res.body)
        $('.confirm').show().text(json.message);
      })
      .catch(err => {
        console.log(err);
      });
  })
});