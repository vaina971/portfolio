<?php
// Connexion à la base de données
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "contact_db";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Échec de la connexion : " . $conn->connect_error);
}

// Récupérer les messages
$sql = "SELECT * FROM messages ORDER BY date_envoi DESC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Messages Reçus</title>
</head>
<body>
    <h1>Liste des Messages</h1>
    <table border="1">
        <tr>
            <th>ID</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Message</th>
            <th>Date</th>
        </tr>

        <?php while ($row = $result->fetch_assoc()) { ?>
        <tr>
            <td><?php echo $row['id']; ?></td>
            <td><?php echo $row['prenom']; ?></td>
            <td><?php echo $row['email']; ?></td>
            <td><?php echo $row['telephone']; ?></td>
            <td><?php echo $row['message']; ?></td>
            <td><?php echo $row['date_envoi']; ?></td>
        </tr>
        <?php } ?>
    </table>

    <?php $conn->close(); ?>
</body>
</html>