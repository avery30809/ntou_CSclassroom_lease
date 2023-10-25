<?php

/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Scripting/EmptyPHP.php to edit this template
 */
  $server_name = 'localhost';
  $db_username = 'Choco_La';
  $db_password = 'CoCoNuT';
  $db_name = 'sql_software';

  // mysqli 的四個參數分別為：伺服器名稱、帳號、密碼、資料庫名稱
  $conn = new mysqli($server_name, $db_username, $db_password, $db_name);

  if (!empty($conn->connect_error)) {
    die('資料庫連線錯誤:' . $conn->connect_error);    // die()：終止程序
  }
?>