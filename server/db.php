<?php
//db.php
$host = "localhost";
$db = "db51";
$user = "user51";
$pass = "51heed";

$pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

?>