<?php
//login.php
session_start();
header("Content-Type: application/json");
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$username = $data["username"] ?? "";
$password = $data["password"] ?? "";

$stmt = $pdo->prepare("SELECT * FROM test_users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if(!$user || !password_verify($password, $user["password_hash"])) {
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    exit();
}

$_SESSION["user_id"] = $user["id"];
$_SESSION["username"] = $username;

echo json_encode(["success" => true]);
?>