"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbAddAccount = void 0;
class DbAddAccount {
    constructor(hasher, addAccountRepository) {
        this.hasher = hasher;
        this.addAccountRepository = addAccountRepository;
    }
    async add(accountData) {
        const hashedPassword = await this.hasher.hash(accountData.password);
        const account = await this.addAccountRepository.add({
            ...accountData,
            password: hashedPassword,
        });
        return account;
    }
}
exports.DbAddAccount = DbAddAccount;
