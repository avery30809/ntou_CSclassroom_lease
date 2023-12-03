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
        
        $query = "SELECT userID FROM userdata WHERE useraccount = ? AND pwd = ? AND isAdmin = ?";
        $params = [$account, $password, $op];

        try {
            $result = $this->query($query, $params);
            return $result?$result[0]:false;
        } catch (Exception $e) {
            return false;
        }
    }
}