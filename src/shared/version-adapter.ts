const versionOneAdapter = (data: any) => {
  const { clientName, name } = data;
  const filename = `${name} Application.pdf`;
  const subject = `${clientName} Application Submission from ${name}`;
  return { ...data, filename, subject };
};

export { versionOneAdapter };
