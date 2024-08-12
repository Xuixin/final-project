<?php

session_start();
if (isset($_SESSION['logout'])) {
    session_destroy();
    header("Location: index.php");
}
