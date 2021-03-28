const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const getOne = async (account) => {
  const adapter = new FileSync("db.json");
  const db = low(adapter);

  return await db.get("account").find({ account: account }).value();
};

const register = async (data) => {
  const adapter = new FileSync("db.json");
  const db = low(adapter);

  await db
    .get("account")
    .push({
      id: data.id,
      name: data.name,
      account: data.account,
      password: data.password,
    })
    .write();

  return true;
};

const getData = async (id) => {
  const adapter = new FileSync("db.json");
  const db = low(adapter);

  return await db.get("account").find({ id: id }).value();
};

module.exports = { getOne, register, getData };
