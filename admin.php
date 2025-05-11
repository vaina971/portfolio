<?php
// Connexion à la base de données
$servername = "localhost";
$username = "root";
$password = ""; // MAMP : "root" / XAMPP : ""
$dbname = "portfolio";

$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("La connexion a échoué : " . $conn->connect_error);
}

// === Supprimer un message si le bouton est cliqué ===
if (isset($_GET['delete_id'])) {
    $delete_id = (int) $_GET['delete_id'];
    $sql_delete = "DELETE FROM messages WHERE id = $delete_id";
    if ($conn->query($sql_delete) === TRUE) {
        echo "<script>alert('Message supprimé avec succès.'); window.location.href='admin.php';</script>";
    } else {
        echo "Erreur lors de la suppression : " . $conn->error;
    }
}

// === Récupérer les messages depuis la base de données ===
$sql = "SELECT id, prenom, email, telephone, message, date_envoi FROM messages ORDER BY date_envoi DESC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Admin - Messages de Contact</title>
    <link rel="stylesheet" href="style.css">
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #914c23;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .btn-delete {
            background-color: #d9534f;
            color: white;
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .btn-delete:hover {
            background-color: #c9302c;
        }
    </style>
</head>
<body>
    <h1>Messages de Contact</h1>

    <?php if ($result->num_rows > 0): ?>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Message</th>
                    <th>Date d'envoi</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <?php while($row = $result->fetch_assoc()): ?>
                    <tr>
                        <td><?= $row['id'] ?></td>
                        <td><?= $row['prenom'] ?></td>
                        <td><?= $row['email'] ?></td>
                        <td><?= $row['telephone'] ?></td>
                        <td><?= $row['message'] ?></td>
                        <td><?= $row['date_envoi'] ?></td>
                        <td>
                            <a href="admin.php?delete_id=<?= $row['id'] ?>" onclick="return confirm('Voulez-vous vraiment supprimer ce message ?');">
                                <button class="btn-delete">Supprimer</button>
                            </a>
                        </td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    <?php else: ?>
        <p>Aucun message trouvé.</p>
    <?php endif; ?>

    <?php $conn->close(); ?>
</body>
</html>
