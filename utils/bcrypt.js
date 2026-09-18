import bcrypt from "bcrypt";

const hashPassword = async (plainPassword) => {
    const saltRound =10;
    const hashedpassword = await bcrypt.hash(plainPassword, saltRound);
    return hashedpassword;
};

const comparePassword = async (plainPassword, hashedPasword) =>  {
    return await bcrypt.compare(plainPassword,hashedPasword);
};

export { hashPassword, comparePassword};