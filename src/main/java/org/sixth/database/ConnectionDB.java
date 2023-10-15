package org.sixth.database;

import java.sql.*;
import java.util.ArrayList;

public class ConnectionDB {
    final static String mysqlURL = "jdbc:mysql://localhost:3306/sql_software?serverTimezone=UTC";
    final static String user = "root";
    final static String password = "Choco_La";
    public static ArrayList<User> SearchAllUser() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection(mysqlURL, user, password);
            if(!connection.isClosed()) {
                //透過連接物件 拖出一個互動命令物件
                Statement st = connection.createStatement();
                //執行查詢
                ResultSet rs = st.executeQuery("select * from userData");
                ArrayList<User> res = new ArrayList<>();
                while(rs.next()){
                    res.add(new User(rs.getNString("username"), rs.getNString("useraccount"),
                            rs.getNString("password"), rs.getNString("gmail")));
                }
                //處理完了 關閉連接
                connection.close();
                return res;
            }
        } catch (ClassNotFoundException ex) {
            System.out.println("類別載入錯誤");
        } catch (SQLException ex){
            System.out.println(ex.getMessage());
        }
        return null;
    }
}