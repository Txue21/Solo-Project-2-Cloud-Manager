<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$file = 'games.json';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

function getGames($file) {
    return json_decode(file_get_contents($file), true);
}

function saveGames($file, $data) {
    file_put_contents($file, json_encode(array_values($data), JSON_PRETTY_PRINT));
}

function validateGameData($data, $isUpdate = false) {
    $errors = [];
    
    // Check required fields
    if (empty($data['title'])) {
        $errors[] = "Title is required";
    }
    
    if (empty($data['platform'])) {
        $errors[] = "Platform is required";
    }
    
    if (!isset($data['hoursPlayed']) || $data['hoursPlayed'] === '') {
        $errors[] = "Hours played is required";
    }
    
    if (empty($data['status'])) {
        $errors[] = "Status is required";
    }
    
    // Validate data types and values
    if (isset($data['hoursPlayed']) && (!is_numeric($data['hoursPlayed']) || $data['hoursPlayed'] < 0)) {
        $errors[] = "Hours played must be a positive number";
    }
    
    // Validate allowed values
    $allowedPlatforms = ['PC', 'PS5', 'PS4', 'Xbox', 'Switch', 'Mobile'];
    if (!empty($data['platform']) && !in_array($data['platform'], $allowedPlatforms)) {
        $errors[] = "Invalid platform";
    }
    
    $allowedStatuses = ['Backlog', 'In Progress', 'Completed'];
    if (!empty($data['status']) && !in_array($data['status'], $allowedStatuses)) {
        $errors[] = "Invalid status";
    }
    
    return $errors;
}

switch ($method) {
    case 'GET':
        echo file_get_contents($file);
        break;

    case 'POST':
        $errors = validateGameData($input);
        if (!empty($errors)) {
            http_response_code(400);
            echo json_encode(["error" => "Validation failed", "details" => $errors]);
            break;
        }
        
        $games = getGames($file);
        $input['id'] = time();
        $games[] = $input;
        saveGames($file, $games);
        echo json_encode($input);
        break;

    case 'PUT':
        $errors = validateGameData($input, true);
        if (!empty($errors)) {
            http_response_code(400);
            echo json_encode(["error" => "Validation failed", "details" => $errors]);
            break;
        }
        
        $games = getGames($file);
        foreach ($games as &$game) {
            if ($game['id'] == $input['id']) {
                $game = $input;
            }
        }
        saveGames($file, $games);
        echo json_encode($input);
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $games = getGames($file);
        $games = array_filter($games, function($g) use ($id) { return $g['id'] != $id; });
        saveGames($file, $games);
        echo json_encode(["status" => "success"]);
        break;
}
?>