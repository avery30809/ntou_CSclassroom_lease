package org.sixth.database;

public class User {
    private String name, account, password, gmail;

    public User(String name, String account, String password, String gmail) {
        this.name = name;
        this.account = account;
        this.password = password;
        this.gmail = gmail;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getGmail() {
        return gmail;
    }

    public void setGmail(String gmail) {
        this.gmail = gmail;
    }

    @Override
    public String toString() {
        return "姓名:" + name + " 帳號:" + account + " 密碼:" + password + " gmail:" + gmail;
    }
}
