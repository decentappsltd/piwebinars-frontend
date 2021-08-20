<?php

$connect = mysql_connect(“server_name”, “admin_name”, “password”); if (!connect) { die('Connection Failed: ' . mysql_error()); { mysql_select_db(“database_name”, $connect);
                                                                                                                                
$user_info = “INSERT INTO table_name (username, url) VALUES ('$_POST[username]', '$_POST[url]')”; if (!mysql_query($user_info, $connect)) { die('Error: ' . mysql_error()); }

echo “Submitted”;

mysql_close($connect); ?>
