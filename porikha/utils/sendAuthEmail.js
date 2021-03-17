const SGmail = require('@sendgrid/mail');

module.exports = async (msg) => {
  try {
    await SGmail.send(msg);
  } catch (error) {
    console.error(error.message);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
