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

switch ($method) {
    case 'GET':
        echo file_get_contents($file);
        break;

    case 'POST':
        $games = getGames($file);
        $input['id'] = time();
        $games[] = $input;
        saveGames($file, $games);
        echo json_encode($input);
        break;

    case 'PUT':
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