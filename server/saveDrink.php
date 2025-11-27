<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "Not logged in jit"]);
    exit();
}

require "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$drink_id = $data["drink_id"];
$user_id = $_SESSION["user_id"];

if (!$drink_id) {
    echo json_encode(["success" => false, "error" => "No drink ID jit"]);
    exit();
}

//need to prevent duplicates
$stmt = $pdo->prepare("SELECT id FRom test_user_saved_drinks WHERE user_id = ? AND drink_id = ?");
$stmt->execute([$user_id, $drink_id]);
$exists = $stmt->fetch();

if($exists) {
    echo json_encode (["success" => true, "message" => "Saved this already jit"]);
    exit();
}

$stmt = $pdo->prepare("INSERT INTO test_user_saved_drinks (user_id, drink_id) VALUES (?, ?)");
$stmt->execute([$user_id, $drink_id]);

echo json_encode(["success" => true, "message" => "Drink saved jit"]);
exit();
?>