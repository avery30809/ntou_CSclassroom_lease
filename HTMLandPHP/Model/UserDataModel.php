<?php
require_once("/Model/Database.php");
class UserDataModel extends Database
{
    public function getUserProfile($userID) {
        $result = $this->select("SELECT username, useraccount, email, phone FROM userdata WHERE userID = ?", [$userID]);
        return $result;
    }
}