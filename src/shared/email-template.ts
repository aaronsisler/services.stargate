const getEmailTemplate = (inputs: any, hasAttachment = false) => {
  const {
    emailAddress,
    galleryPieceLink,
    galleryPieceName,
    message,
    name,
    phoneNumber,
  } = inputs;

  let html = "";

  html += `
    <html>
      ${getHead()}
  
      <body>
        ${
          hasAttachment
            ? getBodyHeader("Someone has sent you an application.")
            : getBodyHeader("Someone has contacted you for more information.")
        }
        <table class="contact_info">`;

  if (emailAddress) {
    html += getTableRow("Email", emailAddress);
  }

  if (name) {
    html += getTableRow("Name", name);
  }

  if (phoneNumber) {
    html += getPhoneNumber(phoneNumber);
  }

  if (galleryPieceLink) {
    html += getTableRow(
      "Gallery Piece",
      `<a href="${galleryPieceLink}">${galleryPieceName}</a>`
    );
  }

  if (message) {
    html += getTableRow("Message", message);
  }

  html += `</table></body></html>`;

  return html;
};

const getBodyHeader = (title: string) => {
  return `
    <p>
      ${title}
      <br />
      Here is their contact info below:
    </p>
    `;
};

const getPhoneNumber = (phoneNumber: string) => {
  const areaCode = phoneNumber.slice(0, 3);
  const prefix = phoneNumber.slice(3, 6);
  const lineNumber = phoneNumber.slice(6, 10);

  const formattedPhoneNumber = `(${areaCode}) ${prefix}-${lineNumber}`;

  return getTableRow("Phone Number", formattedPhoneNumber);
};

const getTableRow = (category: string, value: string) =>
  `
    <tr class="contact_widget">
      <td class="contact_category">
          ${category}
      </td>
    </tr>
    <tr class="contact_widget">
      <td class="contact_value">
        ${value}
      </td>
    </tr>
  `;

const getHead = () => `
  <head>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style>
      p {
        font-size: 1.25rem;
        margin: 0;
      }
  
      .contact_info {
        background-color: rgba(120, 186, 251, 0.6);
        color: rgba(0, 0, 0, 0.8);
        margin: 1rem 0;
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
  </head>`;

export { getEmailTemplate };
