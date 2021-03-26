const reg = {
  uuid: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
};

const testId = id => reg.uuid.test(id);

module.exports = { testId };
