<?php
require_once __DIR__ . "/Database.php";
class UserModel extends Database
{
    public function getUserProfile($userID) {
        $result = $this->query("SELECT username, useraccount, email, phone FROM userdata WHERE userID = ?", [$userID]);
        $obj = [
            "username"=>$result[0][0],
            "useraccount"=>$result[0][1],
            "email"=>$result[0][2],
            "phone"=>$result[0][3]
        ];
        return $obj;
    }
    public function authenticate($account, $password, $op) {
        try {
            $result = $this->query("SELECT userID, pwd FROM userdata WHERE useraccount = ? AND isAdmin = ?", [$account, $op]);
            if($result && password_verify($password, $result[0][1])) {
                return $result[0];
            }
            else return false;
        } catch (Exception $e) {
            return false;
        }
    }
    public function register($username, $account, $password, $email) {
        try {
            // 帳號是第一次註冊回傳 false(找不到)
            $result = $this->query("SELECT useraccount FROM userdata WHERE useraccount = ?", [$account]);
            // 不是第一次 回傳true給controller
            if($result !== false) return true;
            $hash_pwd = password_hash($password, PASSWORD_DEFAULT);
            $this->query("INSERT INTO userdata (username, useraccount, pwd, email)VALUES (?,?,?,?)",[$username, $account, $hash_pwd, $email]);
            return false;

        } catch (Exception $e) {
            return false;
        }
    }
    public function accountGetID($account) {
        try {
            $result = $this->query("SELECT userID FROM userdata WHERE useraccount = ?", [$account]);
            if($result !== false) return $result[0];
            return false;
        } catch (Exception $e) {
            return false;
        }
    }
    public function resetPWD($account) {
        try {
            // 確認帳號已註冊過 false(尚未註冊)
            $result = $this->query("SELECT useraccount FROM userdata WHERE useraccount = ?", [$account]);
            // 尚未註冊 回傳false給controller
            if($result == false) return false;
            $newPWD = $this->randomPWD();
            $hash_pwd = password_hash($newPWD, PASSWORD_DEFAULT);
            $sender = new VerificationModel();
            $this->query("UPDATE userdata SET pwd = ? WHERE useraccount = ?",[$hash_pwd, $account]);
            $sender->setPWD($newPWD);
            $sender->sendEmail("$account@mail.ntou.edu.tw", "reset");
            return true;

        } catch (Exception $e) {
            return false;
        }
    }
    private function randomPWD() {
        $ls = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        str_shuffle($ls);
        $len = 15;
        $pwd = "";
        for($i = 0; $i<$len; $i++) {
            $pwd = $pwd . $ls[rand(0, strlen($ls)-1)];
        }
        return $pwd;
    }
}