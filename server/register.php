<?php
//register.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
header('Content-Type: application/json');

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$username = $data["username"];
$password = $data["password"];

if (!$username || !$password) {
    echo json_encode(["success" => false, "message" => "Missing info jit"]);
    exit();
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("INSERT INTO test_users (username, password_hash) VALUES (?, ?)");

try {
    $stmt-> execute([$username, $passwordHash]);
    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "pick a different username jit"]);
}

?>