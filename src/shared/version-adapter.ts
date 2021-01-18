const versionOneAttachmentAdapter = (data: any) => {
  const { clientName, name } = data;
  const filename = `${name} Application.pdf`;
  const subject = `${clientName} Application Submission from ${name}`;

  return { ...data, filename, subject };
};

const versionOneEmailAdapter = (data: any) => {
  const { clientName } = data;
  const subject = clientName
    ? `${clientName} Contact Request`
    : `Contact Request`;

  return { ...data, subject };
};

export { versionOneAttachmentAdapter, versionOneEmailAdapter };
