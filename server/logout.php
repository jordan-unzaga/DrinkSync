<?php
session_start();
header("Content-Type: application/json");
$_SESSION = array();
session_destroy();
setcookie(session_name(), "", time() - 500, "/");

echo json_encode(["success" => true]);
exit();
?>