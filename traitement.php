<?php
// Informations de connexion à la base de données
$servername = "localhost";
$username = "root";
$password = ""; // MAMP : "root" | XAMPP : "" | WAMP : ""
$dbname = "portfolio";

// Connexion à la base de données
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("La connexion a échoué : " . $conn->connect_error);
}

// Récupération des données du formulaire
$prenom = htmlspecialchars($_POST['prenom']);
$email = htmlspecialchars($_POST['email']);
$telephone = htmlspecialchars($_POST['telephone']);
$message = htmlspecialchars($_POST['message']);

// Requête SQL pour insérer les données
$sql = "INSERT INTO messages (prenom, email, telephone, message) 
        VALUES ('$prenom', '$email', '$telephone', '$message')";

if ($conn->query($sql) === TRUE) {
    echo "<script>alert('Message envoyé avec succès !'); window.location.href='index.html';</script>";
} else {
    echo "Erreur lors de l'envoi du message : " . $conn->error;
}

// Fermer la connexion
$conn->close();
?>
