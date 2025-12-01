<?php
session_start();
header("Content-Type: application/json");
require "db.php";

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["error" => "Not logged in"]);
    exit();
}

$user_id = $_SESSION["user_id"];

$stmt = $pdo->prepare("SELECT drink_id FROM test_user_saved_drinks WHERE user_id = ?");
$stmt->execute([$user_id]);

$ids = $stmt->fetchAll(PDO::FETCH_COLUMN);

echo json_encode(["drink_ids" => $ids]);

?>