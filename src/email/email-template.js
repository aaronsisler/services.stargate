exports.getEmailTemplate = inputs => {
  const {
    emailAddress,
    galleryPieceLink,
    galleryPieceName,
    message,
    name,
    phoneNumber,
    website
  } = inputs;

  let html = "";
  html += `
  <html>
      <head>
          <meta name="viewport" content="width=device-width">
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
          <title>Contact Form Submission</title>
          <style>
              h3 {
                  margin: 1rem 20% 0.25rem 1rem;
                  padding: 1rem 0 0.25rem;
              }
      
              .contact_info {
                  background-color: rgba(120, 186, 251, 0.6);
                  color: rgba(0, 0, 0, 0.8);
                  margin: 1rem;
                  padding: 0 0.5rem 1rem 0.5rem;
                  width: 30%;
              }
      
              .contact_category {
                  border-spacing: 1rem;
                  font-size: 1.5rem;
                  font-weight: bold;
                  padding: 0.5rem 0 0;
              }
      
              .contact_value {
                  border: 1px solid rgba(0, 0, 0, 0.5);
                  background-color: #ffffff;
                  font-size: 1.5rem;
                  padding: 0.5rem;
              }
          </style>
      </head>

      <body>
          <h3>
              Someone has contacted you for more information.
              <br />
              <br /> Here is their contact info below:
          </h3>
          <table class="contact_info">

              <tr class="contact_widget">
                  <td class="contact_category">
                      Email
                  </td>
              </tr>
              <tr class="contact_widget">
                  <td class="contact_value">
                      ${emailAddress}
                  </td>
              </tr>
  `;

  if (website) {
    html += `
          <tr class="contact_widget">
              <td class="contact_category">
                  Website
              </td>
          </tr>
          <tr class="contact_widget">
              <td class="contact_value">
                  ${website}
              </td>
          </tr>
      `;
  }

  if (name) {
    html += `
          <tr class="contact_widget">
              <td class="contact_category">
                  Name
              </td>
          </tr>
          <tr class="contact_widget">
              <td class="contact_value">
                  ${name}
              </td>
          </tr>
      `;
  }

  if (phoneNumber) {
    const areaCode = phoneNumber.slice(0, 3);
    const prefix = phoneNumber.slice(3, 6);
    const lineNumber = phoneNumber.slice(6, 10);

    const formattedPhoneNumber = `(${areaCode}) ${prefix}-${lineNumber}`;

    html += `
      <tr class="contact_widget">
          <td class="contact_category">
              Phone Number
          </td>
      </tr>
      <tr class="contact_widget">
          <td class="contact_value">
              ${formattedPhoneNumber}
          </td>
      </tr>
      `;
  }

  if (galleryPieceLink) {
    html += `
          <tr class="contact_widget">
              <td class="contact_category">
                  Gallery Piece
              </td>
          </tr>
          <tr class="contact_widget">
              <td class="contact_value">
                  <a href="${galleryPieceLink}">${galleryPieceName}</a>
              </td>
          </tr>
      `;
  }

  if (message) {
    html += `
      <tr class="contact_widget">
          <td class="contact_category">
              Message
          </td>
      </tr>
      <tr class="contact_widget">
          <td class="contact_value">
              ${message}
          </td>
      </tr>
      `;
  }

  html += `</table></body></html>`;
  return html;
};
