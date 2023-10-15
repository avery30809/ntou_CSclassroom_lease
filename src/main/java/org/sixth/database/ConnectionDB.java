package org.sixth.database;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.sql.*;
import java.util.ArrayList;

@Component
public class ConnectionDB {
    @Value("${spring.datasource.url}")
    private String url;
    @Value("${spring.datasource.username}")
    private String username;
    @Value("${spring.datasource.password}")
    private String password;
    public ArrayList<User> SearchAllUser() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection connection = DriverManager.getConnection(url, username, password);
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